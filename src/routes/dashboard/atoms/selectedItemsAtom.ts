import { atom } from 'jotai';

export const selectedItemsAtom = atom(new Set<string>());
