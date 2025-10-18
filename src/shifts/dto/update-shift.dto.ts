import { createZodDto } from '@nestjs/zod';
import { createShiftSchema } from './create-shift.dto';

export const updateShiftSchema = createShiftSchema
  .partial()
  .refine((data) => {
    if (!data.start || !data.end) {
      return true;
    }
    return data.end > data.start;
  }, {
    message: 'Shift end time must be after the start time',
    path: ['end'],
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export class UpdateShiftDto extends createZodDto(updateShiftSchema) {}
