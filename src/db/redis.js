import { createClient } from 'redis';

let client;

export const setupRedis = async () => {
    try {
        const { REDIS_SERVER_URL } = process.env;
        client = createClient({
            url: REDIS_SERVER_URL
        })
        await client.connect();
        console.log('Redis server is up');
    } catch (err) {
        console.error('Redis connection failed', err.message);
    }
}

export const getfromCache = async (key, fallback = undefined, ttl = 60) => {
    let value = await client.get(key);
    if (value == null && fallback) {
        value = await fallback();
        if (value) {
            await client.set(key, JSON.stringify(value), { EX: ttl });
        }
    }else{
        value = JSON.parse(value ?? "");
    }
    return value;
}

export const setToCache = async (key, value, ttl) => {
    const res = await client.set(key, value, { EX: ttl });
    return res === "OK";
}

export const clearCache = async (key) =>{
    const result = await client.del(key);
    return result === 1;
}