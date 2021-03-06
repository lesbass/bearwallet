import EqualizerIcon from '@mui/icons-material/Equalizer'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Card, CardHeader, Collapse, IconButton, IconButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'

import StatsCardContent from './StatsCardContent'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ expand, theme }) => ({
  marginLeft: 'auto',
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const StatsCard: React.VFC = () => {
  const { t } = useTranslation('stats')
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card style={{ backgroundColor: '#211e05', marginBottom: '20px' }}>
      <CardHeader
        action={
          <ExpandMore aria-expanded={expanded} aria-label="show more" expand={expanded} onClick={handleExpandClick}>
            <ExpandMoreIcon />
          </ExpandMore>
        }
        avatar={<EqualizerIcon />}
        title={t('title')}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <Collapse unmountOnExit in={expanded} timeout="auto">
        <StatsCardContent />
      </Collapse>
    </Card>
  )
}

export default StatsCard
