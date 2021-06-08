import {
  useBlockingState,
  useProvideModuleNameAndRef,
  useResetArea,
} from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC, ReactElement } from 'react';
import React, { cloneElement, useEffect, useState } from 'react';
import type { ChooseGridProps } from './ChooseGrid';
import { ChooseGrid } from './ChooseGrid';
import { DisableOrEnableRowsButton, DisableOrEnableRowsHook } from './DisableOrEnableRowsButton';
import type { HookOrNotProp } from './HookOrNotProp';
import type { PaintRandomPixels } from './MassivePaintButton';
import { MassivePaintButton } from './MassivePaintButton';
import { MeasuredControlButton } from './MeasuredControlButton';

const pixelsStageStyle: CSSProperties = { flexGrow: 1 };
const controlPanelContainerStyle: CSSProperties = { margin: '10px 0 0 5px' };
const headlineStyle: CSSProperties = { margin: '0 0 10px' };
const blockedStyle: CSSProperties = { filter: 'blur(0.7px)' };
const lineStyle: CSSProperties = { height: 0, borderTop: '0.5px solid gray', margin: '15px 0' };

type ControlPanelProps = {
  headline: string;
  useDisableRows: DisableOrEnableRowsHook;
  useEnableRows: DisableOrEnableRowsHook;
  moduleName: string;
  children: ReactElement;
} & HookOrNotProp<'repaintRow'> &
  HookOrNotProp<'paintRandomSinglePixel'> &
  HookOrNotProp<'gridSize', number> &
  PaintRandomPixels &
  Omit<ChooseGridProps, 'gridSize'>;

interface UseBodyReturn {
  blockingContainerStyle: CSSProperties;
  pixelStageWithPropsAdded: ReactElement | null;
}

const createUseBody = ({
  gridSize,
  pixelsStage,
  moduleName,
}: {
  gridSize: number;
  pixelsStage: ReactElement;
  moduleName: string;
}): {
  pixelStageContainerRef: (refElement: HTMLDivElement | null) => void;
  useBody: () => UseBodyReturn;
} => {
  let provideModuleNameAndRef: (modNAndRef: [string, HTMLElement]) => void;
  let pixelSize: number | null = null;
  let pixelStageWithPropsAdded: ReactElement | null = null;

  const pixelStageContainerRef = (refElement: HTMLDivElement | null): void => {
    if (refElement) {
      provideModuleNameAndRef([moduleName, refElement]);
      pixelSize === null && (pixelSize = refElement.getBoundingClientRect().height / gridSize);
    }
  };

  const useBody = (): UseBodyReturn => {
    const blockingState = useBlockingState();
    ({ provideModuleNameAndRef } = useProvideModuleNameAndRef());
    const blockingContainerStyle: CSSProperties = blockingState.toBlock ? blockedStyle : {};

    pixelStageWithPropsAdded === null &&
      (pixelStageWithPropsAdded =
        blockingState.toBlock && blockingState.readyToRender && pixelSize !== null
          ? cloneElement(pixelsStage, { pixelSize, gridSize })
          : null);

    return { blockingContainerStyle, pixelStageWithPropsAdded };
  };

  return { pixelStageContainerRef, useBody };
};

export const ControlPanel: FC<ControlPanelProps> = (props) => {
  const { headline, moduleName, useDisableRows, useEnableRows, children: pixelsStage } = props;
  const gridSize = props.gridSize ?? props.useGridSize();

  const [{ pixelStageContainerRef, useBody }] = useState(() =>
    createUseBody({ gridSize, pixelsStage, moduleName })
  );

  const { blockingContainerStyle, pixelStageWithPropsAdded } = useBody();
  const resetArea = useResetArea();

  useEffect(() => resetArea, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
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
              name: 'disable odd rows',
              useOnPushButton: useDisableRows,
              moduleName,
            }}
          />
          <DisableOrEnableRowsButton
            {...{
              name: 'enable odd rows',
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
              onGridChosen: props.onGridChosen,
              gridSize,
              moduleName,
            }}
          />
        </div>
      </div>
    </>
  );
};

export const CONTROL_ACTIONS_ORDER = [
  'change grid',
  're-paint',
  'disable odd rows',
  'enable odd rows',
  'paint random pixel',
  'paint \\d+% random pixels',
];
