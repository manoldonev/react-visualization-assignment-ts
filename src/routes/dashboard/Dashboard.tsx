import { useAtomValue } from 'jotai';
import { TargetStatistic } from '../../components';
import { BoxChart } from './BoxChart';
import { Header } from './Header';
import { actualValuesAtom } from './atoms/statistics';
import { shapesAtom } from './atoms/query';
import { RedoButton } from './RedoButton';
import { ResetButton } from './ResetButton';
import { UndoButton } from './UndoButton';

const targetValue = 0.6;

const Dashboard = (): JSX.Element => {
  const shapes = useAtomValue(shapesAtom);
  const isEmpty = shapes.length === 0;

  const { actualOrangeValue, actualSmallValue } = useAtomValue(actualValuesAtom);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {isEmpty && <span className="p-4">No data available</span>}

        {!isEmpty && (
          <div className="mx-auto flex w-fit flex-col">
            <div className="sticky top-0 flex flex-col justify-center bg-white py-3 px-4 lg:flex-row lg:items-center">
              <TargetStatistic
                data-testid="small-target"
                targetLabel="Small Target"
                target={targetValue}
                actual={actualSmallValue}
              />
              <TargetStatistic
                data-testid="orange-target"
                targetLabel="Orange Target"
                target={targetValue}
                actual={actualOrangeValue}
              />
              <div className="flex gap-3">
                <UndoButton />
                <RedoButton />
                <ResetButton />
              </div>
            </div>

            <BoxChart className="p-4" data={shapes} />
          </div>
        )}
      </main>
    </div>
  );
};

export { Dashboard };
