// noinspection JSNonASCIINames,NonAsciiCharacters

export type CategoryResultModel = {
  has_more: boolean
  next_cursor: string
  results: {
    icon: {
      emoji: string
      file: {
        url: string
      }
      type: string
    }
    id: string
    properties: {
      Nome: {
        title: {
          plain_text: string
        }[]
      }
      Top: {
        checkbox: boolean
      }
    }
  }[]
}
export type ProjectResultModel = {
  has_more: boolean
  next_cursor: string
  results: {
    id: string
    properties: {
      Active: {
        checkbox: boolean
      }
      Nome: {
        title: {
          plain_text: string
        }[]
      }
    }
  }[]
}
export type MovementResultList = {
  has_more: boolean
  next_cursor: string
  results: {
    id: string
    properties: {
      Categoria: {
        relation: {
          id: string
        }[]
      }
      'Dare/Avere (€)': {
        formula: {
          number: number
        }
      }
      Data: {
        date: {
          start: string
        }
      }
      Descrizione: {
        title: {
          plain_text: string
        }[]
      }
      Progetto: {
        relation: {
          id: string
        }[]
      }
    }
    url: string
  }[]
}
export type UsersResultList = {
  has_more: boolean
  next_cursor: string
  results: {
    id: string
    properties: {
      Telegram: {
        rich_text: {
          plain_text: string
        }[]
      }
    }
  }[]
}
export type DatabaseSearchResultList = {
  has_more: boolean
  next_cursor: string
  results: {
    id: string
    parent: {
      page_id: string
    }
    title: {
      plain_text: string
    }[]
  }[]
}
