import { authHeader } from "./auth"
import { BicycleType, LoginSuccess, LoginUserType, NewReviewType, NewUserType } from "./types"


export const NullBicycle: BicycleType = {
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
  photoURL: '',
  reviews: [],
}

export async function submitNewReview(review: NewReviewType) {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(review),
  })
  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

 export async function submitEditedNewBicycle(BicycleToUpdate: BicycleType) {
   const response = await fetch(`/api/bicycles/${BicycleToUpdate.id}`, {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json',
       Authorization: authHeader(),
     },
     body: JSON.stringify(BicycleToUpdate),
   })
   if (response.ok) {
     return response.json()
   } else {
     throw await response.json()
   }
 }

 export async function submitNewBicycle(BicycleToCreate: BicycleType) {
   const response = await fetch('/api/bicycles', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       Authorization: authHeader(),
     },
     body: JSON.stringify(BicycleToCreate),
   })
   if (response.ok) {
     return response.json()
   } else {
     throw await response.json()
   }
 }

   export async function loginUser(user: LoginUserType): Promise<LoginSuccess> {
     const response = await fetch('/api/Session', {
       method: 'POST',
       headers: { 'content-type': 'application/json' },
       body: JSON.stringify(user),
     })
     if (response.ok) {
       return response.json()
     } else {
       throw await response.json()
     }
   }

  export async function submitNewUser(newUser: NewUserType) {
     const response = await fetch('/api/Users', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(newUser),
     })
     if (response.ok) {
       return response.json()
     } else {
       throw await response.json()
     }
   }