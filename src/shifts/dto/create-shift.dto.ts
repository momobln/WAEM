import { createZodDto } from '@nestjs/zod';
import { z } from 'zod';

export const createShiftSchema = z
  .object({
    title: z.string().min(2),
    location: z.string().min(2),
    start: z.coerce.date(),
    end: z.coerce.date(),
    ownerId: z.string().cuid().optional(),
  })
  .refine((data) => data.end > data.start, {
    message: 'Shift end time must be after the start time',
    path: ['end'],
  });

export class CreateShiftDto extends createZodDto(createShiftSchema) {}
