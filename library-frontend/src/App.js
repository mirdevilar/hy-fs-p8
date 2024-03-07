import {
  Routes, Route,
  useNavigate,
} from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const NavBar = () => {
  const navigate = useNavigate()

  return (
    <nav>
      <button onClick={() => navigate('/authors')}>authors</button>
      <button onClick={() => navigate('/books')}>books</button>
      <button onClick={() => navigate('/add')}>add book</button>
    </nav>
  )
}

const App = () => {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
      </Routes>
    </div>
  )
}

export default App
