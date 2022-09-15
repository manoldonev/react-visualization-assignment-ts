import { useAtom } from 'jotai';
import { selectionAtom } from '../../../atoms/selectionAtom';
import { useShapes } from '../query/useShapes';

interface ActualValuesType {
  actualOrangeValue: number;
  actualSmallValue: number;
}

const useActualValuesComputation = (): ActualValuesType => {
  const { data: shapes } = useShapes();
  const [selection] = useAtom(selectionAtom);
  const totalCount = selection.size;
  if (totalCount === 0) {
    return { actualOrangeValue: 0, actualSmallValue: 0 };
  }

  let smallCount = 0;
  let orangeCount = 0;

  (shapes ?? []).forEach((shape) => {
    if (!selection.has(shape.id)) {
      return;
    }

    smallCount += shape.size === 'small' ? 1 : 0;
    orangeCount += shape.color === 'orange' ? 1 : 0;
  });

  return { actualOrangeValue: orangeCount / totalCount, actualSmallValue: smallCount / totalCount };
};

export { useActualValuesComputation };
