import type { ChoiceForPixelAtom } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';

export function drawPixelToPaint(totalNumber: number): ChoiceForPixelAtom {
  const randomIndex = Math.floor(Math.random() * totalNumber);
  const atomToSet = storeAtomsMethods.get(randomIndex);
  if (!atomToSet) {
    throw Error('It should be defined');
  }

  return atomToSet;
}
