import axios, { AxiosRequestConfig } from 'axios'

import { AnilistUserList } from './anilist-user-list-type'
import { AnilistMedia } from './anilist-media-type'
import { AnilistUserResponse, User } from './user-types'
import {
  AnilistMediaQueryResponse,
  AnilistUserListQueryResponse,
  AnilistSaveUserListResponse
} from './anilist-api-responses'
import { CustomError } from './anilist-update-errors'

/**
 * generic query function for Anilist API
 * throws CustomError if unable to complete
 */
export async function queryAnilist(
  query: string,
  variables: {},
  accessToken: string | null
): Promise<{}> {
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    url: 'https://graphql.anilist.co',
    data: {
      query: query,
      variables: variables
    },
    validateStatus: function (status) { return status < 500 } // no errors on 404
  }
  if (typeof accessToken === 'string') { // add to request
    Object.assign(requestConfig, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
  }

  const response = await axios(requestConfig)

  if(Array.isArray(response.data.errors)) { // something went wrong
    throw new CustomError({
      message: `Error querying Anilist API: ${response.data.errors[0].message}`,
      data: response.data.errors
    })
  }

  return response.data
}


export async function fetchAnilistMedia(searchString: string){
  const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        id
        title {
          english
          romaji
        }
        episodes
        seasonYear
        episodes
        relations {
          nodes {
            id
            type
            seasonYear
            episodes
        title {
          english
          romaji
        }
          }
        }
        coverImage {
          extraLarge
        }
      }
    }
  `
  const variables = { search: searchString }

  // no try; let errors bubble
  const result = await queryAnilist(query, variables, null) as AnilistMediaQueryResponse

  const mediaTitle = result.data.Media.title.english ?? result.data.Media.title.romaji
  //console.log(JSON.stringify(result.data,undefined,2))
  return result.data
}


export async function fetchAnilistUserList(mediaId: number, userName: string): Promise<AnilistUserList> {
  const query = `
    query ($mediaId: Int, $userName: String) {
      MediaList (mediaId: $mediaId, userName: $userName) {
        id
        mediaId
        progress
        score
        status
      }
    }
  `
  const variables = { mediaId: mediaId, userName: userName }

  // no try; let errors bubble
  const result = await queryAnilist(query, variables, null) as AnilistUserListQueryResponse
  if (result.data.MediaList === null) {
    throw new CustomError({
      message: 'fetchAnilistUserList() was successful but returned a null user list',
      data: result.data
    })
  }

  return {
    listId: result.data.MediaList.id,
    mediaId: result.data.MediaList.mediaId,
    progress: result.data.MediaList.progress,
    score: result.data.MediaList.score,
    status: result.data.MediaList.status
  }
}


export async function updateUserList(
  mediaId: number,
  progress: number,
  score: number,
  accessToken: string
): Promise<AnilistSaveUserListResponse> {
  const query = `
    mutation ($mediaId: Int, $progress: Int, $scoreRaw: Int) {
        SaveMediaListEntry (mediaId: $mediaId, progress: $progress, scoreRaw: $scoreRaw) {
            id
            progress
            score
        }
    }
  `
  const variables = { mediaId: mediaId, progress: progress, scoreRaw: score }

  // no try; let errors bubble
  const result = await queryAnilist(query, variables, accessToken) as AnilistSaveUserListResponse
  return result
}

export async function addMediaIdToList(mediaId: number, accessToken: string): Promise<AnilistUserList> {
  if (isNaN(mediaId) || !accessToken) {
    throw new Error(`ERROR: invalid value for mediaId (${mediaId}), or accessToken (${accessToken})`)
  }
  const query = `
    mutation ($mediaId: Int) {
        SaveMediaListEntry (mediaId: $mediaId) {
            id
            mediaId
            progress
            score
            status
        }
    }
  `
  const variables = { mediaId: mediaId}
  const result = await queryAnilist(query, variables, accessToken) as AnilistSaveUserListResponse

  return {
    listId: result.data.SaveMediaListEntry.id,
    mediaId: result.data.SaveMediaListEntry.mediaId,
    progress: result.data.SaveMediaListEntry.progress,
    score: result.data.SaveMediaListEntry.score,
    status: result.data.SaveMediaListEntry.status
  }
}


export async function createThread(text:string, accessToken: string) {
  if (!accessToken) {
    throw new Error(`ERROR: invalid valu, or accessToken (${accessToken})`)
  }
  const query = `
    mutation ($text: String) {  
      SaveTextActivity (text: $text) {
            id
            type
            text
        }
    }
  `
  const variables = { text:text}
  const result = await queryAnilist(query, variables, accessToken) as AnilistSaveUserListResponse

  return result.data;
}

export async function setMediaStatus(mediaId: number, accessToken: string,status:'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED'  | 'REPEATING' ): Promise<AnilistUserList> {
  if (isNaN(mediaId) || !accessToken) {
    throw new Error(`ERROR: invalid value for mediaId (${mediaId}), or accessToken (${accessToken})`)
  }
  const query = `
    mutation ($mediaId: Int, $status: MediaListStatus) {
        SaveMediaListEntry (mediaId: $mediaId, status: $status) {
            id
            mediaId
            progress
            score
            status
        }
    }
  `
  const variables = { mediaId: mediaId,status: status}
  const result = await queryAnilist(query, variables, accessToken) as AnilistSaveUserListResponse

  return {
    listId: result.data.SaveMediaListEntry.id,
    mediaId: result.data.SaveMediaListEntry.mediaId,
    progress: result.data.SaveMediaListEntry.progress,
    score: result.data.SaveMediaListEntry.score,
    status: result.data.SaveMediaListEntry.status
  }
}


export async function fetchUserData(accessToken: string): Promise<User> {
  const query = `
    query {
      Viewer {
        id
        name
        siteUrl
      }
    }
  `
  // no try; let errors bubble
  const result = await queryAnilist(query, {}, accessToken) as AnilistUserResponse

  return {
    id: result.data.Viewer.id,
    name: result.data.Viewer.name,
    siteUrl: result.data.Viewer.siteUrl
  }
}
