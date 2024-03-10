import { useEffect, useState } from 'react'
import {
  Routes, Route,
  useNavigate,
} from 'react-router-dom'

import AuthorsView from './components/AuthorsView'
import BooksView from './components/BooksView'
import LoginView from './components/LoginView'
import NewBookView from './components/NewBookView'

const NavBar = ({ isLoggedIn }) => {
  const navigate = useNavigate()

  return (
    <nav>
      <button onClick={() => navigate('/authors')}>authors</button>
      <button onClick={() => navigate('/books')}>books</button>
      {isLoggedIn && <button onClick={() => navigate('/add')}>add book</button>}
      {!isLoggedIn && <button onClick={() => navigate('/login')}>login</button>}
    </nav>
  )
}

const App = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
  }, [])

  return (
    <div>
      <NavBar isLoggedIn={token !== null} />

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
