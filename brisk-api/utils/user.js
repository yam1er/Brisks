import dbClient from "./db";
import redisClient from "./redis";

const userUtils = {
    async getUserDetails(req) {
        const userObj = { userId: null, key: null };

        const xToken = req.header('x-token');
        
        if (!xToken) { return userObj; }

        userObj.key = `auth_${xToken}`;
        userObj.userId = await redisClient.get(userObj.key);

        return userObj;
    }
}

export default userUtils;