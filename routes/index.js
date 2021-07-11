const express = require('express');

const router = express.Router();

const Url = require('../models/url');

//@route GET /:code
// @ desc Redirect to long url

router.get('/:code', async (req,res) => {
    try {
        const url = await Url.findOne({urlCode: req.params.code});
        const {code} = req.params;
        if(url) {
            
            const  incrementCount = url.clickCount + 1;
             const update = await Url.updateOne({urlCode: code},{clickCount: incrementCount, date: Date.now}, {});
            //await url.save()
            res.redirect(url.longUrl);
            // TODO fix the following error
            // @ error desc (node:13948) UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

            
        }else{
             res.status(404).json('Url not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Server error');
    }
});
module.exports = router;