import produce from 'immer';
import { atom } from 'jotai';
import { selectedItemsAtom } from './selectedItemsAtom';
import { undoStoreAtom } from './undoStoreAtom';

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
      (_patches, inversePatches) => {
        set(undoStoreAtom, (draft) => {
          draft.push(...inversePatches);
        });
      },
    ),
  );
});
