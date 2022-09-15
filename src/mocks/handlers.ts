import { rest } from 'msw';
import { shapes } from './seed';

export const handlers = [
  rest.get('https://mdonev-mock.com/shapes', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(shapes));
  }),
];
