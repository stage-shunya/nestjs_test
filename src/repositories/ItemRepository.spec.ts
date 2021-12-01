import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { DeleteParameter } from 'src/models/deleteParameter.dto';
import { CreateItemDTO, UpdateItemDTO } from 'src/models/item.dto';
import { createConnection, getConnection } from 'typeorm';
import { ItemRepository } from './ItemRepository';

describe('ItemRepository', () => {
  let repo: ItemRepository;
  let mockRepo: ItemRepository;
  let baseItem: Item;
  const testConnectionName = 'testConnection';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemRepository,
        {
          provide: getRepositoryToken(ItemRepository),
          useClass: ItemRepository,
        },
      ],
    }).compile();

    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'stage0707',
      database: 'test_db',
      entities: [Item],
      synchronize: true,
      dropSchema: true,
      logging: false,
      name: testConnectionName,
    });
    repo = connection.getCustomRepository(ItemRepository);
    mockRepo = module.get<ItemRepository>(ItemRepository);

    //テストデータの挿入
    baseItem = {
      id: 1,
      todo: 'test',
      limit: new Date(),
      deletePassword: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repo.save(baseItem);
  });

  afterEach(async () => {
    //作成したテストデータの削除
    await repo.delete({});
    await getConnection(testConnectionName).close();
  });

  describe('ItemRepository テスト', () => {
    it('findAllItem テスト', async () => {
      let testDate: Item = {
        id: 2,
        todo: 'test2',
        limit: new Date(),
        deletePassword: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await repo.save(testDate);

      const res = await repo.findAllItem();
      console.log(res);
      expect(res).toMatchObject([baseItem, testDate]);
    });

    it('findOneItem テスト 正常終了', async () => {
      const res = await repo.findOneItem(1);
      expect(res).toMatchObject(baseItem);
    });

    it('findOneItem テスト idが存在しない時', async () => {
      const res = repo.findOneItem(2);
      await expect(res).rejects.toThrowError(
        new NotFoundException('item(id: 2) not found'),
      );
    });

    it('insertItem テスト', async () => {
      let limit_date = new Date();
      let item: CreateItemDTO = {
        todo: 'jestのテスト',
        limit: limit_date,
        deletePassword: '123456',
      };
      const res = await repo.insertItem(item);
      let createdItem: Item = {
        id: res.id,
        todo: 'jestのテスト',
        limit: limit_date,
        deletePassword: '123456',
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      expect(res).toMatchObject(createdItem);
    });

    it('insertItem テスト catch', async () => {
      let item: CreateItemDTO = {
        todo: 'jestのテスト',
        limit: new Date(),
        deletePassword: '123456',
      };
      jest.spyOn(mockRepo, 'save').mockImplementation(() => {
        throw new Error();
      });
      const res = mockRepo.insertItem(item);
      await expect(res).rejects.toThrowError(new Error('Error'));
    });

    it('updateItem テスト 正常終了', async () => {
      let limit_date = new Date();
      let item: UpdateItemDTO = {
        todo: 'testの更新',
        limit: limit_date,
      };
      const res = await repo.updateItem(1, item);
      let updatedItem: Item = {
        id: 1,
        todo: 'testの更新',
        limit: limit_date,
        deletePassword: '123456',
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      expect(res).toMatchObject(updatedItem);
    });

    it('updateItem テスト idが存在しない', async () => {
      let item: UpdateItemDTO = {
        todo: 'jestの存在しないテスト',
        limit: new Date(),
      };
      const res = repo.updateItem(100, item);
      await expect(res).rejects.toThrowError(
        new NotFoundException('item(id: 100) not found'),
      );
    });

    it('updateItem テスト catch', async () => {
      jest.spyOn(mockRepo, 'findOneItem').mockResolvedValue(baseItem);
      jest.spyOn(mockRepo, 'save').mockImplementation(() => {
        throw new Error();
      });

      let item: UpdateItemDTO = {
        todo: 'testの更新',
        limit: new Date(),
      };
      const res = mockRepo.updateItem(1, item);
      await expect(res).rejects.toThrowError(new Error('Error'));
    });

    it('delete テスト', async () => {
      const res = await repo.deleteItem(1);
      expect(res).toBeUndefined();
      // 削除されているかの確認
      const checkDelete = repo.findOneItem(1);
      await expect(checkDelete).rejects.toThrowError(
        new NotFoundException('item(id: 1) not found'),
      );
    });
  });
});
