import { applyPatches } from 'immer';
import { atom } from 'jotai';
import { undoHistoryAtom } from './undoHistoryAtom';
import { selectedItemsAtom } from './selectedItemsAtom';

// write-only action atom
export const redoAtom = atom(null, (get, set) => {
  set(undoHistoryAtom, (draft) => {
    const undoableEntry = draft.redos.pop();
    if (undoableEntry != null) {
      set(selectedItemsAtom, applyPatches(get(selectedItemsAtom), undoableEntry.patches));
      draft.undos.push(undoableEntry);
    }
  });
});
