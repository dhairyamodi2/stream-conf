import { Router, RouterProvider, useSearchParams } from "react-router-dom";
import { router } from "./router";
import React, { useEffect, useMemo, useState } from "react";
import { SocketProvider } from "./providers/SocketProvider";


function App() {
    let [client_socket, setSocket] = useState<WebSocket>()

    useEffect(() => {
        let socket = new WebSocket("ws://192.168.1.6:5000/ws")
        socket.onopen = function (e) {
            setSocket(socket)
        }
        socket.onclose = function (e) {
            setSocket(undefined)
        }
        socket.onerror = function (e) {
            alert(e)
            setSocket(undefined)
        }
    }, [])

    return (
        <SocketProvider value={client_socket}>
             <RouterProvider router={router} />
        </SocketProvider>
        
    )
}

export default App;