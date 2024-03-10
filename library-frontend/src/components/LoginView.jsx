import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'

import { LOGIN } from '../mutations/userMutations'

const LoginView = ({ setToken }) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      navigate(-1)
      const token = result.data.login.value
      setToken('Bearer ' + token)
      localStorage.setItem('token', token)
    }
  }, [result.data])

  const onSubmit = (e) => {
    e.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <form onSubmit={onSubmit}>
      <label>username: </label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <label>password: </label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button type="submit">login</button>
    </form>
  )
}

export default LoginView
