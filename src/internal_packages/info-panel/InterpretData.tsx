import type { CSSProperties, FC } from 'react';
import React from 'react';
import { GridTitleRow } from './TableComponents/GridTitleRow';
import { ModulesRow } from './TableComponents/ModulesRow';
import { RecordRow } from './TableComponents/RecordRow';

export type DataTable<
  M extends string = never,
  G extends number = never,
  D extends string = never
> = PickRequired<
  {
    [P in string]?: ModuleEntry<G, D>;
  },
  M
>;

export type ModuleEntry<G extends number = never, D extends string = never> = PickRequired<
  {
    [P in number]?: GridEntry<D>;
  },
  G
>;

export type GridEntry<D extends string = never> = PickRequired<
  {
    [P in string]?: Data;
  },
  D
>;

export type PickRequired<T, K> = T & { [P in keyof T & K]: {} };

export interface Data {
  TTIs: number[];
  TBTs: number[];
  avTTI: number;
  avTBT: number;
}

const recordsContainerStyle: CSSProperties = { padding: 0, margin: '0 0 15px' };

export const InterpretData: FC<{ data: DataTable; recordsOrder: string[] }> = ({
  data,
  recordsOrder,
}) => {
  const moduleNames = Object.keys(data);

  const gridSizesTable = moduleNames.reduce((gridSizesT, m) => {
    const moduleTable = (data as DataTable<string>)[m];

    return Object.keys(moduleTable).reduce(
      (gST, g) => ({
        ...gST,
        [g]: eliminateDuplicates(
          ...(gST[g] ?? []),
          ...Object.keys((moduleTable as ModuleEntry<number>)[g as unknown as number])
        ),
      }),
      gridSizesT
    );
  }, {} as { [P in string]?: string[] });

  return (
    <div {...{ style: { display: 'flex', flexDirection: 'column' } }}>
      <ModulesRow {...{ moduleNames }} />
      {Object.entries(gridSizesTable as { [P in string]: string[] }).map(
        ([gridTitle, entryTitles]) => [
          <GridTitleRow {...{ moduleNames, gridTitle }} key={gridTitle} />,

          <div {...{ style: recordsContainerStyle }} key={`list-${gridTitle}`}>
            {(recordsOrder.length
              ? recordsOrder.reduce(
                  (ordered, gauge) => [
                    ...ordered,
                    ...entryTitles
                      .filter((t) => RegExp(gauge).test(t))
                      .sort(
                        (title1, title2) =>
                          Number(title1.replace(/\D/g, '')) - Number(title2.replace(/\D/g, ''))
                      ),
                  ],
                  [] as string[]
                )
              : entryTitles.sort()
            ).map((entryTitle) => (
              <RecordRow {...{ moduleNames, data, gridTitle, entryTitle }} key={entryTitle} />
            ))}
          </div>,
        ]
      )}
    </div>
  );
};

function eliminateDuplicates(...arr: string[]): string[] {
  return [...new Set(arr)];
}
