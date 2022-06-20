import React, { useEffect, useState } from 'react'
import { BicycleType, LoggedInUser } from '../types'
import { Link, useParams } from 'react-router-dom'
// import { getUser } from '../auth'
import defaultUserImage from '../images/logo.png'
//import { useQuery } from 'react-query'



export function SingleBicycleFromList({ bicycle }: { bicycle: BicycleType }) {
  const { id } = useParams<{ id: string }>()
  const [usersDetails, setUsersDetails] = useState<LoggedInUser>({
  id: Number(id),
  email: '',
  fullName: '',
  photoURL: '',
  bicycles: [],
})
  useEffect(() => {
    const loadUsersDetails = () => {
      fetch(`/api/users`)
        .then((response) => response.json())
        .then((data) => {
          setUsersDetails(data)
        })
    }
    loadUsersDetails()
  })

  return (
    <article>
      <Link to={`/bicycles/${bicycle.id}`}>
        <img src={bicycle.photoURL} />
      </Link>
      <ul>
        <li>
          <strong>{bicycle.title}</strong> ({bicycle.reviews?.length})
        </li>
        <li>
          <img
            className="user-image"
            src={usersDetails.photoURL ? usersDetails.photoURL : defaultUserImage}
            width="24px"
            height="24px"
          />
        </li>
      </ul>
    </article>
  )
}
