import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { ItemRepository } from 'src/repositories/ItemRepository';
import { CreateItemDTO, UpdateItemDTO } from '../models/item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemRepository)
    private readonly itemRepository: ItemRepository,
  ) {}

  // テーブルの全データを取得する
  async findAll(): Promise<Item[]> {
    return await this.itemRepository.findAllItem();
  }

  // テーブルにアイテムを追加する
  async insertItem(item: CreateItemDTO): Promise<Item> {
    return await this.itemRepository.insertItem(item);
  }

  // idを指定してテーブルから1件のデータを取得する
  async findOneItem(id: number): Promise<Item> {
    return await this.itemRepository.findOneItem(id);
  }

  // idを指定してテーブルのデータを更新する
  async updateItem(id: number, item: UpdateItemDTO): Promise<Item> {
    return await this.itemRepository.updateItem(id, item);
  }

  //  パスワード判定してデータを削除する
  async deleteByPassword(id: number, deletePassword: string): Promise<void> {
    const targetItem = await this.findOneItem(id);
    // 送信したパスワードが間違っていたとき
    if (targetItem.deletePassword !== deletePassword) {
      throw new UnauthorizedException('Incorrect password');
    }
    await this.itemRepository.delete(id);
  }
}
