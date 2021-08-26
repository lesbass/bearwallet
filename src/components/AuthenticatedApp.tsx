import React, { useEffect } from 'react'

import { useAppDispatch } from 'lib/useAppDispatch'
import { setCategories } from 'store/category/category.actions'
import { setLastItems } from 'store/lastItems/lastItems.actions'
import { setProjects } from 'store/project/project.actions'

import Copyright from './Copyright'
import QuickAddCard from './quickAdd/QuickAddCard'
import RecentItemsCard from './RecentItemsCard'
import StatsCard from './stats/StatsCard'
import UtilsCard from './utils/UtilsCard'

const AuthenticatedApp: React.VFC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setCategories())
    dispatch(setProjects())
    dispatch(setLastItems(false))
  }, [dispatch])

  return (
    <>
      <QuickAddCard />
      <RecentItemsCard />
      <StatsCard />
      <UtilsCard />
      <Copyright />
    </>
  )
}

export default AuthenticatedApp
