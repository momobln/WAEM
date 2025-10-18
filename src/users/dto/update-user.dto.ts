import { createZodDto } from '@nestjs/zod';
import { createUserSchema } from './create-user.dto';

export const updateUserSchema = createUserSchema
  .partial()
  .extend({ password: createUserSchema.shape.password.optional() })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
