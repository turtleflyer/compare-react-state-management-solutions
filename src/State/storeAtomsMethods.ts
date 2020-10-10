import type { ChoiceForPixelAtom } from './StateInterface';

const storeAtoms = [] as ChoiceForPixelAtom[];
let curIndex = 0;
interface StoreAtomsMethods {
  push: (newAtom: ChoiceForPixelAtom) => void;
  get: (i: number) => ChoiceForPixelAtom;
  getNext: () => ChoiceForPixelAtom;
  resetIndex: (i?: number) => void;
}
export const storeAtomsMethods: StoreAtomsMethods = {
  push(newAtom) {
    storeAtoms.push(newAtom);
  },
  get(i) {
    return storeAtoms[i];
  },
  getNext() {
    return storeAtoms[curIndex++];
  },
  resetIndex(i = 0) {
    curIndex = i;
  },
};
