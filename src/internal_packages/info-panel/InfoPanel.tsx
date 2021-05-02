import { CONTROL_ACTIONS_ORDER } from '@compare-react-state-management-solutions/control-panel';
import { useGetDataPool } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import { createProcessData } from './createProcessData';
import { InterpretData } from './InterpretData';
import { TabHeader } from './TabHeader';

const PANEL_COLOR = 'yellow';
const mainContainerBaseStyle: CSSProperties = { position: 'fixed', bottom: -20 };

const commonBoxBaseStyle: CSSProperties = {
  backgroundColor: PANEL_COLOR,
  overflow: 'auto',
  padding: 10,
};

const collapsedBoxStyle: CSSProperties = { ...commonBoxBaseStyle, height: 0 };
const expandedBoxStyle: CSSProperties = { ...commonBoxBaseStyle, height: '50vh' };

export const InfoPanel: FC<{ recordsOrder?: string[] }> = ({
  recordsOrder = CONTROL_ACTIONS_ORDER,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const { getDataPool } = useGetDataPool();
  const [{ processData }] = useState(createProcessData);
  const processedData = processData(getDataPool());

  return (
    <div
      {...{
        style: { ...mainContainerBaseStyle, width: document.documentElement.scrollWidth },
      }}
    >
      <TabHeader
        {...{
          name: 'stat',
          color: PANEL_COLOR,
          addStyle: { margin: 'auto' },
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
