import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Item } from 'src/entities/item.entity';
import { DeleteParameter } from 'src/models/deleteParameter.dto';
import { CreateItemDTO, UpdateItemDTO } from 'src/models/item.dto';
import { createConnection, getConnection } from 'typeorm';
import { ItemRepository } from './ItemRepository';

describe('ItemRepository', () => {
  let repo: ItemRepository;
  //テストデータの作成
  const baseDate = new Date();
  const baseItem: Item = {
    id: 1,
    todo: 'test',
    limit: baseDate,
    deletePassword: '123456',
    createdAt: baseDate,
    updatedAt: baseDate,
  };
  const testConnectionName = 'testConnection';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemRepository],
    }).compile();

    const connection = await createConnection(testConnectionName);
    repo = connection.getCustomRepository(ItemRepository);

    //テストデータの挿入
    await repo.save(baseItem);
  });

  afterEach(async () => {
    //作成したテストデータの削除
    await repo.delete({});
    await getConnection(testConnectionName).close();
  });

  describe('ItemRepository テスト', () => {
    it('findAllItem テスト', async () => {
      const testData: Item = {
        id: 2,
        todo: 'test2',
        limit: baseDate,
        deletePassword: '123456',
        createdAt: baseDate,
        updatedAt: baseDate,
      };
      await repo.save(testData);

      const res = await repo.findAllItem();
      expect(res).toMatchObject([baseItem, testData]);
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
      const item: CreateItemDTO = {
        todo: 'jestのテスト',
        limit: baseDate,
        deletePassword: '123456',
      };
      const res = await repo.insertItem(item);
      const createdItem: Item = {
        id: res.id,
        todo: 'jestのテスト',
        limit: baseDate,
        deletePassword: '123456',
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      expect(res).toMatchObject(createdItem);
    });

    it('insertItem テスト catch', async () => {
      const item: CreateItemDTO = {
        todo: 'jestのテスト',
        limit: baseDate,
        deletePassword: '123456',
      };
      jest.spyOn(repo, 'save').mockImplementation(() => {
        throw new Error();
      });
      const res = repo.insertItem(item);
      await expect(res).rejects.toThrowError(new Error('Error'));
    });

    it('updateItem テスト 正常終了', async () => {
      const item: UpdateItemDTO = {
        todo: 'testの更新',
        limit: baseDate,
      };
      const res = await repo.updateItem(1, item);
      const updatedItem: Item = {
        id: 1,
        todo: 'testの更新',
        limit: baseDate,
        deletePassword: '123456',
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      expect(res).toMatchObject(updatedItem);
    });

    it('updateItem テスト idが存在しない', async () => {
      const item: UpdateItemDTO = {
        todo: 'jestの存在しないテスト',
        limit: baseDate,
      };
      const res = repo.updateItem(100, item);
      await expect(res).rejects.toThrowError(
        new NotFoundException('item(id: 100) not found'),
      );
    });

    it('updateItem テスト catch', async () => {
      jest.spyOn(repo, 'save').mockImplementation(() => {
        throw new Error();
      });

      const item: UpdateItemDTO = {
        todo: 'testの更新',
        limit: baseDate,
      };
      const res = repo.updateItem(1, item);
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
