import { CONTROL_ACTIONS_ORDER } from '@compare-react-state-management-solutions/control-panel';
import { useGetDataPool } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import { createProcessData, NotCountFirstMeasureOptions } from './createProcessData';
import { InterpretData } from './InterpretData';
import { TabHeader } from './TabHeader';

export const TAB_HEADER_HEIGHT = 25;

const PANEL_COLOR = 'yellow';
const PANEL_HEIGHT = '50vh';

const exteriorContainerStyle: CSSProperties = {
  height: 0,
};

const mainContainerBaseStyle: CSSProperties = {
  position: 'relative',
};

const commonBoxBaseStyle: CSSProperties = { backgroundColor: PANEL_COLOR };
const collapsedBoxStyle: CSSProperties = { ...commonBoxBaseStyle, height: 0, overflow: 'hidden' };

const expandedBoxStyle: CSSProperties = {
  ...commonBoxBaseStyle,
  padding: '10px 0',
  height: PANEL_HEIGHT,
  overflow: 'auto',
};

export type InfoPanelOptions = NotCountFirstMeasureOptions;

export const InfoPanel: FC<{
  recordsOrder?: string[];
  options?: InfoPanelOptions;
  zIndex?: number;
}> = ({
  recordsOrder = CONTROL_ACTIONS_ORDER,
  options = { notCountFirstMeasure: false },
  zIndex = 0,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const { getDataPool } = useGetDataPool();
  const [{ processData }] = useState(createProcessData);
  const processedData = processData(getDataPool(), options);
  const scrollWidth = document.documentElement.scrollWidth;
  const clientWidth = document.documentElement.clientWidth;
  const calcWidth = scrollWidth > clientWidth ? scrollWidth : '100%';

  return (
    <div {...{ style: exteriorContainerStyle }}>
      {Object.entries(processedData).length === 0 || (
        <div
          {...{
            style: {
              ...mainContainerBaseStyle,
              zIndex,
              width: calcWidth,
              bottom: collapsed
                ? TAB_HEADER_HEIGHT + 1 - calculateScrollBarHeight()
                : `calc(${PANEL_HEIGHT} + ${TAB_HEADER_HEIGHT}px - ${calculateScrollBarHeight().toFixed(
                    0
                  )}px`,
            },
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
      )}
    </div>
  );
};

function calculateScrollBarHeight(): number {
  const { documentElement } = document;
  documentElement.style.overflowX = 'scroll';
  const heightWhenScroll = documentElement.clientHeight;
  documentElement.style.overflowX = 'auto';
  const actualHeight = documentElement.clientHeight;

  return actualHeight - heightWhenScroll;
}
