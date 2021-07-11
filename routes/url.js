const express = require('express');

const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
require('dotenv').config();

//const config = require('cofig');

const Url = require('../models/url');
const baseUrl = process.env.BASE_URL_PROD ||process.env.BASE_URL_DEV;

// @route POST /api/url/shorten
// @desc create a short url
router.post('/shorten', async (req,res) => {
    console.log({ res })

    const {longUrl} = req.body;
    // validate long url
    if(!validUrl.isUri(longUrl)){
        return res.status(401).json('Invalid long url')
    }

     //create short url
     const urlCode = shortid.generate();
    if(validUrl.isUri(longUrl)){
        try {
            let url = await Url.collection.findOne({longUrl});
            if(url){
                // increment the clickCounter
                
                const  incrementCount = url.clickCount + 1;
                await Url.update({longUrl},{saveSameCount: url.saveSameCount + 1, date: Date.now});
                res.json()
            }else{
                const shortUrl = baseUrl + '/' + urlCode;
                url = new Url({
                    longUrl,
                    shortUrl,
                    clickCount: 0,
                    saveSameCount: 1,
                    urlCode,
                    date: new Date()
                });
                await url.save();
                res.json(url);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error ' + err)
        }
    }else {
        res.status(401).json('Invalid long url');
    }
   

    // validate long url
    //if()
});

// @route GET /api/url/
// @desc get all the record from db
router.get('/',  async (req, res) => {

     try {
         const result =  await Url.find({}).sort({_id:-1}) ;
         if (result) {
            console.log(result);
        //    // get all results here
        res.status(200).json(result); 
         } else {
            res.status(401).json('not result')
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Server error');
    }
});


module.exports = router;