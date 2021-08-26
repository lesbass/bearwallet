import React from 'react'

import ColorCard from 'components/template/ColorCard'

import Loader from './Loader'

const AppLoader: React.VFC = () => {
  return (
    <ColorCard>
      <Loader />
    </ColorCard>
  )
}

export default AppLoader
