export interface Category {
  icon: Icon | null
  id: string
  label: string
  top: boolean
}

export interface Icon {
  emoji: string
  file: {
    url: string
  }
  type: string
}

export interface Project {
  id: string
  isActive: boolean
  label: string
}

export interface Movement {
  categoryId: string
  date: string
  description: string
  id: string
  projectIds: string[]
  url: string
  value: number
}

export interface NewMovement {
  categoryId: string
  date: string
  description: string
  projectId: string | undefined | null
  value: number
}

export interface ExportMovement {
  category: string
  date: string
  description: string
  value: number
}

export interface StatsMovement {
  date: string
  projectIds: string[]
  value: number
}
