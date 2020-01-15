/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;


/* =======================
    LOAD THE CONFIG
==========================*/
const config = require('./config')
const port = process.env.PORT || 4000


/* =======================
    EXPRESS CONFIGURATION
==========================*/
const app = express()

mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.set('jwt-secret', config.secret)

// index page, just for testing
app.get('/', (req, res)=>{
    res.send('Hello JWT')
})

// configure api routerß
app.use('/api', require('./routes/api'))

// open the server
app.listen(port, ()=>{
    console.log(`Express is running on port ${port}`)
})


/* =======================
    CONNECT TO MONGODB SERVER
======================= */
/*     const client = new MongoClient(config.mongodbUrl, { useUnifiedTopology: true, useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */