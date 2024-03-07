import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { ALL_AUTHORS } from '../queries/authorQueries'
import { EDIT_AUTHOR } from '../mutations/authorMutations'

let counter = 0

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const [birthFields, setBirthFields] = useState({})

  useEffect(() => {
    if (!result.loading) {
      setBirthFields(authors.reduce((output, a) => {
        output[a.name] = ''
        console.log(output)
        return output
      }, {}))
    }
  }, [result.loading])

  if (result.loading) {
    return <p>loading...</p>
  }

  const authors = result.data.allAuthors

  counter++
  console.log(counter)
  const updateBirthField = (e, name) => {
    let newState = { ...birthFields }
    newState[name] = e.target.value
    setBirthFields(newState)
  }

  const handleSubmitBirth = (e, name) => {
    e.preventDefault()
    console.log(birthFields[name])
    console.log(name)
    editAuthor({ variables: { name, setBornTo: parseInt(birthFields[name]) } })
  }

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
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>
                {a.born
                  ? a.born
                  : <form onSubmit={(e) => handleSubmitBirth(e, a.name)}>
                      <input
                        value={birthFields[a.name]}
                        onChange={(e) => updateBirthField(e, a.name)}
                        style={{width: "2.5em"}}
                      />
                      <button type="submit">set</button>
                    </form>
                }
              </td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
