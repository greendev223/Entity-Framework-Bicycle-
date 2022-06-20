import React from 'react'
import logo from './images/ChainStarsLogoCenter.png'
import git from './images/GitHubSmall.png'
import { Route, Routes } from 'react-router'
import { Landing } from './pages/Landing'
import { AddBicycle } from './pages/AddBicycle'
import { Link } from 'react-router-dom'
import { BicycleDetails } from './pages/BicycleDetails'
import { SignUp } from './pages/Signup'
import { SignIn } from './pages/Signin'
import { UserPage } from './pages/UserPage'
import { EditBicycle } from './pages/EditBicycle'
import { getUser, isLoggedIn, logout } from './auth'
import defaultUserImage from './images/logo.png'
// import { userImageOnErrorHandler } from './components/defaultImageLoading'

function LoggedInNav() {
  const user = getUser()
  function handleLogout() {
    logout()

    window.location.assign('/')
  }
  return (
    <>
      <a
        href="/"
        className="signout"
        onClick={function (event) {
          event.preventDefault()
          handleLogout()
        }}
      >
        Sign out
      </a>
      <Link to={`/user/${user.id}`}>
        <p className="stable">
          {user.fullName}
          <img className="defaultUserImage" src={defaultUserImage ?? user.photoURL} />
        </p>
      </Link>
    </>
  )
}
function SignoutNav() {
  return (
    <>
      <Link to="/signin" className="signIn">
        Sign In
      </Link>
      <Link to="/signup" className="SignUp">
        Sign Up
      </Link>
    </>
  )
}

export function App() {
  return (
    <div>
      <header>
        <Link to="/">
          <img src={logo} className="logo" alt="logo" />
        </Link>
        <div className="loggingNav">
          {isLoggedIn() ? <LoggedInNav /> : <SignoutNav />}
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/bicycles/:id" element={<BicycleDetails />} />
        <Route path="/add" element={<AddBicycle />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/bicycles/:id/edit" element={<EditBicycle />} />
      </Routes>
      <footer>
        <div className="footer">
          <p className="ml-20">
            Created by{' '}
            <Link to="http://www.amheiser.me">Nicholas Amheiser</Link>
          </p>
          <p>
            Github:{' '}
            <Link to="https://github.com/Amheisern">
              <img src={git} className="git" alt="git" />
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
