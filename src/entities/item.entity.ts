import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Item {
  @ApiProperty({
    example: 1,
    description: 'ID',
  })
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ApiProperty({
    example: '買い物に行く',
    description: 'タスクの名称',
  })
  @Column()
  todo: string;

  @ApiProperty({
    example: '2021-09-11T00:00:00.000Z',
    description: '制限時間',
  })
  @Column('timestamp')
  limit: Date;

  @ApiProperty({
    example: '123456',
    description: '削除するためのパスワード',
  })
  @Column()
  deletePassword: string;

  @ApiProperty({
    example: '2020-09-11T00:00:00.000Z',
    description: 'データの作成日時',
  })
  @CreateDateColumn()
  readonly createdAt: Date;

  @ApiProperty({
    example: '2020-09-13T00:00:00.000Z',
    description: 'データの最終更新日時',
  })
  @UpdateDateColumn()
  readonly updatedAt: Date;

  constructor(todo: string, limit: Date, deletePassword: string) {
    this.todo = todo;
    this.limit = limit;
    this.deletePassword = deletePassword;
  }
}
