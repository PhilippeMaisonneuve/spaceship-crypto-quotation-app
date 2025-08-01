"use strict";
/**
 * Data formatting and transformation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatChartData = exports.formatCryptoDetail = exports.formatCachedCryptoData = exports.formatCryptoData = void 0;
/**
 * Formats CoinGecko API response to our standard format
 */
const formatCryptoData = (apiData) => ({
    id: apiData.id,
    symbol: apiData.symbol,
    name: apiData.name,
    current_price: apiData.current_price,
    price_change_percentage_24h: apiData.price_change_percentage_24h,
    market_cap: apiData.market_cap,
    volume_24h: apiData.total_volume,
    image: apiData.image,
    market_cap_rank: apiData.market_cap_rank
});
exports.formatCryptoData = formatCryptoData;
/**
 * Formats cached data to API response format
 */
const formatCachedCryptoData = (cachedData) => ({
    id: cachedData.cryptoId,
    symbol: cachedData.symbol,
    name: cachedData.name,
    current_price: cachedData.current_price,
    price_change_percentage_24h: cachedData.price_change_percentage_24h,
    market_cap: cachedData.market_cap,
    volume_24h: cachedData.volume_24h,
    image: cachedData.image,
    market_cap_rank: cachedData.market_cap_rank
});
exports.formatCachedCryptoData = formatCachedCryptoData;
/**
 * Formats CoinGecko coin detail response
 */
const formatCryptoDetail = (apiData) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    return ({
        id: apiData.id,
        symbol: apiData.symbol,
        name: apiData.name,
        description: ((_a = apiData.description) === null || _a === void 0 ? void 0 : _a.en) || '',
        current_price: ((_c = (_b = apiData.market_data) === null || _b === void 0 ? void 0 : _b.current_price) === null || _c === void 0 ? void 0 : _c.usd) || 0,
        price_change_percentage_24h: ((_d = apiData.market_data) === null || _d === void 0 ? void 0 : _d.price_change_percentage_24h) || null,
        price_change_percentage_7d: ((_e = apiData.market_data) === null || _e === void 0 ? void 0 : _e.price_change_percentage_7d) || null,
        price_change_percentage_30d: ((_f = apiData.market_data) === null || _f === void 0 ? void 0 : _f.price_change_percentage_30d) || null,
        market_cap: ((_h = (_g = apiData.market_data) === null || _g === void 0 ? void 0 : _g.market_cap) === null || _h === void 0 ? void 0 : _h.usd) || 0,
        market_cap_rank: apiData.market_cap_rank || 0,
        volume_24h: ((_k = (_j = apiData.market_data) === null || _j === void 0 ? void 0 : _j.total_volume) === null || _k === void 0 ? void 0 : _k.usd) || 0,
        circulating_supply: ((_l = apiData.market_data) === null || _l === void 0 ? void 0 : _l.circulating_supply) || null,
        total_supply: ((_m = apiData.market_data) === null || _m === void 0 ? void 0 : _m.total_supply) || null,
        max_supply: ((_o = apiData.market_data) === null || _o === void 0 ? void 0 : _o.max_supply) || null,
        ath: ((_q = (_p = apiData.market_data) === null || _p === void 0 ? void 0 : _p.ath) === null || _q === void 0 ? void 0 : _q.usd) || 0,
        ath_date: ((_s = (_r = apiData.market_data) === null || _r === void 0 ? void 0 : _r.ath_date) === null || _s === void 0 ? void 0 : _s.usd) || '',
        atl: ((_u = (_t = apiData.market_data) === null || _t === void 0 ? void 0 : _t.atl) === null || _u === void 0 ? void 0 : _u.usd) || 0,
        atl_date: ((_w = (_v = apiData.market_data) === null || _v === void 0 ? void 0 : _v.atl_date) === null || _w === void 0 ? void 0 : _w.usd) || '',
        image: ((_x = apiData.image) === null || _x === void 0 ? void 0 : _x.large) || '',
        website: ((_z = (_y = apiData.links) === null || _y === void 0 ? void 0 : _y.homepage) === null || _z === void 0 ? void 0 : _z[0]) || '',
        blockchain_site: ((_1 = (_0 = apiData.links) === null || _0 === void 0 ? void 0 : _0.blockchain_site) === null || _1 === void 0 ? void 0 : _1[0]) || '',
        official_forum_url: ((_3 = (_2 = apiData.links) === null || _2 === void 0 ? void 0 : _2.official_forum_url) === null || _3 === void 0 ? void 0 : _3[0]) || '',
        repos_url: ((_6 = (_5 = (_4 = apiData.links) === null || _4 === void 0 ? void 0 : _4.repos_url) === null || _5 === void 0 ? void 0 : _5.github) === null || _6 === void 0 ? void 0 : _6[0]) || ''
    });
};
exports.formatCryptoDetail = formatCryptoDetail;
/**
 * Formats chart data from CoinGecko API
 */
const formatChartData = (apiData) => {
    return apiData.map(([timestamp, price]) => ({
        date: new Date(timestamp).toISOString().split('T')[0],
        price: price
    }));
};
exports.formatChartData = formatChartData;
