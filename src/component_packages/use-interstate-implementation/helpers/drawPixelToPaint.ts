import type { ChoiceForPixel } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';

export function drawPixelToPaint(totalNumber: number): ChoiceForPixel {
  const randomIndex = Math.floor(Math.random() * totalNumber);
  const pixelKey = storeKeysMethods.get(randomIndex);

  if (!pixelKey) {
    throw Error('It should be defined');
  }

  return pixelKey;
}
