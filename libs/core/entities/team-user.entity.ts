import { Team, User } from './';

export class TeamUser {
  id: string;

  user: User;
  team: Team;

  joinedAt: Date;
  leavedAt?: Date;
}
