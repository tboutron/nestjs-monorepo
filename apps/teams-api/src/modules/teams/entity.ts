import { TeamUser } from 'libs/core/entities';

import { Team } from './schema';

export class TeamEntity implements Team {
  id?: string;

  name: string;

  members: Array<TeamUser>;

  parent?: Team;

  createdAt: Date;
}
