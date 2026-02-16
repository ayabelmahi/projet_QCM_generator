import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
    return (
        <Router>
            <Routes>
                {/* 1. La page d'accueil par défaut */}
                <Route path="/" element={<Home />} />

                {/* 2. Tes pages d'authentification */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 3. Sécurité : Si l'utilisateur tape une URL inconnue, on le ramène à la Home */}
                <Route path="*" element={<Home />} />
            </Routes>
        </Router>
    )
}

export default App