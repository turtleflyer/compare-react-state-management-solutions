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
import { getGridSize } from './State/selectors';
import { storeKeysMethods } from './State/storeKeysMethods';

const ONE_HUNDRED_PERCENT = 100;

export const useRepaintRow = (): (() => void) => {
  const dispatch = useDispatch();

  return () => {
    dispatch(repaintRowAction());
  };
};

export const useDisableRow = (): (() => void) => {
  const dispatch = useDispatch();

  return () => {
    dispatch(disableRowAction());
  };
};

export const useEnableRow = (): (() => void) => {
  const dispatch = useDispatch();

  return () => {
    dispatch(enableRowAction());
  };
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
