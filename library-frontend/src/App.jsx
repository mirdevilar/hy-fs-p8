import { useEffect, useState } from 'react'
import {
  Routes, Route,
  useNavigate,
} from 'react-router-dom'
import { useQuery, useSubscription, useApolloClient } from '@apollo/client'

import AuthorsView from './components/AuthorsView'
import BooksView from './components/BooksView'
import LoginView from './components/LoginView'
import NewBookView from './components/NewBookView'
import RecommendedView from './components/RecommendedView'

import { ME } from './queries/userQueries'
import { BOOK_ADDED } from './subscriptions'
import { ALL_BOOKS } from './queries/bookQueries'

const NavBar = ({ isLoggedIn, logout }) => {
  const navigate = useNavigate()

  return (
    <nav>
      <button onClick={() => navigate('/')}>books</button>
      <button onClick={() => navigate('/authors')}>authors</button>
      {isLoggedIn && <button onClick={() => navigate('/recommended')}>recommended</button>}
      {isLoggedIn && <button onClick={() => navigate('/add')}>add book</button>}

      {!isLoggedIn && <button onClick={() => navigate('/login')}>login</button>}
      {isLoggedIn && <button onClick={logout}>log out</button>}
    </nav>
  )
}

export const updateCache = (cache, query, addedBook) => {
  cache.updateQuery(query, ({ allBooks }) => {
    allBooks = allBooks.some(b => b.title === addedBook.title)
      ? allBooks
      : allBooks.concat(addedBook)
    return {
      allBooks
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const userQuery = useQuery(ME)

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const newBook = data.data.bookAdded
      alert(`${newBook} was added!`)
      updateCache(client.cache, { query: ALL_BOOKS }, newBook)
    }
  })

  useEffect(() => {
    const localToken = localStorage.getItem('token')
    setToken(localToken)
  }, [userQuery.data])

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <div>
      <NavBar isLoggedIn={token !== null} logout={logout} />

      <Routes>
        <Route path="/add" element={<NewBookView />} />
        <Route path="/authors" element={<AuthorsView token={token} />} />
        {userQuery.data && userQuery.data.me && <Route path="/recommended" element={<RecommendedView user={userQuery.data.me} />} />}
        {!token && <Route path="/login" element={<LoginView setToken={setToken} />} />}
        <Route path="/" element={<BooksView />} />
      </Routes>
    </div>
  )
}

export default App
