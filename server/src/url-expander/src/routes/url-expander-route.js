import express from 'express'
import urlExpanderService from '../services/url-expander-service.js';

const router = express.Router()

router.get('/:shortId', async (req, res) => {
    try {
        const shortID = req.params.shortId;
        const original_url = await urlExpanderService.findOriginalUrl(shortID)
        console.log(original_url);
        res.redirect(original_url);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            EM: 'Something wrong in server',
            EC: '-2',
            DT: '',
        })
    }


});

export default router