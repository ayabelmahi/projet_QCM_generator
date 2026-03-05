import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'


function App() {
    return (
        
            <Routes>
                {/* Par défaut, on arrive sur le Login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />


                {/* On ajoutera le Dashboard ici plus tard */}
            </Routes>
        
    )
}

export default App