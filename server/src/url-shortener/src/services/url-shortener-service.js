import crypto from 'crypto'

import db from '../models/index.js'; // Import db chứa sequelize và các models

const { Url } = db;

// import KafkaConfig from '../config/kafka.js';



class UrlShortenerService {

    async generateURLcode(input) {
        // Get the current Unix time in nanoseconds
        const nanoTime = process.hrtime.bigint().toString();

        // Concatenate the input URL with the current Unix nano time
        const combinedInput = nanoTime + input;

        // Create a SHA-256 hash of the combined input
        const hash = crypto.createHash('sha256').update(combinedInput).digest();

        console.log('hash', hash);

        // Slice the first 6 bytes of the hash
        const bytes = hash.slice(0, 6);

        let num = 0n;
        for (let i = 0; i < bytes.length; i++) {
            num = (num << 8n) | BigInt(bytes[i]);
        }

        console.log('num', num);

        // Base62 encoding
        const base62chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';

        while (num > 0n) {
            const remainder = num % 62n;
            code = base62chars[Number(remainder)] + code;
            num = num / 62n;
        }

        // Ensure the code is 10 characters long
        code = code.padStart(10, '0').substring(0, 10);

        return code;
    }
    async createShortUrl(originalUrl, redisClient) {
        const server_host_url = 'http://localhost:3002' // 'http://short.url'
        try {

            console.log(Url);

            console.log('hit data create short url');

            let url = await Url.findOne({
                where: { longUrl: originalUrl }
            });

            if (url) {
                console.log('>>> url exits in db');
                return {
                    EM: ' URL is exits ',
                    EC: '1',
                    DT: url
                }
            }
            const urlCode = await this.generateURLcode(originalUrl)

            console.log('url code hash', urlCode);

            const shortUrl = `${server_host_url}/${urlCode}`;
            console.log('check shortUrl', shortUrl);

            url = new Url({
                urlCode,
                longUrl: originalUrl,
                shortUrl,
            });

            await url.save();
            await redisClient.setEx(`url:${url.urlCode}`, 3600, JSON.stringify(url));

            // await KafkaConfig.produce('url_created', url);
            // console.log('send to kafka');

            return {
                EM: 'create short URL succesfully ',
                EC: '0',
                DT: url
            }
        } catch (error) {
            console.error(error);

            return {
                EM: 'Something wrong in server',
                EC: '-2',
                DT: '',
            }


        }
    }

    async getOriginalURL(shortId) {
        try {
            console.log('hit get OriginalUrl aaa', shortId);
            let url = await Url.findOne({

                where: { urlCode: shortId }
            });
            console.log('chekc', url);
            if (!url) {
                console.log('hit null');

                return {
                    EM: 'Short URL not defined',
                    EC: '0',
                    DT: ''
                }

            }

            return {
                EM: 'get Original URL succesfully ',
                EC: '0',
                DT: url
            }
        } catch (error) {
            console.error(error);

            return {
                EM: 'Something wrong in server',
                EC: '-2',
                DT: '',
            }
        }

    }

}


export default new UrlShortenerService();