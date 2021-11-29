import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { ItemRepository } from 'src/repositories/ItemRepository';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateItemDTO } from '../models/item.dto';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let repo: ItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        ItemRepository,
        // {
        //   provide: getRepositoryToken(Item),
        //   useValue: new Repo_sitory<Item>(),
        // },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repo = module.get<ItemRepository>(ItemRepository);
  });

  const baseItem: Item = {
    id: 1,
    todo: '試しのテスト',
    limit: new Date(2021, 0, 1),
    deletePassword: '123456',
    createdAt: new Date(2021, 0, 1),
    updatedAt: new Date(2021, 0, 1),
  };
  console.log(baseItem);

  describe('findAll', () => {
    it('findAll テスト', async () => {
      jest.spyOn(repo, 'findAllItem').mockResolvedValue([baseItem]);
      let res = await service.findAll();
      expect(res).toEqual([baseItem]);
    });

    it('insertItem テスト', async () => {
      let item: CreateItemDTO = {
        todo: 'test',
        limit: new Date(2021, 0, 1),
        deletePassword: '123456',
      };
      jest.spyOn(repo, 'insertItem').mockResolvedValue(baseItem);
      let res = await service.insertItem(item);
      expect(res).toEqual(baseItem);
    });

    it('findOneItem テスト', async () => {
      jest.spyOn(repo, 'findOneItem').mockResolvedValue(baseItem);
      let res = await service.findOneItem(1);
      expect(res).toEqual(baseItem);
    });

    it('updateItem テスト', async () => {
      let item: CreateItemDTO = {
        todo: 'test',
        limit: new Date(2021, 0, 1),
        deletePassword: '123456',
      };
      jest.spyOn(repo, 'updateItem').mockResolvedValue(baseItem);
      let res = await service.updateItem(1, item);
      expect(res).toEqual(baseItem);
    });
  });

  describe('deleteByPassword テスト', () => {
    it('正常終了', async () => {
      jest.spyOn(service, 'findOneItem').mockResolvedValue(baseItem);
      jest.spyOn(repo, 'delete').mockResolvedValue(undefined);
      let res = await service.deleteByPassword(1, '123456');
      expect(res).toBeUndefined();
    });

    it('パスワードが一致しない', async () => {
      // const testItem: Item = {
      //   id: 1,
      //   todo: '試しのテスト',
      //   limit: new Date(),
      //   deletePassword: '123456',
      // };
      jest.spyOn(service, 'findOneItem').mockResolvedValue(baseItem);
      // errorがスローされているか
      const res = () => service.deleteByPassword(1, 'abcdef');
      await expect(res).rejects.toThrowError(
        new UnauthorizedException('Incorrect password'),
      );
    });
  });
});
