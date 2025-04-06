import { Reflector } from '@nestjs/core'
import { Public } from 'src/decorators/public.decorator'

describe('PublicDecorator', () => {
  const reflector = new Reflector()

  it('should set the "isPublic" metadata to true', () => {
    class TestClass {
      @Public()
      publicMethod() {}
    }

    const isPublic = reflector.get('isPublic', TestClass.prototype.publicMethod)
    expect(isPublic).toBe(true)
  })

  it('should return undefined if "isPublic" metadata is not set', () => {
    class TestClass {
      nonPublicMethod() {}
    }

    const isPublic = reflector.get('isPublic', TestClass.prototype.nonPublicMethod)
    expect(isPublic).toBeUndefined()
  })
})
