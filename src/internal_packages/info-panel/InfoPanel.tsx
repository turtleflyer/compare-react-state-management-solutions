import { CONTROL_ACTIONS_ORDER } from '@compare-react-state-management-solutions/control-panel';
import { useGetDataPool } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import { createProcessData, NotCountFirstMeasureOptions } from './createProcessData';
import { InterpretData } from './InterpretData';
import { TabHeader } from './TabHeader';

const PANEL_COLOR = 'yellow';

const mainContainerBaseStyle: CSSProperties = {
  position: 'relative',
};

const commonBoxBaseStyle: CSSProperties = { backgroundColor: PANEL_COLOR };
const collapsedBoxStyle: CSSProperties = { ...commonBoxBaseStyle, height: 0, overflow: 'hidden' };

const expandedBoxStyle: CSSProperties = {
  ...commonBoxBaseStyle,
  padding: '10px 0',
  height: '50vh',
  overflow: 'auto',
};

export type InfoPanelOptions = NotCountFirstMeasureOptions;

export const InfoPanel: FC<{ recordsOrder?: string[]; options?: InfoPanelOptions }> = ({
  recordsOrder = CONTROL_ACTIONS_ORDER,
  options = { notCountFirstMeasure: false },
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const { getDataPool } = useGetDataPool();
  const [{ processData }] = useState(createProcessData);
  const processedData = processData(getDataPool(), options);
  const scrollWidth = document.documentElement.scrollWidth;
  const clientWidth = document.documentElement.clientWidth;
  const calcWidth = scrollWidth > clientWidth ? scrollWidth : '100%';

  return (
    <div
      {...{
        style: { ...mainContainerBaseStyle, width: calcWidth, bottom: collapsed ? 1 : '50%' },
      }}
    >
      <TabHeader
        {...{
          name: 'stat',
          color: PANEL_COLOR,
          addStyle: { margin: '0 auto', transform: 'translateY(1px)' },
          onClick: () => {
            setCollapsed((prevState) => !prevState);
          },
        }}
      />
      <div {...{ style: collapsed ? collapsedBoxStyle : expandedBoxStyle }}>
        <InterpretData {...{ data: processedData, recordsOrder }} />
      </div>
    </div>
  );
};
