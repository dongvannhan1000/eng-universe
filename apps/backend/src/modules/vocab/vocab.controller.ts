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
import { CreateVocabDto } from './dto/create-vocab.dto';
import { ListVocabQueryDto } from './dto/list-vocab-query.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { VocabService } from './vocab.service';
import { VocabEntityDoc } from './entities/vocab.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedVocabDoc } from './entities/list-vocab.entity';

@Controller('api/vocab')
@ApiTags('vocabs')
@ApiBearerAuth()
@ApiExtraModels(VocabEntityDoc, PaginatedVocabDoc)
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vocab' })
  @ApiCreatedResponse({ description: 'Created', type: VocabEntityDoc })
  @ApiBadRequestResponse({ description: 'Validation error' })
  create(@Body() createVocabDto: CreateVocabDto) {
    return this.vocabService.create(createVocabDto);
  }

  @Get()
  @ApiOperation({ summary: 'List vocabs (filter & pagination)' })
  @ApiOkResponse({ description: 'List', type: PaginatedVocabDoc })
  list(@Query() q: ListVocabQueryDto) {
    return this.vocabService.findAll(q);
  }

  @Get('summary')
  getSummary() {
    return this.vocabService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vocabService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabDto: UpdateVocabDto,
  ) {
    return this.vocabService.update(id, updateVocabDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vocabService.remove(id);
  }
}
