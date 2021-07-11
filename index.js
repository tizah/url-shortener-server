const express = require('express');
//const routes = require('./routes');
const bodyParser = require('body-parser');
const logger = require('morgan');
const shortid = require('shortid');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const validUrl = require('valid-url');
const urlModel = require('./models/url');
const baseUrl = process.env.BASE_URL_DEV;
const Url = require('./models/url');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.use(express.json)

const dbURL = process.env.MONGO_DB_URL;

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true}, function(err){
  if(err){
    console.log('Error connecting to: '+ dbURL + " " + err)
  }
  else{
    console.log('Connected to: '+ dbURL);
  }
});

//routes(app);
app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));
app.get('/get', async (req,res) => {
    try {
         const result =  await Url.collection('urls').find({});
         console.log({result})
         res.send(result)
         //result.then(x => )
        //console.log({result})
        // if (result) {
        //    // get all results here
        //     return res.status(200).json(result); 
        // } else {
        //     res.status(401).json('not result')
        // }
    } catch (error) {
        console.log('bad')
        console.log(error);
        res.status(500).json('Server error ' + error);
    }
})

// app.get('/', (req, res) => {
//     res.json({ message: "Welcome to url shortener API"});
// });

const port = process.env.PORT || 4000;

app.listen(port, (err) => {
    if(err) return console.log(err)
    return console.log(`Server listening on http://localhost:${port}`)
})