
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import { TaskProvider } from "./contexts/TaskContext";
import Home from "./pages/Home";

function Calendario() {
  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h2>Calendário</h2>
      <p>Em breve...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Toaster/>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/calendario" element={<Calendario />} />
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;
