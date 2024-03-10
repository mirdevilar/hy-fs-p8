import { useEffect, useState } from 'react'
import {
  Routes, Route,
  useNavigate,
} from 'react-router-dom'

import AuthorsView from './components/AuthorsView'
import BooksView from './components/BooksView'
import LoginView from './components/LoginView'
import NewBookView from './components/NewBookView'

const NavBar = ({ isLoggedIn, logout }) => {
  const navigate = useNavigate()

  return (
    <nav>
      <button onClick={() => navigate('/books')}>books</button>
      <button onClick={() => navigate('/authors')}>authors</button>
      {isLoggedIn && <button onClick={() => navigate('/add')}>add book</button>}

      {!isLoggedIn && <button onClick={() => navigate('/login')}>login</button>}
      {isLoggedIn && <button onClick={logout}>log out</button>}
    </nav>
  )
}

const App = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.setItem('token', null)
  }

  return (
    <div>
      <NavBar isLoggedIn={token !== null} logout={logout} />

      <Routes>
        <Route path="/add" element={<NewBookView />} />
        <Route path="/authors" element={<AuthorsView />} />
        <Route path="/login" element={<LoginView setToken={setToken} />} />
        <Route path="*" element={<BooksView />} />
      </Routes>
    </div>
  )
}

export default App
