import express from "express";
import urlExpanderService from "../services/url-expander-service.js";

const router = express.Router();

export default (redisClient) => {
  router.get("/:shortId", async (req, res) => {
    try {
      const shortID = req.params.shortId;
      const original_url = await urlExpanderService.redirectOriginalUrl(shortID, redisClient);
      if (original_url) {
        console.log(original_url);
        return res.status(200).json({
          originalUrl: original_url,
        });
      }
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        EM: "Something wrong in server",
        EC: "-2",
        DT: "",
      });
    }
  });
  return router;
};
