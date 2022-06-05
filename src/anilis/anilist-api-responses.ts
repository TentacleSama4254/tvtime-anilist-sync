export type AnilistAPIError = {
  locations: [],
  message: string,
  status: number
}

export type AnilistMediaQueryResponse = {
  data: {
    Media: AnilistMediaQueryFields
  },
  errors?: AnilistAPIError[]
}

type AnilistMediaQueryFields = {
  coverImage: {
    medium: string
  },
  episodes: number,
  id: number,
  title: {
    english: string | null,
    romaji: string | null
  }
}

export type AnilistUserListQueryResponse = {
  data: {
    MediaList: null | MediaListDataFields
  },
  errors?: AnilistAPIError[]
}

type MediaListDataFields = {
  id: number,
  mediaId: number,
  progress: number,
  score: number,
  status: string
}

export type AnilistSaveUserListResponse = {
  data: {
    SaveMediaListEntry: {
      id: number,
      mediaId: number,
      progress: number,
      score: number,
      status: string
    }
  }
}
