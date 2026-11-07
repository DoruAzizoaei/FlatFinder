import React, { JSX } from 'react'

import FlatsList from '../flats/FlatList'

const HomeComponent:React.FC = ():JSX.Element => {
  return (
    <FlatsList viewType="home"/>
  )
}

export default HomeComponent 