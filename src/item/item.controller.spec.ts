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
  let repo: ItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        //ここを追記してエラー解消した
        //エラーmsg
        //Nest can't resolve dependencies of the ItemRepository (?). Please make sure that the argument Connection at index [0] is available in the TypeOrmModule context.
        // これか
        ItemRepository,
        // これ
        // {
        //   provide: getRepositoryToken(Item),
        //   useValue: Repository,
        // },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
    repo = module.get<ItemRepository>(getRepositoryToken(ItemRepository));
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
    it('(Get) /item テスト 1件以上取得', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([baseItem]);
      let func = await controller.getItemList();
      expect(func).toEqual([baseItem]);
    });

    it('(Get) /item テスト 0件取得', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
      let func = await controller.getItemList();
      expect(func).toBeDefined();
    });

    it('(Get) /item/:id テスト', async () => {
      jest.spyOn(service, 'findOneItem').mockResolvedValueOnce(baseItem);
      let res = await controller.getItem(1);
      expect(res).toBe(baseItem);
      expect(res).toEqual(baseItem);
    });

    it('(Post) /item テスト', async () => {
      jest.spyOn(service, 'insertItem').mockResolvedValueOnce(baseItem);
      let item: CreateItemDTO = {
        todo: 'test',
        limit: new Date(),
        deletePassword: '123456',
      };
      let res = await controller.addItem(item);
      console.log('res');
      console.log(res);
      expect(res).toEqual(baseItem);
    });

    it('(Put) /item/:id/update テスト', async () => {
      jest.spyOn(service, 'updateItem').mockResolvedValueOnce(baseItem);
      let item: UpdateItemDTO = {
        todo: '更新したよ',
        limit: new Date(),
      };
      let res = await controller.updateItem(1, item);
      console.log('res');
      console.log(res);
      expect(res).toEqual(baseItem);
    });

    it('(Delete) /item/:id/delete テスト', async () => {
      jest.spyOn(service, 'deleteByPassword').mockResolvedValueOnce(undefined);
      let item: DeleteParameter = {
        deletePassword: '123456',
      };
      let res = await controller.deleteItem(1, item);
      expect(res).toBeUndefined();
    });
  });
});
