import React from 'react'
import { useSelector } from 'react-redux'

import { getProjects } from 'store/project/project.selectors'

const ProjectRenderer: React.VFC<{ projectIds: string[] }> = ({ projectIds }) => {
  const projects = useSelector(getProjects)
  if (!projectIds.length) return <></>

  const itemProjects = projectIds.map((projectId) => projects?.find((prj) => prj.id == projectId))
  const projectTitle = itemProjects
    .map((prj) => prj?.label ?? '')
    .filter(Boolean)
    .join(', ')
  return (
    <>
      <div style={{ color: '#dddddd', fontSize: '0.8em', fontVariant: 'small-caps' }} title={projectTitle}>
        <span style={{ color: '#8fcaf9' }}>{'➹'}</span> {projectTitle}
      </div>
    </>
  )
}

export default ProjectRenderer
