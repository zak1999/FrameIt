import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PartyRoomOwner from './pages/PartyRoomOwner'
import PartyRoomPH from './pages/PartyRoomPH'
import JoinRoom from './pages/JoinRoom'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/party/:id" element={<PartyRoomOwner />} />
          <Route path="/party/:id/ph" element={<JoinRoom />} />
          <Route path="/party/:id/ph/add" element={<PartyRoomPH />} />
          {/* <Route path="/adder/:id" element={<Adder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/adding/:id" element={<Adding />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
