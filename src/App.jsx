import React from "react"
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import GamePage from "@/components/pages/GamePage"

function App() {
  return (
    <div className="min-h-screen bg-sky-gradient">
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App