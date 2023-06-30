import * as WebSocket from 'ws'
import { rooms } from "./main"
import { JoinRoom, Response } from './types/types';

export function handleJoinRoom(id : string, client : WebSocket) {
    try {
        let ws = rooms.get(id);
        console.log(id)
        if (ws == undefined) {
            client.send(JSON.stringify({
                event_type : "join-room-res",
                payload: {
                    code : "no-room-error",
                    success: false,
                    message: "No such room exists!",
                    data: null
                }
            }))
            return;
        }
        if (ws.length == 0) {
            rooms.set(id, [client])
            client.send(JSON.stringify({
                event_type : "join-room-res",
                payload: {
                    success: true,
                    code : "invite-step",
                    data: {
                        user_type: 'host'
                    },
                    message: "Invite other partiticipants"
                }
            }))
            return;
        }
        if (ws.length == 1) {
            ws.push(client);
            rooms.set(id, ws)
            ws[0].send(JSON.stringify({
                event_type : 'join-room-res',
                payload: {
                    success: true,
                    code : 'accept-step',
                    data: {user_type: 'guest'},
                    message: "Some user wants to enter the call"
                }
            }))
            ws[1].send(JSON.stringify({
                event_type : 'join-room-res',
                payload: {
                    success: true,
                    code : 'waiting-step',
                    data: {user_type: 'guest'},
                    message: "Please wait while host admits you!"
                }
            }))
        }
        // console.log(rooms)
    } catch (error) {
        console.log(error)
    }
}


export function handleGenerateOffer(offer : any, client : WebSocket, id : string) {
    try {
        if (offer && id) {
            let clients = rooms.get(id)
            let responseObj : Response<any>
            if(clients && clients.length == 2) {
                responseObj = {
                    event_type: 'offer-res',
                    payload: {
                        success: true,
                        message: "",
                        data: offer,
                        code: "offer-received"
                    }
                }
                if (client === clients[0]) {
                    clients[1].send(JSON.stringify(responseObj))
                }
                else if (client == clients[1]) {
                    clients[0].send(JSON.stringify(responseObj))
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}


export function handleGenerateAnswer(ans : any, client : WebSocket, id : string) {
    try {
        if(ans && id) {
            const clients = rooms.get(id)
            let responseObj : Response<any>
            if(clients && clients.length == 2) {
                responseObj = {
                    event_type: 'ans-res',
                    payload: {
                        success: true,
                        message: "",
                        data: ans,
                        code: "ans-received"
                    }
                }
                if (client === clients[0]) {
                    clients[1].send(JSON.stringify(responseObj))
                }
                else if (client == clients[1]) {
                    clients[0].send(JSON.stringify(responseObj))
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export function handleEndCall (client : WebSocket, id : string) {
    console.log('ending call..')
    try {
        const clients = rooms.get(id)
        console.log('end call here')
        let responseObj : Response<any> 
        if(clients && typeof (clients) == 'object') {
            clients.map((client) => {
                responseObj = {
                    event_type:'end-call',
                    payload: {
                        success: true,
                        message: "Get out",
                        data: null,
                        code: 'end-call'
                    }
                }
                console.log(JSON.stringify(responseObj))
                client.send(JSON.stringify(responseObj))
            })
        }
    } catch (error) {
        console.log(error)
    }
}