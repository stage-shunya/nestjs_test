import {
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Item } from 'src/entities/item.entity';
import { CreateItemDTO, UpdateItemDTO } from 'src/models/item.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  async findAllItem(): Promise<Item[]> {
    return await this.find();
  }

  async findOneItem(id: number): Promise<Item> {
    let res = await this.findOne({ id: id });
    console.log(res);
    if (!res) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Missing item(id: ${id}).`,
        },
        404,
      );
    }
    return res;
  }

  async insertItem(item: CreateItemDTO): Promise<Item> {
    let items = new Item(item.todo, item.limit, item.deletePassword);
    console.log('items');
    console.log(items);
    try {
      return await this.save(items);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateItem(id: number, item: UpdateItemDTO): Promise<Item> {
    let findedItem = await this.findOneItem(id);
    findedItem.limit = item.limit ? item.limit : findedItem.limit;
    findedItem.todo = item.todo ? item.todo : findedItem.todo;
    try {
      return await this.save(findedItem);
    } catch (error) {
      throw new Error(error);
    }
  }
}
