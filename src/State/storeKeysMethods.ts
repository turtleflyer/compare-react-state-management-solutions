import { ChoiceForPixel } from './StateInterface';

let storeKeys = [] as ChoiceForPixel[];
interface StoreKeysMethods {
  push: (newKey: ChoiceForPixel) => void;
  get: (i: number) => ChoiceForPixel | undefined;
  reset: () => void;
}
export const storeKeysMethods: StoreKeysMethods = {
  push(newKey) {
    storeKeys.push(newKey);
  },

  get(i) {
    return storeKeys[i];
  },

  reset() {
    storeKeys = [];
  },
};
