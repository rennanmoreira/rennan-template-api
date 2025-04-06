import { ApiProperty } from '@nestjs/swagger'

export class ErrorResponse {
  @ApiProperty({
    title: 'Status Code',
    example: 500,
    description: 'The HTTP status code representing the type of error.',
    type: Number
  })
  status_code: number

  @ApiProperty({
    example: 'Internal Server Error',
    description: 'A human-readable message summarizing the error.',
    type: String
  })
  message: string

  @ApiProperty({
    example: '/api/resource',
    description: 'The URL path where the error occurred.',
    type: String
  })
  path: string

  @ApiProperty({
    example: '2024-11-29T16:45:00.000Z',
    description: 'The timestamp of when the error was generated in ISO 8601 format.',
    type: String
  })
  timestamp: string

  @ApiProperty({
    example: {
      stack: 'Error: Something went wrong\n at ...',
      debug_message: 'Detailed error message for debugging purposes (optional).'
    },
    description: 'Optional additional error details such as stack traces or debug information.',
    type: Object,
    required: false
  })
  error?: Record<string, any>
}
