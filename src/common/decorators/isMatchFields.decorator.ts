import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsMatchFields(
        property: string,
        validationOptions?: ValidationOptions,
    ) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMatchFields',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: any) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args: any) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} et ${relatedPropertyName} doivent être identiques`;
                },
            },
        });
    };
}