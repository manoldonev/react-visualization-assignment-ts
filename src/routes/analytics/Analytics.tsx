import { useAtom } from 'jotai';
import { selectionAtom } from '../../atoms/selectionAtom';
import { BoxList, SmallTargetStatistic } from '../../components';
import { useShapes } from './query/useShapes';

const targetValue = 0.6;

const Analytics = (): JSX.Element => {
  const { data: shapes, isLoading, isEmpty } = useShapes();
  const [selection] = useAtom(selectionAtom);

  const totalCount = selection.size;
  let smallCount = 0;
  let actualValue = 0;
  if (totalCount > 0) {
    smallCount = (shapes ?? []).filter((shape) => selection.has(shape.id) && shape.size === 'small').length;

    actualValue = smallCount / totalCount;
  }

  return (
    <main className="min-h-screen">
      <h1 className="m-4">Visualization Assignment</h1>

      {isLoading && <span className="p-4">Loading...</span>}
      {isEmpty && <span className="p-4">No data available</span>}

      {shapes != null && shapes.length > 0 && (
        <div className="mx-auto flex w-fit flex-col p-4">
          <SmallTargetStatistic target={targetValue} actual={actualValue} className="mx-auto" />
          <BoxList data={shapes} />
        </div>
      )}
    </main>
  );
};

export { Analytics };
