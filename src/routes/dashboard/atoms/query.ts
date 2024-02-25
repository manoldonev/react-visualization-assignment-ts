import axios from 'axios';
import { atomWithQuery } from 'jotai-tanstack-query';
import type { RectShape } from '../../../models/shape';
import { shapeKeys } from '../../../queryKeyFactory';

export const shapesAtom = atomWithQuery(() => ({
  queryKey: [shapeKeys.all],
  queryFn: async () => {
    const res = await axios.get<RectShape[]>('https://mdonev-mock.com/shapes');
    return res.data;
  },
  staleTime: 5000,
  throwOnError: true,
}));
