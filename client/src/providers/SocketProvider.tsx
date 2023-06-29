import { ReactNode, createContext } from "react";

export const SocketContext = createContext<WebSocket | undefined>(undefined)

export const SocketProvider : React.FC<{children : ReactNode, value : WebSocket | undefined}>= function ({children, value}) {
    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}