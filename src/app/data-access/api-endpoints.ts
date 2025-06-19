export const API_ENDPOINTS = {
  WORD_GROUPS: '/words/groups',
  ALL_WORDS_IN_GROUP: (groupId: number) => `/words/by-group/${groupId}/all`
}
