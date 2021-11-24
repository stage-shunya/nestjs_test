import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Item } from 'src/entities/item.entity';

export class CreateItemDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '買い物に行く',
    description: 'タスクの名称',
  })
  todo: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '2021-09-09',
    description: '制限時間',
  })
  limit: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '123456',
    description: '削除するためのパスワード',
  })
  deletePassword: string;
}

export class UpdateItemDTO {
  @ApiPropertyOptional({
    example: '買い物に行く',
    description: 'タスクの名称',
  })
  todo?: string;

  @ApiPropertyOptional({
    example: '2021-09-09',
    description: '制限時間',
  })
  limit?: Date;
}
