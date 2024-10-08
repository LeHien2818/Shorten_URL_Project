import Url from '../models/Url.js'


class UrlExpanderService {

    URL_object = {}
    
    constructor(){
        this.URL_object = {
            urlCode : "",
            longUrl: "",
            shortUrl: "",
            date: ""
        }
    }

    async findOriginalUrl(url_code) {
        try{
            let url = await Url.findOne({urlCode: url_code})

            if(url) {
                this.URL_object = {
                    url_code : url.urlCode,
                    long_url : url.longUrl,
                    short_url : url.shortUrl,
                    date : url.date
                }
                return url.longUrl
            }
        } 
        catch(error) {
            console.log(error);
        }
    }

}

export default new UrlExpanderService()