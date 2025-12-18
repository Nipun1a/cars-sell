import React from 'react'
import Login from './components/auth/login'
import Register from './components/auth/register'
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      
      <BrowserRouter>
      
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path= '/register' element={<Register />} />
        
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
