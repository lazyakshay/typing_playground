import { useState } from 'react'
import TypingTest from './components/TypingTest'
import './App.css'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Typing Playground</h1>
        <p className="subtitle">A typing playground developed for Rahul :)</p>
      </header>
      <main>
        <TypingTest />
      </main>
      <footer>
        <p>© 2025 Akshay Saini</p>
      </footer>
    </div>
  )
}

export default App
