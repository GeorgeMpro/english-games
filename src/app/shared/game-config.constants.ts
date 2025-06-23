import {WordGroup} from '../data-access/api.models';

export const DEFAULT_FIRST_STAGE = 0;
export const DEFAULT_STAGE_COUNT = 3;
export const DEFAULT_LAST_STAGE = DEFAULT_STAGE_COUNT - 1;
export const DEFAULT_ITEMS_PER_STAGE = 6;
export const DEFAULT_TOTAL_ITEMS = DEFAULT_STAGE_COUNT * DEFAULT_ITEMS_PER_STAGE;
export const MATCH_RESET_TIMEOUT_DELAY = 300;


//todo move to error
export const ERROR_CATEGORIES_MESSAGE = 'Could not load categories.';

export const sportsGroup: WordGroup = {
  "id": 20,
  "title": "Sports and Fitness",
  "translate": "Sports and Fitness",
  "status": 1,
  "count": 47,
  "cover": {
    "id": 87266,
    "name": "cover_68395112c57c2.png",
    "url": "https://cdn.see.guru\word-groups/2025/05/17485867708155.png"
  }
};
export const animalsGroup: WordGroup = {
  id: 8,
  title: 'Animals',
  translate: 'Animals',
  status: 1,
  count: 37,
  cover: {
    id: 87254,
    name: 'cover_68394f16824f5.png',
    url: 'https://cdn.see.guru/word-groups/2025/05/17485862625406.png'
  }
};

export const colorsGroup = {
  id: 10,
  title: 'Colors',
  translate: 'Colors',
  status: 1,
  count: 36,
  cover: {
    id: 87256,
    name: 'cover_68394f6a7438c.png',
    url: 'https://cdn.see.guru/word-groups/2025/05/17485863464886.png'
  }
};
// Todo remove when done dummy categories functionality
// export const DEFAULT_CATEGORY = 'Animals';
export const DEFAULT_CATEGORY: WordGroup = animalsGroup;

export const DEFAULT_CATEGORIES = [animalsGroup, colorsGroup];
