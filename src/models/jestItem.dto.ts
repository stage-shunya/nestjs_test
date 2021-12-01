import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Item } from 'src/entities/item.entity';

export class jestItem {
  @ApiProperty({
    example: '買い物に行く',
    description: 'タスクの名称',
  })
  todo: string;

  @ApiProperty({
    example: '2021-09-11T00:00:00.000Z',
    description: '制限時間',
  })
  limit: Date;

  @ApiProperty({
    example: '123456',
    description: '削除するためのパスワード',
  })
  deletePassword: string;

  @ApiProperty({
    example: '2020-09-11T00:00:00.000Z',
    description: 'データの作成日時',
  })
  readonly createdAt: Date;

  @ApiProperty({
    example: '2020-09-13T00:00:00.000Z',
    description: 'データの最終更新日時',
  })
  readonly updatedAt: Date;
}
