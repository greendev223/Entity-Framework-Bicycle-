//This is code to deal with the star rating
import { CSSProperties } from 'react'

export interface CSSStarsProperties extends CSSProperties {
  '--rating': number
}

export type BicycleType = {
  id: undefined
  userId: undefined
  title: string
  description: string
  frame: string
  fork: string
  saddle: string
  handlebar: string
  bottomBracket: string
  chainRing: string
  rearCog: string
  crank: string
  wheelSet: string
  pedals: string
  other: string
  photoURL: string
  reviews: ReviewType[]

}
export type ReviewType = {
  id: number | undefined
  summary: string
  body: string
  stars: number
  createdAt: string
  bicycleId: number
  user: LoggedInUser
}

export type NewReviewType = {
  id: number | undefined
  summary: string
  body: string
  stars: number
  createdAt: Date
  bicycleId: number | undefined
}

export type APIError = {
  errors: Record<string, string[]>
  status: number
  title: string
  traceId: string
  type: string
}

export type NewUserType = {
  password: string
  email: string
  fullName?: string
  photoURL?: string
}

export type LoginUserType = {
  email: string
  password: string
  photoURL?: string
}
export type LoggedInUser = {
  id: number
  fullName: string
  email: string
  photoURL?: string
  bicycles: BicycleType[]
}

export type LoginSuccess = {
  token: string
  user: LoggedInUser
}

export type UploadResponse = {
  url: string
}
