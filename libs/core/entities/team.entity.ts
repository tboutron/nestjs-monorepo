import { TeamUser } from './team-user.entity';

export class Team {
  id: string;

  name: string;
  members: Array<TeamUser>;
  createdAt: Date;
}
