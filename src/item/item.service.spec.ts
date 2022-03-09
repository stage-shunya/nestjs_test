import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { ItemRepository } from 'src/repositories/ItemRepository';
import { createConnection, getConnection } from 'typeorm';
import { CreateItemDTO, UpdateItemDTO } from '../models/item.dto';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let mockRepo: ItemRepository;
  //テストデータの作成したのではない！
  // わけわかめ
  const baseDate = new Date();
  const baseItem = {
    id: 1,
    todo: '試しのテスト',
    limit: baseDate,
    deletePassword: '123456',
    createdAt: baseDate,
    updatedAt: baseDate,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemService, ItemRepository],
    }).compile();

    service = module.get<ItemService>(ItemService);
    mockRepo = module.get<ItemRepository>(ItemRepository);
  });

  describe('ItemService テストです', () => {
    it('findAll テスト', async () => {
      jest.spyOn(mockRepo, 'findAllItem').mockResolvedValue([baseItem]);
      const res = await service.findAll();
      expect(res).toMatchObject([baseItem]);
    });

    it('insertItem テストです', async () => {
      const item: CreateItemDTO = {
        todo: '試しのテスト',
        limit: baseDate,
        deletePassword: '123456',
      };
      jest.spyOn(mockRepo, 'insertItem').mockResolvedValue(baseItem);
      const res = await service.insertItem(item);
      expect(res).toMatchObject(baseItem);
    });

    it('findOneItem テストです', async () => {
      jest.spyOn(mockRepo, 'findOneItem').mockResolvedValue(baseItem);
      const res = await service.findOneItem(1);
      expect(res).toMatchObject(baseItem);
    });

    it('updateItem テストです', async () => {
      const item: UpdateItemDTO = {
        todo: '試しのテスト',
        limit: baseDate,
      };
      jest.spyOn(mockRepo, 'updateItem').mockResolvedValue(baseItem);
      const res = await service.updateItem(1, item);
      expect(res).toMatchObject(baseItem);
    });

    it('deleteByPassword テスト 正常終了', async () => {
      jest.spyOn(service, 'findOneItem').mockResolvedValue(baseItem);
      jest.spyOn(mockRepo, 'delete').mockResolvedValue(undefined);
      const res = await service.deleteByPassword(1, '123456');
      expect(res).toBeUndefined();
    });

    it('deleteByPassword テスト パスワードが一致しない', async () => {
      jest.spyOn(service, 'findOneItem').mockResolvedValue(baseItem);
      // errorがスロー
      const res = service.deleteByPassword(1, 'abcdef');
      await expect(res).rejects.toThrowError(
        new UnauthorizedException('Incorrect password'),
      );
    });
  });
});
