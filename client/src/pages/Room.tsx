import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { runVideo } from "../services/runVideo";
import { SocketContext } from "../providers/SocketProvider";
import { JoinRoom, Response } from '../../../types/types'
import { NotFoundPage } from "../components/NotFound";
import { VideoChat } from "../components/VideoChat";
import { rtcService } from "../services/RtcService";

export const Room = function () {
    const params = useParams();
    const [stream, setStream] = useState<MediaStream>();
    const [loader, setLoader] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null)
    const socket = useContext(SocketContext)
    const [joinRoomRes, setJoinRoomRes] = useState<Response<{ user_type: string }>>()
    console.log(socket)


    useEffect(() => {
        if (stream) {
            for (const s of stream.getTracks()) {
                rtcService.RtcPeer!.addTrack(s, stream)
            }
        }

    }, [stream])

    const handleAccept = useCallback(async () => {
        if (socket) {
            const offer = await rtcService.generateOffer();
            socket.send(JSON.stringify({
                event_type: 'offer-generated',
                data: { offer: offer, room: params.id }
            }))
        }


    }, [params, socket])

    // useEffect(() => {
    //     if(socket) {
    //         rtcService.RtcPeer?.addEventListener("negotiationneeded", async () => {
    //             console.log('neg needed');
    //             const offer = await rtcService.generateOffer();
    //             socket.send(JSON.stringify({
    //                 event_type: 'offer-generated',
    //                 data: { offer: offer, room: params.id }
    //             }))
    //         })
    //     }
    // }, [socket, params])

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then((streams) => {
            setStream(streams)
        })

    }, [socket])


    const handleAnswerResponse = useCallback((ans: RTCSessionDescriptionInit) => {
        rtcService.setRemoteDescription(ans)
        // for (var s of stream!.getTracks()) {
        //     rtcService.RtcPeer!.addTrack(s, stream!)
        // }
    }, [stream])


    useEffect(() => {
        // runVideo(videoRef);
        if (socket) {
            console.log(socket)
            console.log('working')
            const joinRoomPayload: JoinRoom = {
                data: { id: params.id as string },
                event_type: 'join-room'
            }
            socket.send(JSON.stringify(joinRoomPayload))
        }
    }, [params, socket])


    useEffect(() => {
        if (socket) {
            socket.onmessage = function (ev) {
                const response = JSON.parse(ev.data) as Response<any>
                switch (response.event_type) {
                    case 'join-room-res':
                        setJoinRoomRes(response as Response<{ user_type: string }>)
                        break;
                    case 'offer-res':
                        console.log(JSON.stringify(response.payload.data))
                        rtcService.processOffer(response.payload.data).then((ans) => {
                            socket!.send(JSON.stringify({
                                event_type: 'answer-generated',
                                data: { ans: ans, room: params.id }
                            }))
                        }).catch((err) => {
                            alert(err)
                        })
                        break;
                    case 'ans-res':
                        handleAnswerResponse(response.payload.data)
                        break;

                }
                console.log(response)
            }
        }

    }, [params, socket, handleAnswerResponse])

    if (joinRoomRes) {
        return (
            <div>
                {joinRoomRes.payload.code === 'no-room-error' ? <NotFoundPage /> :
                    <VideoChat joinRoomRes={joinRoomRes} handleAccept={handleAccept} stream={stream} />}
            </div>
        )
    }
    return (
        <div>
            Loading.....
        </div>
    )
}