import { ChoiceForPixel } from './StateInterface';

const storeKeys = [] as ChoiceForPixel[];
let curIndex = 0;
interface StoreKeysMethods {
  push: (newKey: ChoiceForPixel) => void;
  get: (i: number) => ChoiceForPixel | undefined;
  getNext: () => ChoiceForPixel | undefined;
  resetIndex: (i?: number) => void;
}
export const storeKeysMethods: StoreKeysMethods = {
  push(newKey) {
    storeKeys.push(newKey);
  },
  get(i) {
    return storeKeys[i];
  },
  getNext() {
    return storeKeys[curIndex++];
  },
  resetIndex(i = 0) {
    curIndex = i;
  },
};
