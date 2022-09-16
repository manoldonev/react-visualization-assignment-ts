import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { selectionAtom } from '../atoms/selectionAtom';
import { useShapes } from '../query/useShapes';

export interface ActualValuesType {
  actualOrangeValue: number;
  actualSmallValue: number;
}

const useActualValuesMemo = (): ActualValuesType => {
  const { data } = useShapes();
  const [selection] = useAtom(selectionAtom);

  return useMemo(() => {
    const totalCount = selection.size;
    if (totalCount === 0) {
      return { actualOrangeValue: 0, actualSmallValue: 0 };
    }

    let smallCount = 0;
    let orangeCount = 0;

    (data ?? []).forEach((item) => {
      if (!selection.has(item.id)) {
        return;
      }

      smallCount += item.size === 'small' ? 1 : 0;
      orangeCount += item.color === 'orange' ? 1 : 0;
    });

    return { actualOrangeValue: orangeCount / totalCount, actualSmallValue: smallCount / totalCount };
  }, [data, selection]);
};

export { useActualValuesMemo };
