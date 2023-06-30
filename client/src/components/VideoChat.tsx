import { useCallback, useEffect, useRef, useState } from "react"
import { runVideo } from "../services/runVideo"
import { Response } from "../../../types/types"
import { rtcService } from "../services/RtcService"


interface VideoChatProps {
    joinRoomRes : Response<{user_type : string}>
    handleAccept: () => Promise<void>
    stream : MediaStream | undefined
    handleEndCall :() => void
}
export const VideoChat : React.FC<VideoChatProps> = function ({joinRoomRes, handleAccept, stream, handleEndCall}) {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        if(videoRef.current && stream) {
            videoRef.current.srcObject = stream
        }
    }, [videoRef,stream])

    const receivedVideoRef = useRef<HTMLVideoElement>(null)
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    useEffect(() => {
        rtcService.RtcPeer?.addEventListener('track', async (event) => {
            setRemoteStream(event.streams[0])
        })
    }, [])
    
    

    useEffect(() => {
        if(receivedVideoRef.current && remoteStream) {
            receivedVideoRef.current.srcObject = remoteStream
        }
    }, [receivedVideoRef, remoteStream])
    // if (remoteStream) {
    //     return (
    //         <div>
    //              <video ref={videoRef} autoPlay muted width={300} height={200}></video>
    //              <video ref={receivedVideoRef} autoPlay width={300} height={300}></video>
    //         </div>
    //     )
    // }
    return (
        <div>
            <video ref={videoRef} autoPlay muted width={300} height={200}></video>
            {joinRoomRes.payload.code == 'invite-step' && <div>
                <p>Invite other participants via this link</p>
                <span>{window.location.href}</span>
                </div>}
            {joinRoomRes.payload.code === 'accept-step' && <div>
               <p>A Participant wants to join</p>
               <p><button className="text-white bg-purple-500 p-3 rounded-md" onClick={handleAccept}>Accept</button></p>
                </div>}

            {joinRoomRes.payload.code === 'waiting-step' && <div>
                <p>Please wait while host admits you! Do not refresh the page!</p>
                </div>}
            <p><button onClick={handleEndCall} className="bg-purple-400 text-white p-3 mx-auto w-auto">End Call</button></p>
            <video ref={receivedVideoRef} autoPlay width={300} height={300}></video>
        </div>
    )
}