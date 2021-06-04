import type { FC } from 'react';
import React, { createContext, useState } from 'react';

interface InfotipsPoolMethods {
  addTipHandler: (dispatcher: () => void) => void;
  removeTipHandler: (dispatcher: () => void) => void;
  hideOtherTips: (except: () => void) => void;
}

interface InfotipsProviderProps {
  popupDelay: number;
}
export interface InfotipsContextValue extends InfotipsPoolMethods, InfotipsProviderProps {}

export const InfotipsContext = createContext<InfotipsContextValue | null>(null);

const createInfotipsPoolMethods = (): InfotipsPoolMethods => {
  let dispatchersPool: (() => void)[] = [];

  return {
    addTipHandler: (handler) => {
      dispatchersPool = [...dispatchersPool, handler];
    },

    removeTipHandler: (handler) => {
      dispatchersPool = dispatchersPool.filter((nextHandler) => nextHandler !== handler);
    },

    hideOtherTips: (except) => {
      dispatchersPool.forEach((nextHandler) => nextHandler !== except && nextHandler());
    },
  };
};

export const InfotipsProvider: FC<InfotipsProviderProps> = ({ popupDelay, children }) => {
  const [infotipsContextValue] = useState<InfotipsContextValue>(() => ({
    popupDelay,
    ...createInfotipsPoolMethods(),
  }));

  return (
    <InfotipsContext.Provider {...{ value: infotipsContextValue }}>
      {children}
    </InfotipsContext.Provider>
  );
};
