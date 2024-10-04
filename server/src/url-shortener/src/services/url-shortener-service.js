import crypto from 'crypto'
import Url from '../models/Url.js'



class UrlShortenerService {


    async generateURLcode(input) {

        const hash = crypto.createHash('md5').update(input).digest();


        console.log('as', hash);

        const bytes = hash.slice(0, 6);


        let num = 0n;
        for (let i = 0; i < bytes.length; i++) {
            num = (num << 8n) | BigInt(bytes[i]);
        }

        console.log('cs', num);

        const base62chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';

        while (num > 0n) {
            const remainder = num % 62n;
            code = base62chars[Number(remainder)] + code;
            num = num / 62n;
        }

        code = code.padStart(10, '0').substring(0, 10);

        return code;
    }

    async createShortUrl(originalUrl) {
        try {
            console.log('hit data');

            const urlCode = await this.generateURLcode(originalUrl)

            console.log('url code hash', urlCode);

            const shortUrl = `http://short.url/${urlCode}`;

            let url = await Url.findOne({ longUrl: originalUrl });
            console.log(url);


            if (url) {
                console.log('url exits');
                return {
                    EM: ' URL is exits ',
                    EC: '1',
                    DT: url
                }
            }

            url = new Url({
                urlCode,
                longUrl: originalUrl,
                shortUrl,
            });

            await url.save();

            return {
                EM: 'create short URL succesfully ',
                EC: '0',
                DT: shortUrl
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
            console.log('hit get OriginalUrl', shortId);
            let url = await Url.findOne({ urlCode: shortId });
            console.log(url);
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