import { useAtomValue } from 'jotai';
import { BoxChart } from './BoxChart';
import { Header } from './Header';
import { shapesAtom } from './atoms/query';
import { TargetsPanel } from './TargetsPanel';
import { CommandBar } from './CommandBar';

const Dashboard = (): JSX.Element => {
  const { data: shapes } = useAtomValue(shapesAtom);
  const isEmpty = shapes?.length === 0;

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {isEmpty && <span className="p-4">No data available</span>}

        {!isEmpty && (
          <div className="mx-auto flex w-fit flex-col">
            <div className="sticky top-0 flex flex-wrap justify-center bg-white py-3 px-4">
              <TargetsPanel className="flex flex-wrap justify-center" />
              <CommandBar className="flex gap-3" />
            </div>

            <BoxChart className="p-4" data={shapes} />
          </div>
        )}
      </main>
    </div>
  );
};

export { Dashboard };
