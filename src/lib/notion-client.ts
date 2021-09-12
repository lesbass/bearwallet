// noinspection JSNonASCIINames,NonAsciiCharacters

import { Client } from '@notionhq/client'
import { RequestParameters } from '@notionhq/client/build/src/Client'
import uniq from 'lodash/fp/uniq'

import { Category, ExportMovement, Movement, NewMovement, Project, StatsMovement } from 'interfaces/NotionModels'
import {
  CategoryResultModel,
  DatabaseSearchResultList,
  MovementResultList,
  ProjectResultModel,
  UsersResultList,
} from 'interfaces/NotionResultModels'
import { Gateway } from 'lib/interfaces/gateway'
import { NotionDatabaseIds } from 'lib/interfaces/notionDatabaseIds'
import log from 'lib/log'
import notionDatabaseIds from 'lib/repositories/notionDatabaseIdsRepository'

const notion = new Client({ auth: process.env.NOTION_KEY })
const wallet_id = process.env.NOTION_WALLET_ID

type NotionClient = Gateway & {
  getDatabaseIds: () => Promise<NotionDatabaseIds>
  getTelegramUsers: () => Promise<string[]>
}

export const initApi = (): NotionClient => ({
  async authenticateUser(userName: string, password: string) {
    const { users_database_id } = await notionDatabaseIds()
    log('INFO', `Trying to authenticate user ${userName} against Notion API`, 'api')

    let request_payload: RequestParameters = {
      body: {
        filter: {
          and: [
            {
              property: 'Username',
              title: {
                equals: userName,
              },
            },
            {
              property: 'Password',
              title: {
                equals: password,
              },
            },
            {
              checkbox: {
                equals: true,
              },
              property: 'Enabled',
            },
          ],
        },
        page_size: 1,
      },
      method: 'post',
      path: 'databases/' + users_database_id + '/query',
    }

    const users = await notion.request<UsersResultList>(request_payload)
    return !!users.results.length
  },
  async createItem(item: NewMovement) {
    const { movement_database_id } = await notionDatabaseIds()
    log('INFO', 'Sending data to Notion API', 'api')

    const progettoData = item.projectId
      ? {
          Progetto: {
            relation: [
              {
                id: item.projectId,
              },
            ],
          },
        }
      : {}
    const properties = {
      Categoria: {
        relation: [
          {
            id: item.categoryId,
          },
        ],
      },
      Data: {
        date: {
          start: item.date,
        },
      },
      Descrizione: {
        title: [
          {
            text: {
              content: item.description,
            },
          },
        ],
      },
      'Valore (€)': {
        number: item.value,
      },
    }
    let request_payload: RequestParameters = {
      body: {
        parent: { database_id: movement_database_id },
        properties: { ...properties, ...progettoData },
      },
      method: 'post',
      path: 'pages',
    }

    return notion.request(request_payload)
  },
  async exportItems(startDate, endDate) {
    const items: ExportMovement[] = []
    const { movement_database_id } = await notionDatabaseIds()
    log('INFO', `Reading movements on date range ${startDate} - ${endDate} from Notion API`, 'api')

    const categories = await this.getCategories(false)

    async function getPageOfItems(cursor: string | undefined = undefined) {
      let request_payload: RequestParameters
      // Create the request payload based on the presence of a start_cursor
      if (cursor == undefined) {
        request_payload = {
          body: {
            filter: {
              and: [
                {
                  date: {
                    on_or_after: startDate,
                  },
                  property: 'Data',
                },
                {
                  date: {
                    on_or_before: endDate,
                  },
                  property: 'Data',
                },
              ],
            },
            sorts: [
              {
                direction: 'descending',
                property: 'Data',
              },
            ],
          },
          method: 'post',
          path: 'databases/' + movement_database_id + '/query',
        }
      } else {
        request_payload = {
          body: {
            start_cursor: cursor,
          },
          method: 'post',
          path: 'databases/' + movement_database_id + '/query',
        }
      }
      // While there are more pages left in the query, get pages from the database.
      const current_pages = await notion.request<MovementResultList>(request_payload)

      for (const result of current_pages.results) {
        const title = result.properties.Descrizione.title[0]
        const descrizione = title === undefined ? '' : title.plain_text
        const categoryElement = result.properties.Categoria.relation[0]
        const category =
          categoryElement === undefined ? '-' : categories.find((cat) => cat.id == categoryElement.id)?.label ?? '-'

        items.push(<ExportMovement>{
          category,
          date: result.properties.Data.date.start,
          description: descrizione,
          value: result.properties['Dare/Avere (€)'].formula.number,
        })
      }

      if (current_pages.has_more) {
        await getPageOfItems(current_pages.next_cursor)
      }
    }

    await getPageOfItems()
    return items
  },
  async getCategories() {
    const categories: Category[] = []
    const { category_database_id } = await notionDatabaseIds()
    log('INFO', 'Reading categories from Notion API', 'api')

    async function getPageOfCategories(cursor: string | undefined = undefined) {
      let request_payload: RequestParameters
      // Create the request payload based on the presence of a start_cursor
      if (cursor == undefined) {
        request_payload = {
          body: {
            sorts: [
              {
                direction: 'ascending',
                property: 'Nome',
              },
            ],
          },
          method: 'post',
          path: 'databases/' + category_database_id + '/query',
        }
      } else {
        request_payload = {
          body: {
            start_cursor: cursor,
          },
          method: 'post',
          path: 'databases/' + category_database_id + '/query',
        }
      }
      // While there are more pages left in the query, get pages from the database.
      const current_pages = await notion.request<CategoryResultModel>(request_payload)

      for (const result of current_pages.results) {
        categories.push(<Category>{
          icon: result.icon,
          id: result.id,
          label: result.properties.Nome.title[0].plain_text,
          top: result.properties.Top.checkbox,
        })
      }

      if (current_pages.has_more) {
        await getPageOfCategories(current_pages.next_cursor)
      }
    }

    await getPageOfCategories()
    return categories
  },
  async getDatabaseIds() {
    const ids: NotionDatabaseIds = {
      category_database_id: '',
      movement_database_id: '',
      project_database_id: '',
      users_database_id: '',
    }
    log('INFO', 'Reading database ids from Notion API', 'api')

    async function getPageOfItems(cursor: string | undefined = undefined) {
      let request_payload: RequestParameters
      // Create the request payload based on the presence of a start_cursor
      if (cursor == undefined) {
        request_payload = {
          body: {
            filter: {
              property: 'object',
              value: 'database',
            },
          },
          method: 'post',
          path: 'search',
        }
      } else {
        request_payload = {
          body: {
            start_cursor: cursor,
          },
          method: 'post',
          path: 'search',
        }
      }
      // While there are more pages left in the query, get pages from the database.
      const current_pages = await notion.request<DatabaseSearchResultList>(request_payload)

      for (const result of current_pages.results) {
        if (result.parent?.page_id && result.parent.page_id.replace(/-/g, '') == wallet_id) {
          if (result.title[0]?.plain_text.startsWith('[M]')) {
            ids.movement_database_id = result.id
          } else if (result.title[0]?.plain_text.startsWith('[C]')) {
            ids.category_database_id = result.id
          } else if (result.title[0]?.plain_text.startsWith('[U]')) {
            ids.users_database_id = result.id
          } else if (result.title[0]?.plain_text.startsWith('[P]')) {
            ids.project_database_id = result.id
          }
        }
      }

      if (current_pages.has_more) {
        await getPageOfItems(current_pages.next_cursor)
      }
    }

    await getPageOfItems()
    return ids
  },
  async getLatestItems(category: string | null, page: number) {
    const items: Movement[] = []
    const { movement_database_id } = await notionDatabaseIds()
    log('INFO', `Reading latest items from Notion API for category ${category}, page ${page}`, 'api')
    let pageNumber = page

    async function getPageOfItems(cursor: string | undefined = undefined) {
      let request_payload: RequestParameters

      if (cursor == undefined) {
        const filter = category
          ? {
              filter: {
                property: 'Categoria',
                relation: {
                  contains: category,
                },
              },
            }
          : {}

        const body = {
          page_size: 10,
          sorts: [
            {
              direction: 'descending',
              property: 'Data',
            },
          ],
        }

        request_payload = {
          body: {
            ...body,
            ...filter,
          },
          method: 'post',
          path: 'databases/' + movement_database_id + '/query',
        }
      } else {
        request_payload = {
          body: {
            start_cursor: cursor,
          },
          method: 'post',
          path: 'databases/' + movement_database_id + '/query',
        }
      }

      const current_pages = await notion.request<MovementResultList>(request_payload)

      const requestedPage = --pageNumber == 0

      if (requestedPage)
        for (const result of current_pages.results) {
          const title = result.properties.Descrizione.title[0]
          const descrizione = title === undefined ? '' : title.plain_text
          const categoryId = result.properties.Categoria.relation[0]?.id ?? '-'
          const projectIds = result.properties.Progetto.relation.map((project) => project.id)

          items.push(<Movement>{
            categoryId,
            date: result.properties.Data.date.start,
            description: descrizione,
            id: result.id,
            projectIds: projectIds,
            url: result.url,
            value: result.properties['Dare/Avere (€)'].formula.number,
          })
        }

      if (!requestedPage && current_pages.has_more) {
        await getPageOfItems(current_pages.next_cursor)
      }
    }

    await getPageOfItems()
    return items
  },
  async getLatestNotesForCategory(category: string) {
    const items: string[] = []
    const { movement_database_id } = await notionDatabaseIds()
    log('INFO', `Reading latest notes for category ${category} from Notion API`, 'api')

    async function getPageOfItems() {
      let request_payload: RequestParameters = {
        body: {
          filter: {
            and: [
              {
                property: 'Categoria',
                relation: {
                  contains: category,
                },
              },
              {
                property: 'Descrizione',
                title: {
                  is_not_empty: true,
                },
              },
            ],
          },
          page_size: 20,
          sorts: [
            {
              direction: 'descending',
              property: 'Data',
            },
          ],
        },
        method: 'post',
        path: 'databases/' + movement_database_id + '/query',
      }

      const current_pages = await notion.request<MovementResultList>(request_payload)

      for (const result of current_pages.results) {
        items.push(result.properties.Descrizione.title[0].plain_text)
      }
    }

    await getPageOfItems()
    return uniq(items).slice(0, 10)
  },
  async getProjects() {
    const projects: Project[] = []
    const { project_database_id } = await notionDatabaseIds()
    log('INFO', 'Reading projects from Notion API', 'api')

    async function getPageOfProjects(cursor: string | undefined = undefined) {
      let request_payload: RequestParameters
      // Create the request payload based on the presence of a start_cursor
      if (cursor == undefined) {
        request_payload = {
          body: {
            sorts: [
              {
                direction: 'ascending',
                property: 'Nome',
              },
            ],
          },
          method: 'post',
          path: 'databases/' + project_database_id + '/query',
        }
      } else {
        request_payload = {
          body: {
            start_cursor: cursor,
          },
          method: 'post',
          path: 'databases/' + project_database_id + '/query',
        }
      }
      // While there are more pages left in the query, get pages from the database.
      const current_pages = await notion.request<ProjectResultModel>(request_payload)

      for (const result of current_pages.results) {
        projects.push(<Project>{
          id: result.id,
          isActive: result.properties.Active.checkbox,
          label: result.properties.Nome.title[0].plain_text,
        })
      }

      if (current_pages.has_more) {
        await getPageOfProjects(current_pages.next_cursor)
      }
    }

    await getPageOfProjects()
    return projects
  },
  async getStatsItems(startDate, endDate) {
    const items: StatsMovement[] = []
    const { movement_database_id } = await notionDatabaseIds()
    log('INFO', `Reading movements on date range ${startDate} - ${endDate} from Notion API`, 'api')

    async function getPageOfItems(cursor: string | undefined = undefined) {
      let request_payload: RequestParameters
      // Create the request payload based on the presence of a start_cursor
      if (cursor == undefined) {
        request_payload = {
          body: {
            filter: {
              and: [
                {
                  date: {
                    on_or_after: startDate,
                  },
                  property: 'Data',
                },
                {
                  date: {
                    on_or_before: endDate,
                  },
                  property: 'Data',
                },
              ],
            },
            sorts: [
              {
                direction: 'descending',
                property: 'Data',
              },
            ],
          },
          method: 'post',
          path: 'databases/' + movement_database_id + '/query',
        }
      } else {
        request_payload = {
          body: {
            start_cursor: cursor,
          },
          method: 'post',
          path: 'databases/' + movement_database_id + '/query',
        }
      }
      // While there are more pages left in the query, get pages from the database.
      const current_pages = await notion.request<MovementResultList>(request_payload)

      for (const result of current_pages.results) {
        const projectIds = result.properties.Progetto.relation.map((project) => project.id)

        items.push(<StatsMovement>{
          date: result.properties.Data.date.start,
          projectIds: projectIds,
          value: result.properties['Dare/Avere (€)'].formula.number,
        })
      }

      if (current_pages.has_more) {
        await getPageOfItems(current_pages.next_cursor)
      }
    }

    await getPageOfItems()
    return items
  },
  async getTelegramUsers() {
    const telegramUsers: string[] = []
    const { users_database_id } = await notionDatabaseIds()
    log('INFO', 'Reading telegram users from Notion API', 'api')

    async function getPageOfTelegramUsers(cursor: string | undefined = undefined) {
      let request_payload: RequestParameters
      // Create the request payload based on the presence of a start_cursor
      if (cursor == undefined) {
        request_payload = {
          body: {
            filter: {
              and: [
                {
                  property: 'Telegram',
                  title: {
                    is_not_empty: true,
                  },
                },
                {
                  checkbox: {
                    equals: true,
                  },
                  property: 'Enabled',
                },
              ],
            },
            sorts: [
              {
                direction: 'ascending',
                property: 'Telegram',
              },
            ],
          },
          method: 'post',
          path: 'databases/' + users_database_id + '/query',
        }
      } else {
        request_payload = {
          body: {
            start_cursor: cursor,
          },
          method: 'post',
          path: 'databases/' + users_database_id + '/query',
        }
      }
      // While there are more pages left in the query, get pages from the database.
      const current_pages = await notion.request<UsersResultList>(request_payload)

      for (const result of current_pages.results) {
        telegramUsers.push(result.properties.Telegram.rich_text[0].plain_text)
      }

      if (current_pages.has_more) {
        await getPageOfTelegramUsers(current_pages.next_cursor)
      }
    }

    await getPageOfTelegramUsers()
    return telegramUsers
  },
})

export default initApi()
