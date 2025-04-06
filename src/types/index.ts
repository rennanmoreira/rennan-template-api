export * from './prisma'

export type FindManyWithCount<T> = {
  data: T[]
  count: number
}
