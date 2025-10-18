import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

const shiftSelect = {
  id: true,
  title: true,
  location: true,
  start: true,
  end: true,
  createdAt: true,
  owner: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
};

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateShiftDto) {
    return this.prisma.shift.create({
      data: {
        title: dto.title,
        location: dto.location,
        start: dto.start,
        end: dto.end,
        ownerId: dto.ownerId,
      },
      select: shiftSelect,
    });
  }

  findAll() {
    return this.prisma.shift.findMany({ select: shiftSelect, orderBy: { start: 'asc' } });
  }

  async findOne(id: string) {
    const shift = await this.prisma.shift.findUnique({ where: { id }, select: shiftSelect });
    if (!shift) {
      throw new NotFoundException(`Shift with id ${id} not found`);
    }
    return shift;
  }

  async update(id: string, dto: UpdateShiftDto) {
    await this.ensureExists(id);
    return this.prisma.shift.update({
      where: { id },
      data: dto,
      select: shiftSelect,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.shift.delete({ where: { id } });
    return { id };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.shift.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Shift with id ${id} not found`);
    }
  }
}
