import { useGetRef } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { borderBottom, recordNumbersStyle, recordStyle, rowContainerStyle } from './tableStyles';

const gridRowContainerStyle: CSSProperties = {
  ...rowContainerStyle,
  marginTop: 20,
};

const gridTitleContainerStyle: CSSProperties = {
  ...borderBottom,
  fontStyle: 'italic',
  fontWeight: 600,
  fontSize: '0.9em',
  display: 'flex',
  paddingBottom: 3,
  margin: '0 10px',
  flexShrink: 0,
};

export const GridTitleRow: FC<{ moduleNames: string[]; gridTitle: number | string }> = ({
  moduleNames,
  gridTitle,
}) => {
  const { getRef } = useGetRef();

  return (
    <div {...{ style: gridRowContainerStyle }}>
      {moduleNames.map((moduleN) => (
        <div
          {...{
            style: {
              ...gridTitleContainerStyle,
              width: getRef(moduleN).getBoundingClientRect().width,
            },
          }}
          key={moduleN}
        >
          <div {...{ style: recordStyle }}>{`Grid size: ${gridTitle}`}</div>
          <div {...{ style: recordNumbersStyle }}>average TTI (ms)</div>
          <div {...{ style: recordNumbersStyle }}>average TBT (ms)</div>
        </div>
      ))}
    </div>
  );
};
