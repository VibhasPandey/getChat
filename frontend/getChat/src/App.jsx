import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import toast, { Toaster } from 'react-hot-toast'
import { JoinCreateChat } from './components/JoinCreateChat'
function App() {
  

  return (
    <div>
      <Toaster position="bottom-right" reverseOrder={false}/>
      <JoinCreateChat />

    </div>
  )
}

export default App;
