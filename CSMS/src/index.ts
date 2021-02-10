import express from "express";
import mongoose from 'mongoose';
import config from './Config/config';
import morgan from 'morgan';
import path from 'path';
import rfs from 'rotating-file-stream';
import HTTP from 'http';

/* eslint @typescript-eslint/no-var-requires: "off" */
const SocketIOServer = require('socket.io');


const app = express();

const http = new HTTP.Server(app);
const io = SocketIOServer(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const connectDB = async () => {

    await mongoose.connect(config.MONGODB_CONNECTON, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {


        if (err) return console.log(err);

        console.log('Database Connected');

    });
}
connectDB();



// Name Space
const StationSocket = io.of(/^\/station-\d+$/);







if (config.NODE_ENV === 'development') {
    app.use(morgan('combined'))
} else {
    const accessLogStream = rfs.createStream('access.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, 'log')
    });
    app.use(morgan('combined', { stream: accessLogStream }));
}



http.listen(config.PORT, () => console.log(`server started at http://localhost:${config.PORT}`));

