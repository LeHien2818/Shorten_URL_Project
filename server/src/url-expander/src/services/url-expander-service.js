import db from '../models/index.js'; // Import db chứa sequelize và các models

const { Url } = db;

import KafkaConfig from '../config/kafka.js';
class UrlExpanderService {
    async redirectOriginalUrl(url_code, redisClient) {
        try {
            let data = await redisClient.get(`url:${url_code}`);
            if (data) {
                let cacheUrl = JSON.parse(data);
                console.log(">>> get from cache");
                // produce to kafka
                await KafkaConfig.produce('url_clicked', cacheUrl);
                return cacheUrl.longUrl;
            }

            let url = await Url.findOne({
                where: { urlCode: url_code }
            });
            
            if (url) {
                console.log(">>> get from database");
                await redisClient.setEx(`url:${url_code}`, 3600, JSON.stringify(url));
                // produce to kafka
                await KafkaConfig.produce('url_clicked', url);
                return url.longUrl;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default new UrlExpanderService();
