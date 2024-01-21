import { Team, User } from './';

export class TeamUser {
  user: User;
  team: Team;

  joinedAt: Date;
  leavedAt?: Date;
}
