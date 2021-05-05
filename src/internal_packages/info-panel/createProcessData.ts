import type { PerfInfoData } from '@compare-react-state-management-solutions/performance-info';
import type { Data, DataTable, GridEntry, ModuleEntry, PickRequired } from './InterpretData';

export const createProcessData = (): {
  processData: (newData: PerfInfoData[]) => DataTable;
} => {
  type DataMethodsTable = { [P in string]?: DataMethods };

  interface DataMethods {
    addData: AddData;
  }

  type AddData = (data: PerfInfoData, dataT: DataTable) => DataTable;

  let positionIndex: number;
  let dataTable: Readonly<DataTable>;
  let dataMethodsTable: Readonly<DataMethodsTable>;
  initTable();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const processData = (newData: PerfInfoData[]): DataTable => {
    newData.length === 0 && initTable();
    const newSlice = newData.slice(positionIndex);
    positionIndex = newData.length;

    newSlice.forEach((data) => {
      [dataTable, dataMethodsTable] = dataPipeline(data, [dataTable, dataMethodsTable]);
    });

    return dataTable;
  };

  return { processData };

  function initTable(): void {
    positionIndex = 0;
    dataTable = {};
    dataMethodsTable = {};
  }

  function dataPipeline(
    data: PerfInfoData,
    [dataT, dataMethodsT]: [DataTable, DataMethodsTable]
  ): [DataTable, DataMethodsTable] {
    const {
      tags: [moduleName],
    } = data;

    const nextDataMethT = assureMethodsCreated(moduleName, dataMethodsT);
    const {
      [moduleName]: { addData },
    } = nextDataMethT;

    return [addData(data, dataT), nextDataMethT];
  }

  function assureMethodsCreated<M extends string>(
    moduleName: M,
    dataMethodsT: DataMethodsTable
  ): PickRequired<DataMethodsTable, M> {
    return (dataMethodsT[moduleName]
      ? dataMethodsT
      : { ...dataMethodsT, [moduleName]: createDataMethods(moduleName) }) as PickRequired<
      DataMethodsTable,
      M
    >;
  }

  function createDataMethods(moduleName: string): DataMethods {
    let currentGrid: number | null = null;

    const addData: AddData = (data, dataT) => {
      const {
        data: { TTI, TBT },
        tags: [checkModuleName, ...restTags],
      } = data;

      if (checkModuleName !== moduleName) {
        throw Error('wrong module name');
      }

      let entryName: string;

      if (typeof restTags[0] === 'number') {
        currentGrid = restTags[0];
        entryName = 'change grid';
      } else {
        entryName = restTags[0];
      }

      if (currentGrid === null) {
        throw Error('there is no information about the current grid size');
      }

      const { [moduleName]: moduleEntry = {} as ModuleEntry } = dataT;
      const { [currentGrid]: gridEntry = {} as GridEntry } = moduleEntry;

      const {
        [entryName]: dataEntry = { TTIs: [], TBTs: [] } as Pick<Data, 'TTIs' | 'TBTs'>,
      } = gridEntry;

      const [TTIs, TBTs] = [
        [...dataEntry.TTIs, TTI],
        [...dataEntry.TBTs, TBT],
      ];

      const [avTTI, avTBT] = [average(TTIs), average(TBTs)];

      return {
        ...dataT,
        [moduleName]: {
          ...moduleEntry,
          [currentGrid]: {
            ...gridEntry,
            [entryName]: { ...dataEntry, TTIs, TBTs, avTTI, avTBT },
          },
        },
      };

      function average(x: number[]): number {
        return x.reduce((sum, xi) => sum + xi) / x.length;
      }
    };

    return { addData };
  }
};
