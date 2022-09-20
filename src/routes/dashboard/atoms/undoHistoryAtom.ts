import type { Patch } from 'immer';
import { atomWithImmer } from 'jotai/immer';

export interface UndoHistory {
  undos: Undoable[];
  redos: Undoable[];
}

export interface Undoable {
  inversePatches: Patch[]; // undo
  patches: Patch[]; // redo
}

export const undoHistoryAtom = atomWithImmer<UndoHistory>({ undos: [], redos: [] });
