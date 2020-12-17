import React, { createContext, useContext, useMemo } from 'react';
import type { Dispatch, FC } from 'react';

type InfoTipBoxPositionDispather = Dispatch<
  React.SetStateAction<{
    x: number;
    y: number;
  } | null>
>;

interface TipsPoolMethods {
  addInfoTipBoxPositionDispatcher: (dispatcher: InfoTipBoxPositionDispather) => void;
  removeInfoTipBoxPositionDispatcher: (dispatcher: InfoTipBoxPositionDispather) => void;
  zeroInfoTipBoxPositions: (except: InfoTipBoxPositionDispather) => void;
}

const createTipsPoolMethods = (): TipsPoolMethods => {
  let dispatchersPool: InfoTipBoxPositionDispather[] = [];

  return {
    addInfoTipBoxPositionDispatcher: (dispatcher) => {
      dispatchersPool = [...dispatchersPool, dispatcher];
    },

    removeInfoTipBoxPositionDispatcher: (dispatcher) => {
      dispatchersPool = dispatchersPool.filter((d) => d !== dispatcher);
    },

    zeroInfoTipBoxPositions: (except) => {
      dispatchersPool.forEach((d) => d !== except && d(null));
    },
  };
};

const TipsPoolContext = createContext(createTipsPoolMethods());

export const TipsPoolProvider: FC = ({ children }) => {
  const tipsPoolMethods = useMemo(createTipsPoolMethods, []);

  return (
    <TipsPoolContext.Provider {...{ value: tipsPoolMethods }}>{children}</TipsPoolContext.Provider>
  );
};

export const useTipsPoolMethods = (): TipsPoolMethods => useContext(TipsPoolContext);
