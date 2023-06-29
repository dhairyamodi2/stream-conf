import { useEffect, useRef } from "react"
import { runVideo } from "../services/runVideo"
import { Response } from "../../../types/types"


interface VideoChatProps {
    joinRoomRes : Response<{user_type : string}>
}
export const VideoChat : React.FC<VideoChatProps> = function ({joinRoomRes}) {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        runVideo(videoRef)
        console.log(videoRef.current)
    }, [videoRef])
    return (
        <div>
            <video ref={videoRef} autoPlay muted width={300} height={200}></video>

            {joinRoomRes.payload.code == 'invite-step' && <div>
                <p>Invite other participants via this link</p>
                <span>{window.location.href}</span>
                </div>}
            {joinRoomRes.payload.code === 'accept-step' && <div>
               <p>A Participant wants to join</p>
               <p><button className="text-white bg-purple-500 p-3 rounded-md">Accept</button></p>
                </div>}

            {joinRoomRes.payload.code === 'waiting-step' && <div>
                <p>Please wait while host admits you! Do not refresh the page!</p>
                </div>}
        </div>
    )
}