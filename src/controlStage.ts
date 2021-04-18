import { drawPixels } from '@compare-react-state-management-solutions/draw-pixels';
import type { Dispatch } from 'redux';
import { drawPixelToPaint } from './helpers/drawPixelToPaint';
import {
  repaintRowAction,
  switchAlternativeAction,
  switchMultiplePixelsAction,
  switchPixelChoiceAction,
} from './State/actions';
import type { PixelChoice } from './State/StateInterface';
import { storeKeysMethods } from './State/storeKeysMethods';

const ONE_HUNDRED_PERCENT = 100;

export const getRepaintRow = (dispatch: Dispatch<any>) => (): void => {
  dispatch(repaintRowAction());
};

export const getSwitchRowGetter = (dispatch: Dispatch<any>) => (row: PixelChoice) => (): void => {
  dispatch(switchAlternativeAction(row));
};

export const getPaintRandomSinglePixel = (
  dispatch: Dispatch<any>,
  gridSize: number
) => (): void => {
  dispatch(switchPixelChoiceAction(drawPixelToPaint(gridSize ** 2)));
};

export const getPaintRandomPixels = (dispatch: Dispatch<any>, gridSize: number) => (
  percentage: number
): void => {
  const allPixelsNumber = gridSize ** 2;
  const pixelsNumberToPaint = (allPixelsNumber * percentage) / ONE_HUNDRED_PERCENT;

  dispatch(
    switchMultiplePixelsAction(
      drawPixels(allPixelsNumber, pixelsNumberToPaint).map(
        (p) =>
          storeKeysMethods.get(p) ??
          (() => {
            throw Error('It must be defined');
          })()
      )
    )
  );
};
