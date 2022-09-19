import { applyPatches } from 'immer';
import { atom } from 'jotai';
import { selectedItemsAtom } from './selectedItemsAtom';
import { undoStoreAtom } from './undoStoreAtom';

// write-only action atom
export const undoAtom = atom(null, (get, set) => {
  set(undoStoreAtom, (draft) => {
    const entryToUndo = draft.pop();
    if (entryToUndo != null) {
      set(selectedItemsAtom, applyPatches(get(selectedItemsAtom), [entryToUndo]));
    }
  });
});
