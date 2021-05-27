const express = require('express');
const axios = require('axios');
const redis = require('redis');
const morgan = require('morgan')
const { promisify } = require('util')

// var createError = require('http-errors');
// var cookieParser = require('cookie-parser');
const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// connnect to the redis database 
// if the redis database is runing somewhere else then put the host in the paramenter
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
})

// redis client do not come with the promise so we have to use the promisify module from the util module which is inbuilt module from the nodejs
// promisify is use to convert callback based method into the promise based method.

// There is two method in the cliend redis which is get and set 
// we bind it with the client might be it have the client another

const GET_ASYNC = promisify(client.get).bind(client)
const SET_ASYNC = promisify(client.set).bind(client)


app.get('/rockets', async(req, res) => {
    try {

        const reply = await GET_ASYNC('rockets')
        if (reply) {
            console.log('using cached data')
            res.send(JSON.parse(reply))
            return
        }
        const response = await axios.get('https://api.spacexdata.com/v3/rockets')

        // EX is the expiry in the second in the next parameter we have to save the in the stringify because it save as the key valuse pair
        const set_response = SET_ASYNC('rockets', JSON.stringify(response.data), 'EX', 5)
        console.log('new cached data saved', set_response)

        return res.send({ data: response.data })
    } catch (error) {
        return res.send(error.message)
    }
})

app.listen(3001, () => {
    console.log('redis project started on 3001')
})