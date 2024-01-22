import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TeamEntity } from 'apps/teams-api/src/modules/teams/entity';
import * as request from 'supertest';

import { ITeamsRepository, ITeamsService } from '../adapter';
import { TeamsController } from '../controller';
import { TeamsRepository } from '../repository';
import { Team } from '../schema';
import { TeamsService } from '../service';

const getFakeTeam = (): TeamEntity => ({
  id: 'mockId',
  name: 'mockName',
  members: [],
  createdAt: new Date(),
});
const getFakeTeamList = (): TeamEntity[] => [
  {
    id: 'mockId1',
    name: 'mockName1',
    members: [],
    createdAt: new Date(),
  },
  {
    id: 'mockId2',
    name: 'mockName2',
    members: [],
    createdAt: new Date(),
  },
];

describe('TeamsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: ITeamsService,
          useClass: TeamsService,
        },
        {
          provide: ITeamsRepository,
          useClass: TeamsRepository,
        },
        {
          provide: ITeamsRepository,
          useClass: TeamsRepository,
        },
        {
          provide: getModelToken(Team.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findOne: jest.fn().mockReturnValue({
              populate: () => ({
                exec: jest.fn(getFakeTeam),
              }),
            }),
            find: jest.fn().mockReturnValue({
              populate: () => ({
                exec: jest.fn(getFakeTeamList),
              }),
            }),
            findById: jest.fn().mockReturnValue({
              populate: () => ({
                exec: jest.fn(getFakeTeamList),
              }),
            }),
            update: jest.fn(),
            create: jest.fn(getFakeTeamList),
            findByIdAndDelete: jest.fn(getFakeTeamList),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/teams (GET)', () => {
    return request(app.getHttpServer()).get('/teams').expect(200);
  });

  it('/teams/:id (GET)', () => {
    return request(app.getHttpServer()).get('/teams/1').expect(200);
  });

  it('/teams (POST)', () => {
    return request(app.getHttpServer()).post('/teams').send({ name: 'Test Team' }).expect(201);
  });

  it('/teams/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/teams/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
