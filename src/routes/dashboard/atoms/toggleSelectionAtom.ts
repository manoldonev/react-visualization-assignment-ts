import produce from 'immer';
import { atom } from 'jotai';
import { selectedItemsAtom } from './selectedItemsAtom';
import { undoHistoryAtom } from './undoHistoryAtom';

// write-only action atom
export const toggleSelectionAtom = atom(null, (get, set, id: string) => {
  set(
    selectedItemsAtom,
    produce(
      get(selectedItemsAtom),
      (draft) => {
        const wasPreviouslySelected = draft.has(id);
        if (wasPreviouslySelected) {
          draft.delete(id);
        } else {
          draft.add(id);
        }
      },
      (patches, inversePatches) => {
        set(undoHistoryAtom, (draft) => {
          draft.undos.push({ patches, inversePatches });
          draft.redos.length = 0;
        });
      },
    ),
  );
});
