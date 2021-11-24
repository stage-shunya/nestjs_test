import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Item } from 'src/entities/item.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import {
  CreateItemDTO,
  DeleteItemDTO,
  UpdateItemDTO,
} from '../models/item.dto';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';

// ２つ目の書き方？
describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;
  let repo: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        //ここを追記してエラー解消した
        //エラーmsgはこちら
        //Nest can't resolve dependencies of the ItemRepository (?). Please make sure that the argument Connection at index [0] is available in the TypeOrmModule context.
        // これか
        // ItemRepository,
        {
          provide: getRepositoryToken(Item),
          useValue: Repository,
        },
        // これ
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
    repo = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('(Get) /item テスト', () => {
    const testItem: Item = {
      id: 1,
      todo: '試しのテスト',
      limit: new Date(),
      idDone: false,
      deletePassword: '123456',
    };

    it('1件以上取得', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([testItem]);
      let func = await controller.getItemList();
      expect(func).toEqual([testItem]);
      expect(func).toBeDefined();
    });

    it('0件取得', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
      let func = await controller.getItemList();
      expect(func).toBeDefined();
    });
  });

  describe('(Post) /item テスト', () => {
    it('1件をinsert', async () => {
      let item: CreateItemDTO = {
        todo: 'test',
        limit: '2020-09-07',
        deletePassword: '123456',
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(
          async (item: CreateItemDTO): Promise<InsertResult> => {
            if (item) {
              return new InsertResult();
            }
          },
        );
      let res = await controller.addItem(item);
      expect(res).toEqual(new InsertResult());
    });
  });

  describe('(Get) /item/:id テスト', () => {
    const testItem: Item = {
      id: 1,
      todo: '試しのテスト',
      limit: new Date(),
      idDone: false,
      deletePassword: '123456',
    };

    it('想定のidで取得', async () => {
      jest
        .spyOn(service, 'find')
        .mockImplementation(async (id: number): Promise<Item> => {
          if (id == testItem.id) {
            return testItem;
          }
        });
      let res = await controller.getItem('1');
      expect(res).toBe(testItem);
      expect(res).toEqual(testItem);
    });

    // expectのテストになっている？いらない？
    it('想定ではないidで取得', async () => {
      jest
        .spyOn(service, 'find')
        .mockImplementation(async (id: number): Promise<Item> => {
          if (id == testItem.id) {
            return testItem;
          }
        });
      let res = await controller.getItem('2');
      expect(res).not.toBe(testItem);
      expect(res).toBeUndefined();
    });
  });

  describe('(Put) /item/:id/update テスト', () => {
    it('想定のidで取得', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(
          async (id: number, newDate): Promise<UpdateResult> => {
            if (id == 1 && newDate) {
              return new UpdateResult();
            }
          },
        );

      let item: UpdateItemDTO = {
        todo: '更新したよ',
        limit: '2020-09-07',
        isDone: 'true',
      };
      let res = await controller.update('1', item);
      expect(res).toEqual(new UpdateResult());
    });

    // expectのテストになっている？いらない？
    it('想定ではないidで取得', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(
          async (id: number, newDate): Promise<UpdateResult> => {
            if (id == 1 && newDate) {
              return new UpdateResult();
            }
          },
        );

      let item: UpdateItemDTO = {
        todo: '更新したよ',
        limit: '2020-09-07',
        isDone: 'true',
      };
      let res = await controller.update('2', item);
      expect(res).toBeUndefined();
    });
  });

  describe('(Delete) /item/:id/delete テスト', () => {
    it('想定のIDを削除', async () => {
      jest
        .spyOn(service, 'delete')
        .mockImplementation(async (id: number): Promise<DeleteResult> => {
          if (id == 1) {
            return new DeleteResult();
          }
        });
      let res = await controller.delete('1');
      expect(res).toEqual(new DeleteResult());
    });

    // expectのテストになっている？いらない？
    it('想定ではないIDを削除', async () => {
      jest
        .spyOn(service, 'delete')
        .mockImplementation(async (id: number): Promise<DeleteResult> => {
          if (id == 1) {
            return new DeleteResult();
          }
        });
      let res = await controller.delete('2');
      expect(res).toBeUndefined();
    });
  });

  describe('(Post)/item/:id/delete', () => {
    it('itemが存在する場合', async () => {
      const testItem: Item = {
        id: 1,
        todo: '試しのテスト',
        limit: new Date(),
        idDone: false,
        deletePassword: '123456',
      };

      jest.spyOn(service, 'find').mockResolvedValue(testItem);
      jest
        .spyOn(service, 'deleteByPassword')
        .mockImplementation(
          async (id: number, deletePassword: string): Promise<DeleteResult> => {
            if (
              id == testItem.id &&
              deletePassword == testItem.deletePassword
            ) {
              return new DeleteResult();
            }
          },
        );
      let item: DeleteItemDTO = {
        deletePassword: '123456',
      };
      let res = await controller.deleteItem('1', item);
      // DeleteResultのレスポンスがないためエラー
      // returnがないとundefindになる？ void型もundefindらしい？
      expect(res).toEqual(new DeleteResult());
    });

    it('itemが存在するが、パスワードが違う場合', async () => {
      const testItem: Item = {
        id: 1,
        todo: '試しのテスト',
        limit: new Date(),
        idDone: false,
        deletePassword: '123456',
      };
      jest.spyOn(service, 'find').mockResolvedValue(testItem);

      jest
        .spyOn(service, 'deleteByPassword')
        .mockImplementation(
          async (id: number, deletePassword: string): Promise<DeleteResult> => {
            if (
              id == testItem.id &&
              deletePassword != testItem.deletePassword
            ) {
              return Promise.reject(new Error('Incorrect password'));
            }
          },
        );
      let item: DeleteItemDTO = {
        deletePassword: 'abcdef',
      };
      // DeleteResultのためエラー
      await controller.deleteItem('1', item).catch((error) => {
        console.log(error);
        expect(error.status).toBe(403);
        expect(error.response.status).toBe(403);
        expect(error.response.error).toBe(`Incorrect password`);
      });
    });

    it('itemが存在しない場合', async () => {
      const testItem = undefined;
      jest.spyOn(service, 'find').mockResolvedValue(testItem);

      // service.deleteByPasswordは通らないからモックする必要もなし？
      jest
        .spyOn(service, 'deleteByPassword')
        .mockImplementation(
          async (id: number, deletePassword: string): Promise<DeleteResult> => {
            if (
              id == testItem.id &&
              deletePassword == testItem.deletePassword
            ) {
              return new DeleteResult();
            }
          },
        );
      let item: DeleteItemDTO = {
        deletePassword: '123456',
      };

      await controller.deleteItem('1', item).catch((error) => {
        expect(error.status).toBe(404);
        expect(error.response.status).toBe(404);
        expect(error.response.error).toBe('Missing item(id: 1).');
      });

      // throwされているか
      const res = () => controller.deleteItem('1', item);
      expect(res()).rejects.toThrowError(
        new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Missing item(id: 3.`,
          },
          404,
        ),
      );
    });
  });
});
