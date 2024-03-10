import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { ALL_AUTHORS } from '../queries/authorQueries'
import { EDIT_AUTHOR } from '../mutations/authorMutations'

const BirthForm = ({ authorName }) => {
  const [value, setValue] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submitBirth = (e) => {
    e.preventDefault()
    editAuthor({ variables: { name: authorName, setBornTo: parseInt(value) } })
  }

  return (
    <form onSubmit={submitBirth}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{width: "2.5em"}}
      />
      <button type="submit">set</button>
    </form>
  )
}

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <p>loading...</p>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a, i) => {
            return (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>
                  {a.born
                    ? a.born
                    : <BirthForm authorName={a.name} key={a.name} />
                  }
                </td>
                <td>{a.bookCount}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
