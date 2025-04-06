import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function Match(property: string, validation_options?: ValidationOptions) {
  return function (object: object, property_name: string) {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName: property_name,
      constraints: [property],
      options: validation_options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]
          return value === relatedValue
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          return `${property_name} must match ${relatedPropertyName}`
        }
      }
    })
  }
}
