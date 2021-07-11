const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');


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
app.use('/api/url', require('./routes/index'));
app.use('/api/url', require('./routes/url'));


const port = process.env.PORT || 4000;

app.listen(port, (err) => {
    if(err) return console.log(err)
    return console.log(`Server listening on http://localhost:${port}`)
})