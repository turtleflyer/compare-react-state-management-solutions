import type { PerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useState } from 'react';

export type Tags = [string, ...(string | number)[]];

export interface PerfInfoData {
  tags: Tags;

  data: PerfMetric;
}

export interface GetDataPoolContextValue {
  getDataPool: () => PerfInfoData[];
}

export interface PerfInfoDataMethods {
  addData: (data: PerfInfoData) => void;

  clearData: () => void;
}

export const GetDataPoolContext = createContext<GetDataPoolContextValue | null>(null);

export const PerfInfoDataMethodsContext = createContext<PerfInfoDataMethods | null>(null);

const createCollectDataProviderAssets = (): {
  useGetDataPoolContextValue: () => GetDataPoolContextValue;
  perfInfoDataMethods: PerfInfoDataMethods;
} => {
  let setData: Dispatch<SetStateAction<PerfInfoData[]>>;

  const useGetDataPoolContextValue = (): GetDataPoolContextValue => {
    const [dataPool, _setData] = useState<PerfInfoData[]>([]);
    setData = _setData;

    const getDataPool = () => [...dataPool];

    return { getDataPool };
  };

  const perfInfoDataMethods = {
    addData: (newData: PerfInfoData) => {
      setData((db) => [...db, newData]);
    },

    clearData: (): void => {
      setData([]);
    },
  };

  return { useGetDataPoolContextValue, perfInfoDataMethods };
};

export const CollectDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ useGetDataPoolContextValue, perfInfoDataMethods }] = useState(() =>
    createCollectDataProviderAssets()
  );

  const getDataPoolValue = useGetDataPoolContextValue();

  return (
    <PerfInfoDataMethodsContext.Provider {...{ value: perfInfoDataMethods }}>
      <GetDataPoolContext.Provider {...{ value: getDataPoolValue }}>
        {children}
      </GetDataPoolContext.Provider>
    </PerfInfoDataMethodsContext.Provider>
  );
};
