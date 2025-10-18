import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema, ZodTypeAny } from 'zod';

type ZodClass = { schema?: ZodSchema };

interface ZodValidationPipeOptions {
  transform?: boolean;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly options: ZodValidationPipeOptions = {}) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const metatype = metadata.metatype as ZodTypeAny | ZodClass | undefined;
    const schema =
      (metatype && 'schema' in metatype && metatype.schema) ||
      (metatype as ZodTypeAny | undefined);

    if (!schema || typeof (schema as ZodTypeAny).safeParse !== 'function') {
      return value;
    }

    const result = (schema as ZodTypeAny).safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }

    if (this.options.transform) {
      return result.data;
    }

    return value;
  }
}
