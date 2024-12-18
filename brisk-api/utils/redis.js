import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.custumGet = promisify(this.client.get).bind(this.client);
        this.client.on('error', (error) => console.log('Error', error.message));
        this.client.on('connect', () => {
            this.client.ready = true
            console.log('Successfully connected to Redis');
        })
    }

    isAlive() {
        return this.client.ready;
    }

    async get(key) {
        const value = this.custumGet(key);
        return value;
    }

    async set(key, value, duration) {
        this.client.setex(key, duration, value);
    }

    async del(key) {
        this.client.del(key);
    }
}

const redisClient = new RedisClient();
export default redisClient;