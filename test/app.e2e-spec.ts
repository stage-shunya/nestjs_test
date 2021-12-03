import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ItemModule } from 'src/item/item.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ItemModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    return await app.init();
  });

  afterEach(async () => {
    return await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule, ],
//       // providers:
//     }).compile();

//     app = moduleFixture.createNestApplication();

//     return await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });

//   afterEach(async () => {
//     return await app.close();
//   });
// });

// describe('AppController (e2e)', () => {
//   // const baseDate = new Date();
//   // const baseItem: Item = {
//   //   id: 1,
//   //   todo: 'test',
//   //   limit: baseDate,
//   //   deletePassword: '123456',
//   //   createdAt: baseDate,
//   //   updatedAt: baseDate,
//   // };
//   const token = 'Bearer 間違いsecret';
//   let app: INestApplication;
//   // let service = { findAll: async () => [baseItem] };

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//       providers: [ItemService, ItemRepository],
//     })
//       // .overrideProvider(ItemService)
//       // .useValue(service)
//       .compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   afterEach(async () => {
//     await app.close();
//   });

//   it('/ (GET)', () => {
//     // requestの際にheaderにvalue（blueAPIの場合token）を定義できるはず
//     return request(app.getHttpServer())
//       .get('/item')
//       .set('Authorization', token)
//       .expect(200);
//     // .expect(service.findAll);
//   });
// });
