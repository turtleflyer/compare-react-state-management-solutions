import { useGetRef } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import type { DataTable } from '../InterpretData';
import {
  borderBottom,
  recordNameStyle,
  recordNumbersStyle,
  rowContainerStyle,
} from './tableStyles';

const recordContainerStyle: CSSProperties = {
  ...borderBottom,
  display: 'flex',
  paddingBottom: 3,
  margin: '0 10px',
  flexShrink: 0,
};

export const RecordRow: FC<{
  moduleNames: string[];
  data: DataTable;
  gridTitle: number | string;
  entryTitle: string;
}> = ({ moduleNames, data, gridTitle, entryTitle }) => {
  const { getRef } = useGetRef();

  return (
    <div {...{ style: rowContainerStyle }}>
      {moduleNames.map((moduleN) => {
        const record = data[moduleN]?.[(gridTitle as unknown) as number]?.[entryTitle];

        return (
          <div
            {...{
              style: {
                ...recordContainerStyle,
                width: getRef(moduleN).getBoundingClientRect().width,
              },
            }}
            key={moduleN}
          >
            <div {...{ style: recordNameStyle }}>
              {`${entryTitle} `}
              <span {...{ style: { fontStyle: 'italic' } }}>
                {record ? `(${record.TTIs.length} tries)` : '(no data)'}
              </span>
            </div>
            <div {...{ style: recordNumbersStyle }}>{record ? record.avTTI.toFixed(0) : '-'}</div>
            <div {...{ style: recordNumbersStyle }}>{record ? record.avTBT.toFixed(0) : '-'}</div>
          </div>
        );
      })}
    </div>
  );
};
