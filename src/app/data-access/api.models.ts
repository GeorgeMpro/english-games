export interface ApiResponse<T> {
  success: boolean,
  message: string,
  data: T
}

export interface WordGroup {
  id: number,
  title: string,
  translate: string,
  status: number,
  count: number,
  cover: Cover,
}

export interface Cover {
  id: number,
  name: string,
  url: string
}

export interface ListData<T> {
  items: T[]
}

export interface WordItem {
  id: number,
  title: string,
  transcription: string,
  sentence: string,
  translate: string | null,
  date_created: string | null,
  date_learned: string | null,
  status: number,
  cover: Cover
}
