import { HttpResponse, http } from 'msw';

import { shapes } from './seed';

export const handlers = [
  http.get('https://mdonev-mock.com/shapes', () => {
    return HttpResponse.json(shapes);
  }),
];
