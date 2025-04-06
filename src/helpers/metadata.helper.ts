import { ResponseMetaDTO } from '../utils/dtos/pagination.dto'

export const createMetaData = (total: number, page: number, offset: number): ResponseMetaDTO => {
  const pageCount = Math.ceil(total / offset)
  const metaData: ResponseMetaDTO = {
    pagination: {
      page,
      pageSize: offset,
      pageCount,
      total,
      hasPreviousPage: page > 1,
      hasNextPage: page < pageCount
    }
  }

  return metaData
}
