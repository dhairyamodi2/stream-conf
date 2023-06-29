import { useCallback } from "react"
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const handleCreateRoom = useCallback(async () => {
        const res = await fetch('/create-room');
        const data = await res.json();
        // alert(JSON.stringify(data))
        if(data && data.uid) {
            // alert(data.uid)
            navigate(`/room/${data.uid}`)
        }
        else {
            alert("There was some error");
        }
    }, [])
    return (
        <div className="home">
            <button className="text-white bg-purple-500 p-3 rounded-md text-sm" onClick={handleCreateRoom}>Create Room</button>
        </div>
    )
}