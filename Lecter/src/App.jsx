import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./Chat"
import Login from "./Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
      );
}

export default App;