import express from 'express'
import urlShortenerService from '../services/url-shortener-service.js';

const router = express.Router();

router.get('/:shortId', async (req, res) => {
    try {
        const shortURL = req.params.shortId;
        const data = await urlShortenerService.getOriginalURL(shortURL);
        console.log(data);
        if (data.EC === '2') {
            return res.status(500).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            })
        }
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            EM: 'Something wrong in server',
            EC: '-2',
            DT: '',
        })
    }


});

router.post('/create', async (req, res) => {
    try {
        console.log('hit herre');

        const originalUrl = req.body.originalUrl;
        console.log(originalUrl);

        const data = await urlShortenerService.createShortUrl(originalUrl);

        console.log('data create url', data);

        if (data.EC === '2') {
            return res.status(500).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            })
        }
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            EM: 'Something wrong in server',
            EC: '-2',
            DT: '',
        })
    }
});


export default router;