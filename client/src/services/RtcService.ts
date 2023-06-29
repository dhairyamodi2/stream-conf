class RtcService {
    RtcPeer : RTCPeerConnection | undefined
    private offer : RTCSessionDescriptionInit | undefined
    constructor(){
        if(!this.RtcPeer) {
            this.RtcPeer = new RTCPeerConnection({
                iceServers: [
                    {urls: [ "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"]}
                ]
            })
        }
    }


    async generateOffer() {
        if(this.RtcPeer) {
            // if (this.offer) return this.offer;
            const offer = await this.RtcPeer.createOffer()
            const localDescription = new RTCSessionDescription(offer)
            await this.RtcPeer.setLocalDescription(localDescription)
            // this.offer = offer
            return offer;
        }
    }

    async processOffer(offer : RTCSessionDescriptionInit) {
        if(this.RtcPeer) {
            const remoteDescription = new RTCSessionDescription(offer)
            await this.RtcPeer.setRemoteDescription(remoteDescription)
            const answer = await this.RtcPeer.createAnswer(offer)
            await this.RtcPeer.setLocalDescription(answer)
            return answer;
        }
    }

    async setRemoteDescription(ans : RTCSessionDescriptionInit) {
        if(this.RtcPeer) {
            const remoteDescription = new RTCSessionDescription(ans)
            await this.RtcPeer.setRemoteDescription(remoteDescription)
        }
    }
}

export let rtcService = new RtcService()
