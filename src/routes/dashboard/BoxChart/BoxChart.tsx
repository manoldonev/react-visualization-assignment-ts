import { useAtom } from 'jotai';
import type { RectShape } from '../../../models/shape';
import { BoxButton } from '../../../components/BoxButton';
import { mementoLogAtom, selectionAtom } from '../atoms';

const BoxChart = ({ data }: { data: RectShape[] | undefined }): JSX.Element => {
  const [selection, setSelection] = useAtom(selectionAtom);
  const [, setMementoLog] = useAtom(mementoLogAtom);

  const handleSelection = (id: string): void => {
    const wasPreviouslySelected = selection.has(id);

    setMementoLog((draft) => {
      draft.push({ selection });
    });

    setSelection((draft) => {
      if (wasPreviouslySelected) {
        draft.delete(id);
      } else {
        draft.add(id);
      }
    });
  };

  return (
    <ul className="flex max-w-5xl flex-wrap gap-x-2 gap-y-3">
      {data?.map((item) => (
        <li key={item.id}>
          <BoxButton data={item} isChecked={selection.has(item.id)} onClick={() => handleSelection(item.id)} />
        </li>
      ))}
    </ul>
  );
};

export { BoxChart };
