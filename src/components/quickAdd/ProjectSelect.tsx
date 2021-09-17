import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'lib/useAppDispatch'
import { getCurrentProject, getProjects } from 'store/project/project.selectors'
import { setCurrentProjectSuccess } from 'store/project/project.store'

const ProjectSelect: React.VFC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation('quickAdd')

  const selectedProject = useSelector(getCurrentProject)

  const [hasProject, setHasProject] = useState<boolean>(false)
  const projectList = useSelector(getProjects)

  return !hasProject ? (
    <FormControlLabel
      control={<Checkbox checked={hasProject} onClick={() => setHasProject(!hasProject)} />}
      label={t('add_to_project')}
    />
  ) : (
    <FormControl fullWidth variant="standard">
      <InputLabel htmlFor="project">{t('project')}</InputLabel>
      <Select
        id="project"
        label={t('project')}
        labelId="project"
        value={selectedProject ?? ''}
        onChange={(event) => dispatch(setCurrentProjectSuccess(event.target.value))}
      >
        <MenuItem value="">
          <em>{t('no_project')}</em>
        </MenuItem>
        {projectList &&
          projectList
            .filter((project) => project.isActive)
            .map((project, index) => {
              return (
                <MenuItem key={index} selected={selectedProject === project.id} value={project.id}>
                  {project.label}
                </MenuItem>
              )
            })}
      </Select>
    </FormControl>
  )
}

export default ProjectSelect
