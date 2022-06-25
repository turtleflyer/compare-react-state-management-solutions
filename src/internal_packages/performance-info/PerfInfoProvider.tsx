import { useContext } from 'react';
import { BlockingParametersProvider } from './BlockingParametersProvider';
import type { GetDataPoolContextValue, PerfInfoDataMethods } from './CollectDataProvider';
import {
  CollectDataProvider,
  GetDataPoolContext,
  PerfInfoDataMethodsContext,
} from './CollectDataProvider';
import type { InfotipsContextValue } from './InfotipsProvider';
import { InfotipsContext, InfotipsProvider } from './InfotipsProvider';
import type { RefsProviderAssets } from './RefsDataProvider';
import { RefsContext, RefsDataProvider } from './RefsDataProvider';

export const PerfInfoProvider = ({
  popupDelay = 100,
  children,
}: {
  popupDelay?: number;
  children: React.ReactNode;
}) => (
  <InfotipsProvider {...{ popupDelay }}>
    <CollectDataProvider>
      <RefsDataProvider>
        <BlockingParametersProvider>{children}</BlockingParametersProvider>
      </RefsDataProvider>
    </CollectDataProvider>
  </InfotipsProvider>
);

export const usePerfInfoMethods = (): InfotipsContextValue & PerfInfoDataMethods => ({
  ...(useContext(InfotipsContext) ?? throwError()),
  ...(useContext(PerfInfoDataMethodsContext) ?? throwError()),
});

export const useGetDataPool = (): GetDataPoolContextValue =>
  useContext(GetDataPoolContext) ?? throwError();

export const useClearDataPool = (): { clearData: () => void } => {
  const { clearData } = useContext(PerfInfoDataMethodsContext) ?? throwError();

  return { clearData };
};

export const useProvideModuleNameAndRef = (): Pick<
  RefsProviderAssets,
  'provideModuleNameAndRef'
> => {
  const { provideModuleNameAndRef } = useContext(RefsContext) ?? throwError();

  return { provideModuleNameAndRef };
};

export const useGetRef = (): Pick<RefsProviderAssets, 'getRef'> => {
  const { getRef } = useContext(RefsContext) ?? throwError();

  return { getRef };
};

function throwError(): never {
  throw Error('PerfInfoProvider should be in the root of the app');
}
