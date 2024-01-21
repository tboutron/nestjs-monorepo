import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalModule } from 'libs/modules/global/module';
import * as request from 'supertest';

import { ICatsRepository } from '../adapter';
import { CatsController } from '../controller';
import { CatsEntity } from '../entity';
import { CatsRepository } from '../repository';
import { Cats } from '../schema';

const getMockCats = (): CatsEntity => ({ id: 'mockId', name: 'mockName', age: 42, breed: 'mockBreed' });

describe('CatsController (e2e)', () => {
  let app: INestApplication;

  // if you want to mock model functions
  // let model: Model<Cats>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: ICatsRepository,
          useClass: CatsRepository,
        },
        {
          provide: getModelToken(Cats.name),
          useValue: {
            new: jest.fn(getMockCats),
            constructor: jest.fn(getMockCats),
            find: jest.fn(),
            findOne: jest.fn(getMockCats),
            update: jest.fn(),
            create: jest.fn(getMockCats),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
      imports: [GlobalModule],
    }).compile();

    // mock model functions
    // model = module.get(getModelToken(Cats.name));

    app = module.createNestApplication();
    await app.init();
  });

  describe('/cats (POST)', () => {
    it(`should save successfully`, async () => {
      const dummy: Cats = new CatsEntity();
      return request(app.getHttpServer()).post('/cats').send(dummy).expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
