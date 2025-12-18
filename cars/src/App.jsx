import React from 'react'
import Login from './components/auth/login'
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      
      <BrowserRouter>
      
      <Routes>
        <Route path='/login' element={<Login />} />
        
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
