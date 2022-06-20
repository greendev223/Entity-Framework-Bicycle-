import React from "react"
import defaultUserImage from '../images/logo.png'
import defaultBikeImage from '../images/default.jpg'



export const userImageOnErrorHandler = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  event.currentTarget.src = defaultUserImage
  event.currentTarget.className = 'error'
}

export const bicycleImageOnErrorHandler = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  event.currentTarget.src = defaultBikeImage
  event.currentTarget.className = 'error'
}

// const App: React.FunctionComponent = () => {
  // This function is triggered when an image has been loaded
  export const imageOnLoadHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log(
      `The image with url of ${event.currentTarget.src} has been loaded`
    );
    if (event.currentTarget.className !== "error") {
      event.currentTarget.className = "success";
    }
  }
