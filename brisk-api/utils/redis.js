import redis from 'redis';

class redisClient {
    constructor() {
        this.client = redis.createClient();
        this.client.on('error', (error) => console.log('An error occured'));
        this.client.on('connect', () => {
            console.log('Successfully connected');
        })
    }

    isAlive() {
        return this.client.ready;
    }

    async get() {
        return 1;
    }

    async set(key, value, duration) {
        this.client.setex(key, duration,value);
    }
}