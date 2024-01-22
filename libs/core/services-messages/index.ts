import { TeamsServiceMessages } from 'libs/core/services-messages/teams';
import { UsersServiceMessages } from 'libs/core/services-messages/users';

export { TeamsServiceMessages } from 'libs/core/services-messages/teams';
export { UsersServiceMessages } from 'libs/core/services-messages/users';

type Values<T> = T[keyof T];
type AssertFalse<T extends false> = T;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AllServiceMessagesAreUnique = AssertFalse<Values<UsersServiceMessages> & Values<TeamsServiceMessages>>;
