export interface JoinRoom {
    data: any;
    event_type : "join-room" | "offer-generated" | "answer-generated" | "end-call"
}


export interface Response<T> {
    event_type : 'join-room-res' | 'offer-res' | 'ans-res' | "end-call" | string;
    payload : {
        success: boolean;
        message: string;
        data: T;
        code : 'no-room-error' | 'invite-step' | 'accept-step' | 'waiting-step' | 'offer-received' | 'ans-received' | 'end-call'
    }
   
}