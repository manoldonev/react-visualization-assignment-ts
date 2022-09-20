import { TargetStatistic } from '../../components';
import { BoxChart } from './BoxChart';
import { Header } from './Header';
import { useActualValues } from './hooks';
import { useShapes } from './query/useShapes';
import { RedoButton } from './RedoButton';
import { ResetButton } from './ResetButton';
import { UndoButton } from './UndoButton';

const targetValue = 0.6;

const Dashboard = (): JSX.Element => {
  const { data: shapes, isLoading, isEmpty } = useShapes();
  const { actualOrangeValue, actualSmallValue } = useActualValues();

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {isLoading && <span className="p-4">Loading...</span>}
        {isEmpty && <span className="p-4">No data available</span>}

        {shapes != null && shapes.length > 0 && (
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
