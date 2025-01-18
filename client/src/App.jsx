import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupWrapper from "./pages/authentication/SignupPage";
import LoginPage from "./pages/authentication/LoginPage";
import NotFoundPage from "./pages/utils/NotFoundPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SwipePage from "./pages/swipe/SwipePage";
import ChatPage from "./pages/chat/ChatPage";
import BottomNavbar from "./components/navbar/BottomNavbar";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/signup/*" element={<SignupWrapper />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/swipe" element={<SwipePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>
                <BottomNavbar />
            </div>
        </Router>
    );
}

export default App;