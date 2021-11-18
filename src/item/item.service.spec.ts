import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateItemDTO } from './item.dto';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let repo: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useValue: new Repository<Item>(),
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repo = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('findAll テスト', async () => {
      const testItem: Item = {
        id: 1,
        todo: '試しのテスト',
        limit: new Date(),
        idDone: false,
        deletePassword: '123456',
      };
      jest.spyOn(repo, 'find').mockResolvedValue([testItem]);
      let res = await service.findAll();
      expect(res).toEqual([testItem]);
    });

    it('create テスト', async () => {
      let item: CreateItemDTO = {
        todo: 'test',
        limit: '2020-09-07',
        deletePassword: '123456',
      };
      jest.spyOn(repo, 'insert').mockResolvedValue(new InsertResult());
      let res = await service.create(item);
      expect(res).toEqual(new InsertResult());
    });

    it('find テスト', async () => {
      const testItem: Item = {
        id: 1,
        todo: '試しのテスト',
        limit: new Date(),
        idDone: false,
        deletePassword: '123456',
      };
      jest.spyOn(repo, 'findOne').mockResolvedValue(testItem);
      let res = await service.find(1);
      expect(res).toEqual(testItem);
    });

    it('update テスト', async () => {
      let item: CreateItemDTO = {
        todo: 'test',
        limit: '2020-09-07',
        deletePassword: '123456',
      };
      jest.spyOn(repo, 'update').mockResolvedValue(new UpdateResult());
      let res = await service.update(1, item);
      expect(res).toEqual(new UpdateResult());
    });

    it('delete テスト', async () => {
      let item: CreateItemDTO = {
        todo: 'test',
        limit: '2020-09-07',
        deletePassword: '123456',
      };
      jest.spyOn(repo, 'delete').mockResolvedValue(new DeleteResult());
      let res = await service.delete(1);
      expect(res).toEqual(new DeleteResult());
    });
  });

  describe('deleteByPassword テスト', () => {
    it('正常終了', async () => {
      const testItem: Item = {
        id: 1,
        todo: '試しのテスト',
        limit: new Date(),
        idDone: false,
        deletePassword: '123456',
      };
      jest.spyOn(service, 'find').mockResolvedValue(testItem);
      jest.spyOn(repo, 'delete').mockResolvedValue(new DeleteResult());
      let res = await service.deleteByPassword(1, '123456');
      expect(res).toEqual(new DeleteResult());
    });

    it('targetItemが見つからない', async () => {
      const testItem = undefined;
      jest.spyOn(service, 'find').mockResolvedValue(testItem);

      await service.deleteByPassword(1, '123456').catch((error) => {
        expect(error).toEqual(new Error('Missing Item.'));
      });

      // errorがスローされているか
      const res = () => service.deleteByPassword(1, '123456');
      expect(res()).rejects.toThrowError(new Error('Missing Item.'));
    });

    it('パスワードが一致しない', async () => {
      const testItem: Item = {
        id: 1,
        todo: '試しのテスト',
        limit: new Date(),
        idDone: false,
        deletePassword: '123456',
      };
      jest.spyOn(service, 'find').mockResolvedValue(testItem);
      await service.deleteByPassword(1, 'abcdef').catch((error) => {
        expect(error).toEqual(new Error('Incorrect password'));
      });

      // errorがスローされているか
      const res = () => service.deleteByPassword(1, 'abcdef');
      expect(res()).rejects.toThrowError(new Error('Incorrect password'));
    });
  });
});
