import { Test, TestingModule } from '@nestjs/testing';
import { Item } from 'src/entities/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { CreateItemDTO, UpdateItemDTO } from '../models/item.dto';
import { ItemRepository } from 'src/repositories/ItemRepository';
import { DeleteParameter } from 'src/models/deleteParameter.dto';

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;
  //テストデータの作成
  const baseDate = new Date();
  const baseItem: Item = {
    id: 1,
    todo: '試しのテスト',
    limit: baseDate,
    deletePassword: '123456',
    createdAt: baseDate,
    updatedAt: baseDate,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        //メモ
        //ここを追記してエラー解消した（エラーmsg）
        //Nest can't resolve dependencies of the ItemRepository (?). Please make sure that the argument Connection at index [0] is available in the TypeOrmModule context.
        ItemRepository,
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  describe('ItemController テスト', () => {
    it('getItemList テスト 1件以上取得', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([baseItem]);
      const res = await controller.getItemList();
      expect(res).toMatchObject([baseItem]);
    });

    it('getItemList テスト 0件取得', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);
      const res = await controller.getItemList();
      expect(res).toBeDefined();
    });

    it('getItem テスト', async () => {
      jest.spyOn(service, 'findOneItem').mockResolvedValue(baseItem);
      const res = await controller.getItem(1);
      expect(res).toMatchObject(baseItem);
    });

    it('addItem テスト', async () => {
      jest.spyOn(service, 'insertItem').mockResolvedValue(baseItem);
      const item: CreateItemDTO = {
        todo: '試しのテスト',
        limit: baseDate,
        deletePassword: '123456',
      };
      const res = await controller.addItem(item);
      expect(res).toMatchObject(baseItem);
    });

    it('updateItem テスト', async () => {
      jest.spyOn(service, 'updateItem').mockResolvedValue(baseItem);
      const item: UpdateItemDTO = {
        todo: '試しのテスト',
        limit: baseDate,
      };
      const res = await controller.updateItem(1, item);
      expect(res).toMatchObject(baseItem);
    });

    it('deleteItem テスト', async () => {
      jest.spyOn(service, 'deleteByPassword').mockResolvedValue();
      const item: DeleteParameter = {
        deletePassword: '123456',
      };
      const res = await controller.deleteItem(1, item);
      expect(res).toBeUndefined();
    });
  });
});
