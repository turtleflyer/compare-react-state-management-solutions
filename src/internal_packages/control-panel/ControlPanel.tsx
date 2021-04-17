import type { FC } from 'react';
import React from 'react';
import type { ChooseGridProps } from './ChooseGrid';
import { ChooseGrid } from './ChooseGrid';
import type { PaintRandomPixels } from './MassivePaintButton';
import { MassivePaintButton } from './MassivePaintButton';
import { MeasuredControlButton } from './MeasuredControlButton';

export const DEF_GRID_SIZE = 32;
interface ControlPanelProps extends PaintRandomPixels, ChooseGridProps {
  gridSize: number;
  repaintRow: () => void;
  paintRandomSinglePixel: () => void;
  getSwitchRow: (row: 0 | 1) => () => void;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  gridSize,
  repaintRow,
  onGridChosen,
  paintRandomPixels,
  getSwitchRow,
  paintRandomSinglePixel,
}) => (
  <div {...{ style: { margin: '10px 0 auto 5px' } }}>
    <div {...{ style: { margin: '0 0 10px' } }}>
      <strong>Implemented using &apos;use-interstate&apos; library</strong>
    </div>
    <MeasuredControlButton {...{ name: 're-paint', onPushButton: repaintRow }} />
    {['enable/disable even rows', 'enable/disable odd rows'].map((name, i) => (
      <MeasuredControlButton {...{ name, onPushButton: getSwitchRow(i as 0 | 1) }} key={name} />
    ))}
    <MeasuredControlButton
      {...{ name: 'paint random pixel', onPushButton: paintRandomSinglePixel }}
    />
    <MassivePaintButton {...{ paintRandomPixels }} />
    <div {...{ style: { borderTop: '0.5px solid gray', margin: '15px 0' } }} />
    <ChooseGrid {...{ gridSize, onGridChosen }} />
  </div>
);
