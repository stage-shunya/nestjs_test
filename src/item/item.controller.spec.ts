import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Item } from 'src/entities/item.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { CreateItemDTO, UpdateItemDTO } from '../models/item.dto';
import { ItemRepository } from 'src/repositories/ItemRepository';
import { DeleteParameter } from 'src/models/deleteParameter.dto';

// ２つ目の書き方？
describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        //メモ
        //ここを追記してエラー解消した（エラーmsg）
        //Nest can't resolve dependencies of the ItemRepository (?). Please make sure that the argument Connection at index [0] is available in the TypeOrmModule context.
        ItemRepository,
        // ↑もしくは↓
        // {
        //   provide: getRepositoryToken(Item),
        //   useValue: Repository,
        // },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  const baseItem: Item = {
    id: 1,
    todo: '試しのテスト',
    limit: new Date(),
    deletePassword: '123456',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('ItemController テスト', () => {
    it('@Get() テスト 1件以上取得', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([baseItem]);
      let res = await controller.getItemList();
      expect(res).toEqual([baseItem]);
    });

    it('@Get() テスト 0件取得', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);
      let res = await controller.getItemList();
      expect(res).toBeDefined();
    });

    it('@Get(:id) テスト', async () => {
      jest.spyOn(service, 'findOneItem').mockResolvedValue(baseItem);
      let res = await controller.getItem(1);
      expect(res).toBe(baseItem);
      expect(res).toEqual(baseItem);
    });

    it('@Post() テスト', async () => {
      jest.spyOn(service, 'insertItem').mockResolvedValue(baseItem);
      let item: CreateItemDTO = {
        todo: '試しのテスト',
        limit: new Date(),
        deletePassword: '123456',
      };
      let res = await controller.addItem(item);
      expect(res).toBe(baseItem);
      expect(res).toEqual(baseItem);
    });

    it('@Put(:id/update) テスト', async () => {
      jest.spyOn(service, 'updateItem').mockResolvedValue(baseItem);
      let item: UpdateItemDTO = {
        todo: '試しのテスト',
        limit: new Date(),
      };
      let res = await controller.updateItem(1, item);
      expect(res).toBe(baseItem);
      expect(res).toEqual(baseItem);
    });

    it('@Delete(:id/delete) テスト', async () => {
      jest.spyOn(service, 'deleteByPassword').mockResolvedValue();
      let item: DeleteParameter = {
        deletePassword: '123456',
      };
      let res = await controller.deleteItem(1, item);
      expect(res).not.toEqual(baseItem);
      expect(res).toBeUndefined();
    });
  });
});
