FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma/ ./prisma/

# Install dependencies (including dev dependencies for prisma generate)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install production dependencies (without removing dist folder)
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start the application with database initialization
CMD ["sh", "-c", "npx prisma db push && npm start"] 