import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { RectShape } from '../../../models/shape';
import { shapeKeys } from '../../../queryKeyFactory';

const useShapes = (): { data: RectShape[] | undefined; isLoading: boolean; isEmpty: boolean } => {
  const { isLoading, data } = useQuery<RectShape[]>([shapeKeys.all], async () => {
    const res = await axios.get<RectShape[]>('https://mdonev-mock.com/shapes');
    return res.data;
  });

  const isEmpty = !isLoading && (data == null || data.length === 0);

  return { data, isLoading, isEmpty };
};

export { useShapes };
