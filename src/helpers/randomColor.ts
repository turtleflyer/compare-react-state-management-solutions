import type { ColorValue } from '../State/StateInterface';

const range = 0xffffff;
export function getRandomColor(color: ColorValue): ColorValue {
  let calcColor = Math.round(parseInt(color.slice(1), 16) + range * (Math.random() / 4 + 1 / 2));
  calcColor = calcColor > range ? calcColor - range : calcColor;

  return `#${calcColor.toString(16).padStart(6, '0')}`;
}
