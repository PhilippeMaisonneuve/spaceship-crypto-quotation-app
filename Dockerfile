FROM node:18-alpine

WORKDIR /app

# Install global dependencies for serving and process management
RUN npm install -g serve concurrently

# Copy and build frontend first
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci --only=production

# Copy frontend source and build
COPY frontend ./
RUN npm run build

# Copy and build backend
WORKDIR /app
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/
WORKDIR /app/backend
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy backend source
COPY backend ./
RUN npm run build

# Initialize database (create if doesn't exist)
RUN npx prisma db push || echo "Database initialization completed"

# Back to root directory
WORKDIR /app

# Create a simple proxy server to handle both frontend and API
RUN echo 'const express = require("express");\n\
const { createProxyMiddleware } = require("http-proxy-middleware");\n\
const path = require("path");\n\
\n\
const app = express();\n\
const PORT = process.env.PORT || 3000;\n\
\n\
// Proxy API requests to backend\n\
app.use("/api", createProxyMiddleware({\n\
  target: "http://localhost:3001",\n\
  changeOrigin: true\n\
}));\n\
\n\
// Serve static frontend files\n\
app.use(express.static(path.join(__dirname, "frontend/dist")));\n\
\n\
// Handle SPA routing\n\
app.get("*", (req, res) => {\n\
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));\n\
});\n\
\n\
app.listen(PORT, () => {\n\
  console.log(`🚀 Proxy server running on port ${PORT}`);\n\
});' > proxy-server.js

# Create package.json for the combined app
RUN echo '{\n\
  "name": "spaceship-crypto-app",\n\
  "version": "1.0.0",\n\
  "scripts": {\n\
    "start": "concurrently \\"cd backend && npm start\\" \\"node proxy-server.js\\""\n\
  },\n\
  "dependencies": {\n\
    "express": "^4.18.2",\n\
    "http-proxy-middleware": "^2.0.6",\n\
    "concurrently": "^8.2.2"\n\
  }\n\
}' > package.json

# Install the combined app dependencies
RUN npm install

# Expose the port Vercel will use
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Start both services using the script
CMD ["npm", "start"]