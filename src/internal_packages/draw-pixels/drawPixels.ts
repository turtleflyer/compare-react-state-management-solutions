export function drawPixels(totalNumber: number, numberToDraw: number): number[] {
  if (totalNumber < numberToDraw) {
    throw Error('Number to draw must be less than total');
  }

  const [flagToWrite, numberToLeave] =
    numberToDraw < totalNumber / 2 ? [true, totalNumber - numberToDraw] : [false, numberToDraw];
  const pixels = Array(totalNumber)
    .fill(null)
    .map((_, i) => i);
  const pickedPixels: number[] = [];

  while (pixels.length > numberToLeave) {
    const pickPixel = Math.floor(Math.random() * pixels.length);

    if (flagToWrite) {
      pickedPixels.push(pixels[pickPixel]);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    pickPixel < pixels.length - 1 ? (pixels[pickPixel] = pixels.pop()!) : pixels.pop();
  }

  return flagToWrite ? pickedPixels : pixels;
}
