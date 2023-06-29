import { useEffect, useRef } from "react"
import { runVideo } from "../services/runVideo"

export const VideoChat = function () {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        runVideo(videoRef)
    }, [videoRef])
    return (
        <div>
            <video ref={videoRef} autoPlay muted></video>
        </div>
    )
}