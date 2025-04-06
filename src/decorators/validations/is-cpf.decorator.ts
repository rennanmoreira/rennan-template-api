import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) {
      return false
    }

    const cleanedCPF = value.replace(/[^\d]/g, '')
    if (cleanedCPF.length !== 11 || /^(\d)\1+$/.test(cleanedCPF)) {
      return false
    }

    return this.isValidCPF(cleanedCPF)
  }

  private isValidCPF(cpf: string): boolean {
    const calcDigit = (base: number): number => {
      const sum = cpf
        .slice(0, base)
        .split('')
        .reduce((acc, curr, index) => acc + parseInt(curr) * (base + 1 - index), 0)
      const remainder = (sum * 10) % 11
      return remainder === 10 ? 0 : remainder
    }

    const firstDigit = calcDigit(9)
    const secondDigit = calcDigit(10)

    return firstDigit === parseInt(cpf[9], 10) && secondDigit === parseInt(cpf[10], 10)
  }

  defaultMessage(): string {
    return 'CPF (Cadastro de Pessoa Física) is invalid.'
  }
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCPFConstraint
    })
  }
}
