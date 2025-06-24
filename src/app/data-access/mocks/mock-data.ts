import {WordItem} from '../api.models';

export const mockWord: WordItem = {
  id: 1,
  title: 'Example',
  transcription: 'example',
  sentence: 'This is an example.',
  translate: null,
  date_created: '2024-01-01 00:00:00',
  date_learned: null,
  status: 1,
  cover: {
    id: 101,
    name: 'cover_example.png',
    url: 'https://example.com/image.png'
  }
};
