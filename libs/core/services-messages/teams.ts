export const TeamsServiceMessages = {
  LIST: 'TEAM_LIST',
  GET: 'TEAM_GET',
  CREATE: 'TEAM_CREATE',
  DELETE: 'TEAM_DELETE',
} as const;
export type TeamsServiceMessages = typeof TeamsServiceMessages;
