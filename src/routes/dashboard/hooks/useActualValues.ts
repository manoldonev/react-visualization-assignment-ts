import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { selectedItemsAtom } from '../atoms/selectedItemsAtom';
import { useShapes } from '../query/useShapes';

export interface ActualValuesType {
  actualOrangeValue: number;
  actualSmallValue: number;
}

const useActualValues = (): ActualValuesType => {
  const { data } = useShapes();
  const [selectedItems] = useAtom(selectedItemsAtom);

  return useMemo(() => {
    const totalCount = selectedItems.size;
    if (totalCount === 0) {
      return { actualOrangeValue: 0, actualSmallValue: 0 };
    }

    let smallCount = 0;
    let orangeCount = 0;

    (data ?? []).forEach((item) => {
      if (!selectedItems.has(item.id)) {
        return;
      }

      smallCount += item.size === 'small' ? 1 : 0;
      orangeCount += item.color === 'orange' ? 1 : 0;
    });

    return { actualOrangeValue: orangeCount / totalCount, actualSmallValue: smallCount / totalCount };
  }, [data, selectedItems]);
};

export { useActualValues };
