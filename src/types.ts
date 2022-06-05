
export interface AniListSearchParams {
  search: string;
  page: number;
  perPage: number;
}

export interface AniListSearchResponse {
  media: AniListMedia[];
  pageInfo: AniListPageInfo
}

export interface AniListMedia {
  id: number;
  coverImage: AniListImage;
  description: string;
  startDate: AnilistDate;
  status: AniListMediaStatus;
  title: AniListMediaTitle;
  type: AniListMediaType;
  chapters: number | null;
}

export enum AniListMediaType {
  MANGA = 'MANGA',
  ANIME = 'ANIME'
}

export interface AniListMediaTitle {
  romanji: string;
  english: string;
  native: string;
}

export interface AniListImage {
  large: string;
  extraLarge: string;
  medium: string;
  color: string;
}

export interface AnilistDate {
  year: number;
  month: number;
  day: number;
}

export interface AniListPageInfo {
  currentPage: number;
  hasNextPage: boolean;
  lastPage: number;
  perPage: number;
  total: number;
}

export enum AniListMediaStatus {
  FINISHED = 'FINISHED',
  RELEASING = 'RELEASING',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  CANCELLED = 'CANCELLED'
}

export enum MediaListStatus {
  CURRENT = 'CURRENT',
  PLANNING = 'PLANNING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
  PAUSED = 'PAUSED',
  REPEATING = 'REPEATING'
}

export interface SaveMediaListEntry {
  id: number;
  mediaId: number;
  status: MediaListStatus;
  score: number;
  scoreRaw: number;
  progress: number;
  progressVolumes: number; // Not used!
  repeat: number;
  priority: number;
  private: boolean;
  notes: string;
  hiddenFromStatusLists: boolean;
  customLists: string[]; // not used.
  advancedScores: number[]; // not used
  startedAt: AnilistDate;
  completedAt: AnilistDate;
}

export interface AniListUser {
  id: number;
  name: string;
  avatar: AniListImage;
}