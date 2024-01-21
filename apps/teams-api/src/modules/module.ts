import { Module } from '@nestjs/common';
import { TeamUsersModule } from 'apps/teams-api/src/modules/teamUsers/module';
import { CatsDatabaseModule, TeamDatabaseModule } from 'libs/modules';
import { RedisModule } from 'libs/modules/cache/module';
import { GlobalModule } from 'libs/modules/global/module';

import { CatsModule } from './cats/module';
import { HealthModule } from './health/module';
import { TeamsModule } from './teams/module';

@Module({
  imports: [
    HealthModule,
    GlobalModule,
    CatsModule,
    TeamsModule,
    TeamUsersModule,
    TeamDatabaseModule,
    CatsDatabaseModule,
    RedisModule,
  ],
})
export class MainModule {}
