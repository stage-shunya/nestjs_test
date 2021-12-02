import {
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Item } from 'src/entities/item.entity';
import { CreateItemDTO, UpdateItemDTO } from 'src/models/item.dto';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  async findAllItem(): Promise<Item[]> {
    return await this.find();
  }

  async findOneItem(id: number): Promise<Item> {
    const res = await this.findOne({ id: id });
    if (!res) {
      throw new NotFoundException(`item(id: ${id}) not found`);
    }
    return res;
  }

  async insertItem(item: CreateItemDTO): Promise<Item> {
    const items = new Item(item.todo, item.limit, item.deletePassword);
    try {
      return await this.save(items);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateItem(id: number, item: UpdateItemDTO): Promise<Item> {
    const findedItem = await this.findOneItem(id);
    findedItem.limit = item.limit ? item.limit : findedItem.limit;
    findedItem.todo = item.todo ? item.todo : findedItem.todo;
    try {
      return await this.save(findedItem);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteItem(id: number): Promise<void> {
    await this.delete(id);
  }
}
