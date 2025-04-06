import { ROLES_KEY, Roles } from '@auth/decorators/roles.decorator'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'

describe('RolesDecorator', () => {
  const reflector = new Reflector()

  it('should set roles metadata on handler', () => {
    class TestClass {
      @Roles(Role.ADMIN, Role.PATIENT)
      testMethod() {}
    }

    const roles = reflector.get<Role[]>(ROLES_KEY, TestClass.prototype.testMethod)
    expect(roles).toEqual([Role.ADMIN, Role.PATIENT])
  })

  it('should set empty roles metadata if no roles provided', () => {
    class TestClass {
      @Roles()
      testMethod() {}
    }

    const roles = reflector.get<Role[]>(ROLES_KEY, TestClass.prototype.testMethod)
    expect(roles).toEqual([])
  })
})
