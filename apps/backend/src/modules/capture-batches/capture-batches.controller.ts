import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CaptureBatchesService } from './capture-batches.service';
import { CreateCaptureBatchDto } from './dto/create-capture-batch.dto';
import { ListCaptureBatchesQueryDto } from './dto/list-capture-batches-query.dto';
import { UpdateCaptureBatchDto } from './dto/update-capture-batch.dto';

@Controller('capture-batches')
export class CaptureBatchesController {
  constructor(private readonly captureBatchesService: CaptureBatchesService) {}

  @Post()
  create(@Body() dto: CreateCaptureBatchDto) {
    return this.captureBatchesService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListCaptureBatchesQueryDto) {
    return this.captureBatchesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.captureBatchesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCaptureBatchDto,
  ) {
    return this.captureBatchesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.captureBatchesService.remove(id);
  }
}
