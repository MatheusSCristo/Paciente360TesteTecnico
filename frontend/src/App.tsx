
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import { TaskProvider } from "./contexts/TaskContext";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Toaster/>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;
