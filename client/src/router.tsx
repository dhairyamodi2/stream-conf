import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Room } from "./pages/Room";
export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Home />
        ),
    },
     {
        path: '/room/:id',
        element: (
            <Room />
        )
     }
])