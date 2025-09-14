import { Injectable } from '@nestjs/common';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';

@Injectable()
export class VocabService {
  create(createVocabDto: CreateVocabDto) {
    return 'This action adds a new vocab';
  }

  findAll() {
    return `This action returns all vocab`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocab`;
  }

  update(id: number, updateVocabDto: UpdateVocabDto) {
    return `This action updates a #${id} vocab`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocab`;
  }
}
