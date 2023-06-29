import * as WebSocket from 'ws'
import { rooms } from "./main"
import { Response } from './types/types';

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
                event_type : 'join_room-res',
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