import { validate } from 'class-validator'
import { Match } from '@auth/decorators/match.decorator'

class TestClass {
  @Match('confirm_password', { message: 'Passwords do not match' })
  password: string

  confirm_password: string
}

describe('MatchDecorator', () => {
  it('should pass validation if the values match', async () => {
    const dto = new TestClass()
    dto.password = 'test_password'
    dto.confirm_password = 'test_password'

    const errors = await validate(dto)

    expect(errors.length).toBe(0)
  })

  it('should fail validation if the values do not match', async () => {
    const dto = new TestClass()
    dto.password = 'test_password'
    dto.confirm_password = 'different_password'

    const errors = await validate(dto)

    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].constraints).toHaveProperty('match')
    expect(errors[0].constraints.match).toBe('Passwords do not match')
  })

  it('should use default error message if no custom message is provided', async () => {
    class TestClassWithDefaultMessage {
      @Match('confirm_password')
      password: string

      confirm_password: string
    }

    const dto = new TestClassWithDefaultMessage()
    dto.password = 'test_password'
    dto.confirm_password = 'different_password'

    const errors = await validate(dto)

    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].constraints).toHaveProperty('match')
    expect(errors[0].constraints.match).toBe('password must match confirm_password')
  })
})
