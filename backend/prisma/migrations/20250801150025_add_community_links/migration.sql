-- CreateTable
CREATE TABLE "CryptoListCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cryptoId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "current_price" REAL NOT NULL,
    "price_change_percentage_24h" REAL,
    "market_cap" REAL NOT NULL,
    "volume_24h" REAL NOT NULL,
    "image" TEXT NOT NULL,
    "market_cap_rank" INTEGER NOT NULL,
    "cachedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CryptoDetailCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cryptoId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "current_price" REAL NOT NULL,
    "price_change_percentage_24h" REAL,
    "price_change_percentage_7d" REAL,
    "price_change_percentage_30d" REAL,
    "market_cap" REAL NOT NULL,
    "market_cap_rank" INTEGER NOT NULL,
    "volume_24h" REAL NOT NULL,
    "circulating_supply" REAL,
    "total_supply" REAL,
    "max_supply" REAL,
    "ath" REAL NOT NULL,
    "ath_date" TEXT NOT NULL,
    "atl" REAL NOT NULL,
    "atl_date" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "website" TEXT,
    "blockchain_site" TEXT,
    "official_forum_url" TEXT,
    "repos_url" TEXT,
    "twitter_username" TEXT,
    "reddit_url" TEXT,
    "telegram_url" TEXT,
    "discord_url" TEXT,
    "facebook_username" TEXT,
    "announcement_url" TEXT,
    "chat_url" TEXT,
    "cachedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PriceHistoryCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cryptoId" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "cachedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoListCache_cryptoId_key" ON "CryptoListCache"("cryptoId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoDetailCache_cryptoId_key" ON "CryptoDetailCache"("cryptoId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceHistoryCache_cryptoId_days_key" ON "PriceHistoryCache"("cryptoId", "days");
