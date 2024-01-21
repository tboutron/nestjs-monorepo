export const UsersServiceMessages = {
  LIST: 'USER_LIST',
  GET: 'USER_GET',
  GET_BY_NAME: 'USER_GET_BY_NAME',
  CREATE: 'USER_CREATE',
  DELETE: 'USER_DELETE',
} as const;
export type UsersServiceMessages = typeof UsersServiceMessages;
