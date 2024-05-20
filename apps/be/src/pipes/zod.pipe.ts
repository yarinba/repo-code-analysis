import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: any) {}


  /**
   * Transforms the input value using the Zod schema for validation.
   *
   * @param value The value to be transformed and validated.
   * @param metadata The argument metadata provided by NestJS.
   *
   * @returns The validated input value.
   *
   * @throws Error if the input value does not conform to the Zod schema.
   */
  transform(value: any, metadata: ArgumentMetadata) {
    this.schema.parse(value);
    return value;
  }
}
