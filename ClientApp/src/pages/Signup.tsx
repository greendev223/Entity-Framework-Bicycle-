import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router'
import { submitNewUser } from '../api'
import { APIError, NewUserType, UploadResponse } from '../types'
import { useDropzone } from 'react-dropzone'
import { authHeader } from '../auth'

export function SignUp() {
  const history = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [newUser, setNewUser] = useState<NewUserType>({
    fullName: '',
    email: '',
    password: '',
    photoURL: '',
  })

  const createUserMutation = useMutation(
    (newUser: NewUserType) => submitNewUser(newUser),
    {
      onSuccess: () => {
        history('/signin')
      },
      onError: function (error: APIError) {
        setErrorMessage(Object.values(error.errors).join('/'))
      },
    }
  )

  function handleStringFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldName = event.target.name
    const updatedUser = { ...newUser, [fieldName]: value }
    setNewUser(updatedUser)
  }

 const [passwordShow, setPasswordShow] = useState(false)
 const toggledPassword = () => {
   setPasswordShow(!passwordShow)
 }

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop: onDropFile,
})
const [isUploading, setIsUploading] = useState(false)
  async function uploadFile(fileToUpload: File) {
    // Create a formData object so we can send this
    // to the API that is expecting some form data.
    const formData = new FormData()

    // Append a field that is the form upload itself
    formData.append('file', fileToUpload)

    // Use fetch to send an authorization header and
    // a body containing the form data with the file
    const response = await fetch('/api/Uploads', {
      method: 'POST',
      headers: {
        Authorization: authHeader(),
      },
      body: formData,
    })

    if (response.ok) {
      return response.json()
    } else {
      throw 'Unable to upload image!'
    }
  }
const uploadFileMutation = useMutation(uploadFile, {
  onSuccess: function (apiResponse: UploadResponse) {
    const url = apiResponse.url

    setNewUser({ ...newUser, photoURL: url })
  },

  onError: function (error: string) {
    setErrorMessage(error)
  },

  onSettled: function () {
    setIsUploading(false)
  },
})

async function onDropFile(acceptedFiles: File[]) {
  // Do something with the files
  const fileToUpload = acceptedFiles[0]

  setIsUploading(true)
  uploadFileMutation.mutate(fileToUpload)
}

let dropZoneMessage = 'Drag a picture of the user here to upload!'

if (isUploading) {
  dropZoneMessage = 'Uploading...'
}

if (isDragActive) {
  dropZoneMessage = 'Drop the files here ...'
}

  return (
    <div>
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Sign up</h2>
      </nav>
      <form
        onSubmit={function (event) {
          event.preventDefault()
          createUserMutation.mutate(newUser)
        }}
      >
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <p className="form-input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="fullName"
            value={newUser.fullName}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <label htmlFor="password">Password</label>
          <input
            placeholder="click to show Password"
            type={passwordShow ? 'text' : 'password'}
            name="password"
            value={newUser.password}
            onClick={toggledPassword}
            onChange={handleStringFieldChange}
          />
        </p>
        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>
      {newUser.photoURL ? (
        <p>
          <img alt="User Photo" width={200} src={newUser.photoURL} />
        </p>
      ) : null}
      <div className="file-drop-zone">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {dropZoneMessage}
        </div>
      </div>
    </div>
  )
}
