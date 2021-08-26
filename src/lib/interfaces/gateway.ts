import { Category, ExportMovement, Movement, NewMovement, Project, StatsMovement } from 'interfaces/NotionModels'

export type Gateway = {
  authenticateUser: (userName: string, password: string) => Promise<boolean>
  createItem: (item: NewMovement) => Promise<void>
  exportItems: (startDate: string, endDate: string) => Promise<ExportMovement[]>
  getCategories: (refresh: boolean) => Promise<Category[]>
  getLatestItems: (refresh: boolean) => Promise<Movement[]>
  getLatestNotesForCategory: (category: string, refresh: boolean) => Promise<string[]>
  getProjects: (refresh: boolean) => Promise<Project[]>
  getStatsItems: (startDate: string, endDate: string) => Promise<StatsMovement[]>
}
