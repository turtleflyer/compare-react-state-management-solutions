import { drawPixels } from '@compare-react-state-management-solutions/draw-pixels';
import { useDispatch, useSelector } from 'react-redux';
import { drawPixelToPaint } from './helpers/drawPixelToPaint';
import {
  disableRowAction,
  enableRowAction,
  repaintRowAction,
  switchMultiplePixelsAction,
  switchPixelChoiceAction,
} from './State/actions';
import { createSelector, getGridSize } from './State/selectors';
import { alternativeForChoiceKeys } from './State/State';
import { storeKeysMethods } from './State/storeKeysMethods';

const ONE_HUNDRED_PERCENT = 100;

export const useRepaintRow = (): (() => void) => {
  const dispatch = useDispatch();

  return () => {
    dispatch(repaintRowAction());
  };
};

export const useDisableRows = (): (() => void) | null => {
  const dispatch = useDispatch();

  const possibleColor = useSelector(createSelector(alternativeForChoiceKeys[1]));

  return possibleColor === null
    ? null
    : () => {
        dispatch(disableRowAction());
      };
};

export const useEnableRows = (): (() => void) | null => {
  const dispatch = useDispatch();

  const possibleColor = useSelector(createSelector(alternativeForChoiceKeys[1]));

  return possibleColor === null
    ? () => {
        dispatch(enableRowAction());
      }
    : null;
};

export const usePaintRandomSinglePixel = (): (() => void) => {
  const dispatch = useDispatch();
  const gridSize = useSelector(getGridSize);

  return () => {
    dispatch(switchPixelChoiceAction(drawPixelToPaint(gridSize ** 2)));
  };
};

export const usePaintRandomPixels = (): ((percentage: number) => void) => {
  const dispatch = useDispatch();
  const gridSize = useSelector(getGridSize);

  return (percentage: number) => {
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
};

export const useGridSize = (): number => useSelector(getGridSize);
