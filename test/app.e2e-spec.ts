import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Item } from 'src/entities/item.entity';
import { CreateItemDTO, UpdateItemDTO } from 'src/models/item.dto';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { getConnection, getConnectionOptions, getRepository } from 'typeorm';
import { ItemRepository } from 'src/repositories/ItemRepository';
import { DeleteParameter } from 'src/models/deleteParameter.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testItem: Item;

  //削除するデータ
  const deleteItems: Item[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () =>
            Object.assign(await getConnectionOptions(), {
              entities: [Item],
            }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    //テストデータを設定
    if (!testItem) {
      testItem = await getConnection()
        .getCustomRepository(ItemRepository)
        .insertItem({
          todo: 'テスト用データ',
          limit: new Date(),
          deletePassword: '123456',
        });
      deleteItems.push(testItem);
    }
    await app.init();
  });

  afterAll(async () => {
    await Promise.all(
      deleteItems.map(async (item) => {
        if (item.id) {
          return await getConnection()
            .getCustomRepository(ItemRepository)
            .delete({ id: item.id });
        }
        return;
      }),
    );
    await app.close();
  });

  //Date型に変更
  const changeType = (res: Item) => {
    res.limit = new Date(res.limit);
    res.createdAt = new Date(res.createdAt);
    res.updatedAt = new Date(res.updatedAt);
    return res;
  };

  describe('AppModule TEST', () => {
    //Bearer認証 token
    const token = 'Bearer secret';

    it('/item (GET) 正常処理', async () => {
      const res = await request(app.getHttpServer())
        .get('/item')
        .set('authorization', token);
      const itemArray = changeType(res.body[res.body.length - 1]);

      expect(itemArray).toMatchObject(testItem);
      expect(res.status).toEqual(200);
    });

    it('/item (GET) tokenなし', async () => {
      const res = await request(app.getHttpServer()).get('/item');

      expect(res.status).toEqual(403);
    });

    it('/item/:id (GET) 正常処理', async () => {
      const res = await request(app.getHttpServer())
        .get(`/item/${testItem.id}`)
        .set('authorization', token);
      const itemArray = changeType(res.body);

      expect(itemArray).toMatchObject(testItem);
      expect(res.status).toEqual(200);
    });

    it('/item/:id (GET) IDが存在しない場合', async () => {
      const res = await request(app.getHttpServer())
        .get('/item/1000')
        .set('authorization', token);

      expect(res.status).toEqual(404);
      expect(res.body.message).toBe('item(id: 1000) not found');
    });

    it('/item/:id  (GET) tokenなし', async () => {
      const res = await request(app.getHttpServer()).get(
        `/item/${testItem.id}`,
      );

      expect(res.status).toEqual(403);
    });

    //POST
    //createパラメーターの定義
    const createItem: CreateItemDTO = {
      todo: 'createテスト用データ',
      limit: new Date(),
      deletePassword: '123456',
    };

    it('/item (Post) 正常処理', async () => {
      const res = await request(app.getHttpServer())
        .post('/item')
        .set('authorization', token)
        .send(createItem);
      const itemArray = changeType(res.body);

      const resCreatedItem: Item = {
        id: itemArray.id,
        todo: createItem.todo,
        limit: createItem.limit,
        deletePassword: createItem.deletePassword,
        createdAt: itemArray.createdAt,
        updatedAt: itemArray.updatedAt,
      };

      expect(itemArray).toMatchObject(resCreatedItem);
      expect(res.status).toEqual(201);

      await deleteItems.push(resCreatedItem);
    });

    it('/item (POST) tokenなし', async () => {
      const res = await request(app.getHttpServer())
        .post('/item')
        .send(createItem);

      expect(res.status).toEqual(403);
    });

    //UPDATE
    //updateパラメーターの定義
    const updateItem: UpdateItemDTO = {
      todo: 'updateテスト用データ',
      limit: new Date('2020/1/1'),
    };
    it('/item/:id/update (Put) 正常処理', async () => {
      const res = await request(app.getHttpServer())
        .put(`/item/${testItem.id}/update`)
        .set('authorization', token)
        .send(updateItem);
      const itemArray = changeType(res.body);
      const resUpdatedItem: Item = {
        id: itemArray.id,
        todo: updateItem.todo,
        limit: updateItem.limit,
        deletePassword: itemArray.deletePassword,
        createdAt: itemArray.createdAt,
        updatedAt: itemArray.updatedAt,
      };

      expect(itemArray).toMatchObject(resUpdatedItem);
      expect(res.status).toEqual(200);

      deleteItems.push(resUpdatedItem);
    });

    it('/item/:id/update (Put) IDが存在しない場合', async () => {
      const res = await request(app.getHttpServer())
        .put('/item/1000/update')
        .set('authorization', token)
        .send(updateItem);

      expect(res.status).toEqual(404);
      expect(res.body.message).toBe('item(id: 1000) not found');
    });

    it('/item/:id/update (Put) tokenなし', async () => {
      const res = await request(app.getHttpServer())
        .put(`/item/${testItem.id}/update`)
        .send(updateItem);

      expect(res.status).toEqual(403);
    });

    //DELETE
    //deleteパラメーターの定義
    const deleteItem: DeleteParameter = {
      deletePassword: '123456',
    };

    it('/item/:id/delete (Delete) IDが存在しない', async () => {
      const res = await request(app.getHttpServer())
        .delete('/item/1000/delete')
        .set('authorization', token)
        .send(deleteItem);

      expect(res.status).toEqual(404);
      expect(res.body.message).toBe('item(id: 1000) not found');
    });

    it('/item/:id/delete (Delete) パスワード間違い', async () => {
      const wrongPass: DeleteParameter = {
        deletePassword: 'abcdef',
      };

      const res = await request(app.getHttpServer())
        .delete(`/item/${testItem.id}/delete`)
        .set('authorization', token)
        .send(wrongPass);

      expect(res.status).toEqual(401);
      expect(res.body.message).toBe('Incorrect password');
    });

    it('/item/:id/delete (Delete) tokenなし', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/item/${testItem.id}/delete`)
        .send(deleteItem);

      expect(res.status).toEqual(403);
    });

    it('/item/:id/delete (Delete) 正常処理', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/item/${testItem.id}/delete`)
        .set('authorization', token)
        .send(deleteItem);

      expect(res.status).toEqual(200);
    });
  });
});
