import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupWrapper from "./pages/authentication/SignupPage";
import LoginPage from "./pages/authentication/LoginPage";
import NotFoundPage from "./pages/utils/NotFoundPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/signup/*" element={<SignupWrapper />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;