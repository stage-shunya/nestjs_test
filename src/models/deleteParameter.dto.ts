import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteParameter {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: '削除するためのパスワード',
  })
  deletePassword: string;
}
