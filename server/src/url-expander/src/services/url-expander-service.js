import Url from "../models/Url.js";

class UrlExpanderService {
    URL_object = {};

    constructor() {
        this.URL_object = {
            urlCode: "",
            longUrl: "",
            shortUrl: "",
            date: "",
        };
    }

    async findOriginalUrl(url_code) {
        try {
            let url = await Url.findOne({ urlCode: url_code });

            if (url) {
                this.URL_object = {
                    url_code: url.urlCode,
                    long_url: url.longUrl,
                    short_url: url.shortUrl,
                    date: url.date,
                };
                return url.longUrl;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async redirectOriginalUrl(url_code, redisClient) {
        try {
            let hotData = await redisClient.get(`hot:url:${url_code}`);
            if (hotData) {
                let hotCacheUrl = JSON.parse(hotData);
                hotCacheUrl.clicks += 1;
                await redisClient.setEx(`hot:url:${url_code}`, 3600, JSON.stringify(hotCacheUrl));
                console.log("Cache");
                return hotCacheUrl.longUrl;
            }

            let data = await redisClient.get(`url:${url_code}`);
            if (data) {
                let cacheUrl = JSON.parse(data);
                cacheUrl.clicks += 1;
                await redisClient.setEx(`url:${url_code}`, 3600, JSON.stringify(cacheUrl));
                console.log("Cache");
                return cacheUrl.longUrl;
            }

            let url = await Url.findOne({ urlCode: url_code });
            if (url) {
                url.clicks++;
                await url.save();
                await redisClient.setEx(
                    `url:${url.urlCode}`,
                    3600,
                    JSON.stringify({ longUrl: url.longUrl, clicks: url.clicks })
                );
                return url.longUrl;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default new UrlExpanderService();
