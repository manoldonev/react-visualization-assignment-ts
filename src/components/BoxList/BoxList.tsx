import type { RectShape } from '../../models/shape';
import { BoxListItem } from './BoxListItem';

const BoxList = ({ data }: { data: RectShape[] | undefined }): JSX.Element => {
  return (
    <ul className="flex max-w-5xl flex-wrap gap-x-2 gap-y-3">
      {data?.map((item) => (
        <BoxListItem key={item.id} data={item} />
      ))}
    </ul>
  );
};

export { BoxList };
