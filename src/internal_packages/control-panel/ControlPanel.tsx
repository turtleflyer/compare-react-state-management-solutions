import {
  useBlockingState,
  useProvideModuleNameAndRef,
  useSetStateToBlock,
} from '@compare-react-state-management-solutions/performance-info';
import type { WrapMetricConsumerProps } from '@compare-react-state-management-solutions/use-perf-metric';
import { usePerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
import type { CSSProperties, FC, ReactElement } from 'react';
import React, { cloneElement, useEffect, useState } from 'react';
import type { ChooseGridProps } from './ChooseGrid';
import { ChooseGrid } from './ChooseGrid';
import { DisableOrEnableRowsButton, DisableOrEnableRowsHook } from './DisableOrEnableRowsButton';
import type { HookOrNotProp } from './HookOrNotProp';
import type { PaintRandomPixelsProps } from './MassivePaintButton';
import { MassivePaintButton } from './MassivePaintButton';
import { MeasuredControlButton } from './MeasuredControlButton';

const pixelsStageStyle: CSSProperties = { flexGrow: 1 };
const controlPanelContainerStyle: CSSProperties = { margin: '10px 0 0 5px' };
const headlineStyle: CSSProperties = { margin: '0 0 10px' };
const blockedStyle: CSSProperties = { filter: 'blur(0.7px)' };
const unblockedStyle: CSSProperties = {};
const lineStyle: CSSProperties = { height: 0, borderTop: '0.5px solid gray', margin: '15px 0' };

type ControlPanelProps = {
  headline: string;
  useDisableRows: DisableOrEnableRowsHook;
  useEnableRows: DisableOrEnableRowsHook;
  children: ReactElement;
} & HookOrNotProp<'repaintRow'> &
  HookOrNotProp<'paintRandomSinglePixel'> &
  PaintRandomPixelsProps &
  ChooseGridProps;

interface UseBodyReturn {
  blockingContainerStyle: CSSProperties;

  pixelStageWithPropsAdded: ReactElement | null;

  WrapMetricConsumerToBuildGrid: FC<WrapMetricConsumerProps>;

  WrapMetricConsumerToUnmountGrid: FC<WrapMetricConsumerProps>;

  onGridChosenEnhanced: (arg: { gridSize: number }) => void;

  pixelStageContainerRef: (refElement: HTMLDivElement | null) => void;
}

const warnToChangeGrid = (): never => {
  throw Error(
    '(ControlPanel) toChangeGrid must hold the function that refresh the App and set new grid size'
  );
};

const createUseBody = ({
  moduleName,
  onGridChosen,
}: {
  moduleName: string;
  onGridChosen: (arg: { gridSize: number }) => void;
}): {
  useBody: (arg: { gridSize: number; pixelsStage: ReactElement }) => UseBodyReturn;
} => {
  type LifePoint<K extends LifePointType = never, L = [K] extends [never] ? {} : { type: K }> =
    | L &
        (
          | {
              type: 'want to mount pixel stage';
              callback: () => LifePoint<
                'want to mount pixel stage' | 'ready to mount pixel stage'
              > | null;
            }
          | {
              type: 'ready to mount pixel stage';
              callback: () => LifePoint<'ready to mount pixel stage' | 'stage mounted'> | null;
            }
          | {
              type: 'stage mounted';
              callback: (() => LifePoint<'stage mounted'>) | null;
            }
          | {
              type: 'want to unmount pixel stage';
              callback: () => LifePoint<
                'want to unmount pixel stage' | 'ready to unmount pixel stage'
              > | null;
            }
          | {
              type: 'ready to unmount pixel stage';
              callback: () => LifePoint<'ready to unmount pixel stage' | 'stage unmounted'> | null;
            }
          | {
              type: 'stage unmounted';
              callback: () => LifePoint<'stage unmounted' | 'want to mount pixel stage'> | null;
            }
        );

  type LifePointType =
    | 'want to mount pixel stage'
    | 'ready to mount pixel stage'
    | 'stage mounted'
    | 'want to unmount pixel stage'
    | 'ready to unmount pixel stage'
    | 'stage unmounted';

  type LifePointCallback<T extends LifePointType> = LifePoint<T>['callback'] & FunctionLike;

  let wantToMountCallback: LifePointCallback<'want to mount pixel stage'>;
  let wantToMountCallbackFirstRun: LifePointCallback<'want to mount pixel stage'>;
  let readyToMountCallback: LifePointCallback<'ready to mount pixel stage'>;
  let readyToMountCallbackFirstRun: LifePointCallback<'ready to mount pixel stage'>;
  let stageMountedCallback: LifePointCallback<'stage mounted'>;
  let wantToUnmountCallback: LifePointCallback<'want to unmount pixel stage'>;
  let wantToUnmountCallbackFirstRun: LifePointCallback<'want to unmount pixel stage'>;
  let readyToUnmountCallback: LifePointCallback<'ready to unmount pixel stage'>;
  let readyToUnmountCallbackFirstRun: LifePointCallback<'ready to unmount pixel stage'>;
  let stageUnmountedCallback: LifePointCallback<'stage unmounted'>;
  let stageUnmountedCallbackFirstRun: LifePointCallback<'stage unmounted'>;

  let pixelStageContainerRef: (refElement: HTMLDivElement | null) => void;

  const useBody = ({
    gridSize,
    pixelsStage,
  }: {
    gridSize: number;
    pixelsStage: ReactElement;
  }): UseBodyReturn => {
    const blockingState = useBlockingState();

    const blockingContainerStyle: CSSProperties = blockingState.toBlock
      ? blockedStyle
      : unblockedStyle;

    const [containerHeight, setContainerHeight] = useState<number | null>(null);
    const [pixelStageWithPropsAdded, setPixelStage] = useState<ReactElement | null>(null);
    const setStateToBlock = useSetStateToBlock();

    const {
      WrapMetricConsumer: WrapMetricConsumerToBuildGrid,
      measurePerformance: measurePerformanceToBuildGrid,
    } = usePerfMetric();

    const {
      WrapMetricConsumer: WrapMetricConsumerToUnmountGrid,
      measurePerformance: measurePerformanceToToUnmountGrid,
    } = usePerfMetric();

    /**
     * onGridChosenEnhanced is callback being passed to ChooseGrid component
     */
    const [onGridChosenEnhanced, setOnGridChosenEnhanced] = useState<
      (arg: { gridSize: number }) => void
    >(() => () => null);

    /**
     * nextGridSize is used to remember last changed grid size to control if it changes in root of
     * App to make sure it is good to proceed to 'want to mount' life point
     */
    const [nextGridSize, rememberGridSize] = useState<number | null>(null);

    /**
     * toChangeGrid is used to refresh App and set new grid size
     */
    const [toChangeGrid, setToChangeGrid] = useState<() => void>(() => warnToChangeGrid);

    const [lifePoint, setLifePoint] = useState<LifePoint>({
      type: 'want to mount pixel stage',
      callback: () => wantToMountCallbackFirstRun(),
    });

    wantToMountCallback = () =>
      blockingState.toBlock && blockingState.readyToRender && containerHeight !== null
        ? ({
            type: 'ready to mount pixel stage',
            callback: () => readyToMountCallbackFirstRun(),
          } as const)
        : null;

    wantToMountCallbackFirstRun = () => {
      const transit = wantToMountCallback();

      if (transit) {
        return transit;
      }

      setStateToBlock();

      return {
        type: 'want to mount pixel stage',
        callback: () => wantToMountCallback(),
      } as const;
    };

    readyToMountCallback = () =>
      pixelStageWithPropsAdded && !blockingState.toBlock
        ? ({ type: 'stage mounted', callback: () => stageMountedCallback() } as const)
        : null;

    readyToMountCallbackFirstRun = () => {
      const transit = readyToMountCallback();

      if (transit) {
        return transit;
      }

      measurePerformanceToBuildGrid({
        measureAtEffectStage: true,

        callback: () => {
          setPixelStage(cloneElement(pixelsStage, { containerHeight }));
        },
      });

      return {
        type: 'ready to mount pixel stage',
        callback: () => readyToMountCallback(),
      } as const;
    };

    stageMountedCallback = () => {
      setOnGridChosenEnhanced(() => (arg: { gridSize: number }): void => {
        setLifePoint({
          type: 'want to unmount pixel stage',
          callback: () => wantToUnmountCallbackFirstRun(),
        });

        rememberGridSize(arg.gridSize);
        setToChangeGrid(() => () => onGridChosen(arg));
      });

      return { type: 'stage mounted', callback: null } as const;
    };

    wantToUnmountCallback = () =>
      blockingState.toBlock && blockingState.readyToRender
        ? ({
            type: 'ready to unmount pixel stage',
            callback: () => readyToUnmountCallbackFirstRun(),
          } as const)
        : null;

    wantToUnmountCallbackFirstRun = () => {
      const transit = wantToUnmountCallback();

      if (transit) {
        return transit;
      }

      setStateToBlock();
      setOnGridChosenEnhanced(() => () => null);

      return {
        type: 'want to unmount pixel stage',
        callback: () => wantToUnmountCallback(),
      } as const;
    };

    readyToUnmountCallback = () =>
      pixelStageWithPropsAdded || blockingState.toBlock
        ? null
        : ({
            type: 'stage unmounted',
            callback: () => stageUnmountedCallbackFirstRun(),
          } as const);

    readyToUnmountCallbackFirstRun = () => {
      const transit = readyToUnmountCallback();

      if (transit) {
        return transit;
      }

      measurePerformanceToToUnmountGrid({
        measureAtEffectStage: true,

        callback: () => {
          setPixelStage(null);
        },
      });

      return {
        type: 'ready to unmount pixel stage',
        callback: () => readyToUnmountCallback(),
      } as const;
    };

    stageUnmountedCallback = () =>
      gridSize === nextGridSize
        ? ({
            type: 'want to mount pixel stage',
            callback: () => wantToMountCallbackFirstRun(),
          } as const)
        : null;

    stageUnmountedCallbackFirstRun = () => {
      const transit = stageUnmountedCallback();

      if (transit) {
        return transit;
      }

      toChangeGrid();
      setToChangeGrid(() => warnToChangeGrid);

      return { type: 'stage unmounted', callback: () => stageUnmountedCallback() } as const;
    };

    /**
     * Making transition from one life point to next
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      const nextLifePoint = lifePoint.callback?.();

      if (nextLifePoint) {
        setLifePoint(nextLifePoint);
      }
    });

    const { provideModuleNameAndRef } = useProvideModuleNameAndRef();

    pixelStageContainerRef =
      pixelStageContainerRef ??
      ((refElement: HTMLDivElement | null): void => {
        if (refElement && containerHeight === null) {
          provideModuleNameAndRef([moduleName, refElement]);
          setContainerHeight(refElement.getBoundingClientRect().height);
        }
      });

    return {
      blockingContainerStyle,
      pixelStageWithPropsAdded,
      WrapMetricConsumerToBuildGrid,
      WrapMetricConsumerToUnmountGrid,
      onGridChosenEnhanced,
      pixelStageContainerRef,
    };
  };

  return { useBody };
};

const outerContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  margin: '10px 10px 0',
};

export const ControlPanel: FC<ControlPanelProps> = (props) => {
  const {
    headline,
    gridSize,
    moduleName,
    useDisableRows,
    useEnableRows,
    onGridChosen,
    children: pixelsStage,
  } = props;

  const [{ useBody }] = useState(() => createUseBody({ moduleName, onGridChosen }));

  const {
    blockingContainerStyle,
    pixelStageWithPropsAdded,
    WrapMetricConsumerToBuildGrid,
    WrapMetricConsumerToUnmountGrid,
    onGridChosenEnhanced,
    pixelStageContainerRef,
  } = useBody({ gridSize, pixelsStage });

  return (
    <div {...{ style: outerContainerStyle }}>
      <div {...{ style: pixelsStageStyle, ref: pixelStageContainerRef }}>
        {pixelStageWithPropsAdded}
      </div>
      <div {...{ style: controlPanelContainerStyle }}>
        <div {...{ style: headlineStyle }}>
          <strong>{headline}</strong>
        </div>
        <div {...{ style: blockingContainerStyle }}>
          <MeasuredControlButton
            {...{
              moduleName,
              name: 're-paint',
              ...(props.repaintRow
                ? { onPushButton: props.repaintRow }
                : { useOnPushButton: props.useRepaintRow }),
            }}
          />
          <DisableOrEnableRowsButton
            {...{
              name: 'disable rows',
              useOnPushButton: useDisableRows,
              moduleName,
            }}
          />
          <DisableOrEnableRowsButton
            {...{
              name: 'enable rows',
              useOnPushButton: useEnableRows,
              moduleName,
            }}
          />
          <MeasuredControlButton
            {...{
              name: 'paint random pixel',
              ...(props.paintRandomSinglePixel
                ? { onPushButton: props.paintRandomSinglePixel }
                : { useOnPushButton: props.usePaintRandomSinglePixel }),
              gridSize,
              moduleName,
            }}
          />
          <MassivePaintButton
            {...{
              ...(props.paintRandomPixels
                ? { paintRandomPixels: props.paintRandomPixels }
                : { usePaintRandomPixels: props.usePaintRandomPixels }),
              moduleName,
            }}
          />
          <div {...{ style: lineStyle }} />
          <ChooseGrid
            {...{
              onGridChosen: onGridChosenEnhanced,
              WrapMetricConsumerToBuildGrid,
              WrapMetricConsumerToUnmountGrid,
              gridSize,
              moduleName,
            }}
          />
        </div>
      </div>
    </div>
  );
};

type FunctionLike = (...x: any) => any;

export const CONTROL_ACTIONS_ORDER = [
  'build grid',
  'unmount grid',
  're-paint',
  'disable rows',
  'enable rows',
  'paint random pixel',
  'paint \\d+% random pixels',
];
