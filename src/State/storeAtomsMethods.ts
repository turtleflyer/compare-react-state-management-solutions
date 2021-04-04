import type { ChoiceForPixelAtom } from './StateInterface';

let storeAtoms = [] as ChoiceForPixelAtom[];

interface StoreAtomsMethods {
  push: (newAtom: ChoiceForPixelAtom) => void;
  get: (i: number) => ChoiceForPixelAtom | undefined;
  reset: () => void;
}

export const storeAtomsMethods: StoreAtomsMethods = {
  push(newAtom) {
    storeAtoms.push(newAtom);
  },

  get(i) {
    return storeAtoms[i];
  },

  reset() {
    storeAtoms = [];
  },
};
