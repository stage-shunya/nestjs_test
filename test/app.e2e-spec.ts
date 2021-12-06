import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ItemModule } from 'src/item/item.module';
import { Item } from 'src/entities/item.entity';
import { CreateItemDTO } from 'src/models/item.dto';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const token = 'Bearer secret';
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot(),
        // TypeOrmModule.forRootAsync({
        //   useFactory: async () =>
        //     Object.assign(await getConnectionOptions(), {
        //       // name: 'testConnection',
        //       entities: [Item],
        //     }),
        // }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    return await app.init();
  });

  afterEach(async () => {
    return await app.close();
  });

  const changeType = (res: Item) => {
    res.limit = new Date(res.limit);
    res.createdAt = new Date(res.createdAt);
    res.updatedAt = new Date(res.updatedAt);
    return res;
  };

  it('/item (GET)', async () => {
    const testItem: Item = {
      id: 3,
      todo: '買い物に行く2',
      limit: new Date('2021-09-11 09:00:00'),
      deletePassword: '123456',
      createdAt: new Date('2021-12-02T02:57:24.686Z'),
      updatedAt: new Date('2021-12-02T02:57:24.686Z'),
    };
    // responseがstringになっている
    const res = await request(app.getHttpServer())
      .get('/item')
      .set('authorization', token);
    console.log(typeof res.body[0].limit);
    expect(res.status).toEqual(200);
    const testArray = changeType(res.body[0]);
    expect(testArray).toMatchObject(testItem);
  });

  it('/item (GET) tokenなし', async () => {
    const res = await request(app.getHttpServer()).get('/item');
    return expect(res.status).toEqual(403);
  });

  // it('/item/:id (GET) IDが存在する場合', async () => {
  //   return request(app.getHttpServer())
  //     .get('/item/2')
  //     .set('authorization', token)
  //     .expect(200);
  // });

  // it('/item/:id (GET) IDが存在しない場合', async () => {
  //   return request(app.getHttpServer())
  //     .get('/item/100')
  //     .set('authorization', token)
  //     .expect(404);
  // });

  // it('/item (Post)', async () => {
  //   const item: CreateItemDTO = {
  //     todo: '試しのテスト',
  //     limit: baseDate,
  //     deletePassword: '123456',
  //   };
  //   return request(app.getHttpServer())
  //     .post('/item')
  //     .set('authorization', token)
  //     .send(item)
  //     .expect(201);
  // });

  // it('/item/:id/update (Put)', async () => {});

  // it('/item/:id/delete (Delete)', async () => {});
});
