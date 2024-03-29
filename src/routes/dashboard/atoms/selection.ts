import { atom, useAtomValue, useSetAtom } from 'jotai';
import type { Patch } from 'immer';
import { applyPatches, produce } from 'immer';
import { atomWithImmer } from 'jotai-immer';

// TODO: jotai-in-big-project best practices still not set in stone (see https://github.com/pmndrs/jotai/discussions/896)
// TODO: consider whether it makes sense to define "model" and "action" atoms in separate files (e.g. selection.model.ts and selection.controller.ts)
// NOTE: currently "model" atoms are defined on top and "action" atoms at the bottom but generally we are not exporting "action" atoms themselves but exposing their functionality via a "controller" custom hook

interface UndoHistory {
  undos: Undoable[];
  redos: Undoable[];
}

interface Undoable {
  inversePatches: Patch[]; // undo
  patches: Patch[]; // redo
}

const undoHistoryAtom = atomWithImmer<UndoHistory>({ undos: [], redos: [] });
const canUndoAtom = atom((get) => get(undoHistoryAtom).undos.length > 0);
const canRedoAtom = atom((get) => get(undoHistoryAtom).redos.length > 0);
const canResetAtom = atom((get) => {
  const history = get(undoHistoryAtom);
  return history.undos.length > 0 || history.redos.length > 0;
});

export interface UndoHistoryStatus {
  canUndo: boolean;
  canRedo: boolean;
  canReset: boolean;
}

export const useUndoHistoryStatus = (): UndoHistoryStatus => {
  return {
    canUndo: useAtomValue(canUndoAtom),
    canRedo: useAtomValue(canRedoAtom),
    canReset: useAtomValue(canResetAtom),
  };
};

export const selectedItemsAtom = atom(new Set<string>());

const toggleSelectionAtom = atom(null, (get, set, id: string) => {
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

const undoAtom = atom(null, (get, set) => {
  set(undoHistoryAtom, (draft) => {
    const undoableEntry = draft.undos.pop();
    if (undoableEntry != null) {
      set(selectedItemsAtom, applyPatches(get(selectedItemsAtom), undoableEntry.inversePatches));
      draft.redos.push(undoableEntry);
    }
  });
});

const redoAtom = atom(null, (get, set) => {
  set(undoHistoryAtom, (draft) => {
    const undoableEntry = draft.redos.pop();
    if (undoableEntry != null) {
      set(selectedItemsAtom, applyPatches(get(selectedItemsAtom), undoableEntry.patches));
      draft.undos.push(undoableEntry);
    }
  });
});

const resetAtom = atom(null, (_get, set) => {
  set(undoHistoryAtom, (draft) => {
    draft.undos.length = 0;
    draft.redos.length = 0;
  });

  set(selectedItemsAtom, new Set());
});

export interface SelectController {
  toggle: (id: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

export const useSelectController = (): SelectController => {
  return {
    toggle: useSetAtom(toggleSelectionAtom),
    undo: useSetAtom(undoAtom),
    redo: useSetAtom(redoAtom),
    reset: useSetAtom(resetAtom),
  };
};
