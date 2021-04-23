import type { FC } from 'react';
import React from 'react';
import type { ChooseGridProps } from './ChooseGrid';
import { ChooseGrid } from './ChooseGrid';
import { DisableOrEnableRowsButton, DisableOrEnableRowsHook } from './DisableOrEnableRowsButton';
import type { HookOrNotProp } from './HookOrNotProp';
import type { PaintRandomPixels } from './MassivePaintButton';
import { MassivePaintButton } from './MassivePaintButton';
import { MeasuredControlButton } from './MeasuredControlButton';

export const DEF_GRID_SIZE = 32;
type ControlPanelProps = {
  headline: string;
  useDisableRows: DisableOrEnableRowsHook;
  useEnableRows: DisableOrEnableRowsHook;
} & HookOrNotProp<'repaintRow'> &
  HookOrNotProp<'paintRandomSinglePixel'> &
  PaintRandomPixels &
  ChooseGridProps;

export const ControlPanel: FC<ControlPanelProps> = (props) => {
  return (
    <div {...{ style: { margin: '10px 0 auto 5px' } }}>
      <div {...{ style: { margin: '0 0 10px' } }}>
        <strong>{props.headline}</strong>
      </div>
      <MeasuredControlButton
        {...{
          name: 're-paint',
          ...(props.repaintRow
            ? { onPushButton: props.repaintRow }
            : { useOnPushButton: props.useRepaintRow }),
        }}
      />
      <DisableOrEnableRowsButton
        {...{
          name: 'disable odd rows',
          useOnPushButton: props.useDisableRows,
        }}
      />
      <DisableOrEnableRowsButton
        {...{
          name: 'enable odd rows',
          useOnPushButton: props.useEnableRows,
        }}
      />
      <MeasuredControlButton
        {...{
          name: 'paint random pixel',
          ...(props.paintRandomSinglePixel
            ? { onPushButton: props.paintRandomSinglePixel }
            : { useOnPushButton: props.usePaintRandomSinglePixel }),
        }}
      />
      <MassivePaintButton
        {...(props.paintRandomPixels
          ? { paintRandomPixels: props.paintRandomPixels }
          : { usePaintRandomPixels: props.usePaintRandomPixels })}
      />
      <div {...{ style: { borderTop: '0.5px solid gray', margin: '15px 0' } }} />
      <ChooseGrid
        {...{
          onGridChosen: props.onGridChosen,
          ...(props.gridSize === undefined
            ? { useGridSize: props.useGridSize }
            : { gridSize: props.gridSize }),
        }}
      />
    </div>
  );
};
