import express from 'express'
import dotenv from 'dotenv'
import path, { parse } from 'path';
import * as http from 'http'
import * as WebSocket from 'ws'
import { handleEndCall, handleGenerateAnswer, handleGenerateOffer, handleJoinRoom } from './EventHandlers';
import * as crypto from 'crypto'
import cors from 'cors';
import { error } from 'console';
import { JoinRoom } from './types/types';
const app = express()
const server = http.createServer(app)

app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(express.json({limit: '50mb'}))

app.use(cors({
    origin: '*',
    allowedHeaders: '*',
    credentials: true

}))

dotenv.config({path: path.join(__dirname, "../.env")});

server.listen(process.env.PORT, () => {
    console.log(path.join(__dirname, "../client/build/index.html"))
    console.log(`Server runnning on port ${process.env.PORT}`)
})

const socket_server = new WebSocket.Server({path: "/ws", server})
socket_server.on('connection', function() {
    console.log('connected')
})
export let rooms = new Map<string, Array<WebSocket>>();

interface IncomingEvent {
    event_type : 'join-room'
    data : any
}

// server.on('upgrade', function(req, socket, head) {
//     socket.on('error', (e) => console.log(e))

//     console.log("here")
//     socket_server.handleUpgrade(req, socket, head, function done(ws) {
//         socket_server.emit('connection', ws, req)
//     })  
// })
socket_server.on("connection", (webSocket : WebSocket) => {
    webSocket.on('message', function(incoming : Buffer) {
        const message = JSON.parse(incoming.toString()) as JoinRoom;
        console.log(message)
        const {data, event_type} = message;

        switch(event_type) {
            case 'join-room':
                console.log(data)
                handleJoinRoom(data.id, webSocket);
                break;
            case 'offer-generated':
                console.log(data)
                handleGenerateOffer(data.offer, webSocket, data.room as string)
                break;
            case 'answer-generated':
                console.log(data)
                handleGenerateAnswer(data.ans, webSocket, data.room as string)
                break;
            case 'end-call' :
                console.log(data)
                handleEndCall(webSocket, data as string)
                break;


        }

    })
    webSocket.send('connected');
})

app.use(express.static(path.join(__dirname, '../client/build')));


app.get("/create-room", (req, res) => {
    var uid = crypto.randomUUID() as string;
    let arr = new Array<WebSocket>();
    rooms.set(uid, arr);
    console.log(rooms)
    return res.status(200).json({
        success: true,
        uid: uid
    })

   
})


app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
})