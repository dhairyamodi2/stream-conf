import express from 'express'
import dotenv from 'dotenv'
import path, { parse } from 'path';
import * as http from 'http'
import * as WebSocket from 'ws'
import { handleJoinRoom } from './EventHandlers';
import * as crypto from 'crypto'
import cors from 'cors';
import { error } from 'console';
import { JoinRoom } from './types/types';
const app = express()
const server = http.createServer(app)

app.use(express.json())

app.use(cors({
    origin: '*'
}))

dotenv.config({path: path.join(__dirname, "../.env")});

server.listen(process.env.PORT, () => {
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
        }

    })
    webSocket.send('connected');
})


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
