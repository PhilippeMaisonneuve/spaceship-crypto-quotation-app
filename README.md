# 🚀 Spaceship Crypto Quotation App

A clean, responsive cryptocurrency price tracker built with React and Node.js.

## 🌐 Live Demo
**👉 [View Live Demo](https://spaceship-crypto-quotation-app-tzuu-ptmfahfvy.vercel.app/)**

## ⚡ Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [CoinGecko API Key](https://www.coingecko.com/en/api) (free tier available)

### 1. Clone & Setup
```bash
git clone <repository-url>
cd spaceship-crypto-quotation-app
```

### 2. Get Your CoinGecko API Key
1. Visit [CoinGecko API](https://www.coingecko.com/en/api)
2. Sign up for a free account
3. Navigate to your dashboard and copy your API key

### 3. Create Environment File
Create a `.env` file in the project root:
```bash
# CoinGecko API Configuration (REQUIRED)
COINGECKO_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# API Configuration  
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
CACHE_DURATION_MS=60000

# Database Configuration
DATABASE_URL=file:./dev.db
```

### 4. Run with Docker
```bash
docker-compose up --build
```

### 5. Open Your Browser
- **🌐 Main App**: http://localhost
- **🔧 API Endpoints**: http://localhost:3001
- **⏱️ First Launch**: Initial startup may take a few minutes as it builds the containers and fetches crypto data

## 📊 Data Caching & Performance

### ⏰ Data Delay Information
This application implements by default a **60-second cache** system for optimal performance and API rate limit management:

- **Total Data Delay**: ~120 seconds (60s cache + 60s CoinGecko free tier delay)
- **Cache Duration**: 60 seconds (customizable via `CACHE_DURATION_MS` in `.env`)
- **CoinGecko Free Tier**: ~60 seconds natural delay
- **CoinGecko Paid Tier**: ~20 seconds delay (much faster updates)

### 🛠️ Cache Configuration
You can customize or disable the cache by modifying your `.env` file:

```bash
# Default: 60 seconds (60000ms)
CACHE_DURATION_MS=60000

# Reduce cache (30 seconds)
CACHE_DURATION_MS=30000

# Disable cache (not recommended for production)
CACHE_DURATION_MS=0
```

### ⚡ Scalability Considerations

**🆓 Free Tier Limitations:**
- **Rate Limit**: 30 requests per minute
- **Without Cache**: Supports max **10 users per minute** (each user triggers 3 API calls)
- **With Cache**: Supports **hundreds of users** (data served from cache)

**Cache Enabled (Recommended for Free Tier):**
- ✅ Handles hundreds of concurrent users efficiently
- ✅ Stays within 30 requests/minute CoinGecko limit
- ✅ Reduces server load and response times
- ⚠️ Data freshness: 60-120 seconds delay

**Cache Disabled (Not Recommended for Free Tier):**
- ❌ Each user request hits CoinGecko API directly
- ❌ **Critical**: App breaks with more than 10 users per minute
- ❌ Quickly exceeds 30 requests/minute limit
- ✅ Fresh data (but unusable in production)

### 💰 CoinGecko API Tiers Comparison

| Tier | Rate Limits | Data Delay | Scalability | Data Freshness |
|------|-------------|------------|-------------|----------------|
| **Free** | 30 req/min | ~60 seconds | Cache required | 60-120s delay |
| **Paid** | Much higher | ~20 seconds | ✅ Both possible | 20-80s delay |

### 🎯 Best Configurations

**🆓 Free Tier (Current Setup):**
- ✅ **Use Cache**: Scalability ✓, Data Freshness ✗
- ❌ **No Cache**: Scalability ✗, Data Freshness ✓

**💳 Paid Tier:**
- ✅ **With Cache**: Scalability ✓, Data Freshness ✓ (optimal)
- ✅ **No Cache**: Scalability ✓, Data Freshness ✓ (higher server load)

**💡 The paid CoinGecko tier allows you to have BOTH scalability AND data freshness, while the free tier forces you to choose one or the other.**

## 🚀 Deployment & CI/CD

This project features **automated deployment pipelines**:

**✅ Continuous Deployment (CD):**
- **Frontend**: Auto-deploys to [Vercel](https://vercel.com) on every git push
- **Backend**: Auto-deploys to [Railway](https://railway.app) with environment sync
- **Docker**: Containerized for consistent environments across platforms
- **Zero-downtime**: Deployments happen seamlessly without service interruption

**🔄 Continuous Integration (CI) - To Be Implemented:**
- Automated testing workflows
- Code quality gates with GitHub Actions
- Security scanning and dependency checks

*Current status: **Automated deployment** ✅ | **Automated testing** ❌*

## 🛠️ Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Troubleshooting

### Common Issues

**🚫 "Missing required environment variables: COINGECKO_API_KEY"**
- Make sure you've created a `.env` file in the project root
- Verify your API key is correct and active
- Check that there are no extra spaces around the API key

**🐳 "Docker Desktop is not running"**
- Start Docker Desktop application
- Wait for Docker to fully initialize (green status)
- Restart your terminal and try again

**🌐 "Cannot connect to backend"**
- Ensure both containers are running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify ports 80 and 3001 are not in use by other applications

**📡 "API rate limit exceeded"**
- CoinGecko free tier has rate limits
- Wait a few minutes and try again
- Consider upgrading to a paid CoinGecko plan for higher limits

### Getting Help
If you encounter other issues:
1. Check the container logs: `docker-compose logs`
2. Ensure all prerequisites are installed
3. Try rebuilding containers: `docker-compose down && docker-compose up --build`

## 🏗️ Built With

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript  
- **Database**: SQLite + Prisma
- **API**: CoinGecko
- **Deployment**: Docker + Vercel

## 📱 Features

- 📊 Live crypto prices and market data
- 🔍 Search and filter cryptocurrencies  
- 📈 Detailed crypto information and statistics
- 📱 Responsive design for all devices
- 🚀 Fast Docker-based deployment
- 🔧 Customizable cache settings for different use cases
- 📈 Scalable architecture supporting hundreds of concurrent users


---

*Market data powered by [CoinGecko](https://www.coingecko.com)* 