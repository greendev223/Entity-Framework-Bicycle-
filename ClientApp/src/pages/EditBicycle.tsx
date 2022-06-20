import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router'
import { authHeader, getUser } from '../auth'
import { APIError, BicycleType, UploadResponse } from '../types'
import { useDropzone } from 'react-dropzone'
import { submitEditedNewBicycle } from '../api'

export function EditBicycle() {
  const { id } = useParams<{ id: string }>()
  const history = useNavigate()
  const user = getUser()

  useQuery<BicycleType>(['one-bicycle', id], () => loadBicycleDetails(), {
    refetchOnWindowFocus: false,
    onSuccess: function (bicycleBeingLoaded) {
      console.log('loadBicycleDetails')
       setUpdateBicycle(bicycleBeingLoaded)
    },
  })

  const [updateBicycle, setUpdateBicycle] = useState<BicycleType>({
    id: undefined,
    userId: undefined,
    title: '',
    description: '',
    frame: '',
    fork: '',
    saddle: '',
    handlebar: '',
    bottomBracket: '',
    chainRing: '',
    rearCog: '',
    crank: '',
    wheelSet: '',
    pedals: '',
    other: '',
    reviews: [],
    photoURL: '',
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function loadBicycleDetails() {
    const response = await fetch(`/api/bicycles/${id}`)
    if (response.ok) {
      return response.json()
    } else {
      throw await response.json()
    }
  }

  const editNewBicycle = useMutation(submitEditedNewBicycle, {
    onSuccess: function () {
      history('/user/' + user.id)
    },
    onError: function (apiError: APIError) {
      setErrorMessage(Object.values(apiError.errors).join('/'))
    },
  })

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    editNewBicycle.mutate(updateBicycle)
  }

  function handleFormChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = event.target.value
    const fieldName = event.target.name
    const updatedBicycle = { ...updateBicycle, [fieldName]: value }
    console.log('handleFormChanges')
    setUpdateBicycle(updatedBicycle)
  }
  // -------------------------------------------------------------------
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
  function onDropFile(acceptedFiles: File[]) {
    // Do something with the files
    const fileToUpload = acceptedFiles[0]
    uploadFileMutation.mutate(fileToUpload)
    setIsUploading(true)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
  })

  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: function (apiResponse: UploadResponse) {
      const url = apiResponse.url
      console.log('uploadFileMutations')
      setUpdateBicycle({ ...updateBicycle, photoURL: url })
      setIsUploading(false)
    },

    onError: function (error: string) {
      console.log(error)
      setErrorMessage(error)
    },

    onSettled: function () {
      setIsUploading(false)
    },
  })

  let dropZoneMessage = 'Drag a picture of the bicycle here to upload!'

  if (isUploading) {
    dropZoneMessage = 'Uploading...'
  }

  if (isDragActive) {
    dropZoneMessage = 'Drop the files here ...'
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit} className="form-horizontal">
        <h1 className="addABikeTitle">
          edit {user.fullName} {updateBicycle.title}
        </h1>
        {errorMessage ? <p className="form-error"> {errorMessage} </p> : null}
        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="title">
            Title
          </label>
          <div className="col-md-4">
            <input
              required
              id="title"
              name="title"
              value={updateBicycle.title}
              onChange={handleFormChange}
              type="text"
              placeholder="Type a title (required)"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="description">
            Description
          </label>
          <div className="col-md-4">
            <textarea
              className="form-control"
              required
              id="description"
              name="description"
              placeholder="Description (required)"
              value={updateBicycle.description}
              onChange={handleFormChange} >
              Type a description(required)
            </textarea>
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="frame">
            Frame
          </label>
          <div className="col-md-4">
            <input
              id="frame"
              name="frame"
              value={updateBicycle.frame}
              onChange={handleFormChange}
              type="text"
              placeholder="What are you riding?"
              className="form-control input-md"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="fork">
            Fork
          </label>
          <div className="col-md-4">
            <input
              id="fork"
              name="fork"
              value={updateBicycle.fork}
              onChange={handleFormChange}
              type="text"
              placeholder="What is the make of the fork?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="saddle">
            Saddle
          </label>
          <div className="col-md-4">
            <input
              id="saddle"
              name="saddle"
              value={updateBicycle.saddle}
              onChange={handleFormChange}
              type="text"
              placeholder="What are you sitting on?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="handlebar">
            Handlebars
          </label>
          <div className="col-md-4">
            <input
              id="handlebar"
              name="handlebar"
              value={updateBicycle.handlebar}
              onChange={handleFormChange}
              type="text"
              placeholder="What are you gripping?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="bottomBracket">
            Bottom Bracket
          </label>
          <div className="col-md-4">
            <input
              id="bottomBracket"
              name="bottomBracket"
              value={updateBicycle.bottomBracket}
              onChange={handleFormChange}
              type="text"
              placeholder="What are you spinning ?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="chainRing">
            Chain Ring
          </label>
          <div className="col-md-4">
            <input
              id="chainRing"
              name="chainRing"
              value={updateBicycle.chainRing}
              onChange={handleFormChange}
              type="text"
              placeholder="How many teeth we working with?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="rearCog">
            Rear Cog
          </label>
          <div className="col-md-4">
            <input
              id="rearCog"
              name="rearCog"
              value={updateBicycle.rearCog}
              onChange={handleFormChange}
              type="text"
              placeholder="How many teeth we working with?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="crank">
            Crank
          </label>
          <div className="col-md-4">
            <input
              id="crank"
              name="crank"
              value={updateBicycle.crank}
              onChange={handleFormChange}
              type="text"
              placeholder="What are you cranking?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="wheelSet">
            Wheels
          </label>
          <div className="col-md-4">
            <input
              id="wheelSet"
              name="wheelSet"
              value={updateBicycle.wheelSet}
              onChange={handleFormChange}
              type="text"
              placeholder="What are you skidding?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="pedals">
            Pedals
          </label>
          <div className="col-md-4">
            <input
              id="pedals"
              name="pedals"
              value={updateBicycle.pedals}
              onChange={handleFormChange}
              type="text"
              placeholder="What are you standing on?"
              className="form-control input-md"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label" htmlFor="other">
            Other
          </label>
          <div className="col-md-4">
            <textarea
              className="form-control"
              id="other"
              name="other"
              placeholder="What else you got?"
              value={updateBicycle.other}
              onChange={handleFormChange}
            ></textarea>
          </div>
        </div>
        {updateBicycle.photoURL ? (
          <p className="photo-preview">
            <img
              alt="New Bicycle Photo"
              width={200}
              src={updateBicycle.photoURL}
            />
          </p>
        ) : null}
        <div className="form-group">
          <div className="col-md-4">
            {updateBicycle.photoURL ? (
              <p>
                <button
                  onClick={function (event) {
                    event.preventDefault()
                    console.log('button:click')
                    setUpdateBicycle({
                      ...updateBicycle,
                      photoURL: '',
                    })
                  }}
                >
                  Remove photo
                </button>
              </p>
            ) : null}
            <div className="form-input">
              <div className="file-drop-zone">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {dropZoneMessage}
                </div>
              </div>
            </div>
            <p>
              <button id="submit" name="submit" className="btn btn-success">
                Save
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
