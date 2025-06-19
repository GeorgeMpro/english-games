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
