export const synonymMap = new Map([
  ['愛因斯坦', 'einstein'],
  ['德國', 'germany'],
  ['出生', 'born'],
  ['出生於', 'born'],
  ['出生在', 'born'],
  ['出生地', 'born'],
  ['德意志', 'germany'],
  ['德意志帝國', 'germany'],
  ['德意志國', 'germany'],
  ['德國人', 'german'],
  ['usa', 'united states'],
  ['u.s.', 'united states'],
  ['u.s', 'united states'],
  ['united states of america', 'united states'],
  ['america', 'united states'],
  ['uk', 'united kingdom'],
  ['u.k.', 'united kingdom'],
  ['u.k', 'united kingdom'],
  ['england', 'united kingdom'],
  ['britain', 'united kingdom'],
  ['great britain', 'united kingdom'],
  ['gbr', 'united kingdom'],
  ['prc', 'china'],
  ['peoples republic of china', 'china'],
  ['p.r.c.', 'china'],
  ['russia', 'russian federation'],
  ['russian federation', 'russia'],
  ['south korea', 'republic of korea'],
  ['north korea', 'democratic people\'s republic of korea'],
  ['dprk', 'democratic people\'s republic of korea'],
  ['dr', 'doctor'],
  ['physician', 'doctor'],
  ['film', 'movie'],
  ['actor', 'actress'],
  ['actress', 'actor'],
  ['football', 'soccer'],
  ['nba', 'national basketball association'],
  ['german', 'germany'],
  ['germans', 'germany'],
  ['born', 'born'],
  ['birth', 'born'],
  ['不是', 'not'],
  ['沒有', 'not'],
]);

export const affirmativeWords = ['is', 'was', 'are', 'does', 'did', 'has', 'have'];
export const negativeWords = ['not', 'no', "isn't", "wasn't", "aren't", "doesn't", "didn't", "hasn't", "haven't", 'without', 'never', '不是', '沒有'];

export function normalizeToken(token) {
  const value = synonymMap.get(token);
  return value ?? token;
}

