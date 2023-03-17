import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PartyRoomOwner from './pages/PartyRoomOwner'
import PartyRoomPH from './pages/PartyRoomPH'
import JoinRoom from './pages/JoinRoom'
import NoPage from "./pages/NoPage";

export const router = createBrowserRouter([
  {
    path:"/",
    element:<Home />
  },
  {
    path:"/dashboard", 
    element:<Dashboard />
  },
  {
    path:"/party/:id",
    element:<PartyRoomOwner />
  },
  {
    path:"/party/:id/ph",
    element:<JoinRoom />
  },
  {
    path:"/party/:id/ph/add",
    element:<PartyRoomPH />
  },
  {
    path:"*", 
    element:<NoPage />
  }
])
