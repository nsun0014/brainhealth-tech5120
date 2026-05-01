export const PROJECT_AUTH_KEY = 'bb_project_auth'

export function hasProjectAccess() {
  return sessionStorage.getItem(PROJECT_AUTH_KEY) === 'true'
}
