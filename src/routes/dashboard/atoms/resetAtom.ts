import { atom } from 'jotai';
import { undoHistoryAtom } from './undoHistoryAtom';
import { selectedItemsAtom } from './selectedItemsAtom';

// write-only action atom
export const resetAtom = atom(null, (_get, set) => {
  set(undoHistoryAtom, (draft) => {
    draft.undos.length = 0;
    draft.redos.length = 0;
  });

  set(selectedItemsAtom, new Set());
});
