import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CMSDashboard from './pages/CMSDashboard'
import Home from './pages/Home'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/CMSDashboard" element={<CMSDashboard />} />

      </Routes>

    </div>
  )
}

export default App
