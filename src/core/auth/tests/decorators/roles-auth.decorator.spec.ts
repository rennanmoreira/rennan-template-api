import { Auth } from '@auth/decorators/roles-auth.decorator'
import { ROLES_KEY } from '@auth/decorators/roles.decorator'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { AuthGuard } from '@auth/guards/auth.guard'

describe('AuthDecorator', () => {
  const reflector = new Reflector()

  it('should apply AuthGuard and RolesGuard, and set roles metadata', () => {
    class TestClass {
      testMethod() {}
    }

    const guards = Reflect.getMetadata('__guards__', TestClass.prototype.testMethod)
    expect(guards).toContain(AuthGuard)

    const roles = reflector.get<Role[]>(ROLES_KEY, TestClass.prototype.testMethod)
    expect(roles).toEqual([Role.ADMIN, Role.PATIENT])
  })

  it('should apply guards and set empty roles metadata if no roles are provided', () => {
    class TestClass {
      testMethod() {}
    }

    const guards = Reflect.getMetadata('__guards__', TestClass.prototype.testMethod)
    expect(guards).toContain(AuthGuard)
    expect(guards).toContain(RolesGuard)

    const roles = reflector.get<Role[]>(ROLES_KEY, TestClass.prototype.testMethod)
    expect(roles).toEqual([])
  })
})
