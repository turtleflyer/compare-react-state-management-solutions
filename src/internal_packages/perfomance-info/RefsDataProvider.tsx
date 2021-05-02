import type { FC } from 'react';
import React, { createContext, useState } from 'react';

export interface RefsProviderAssets {
  provideModuleNameAndRef: (modNAndRef: [string, HTMLElement]) => void;
  getRef: (modN: string) => HTMLElement;
}

export const RefsContext = createContext<RefsProviderAssets | null>(null);

const createRefsProviderAssets = (): RefsProviderAssets => {
  let refsTable: { [P in string]?: HTMLElement } = {};

  const provideModuleNameAndRef = ([modN, ref]: [string, HTMLElement]): void => {
    refsTable = { ...refsTable, [modN]: ref };
  };

  const getRef = (modN: string): HTMLElement =>
    refsTable[modN] ??
    (() => {
      throw Error(`${modN} is not a valid module name`);
    })();

  return { provideModuleNameAndRef, getRef };
};

export const RefsDataProvider: FC = ({ children }) => {
  const [refAssets] = useState(() => createRefsProviderAssets());

  return <RefsContext.Provider {...{ value: refAssets }}>{children}</RefsContext.Provider>;
};
