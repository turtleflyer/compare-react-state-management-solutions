import { useGetRef } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React from 'react';

export type DataTable<
  M extends string = never,
  G extends number = never,
  D extends string = never
> = {
  [P in M]: ModuleEntry<G, D>;
} &
  {
    [P in string]?: ModuleEntry;
  };

export type ModuleEntry<G extends number = never, D extends string = never> = {
  [P in G]: GridEntry<D>;
} &
  {
    [P in number]?: GridEntry;
  };

export type GridEntry<D extends string = never> = { [P in D]: Data } &
  {
    [P in string]?: Data;
  };

export interface Data {
  TTIs: number[];
  TBTs: number[];
  avTTI: number;
  avTBT: number;
}

const mainContainerStyle: CSSProperties = {
  display: 'flex',
};

const columnContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  borderRight: 'solid 0.5px',
  width: 470,
};

const moduleNameStyle: CSSProperties = {
  fontWeight: 200,
  fontVariantCaps: 'small-caps',
  fontSize: '1.2em',
};

const rowStyle: CSSProperties = { display: 'flex', borderBottom: 'solid 0.5px', paddingBottom: 3 };

const headlineRowStyle: CSSProperties = {
  ...rowStyle,
  marginTop: 20,
  fontStyle: 'italic',
  fontWeight: 600,
  fontSize: '0.9em',
};

const ulStyle: CSSProperties = { listStyleType: 'none', padding: 0, marginBlockStart: 0 };
const recordStyle: CSSProperties = { width: '100%', paddingRight: 5 };
const recordNameStyle: CSSProperties = { ...recordStyle, fontSize: '0.8em', lineHeight: '1.8em' };
const recordNumbersStyle: CSSProperties = { ...recordStyle, textAlign: 'right' };

export const InterpretData: FC<{ data: DataTable; recordsOrder: string[] }> = ({
  data,
  recordsOrder,
}) => {
  const moduleNames = Object.keys(data);
  const { getRef } = useGetRef();

  const gridSizesTable = moduleNames.reduce((gridSizesT, m) => {
    const respData = data as DataTable<string>;
    const gSInModule = Object.keys(respData[m]);

    return gSInModule.reduce((gST, g) => {
      const respD = respData as DataTable<string, number>;
      return {
        ...gST,
        [g]: eliminateDuplicates(
          ...(gST[g] ?? []),
          ...Object.keys(respD[m][(g as unknown) as number])
        ),
      };
    }, gridSizesT);
  }, {} as { [P in string]?: string[] });

  return (
    <div {...{ style: mainContainerStyle }}>
      {moduleNames.map((moduleN) => {
        const column = (data as DataTable<string, number, string>)[moduleN];

        return (
          <div
            {...{
              style: {
                ...columnContainerStyle,
                width: getRef(moduleN).getBoundingClientRect().width,
              },
            }}
            key={moduleN}
          >
            <div {...{ style: moduleNameStyle }}>{moduleN}</div>
            {Object.entries(gridSizesTable as { [P in string]: string[] }).map(
              ([gridTitle, entryTitles]) => [
                <div
                  {...{
                    style: headlineRowStyle,
                  }}
                  key={`headline-${gridTitle}`}
                >
                  <div {...{ style: recordStyle }}>{`Grid size: ${gridTitle}`}</div>
                  <div {...{ style: recordNumbersStyle }}>average TTI (ms)</div>
                  <div {...{ style: recordNumbersStyle }}>average TBT (ms)</div>
                </div>,
                <ul {...{ style: ulStyle }} key={`list-${gridTitle}`}>
                  {(recordsOrder.length
                    ? recordsOrder.reduce(
                        (ordered, gauge) => [
                          ...ordered,
                          ...entryTitles.filter((t) => RegExp(gauge).test(t)).sort(),
                        ],
                        [] as string[]
                      )
                    : entryTitles.sort()
                  ).map((t) => {
                    const record = column[(gridTitle as unknown) as number][t];

                    return (
                      <li {...{ style: rowStyle }} key={`${t}`}>
                        <div {...{ style: recordNameStyle }}>
                          {`${t} `}
                          <span
                            {...{ style: { fontStyle: 'italic' } }}
                          >{`(${record.TTIs.length} tries)`}</span>
                        </div>
                        <div {...{ style: recordNumbersStyle }}>{record.avTTI.toFixed(0)}</div>
                        <div {...{ style: recordNumbersStyle }}>{record.avTBT.toFixed(0)}</div>
                      </li>
                    );
                  })}
                </ul>,
              ]
            )}
          </div>
        );
      })}
    </div>
  );
};

function eliminateDuplicates(...arr: string[]): string[] {
  return [...new Set(arr)];
}
