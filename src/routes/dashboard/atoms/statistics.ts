import { atom } from 'jotai';
import { selectedItemsAtom } from './selection';
import { shapesAtom } from './query';

export const actualValuesAtom = atom((get) => {
  const data = get(shapesAtom);
  const selectedItems = get(selectedItemsAtom);

  const totalCount = selectedItems.size;
  if (totalCount === 0) {
    return { actualOrangeValue: 0, actualSmallValue: 0 };
  }

  let smallCount = 0;
  let orangeCount = 0;

  data.forEach((item) => {
    if (!selectedItems.has(item.id)) {
      return;
    }

    smallCount += item.size === 'small' ? 1 : 0;
    orangeCount += item.color === 'orange' ? 1 : 0;
  });

  return { actualOrangeValue: orangeCount / totalCount, actualSmallValue: smallCount / totalCount };
});
