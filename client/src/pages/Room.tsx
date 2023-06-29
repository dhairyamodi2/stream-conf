import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { runVideo } from "../services/runVideo";
import { SocketContext } from "../providers/SocketProvider";
import {JoinRoom, Response} from '../../../types/types'
import { NotFoundPage } from "../components/NotFound";
import { VideoChat } from "../components/VideoChat";

export const Room = function () {
    const params = useParams();
    const [loader, setLoader] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null)
    const socket = useContext(SocketContext)
    const [joinRoomRes, setJoinRoomRes] = useState<Response<{user_type : string}>>()
    useEffect(() => {
        runVideo(videoRef);
        if (socket) {
            console.log(socket)
            console.log('working')
            const joinRoomPayload : JoinRoom = {
                 data: {id : params.id as string},
                 event_type: 'join-room'
            }
            socket.send(JSON.stringify(joinRoomPayload))


            socket.onmessage = function (ev) {
                const response = JSON.parse(ev.data) as Response<{user_type : string}>
                setJoinRoomRes(response)
                // console.log(response)
            }
        }
    }, [params, socket])

    if (joinRoomRes) {
        return (
            <div>
                <VideoChat />
                {joinRoomRes.payload.code === 'no-room-error' ? <NotFoundPage /> : 
                <VideoChat />}
            </div>
        )
    }
    return (
        <div>
            Loading...
        </div>
    )
}