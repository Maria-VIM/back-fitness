import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from '../services/groups.service';
import { GroupCreateDto } from '../dto/groups/group-create.dto';
import { GroupInterface } from '../interfaces/group.interface';
import { GroupUpdateDto } from '../dto/groups/group-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { OwnedResource } from '../../../shared/auth/own-resource.decorator';
import { OwnsResourceGuard } from '../../../shared/auth/owns-resourse.guard';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}
  @Get()
  @UseGuards(AuthGuard('session'))
  async get(): Promise<GroupInterface[]> {
    return this.groupsService.get();
  }

  @Get(':id')
  @UseGuards(AuthGuard('session'))
  async getOne(@Param('id') id: number): Promise<GroupInterface> {
    return this.groupsService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  @OwnedResource()
  async create(@Body() createDto: GroupCreateDto): Promise<GroupInterface> {
    return this.groupsService.create(createDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  @OwnedResource()
  async update(@Param('id') id: number, @Body() updateDto: GroupUpdateDto): Promise<GroupInterface> {
    return this.groupsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  @OwnedResource()
  @HttpCode(204)
  async delete(@Param('id') id: number): Promise<HttpStatus> {
    const deleted: { success: boolean } = await this.groupsService.delete(id);
    if (!deleted.success) {
      throw new ConflictException('resource could not be deleted');
    }
    return HttpStatus.NO_CONTENT;
  }
}
