import { useGetRef } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { rowContainerStyle } from './tableStyles';

const moduleNameContainerStyle: CSSProperties = {
  fontWeight: 200,
  fontVariantCaps: 'small-caps',
  fontSize: '1.2em',
  margin: '0 10px',
  flexShrink: 0,
};

export const ModulesRow: FC<{ moduleNames: string[] }> = ({ moduleNames }) => {
  const { getRef } = useGetRef();

  return (
    <div {...{ style: rowContainerStyle }}>
      {moduleNames.map((moduleN) => (
        <div
          {...{
            style: {
              ...moduleNameContainerStyle,
              width: getRef(moduleN).getBoundingClientRect().width,
            },
          }}
          key={moduleN}
        >
          {moduleN}
        </div>
      ))}
    </div>
  );
};
