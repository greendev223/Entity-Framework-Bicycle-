import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router'
import { BicycleType, LoggedInUser, NewReviewType } from '../types'
// import defaultUserImage from '../images/logo.png'
import { authHeader, getUser, getUserId, isLoggedIn } from '../auth'
import { Link } from 'react-router-dom'
import { NullBicycle, submitNewReview } from '../api'
// import { bicycleImageOnErrorHandler } from '../components/defaultImageLoading'


export function BicycleDetails() {
  const { id } = useParams<{ id: string }>()
   const user = getUser()
  const [newReview, setNewReview] = useState<NewReviewType>({
    id: undefined,
    body: '',
    stars: 5,
    summary: '',
    createdAt: new Date(),
    bicycleId: Number(id),
  })

   const history = useNavigate()

  const { refetch, data: bicycle = NullBicycle } = useQuery<BicycleType>(
    ['one-bicycle', id],
    () => loadBicycleDetails()
  )

  const createNewReview = useMutation(submitNewReview, {
    onSuccess: () => {
      refetch()
      //clears review after submission
      setNewReview({ ...newReview, body: '', stars: 5, summary: '' })
    },
  })

  async function handleSubmitNewReview(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    createNewReview.mutate(newReview)
  }

  function  handleNewReviewTextFieldChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const name = event.target.name
    const value = event.target.value
    setNewReview({ ...newReview, [name]: value })
  }

  async function loadBicycleDetails() {
    const response = await fetch(`/api/bicycles/${id}`)
    if (response.ok) {
      return response.json()
    } else {
      throw await response.json()
    }
  }
// async function handleDeleteBicycle(event: React.FormEvent<HTMLFormElement>)
  async function handleDelete(id: number | undefined) {
    // event.preventDefault()
    if (id === undefined) {
      return
    }
    const response = await fetch(`/api/bicycles/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: authHeader(),
      },
    })
    
    if (response.ok) {
      return response.json()
    } else {
      throw await response.json()
    }
  }
   const deleteBicycles = useMutation(handleDelete, {
     onSuccess: function () {
       history('/user/' + user.id)
     },
     onError: function () {
       // TODO: Make a better error handling here
       console.log('ooops')
     },
   })

    const [bikeUser, setBikeUser] = useState<LoggedInUser>()

   useEffect(() => {
   const userInformation= () => { fetch(`/api/bicycles/${id}`, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        const bikeInformation = data.userId
        console.log(bikeInformation);
        
        return fetch(`/api/users/${bikeInformation}`)
   })
      .then(response => response.json())
      .then(data => {
        setBikeUser(data)
      }
      )
      .catch(err => {console.log(err)})
    }
      userInformation()
    }, [id])
      
  //  useEffect(() => {
  //    const loadBikeInformation = () => {
  //      fetch(`/api/bicycles/${id}`)
  //         .then((response) => response.json())
  //         .then((data) =>
  //          {
  //           fetch(`/api/users/${data.userId}`)
  //             .then((response) => response.json())
  //             .then((data) => {
  //               setBikeUser(data)
  //               console.log(data);
  //             })
  //         })
  //    }
  //     loadBikeInformation()
  //   }, [id] )
    
   
  return (
    <div>
      <article className="bikePhoto">
        <div className="bikePhoto">
          {bicycle.photoURL ? (
            <img alt="bicycle Photo" width={500} src={bicycle.photoURL} />
          ) : null}
        </div>
        <div className="bikeSection">
          <div>
            <h1>{bikeUser?.fullName}:Bike</h1>
            {/* <h2>{bicycle.user.fullName  }</h2> */}
          </div>
          <strong>{bicycle.title}</strong>
          <p>{bicycle.description}</p>
          <ul className="bikeDetails">
            <li>Frame: {bicycle.frame}</li>
            <li>Fork: {bicycle.fork}</li>
            <li>Saddle: {bicycle.saddle}</li>
            <li>Handlebars: {bicycle.handlebar}</li>
            <li>Bottom Bracket: {bicycle.bottomBracket}</li>
            <li>Chain Ring: {bicycle.chainRing}</li>
            <li>Rear Cog: {bicycle.rearCog}</li>
            <li>Crank: {bicycle.crank}</li>
            <li>Wheel Set: {bicycle.wheelSet}</li>
            <li>Pedals: {bicycle.pedals}</li>
            <li>Other: {bicycle.other}</li>
          </ul>
        </div>
        <ul className="reviewsSection">
          <div>
            {bicycle.reviews?.map((reviews) => (
              <li key={reviews?.id}>
                <div className="author">
                  {/* `/user/${reviews.user.id}` */}
                  <Link to={`/user/${reviews.user.id}`}>
                    {reviews.user.fullName}
                  </Link>{' '}
                  said: <em>{reviews.summary}</em> on:{' '}
                  {new Date(reviews.createdAt).toLocaleDateString()}
                </div>
                <div className="body">
                  <p>{reviews.body}</p>
                </div>
              </li>
            ))}
          </div>
        </ul>
        {bicycle.userId === getUserId() ? (
          <>
            <p>
              <button
                onClick={function (event) {
                  event.preventDefault()
                  deleteBicycles.mutate(bicycle.id)
                }}
              >
                Delete Bicycle
              </button>
            </p>
            <p>
              <Link className="button" to={`/bicycles/${id}/edit`}>
                <button className="editButton"> Edit Bicycle </button>
              </Link>
            </p>
          </>
        ) : null}
      </article>
      <hr></hr>
      {isLoggedIn() ? (
        <form className="reviewForm" onSubmit={handleSubmitNewReview}>
          <h3>Leave a review</h3>
          <p>Remember be positive. Spread happiness</p>
          <p className="form-input">
            <label htmlFor="summary">Summary</label>
            <input
              type="text"
              placeholder="Type a summary (required)"
              name="summary"
              value={newReview.summary}
              onChange={handleNewReviewTextFieldChange}
            />
          </p>
          <p className="form-input">
            <label htmlFor="body">Review</label>
            <textarea
              placeholder="Type a review here"
              name="body"
              value={newReview.body}
              onChange={handleNewReviewTextFieldChange}
            ></textarea>
          </p>
          <button id="submit" name="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      ) : null}
    </div>
  )
}
