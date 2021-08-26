import axios from 'axios'

import { Category, ExportMovement, Movement, Project, StatsMovement } from 'interfaces/NotionModels'
import { Gateway } from 'lib/interfaces/gateway'

type ApiClient = Gateway & {
  logOutUser: () => Promise<void>
}

export const initApi = (): ApiClient => ({
  async authenticateUser(userName, password) {
    return axios.post<boolean>('/api/login', { password, userName }).then((res) => res.data)
  },
  async createItem(item) {
    return axios.post('/api/add-item', item)
  },
  async exportItems(startDate, endDate) {
    return axios.post<ExportMovement[]>('/api/export-items', { endDate, startDate }).then((res) => res.data)
  },
  async getCategories() {
    return axios.post<Category[]>('/api/category').then((res) => res.data)
  },
  async getLatestItems(refresh = false) {
    return axios.post<Movement[]>('/api/latest-items', { refresh }).then((res) => res.data)
  },
  async getLatestNotesForCategory(category, refresh = false) {
    return axios.post<string[]>(`/api/notes-for-category/${category}`, { refresh }).then((res) => res.data)
  },
  async getProjects() {
    return axios.post<Project[]>('/api/project').then((res) => res.data)
  },
  async getStatsItems(startDate, endDate) {
    return axios.post<StatsMovement[]>('/api/stats-items', { endDate, startDate }).then((res) => res.data)
  },
  async logOutUser() {
    return axios.post('/api/logout')
  },
})

export default initApi()
