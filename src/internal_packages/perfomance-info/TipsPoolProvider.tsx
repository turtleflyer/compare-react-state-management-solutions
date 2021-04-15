import type { FC } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface TipsPoolMethods {
  addTipHandler: (dispatcher: () => void) => void;
  removeTipHandler: (dispatcher: () => void) => void;
  hideOtherTips: (except: () => void) => void;
}

const createTipsPoolMethods = (): TipsPoolMethods => {
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

interface TipsPoolContextValue {
  tipsPoolMethods: TipsPoolMethods;
  popupDelay: number;
}

const TipsPoolContext = createContext<TipsPoolContextValue | null>(null);

export const TipsPoolProvider: FC<{ popupDelay?: number }> = ({ popupDelay = 100, children }) => {
  const [tipsPoolMethods] = useState(createTipsPoolMethods);

  return (
    <TipsPoolContext.Provider {...{ value: { tipsPoolMethods, popupDelay } }}>
      {children}
    </TipsPoolContext.Provider>
  );
};

export const useTipsPool = (): TipsPoolContextValue | null => useContext(TipsPoolContext);
