import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { BicycleType } from '../types'
import { SingleBicycleFromList } from '../components/SingleBicycleFromList'

export function Landing() {
  const [filterText, SetFilterText] = useState('')

  const { data: bicycles = [] } = useQuery<BicycleType[]>(
    ['bicycles', filterText],
    async function () {
      const response = await fetch(
        filterText.length === 0
          ? '/api/bicycles'
          : `/api/bicycles?filter=${filterText}`
      )
      return response.json() 
    }
  )
  


  return (
    <>
      <div>
        <form className="search">
          <input
            type="text"
            placeholder="Search for a bicycle"
            value={filterText}
            onChange={function (event) {
              SetFilterText(event.target.value)
            }}
          />
        </form>
        <section className="container">
          {bicycles.map(function (bicycle) {
            return <SingleBicycleFromList key={bicycle.id} bicycle={bicycle} />
          })}
        </section>
      </div>
    </>
  )
}
