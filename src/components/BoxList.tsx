import { BoxListItem } from './BoxListItem';
import { getShapes } from '../models/shape';

const BoxList = (): JSX.Element => {
  const shapes = getShapes();

  return (
    <ul className="flex max-w-5xl flex-wrap gap-x-2 gap-y-3">
      {shapes.map((item) => (
        <BoxListItem key={item.id} data={item} />
      ))}
    </ul>
  );
};

export { BoxList };
