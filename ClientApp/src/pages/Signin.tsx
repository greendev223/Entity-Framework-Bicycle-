import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { loginUser } from '../api'
import { attemptAutoLogin, recordAuthentication } from '../auth'
import { APIError, LoginUserType } from '../types'

export function SignIn() {
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState<LoginUserType>({
    email: '',
    password: '',
  })

  useEffect(() => {
    attemptAutoLogin( )
  }, [])

  const loginUserMutation = useMutation(loginUser, {
    onSuccess: function (apiResponse) {
      // TODO: record the authentication information we receive

      recordAuthentication(apiResponse)
      window.location.assign('/')
    },
    onError: function (error: APIError) {
      setErrorMessage(Object.values(error.errors).join(' '))
    },
  })


  const [passwordShow, setPasswordShow] = useState(false)
  const toggledPassword = () => {
    setPasswordShow(!passwordShow)
  }

  function handleStringFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldName = event.target.name
    const updatedUser = { ...user, [fieldName]: value }
    setUser(updatedUser)
  }

  return (
    <div>
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Welcome back</h2>
      </nav>
      <form
        onSubmit={function (event) {
          event.preventDefault()
          loginUserMutation.mutate(user)
        }}
      >
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleStringFieldChange}
          />
        </label>
        <label>
          Password:
          <input
            placeholder="click to show Password"
            type={passwordShow ? 'text' : 'password'}
            name="password"
            value={user.password}
            onClick={toggledPassword}
            onChange={handleStringFieldChange}
          />
        </label>
        <button type="submit" className="submit">
          Sign In
        </button>
      </form>
    </div>
  )
}
