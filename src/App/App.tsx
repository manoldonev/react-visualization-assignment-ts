import { BoxList } from '../components/BoxList';
import { getShapes } from '../models/shape';

const App = (): JSX.Element => {
  const shapes = getShapes();

  return (
    <main>
      <h1 className="m-4">Visualization assignment</h1>
      <BoxList items={shapes} className="m-4" />
    </main>
  );
};

export { App };
