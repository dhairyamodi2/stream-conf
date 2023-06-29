export interface JoinRoom {
    data: {id : string};
    event_type : "join-room"
}


export interface Response<T> {
    event_type : 'join-room-res' | string;
    payload : {
        success: boolean;
        message: string;
        data: T;
        code : 'no-room-error' | 'invite-step' | 'accept-step' | 'waiting-step'
    }
   
}