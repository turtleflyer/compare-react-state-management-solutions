import type { CSSProperties, FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTipsPool } from './TipsPoolProvider';

const infoMarkStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
  fontSize: '1.2em',
  fontWeight: 'bolder',
  color: 'gray',
  backgroundColor: 'rgb(228, 232, 255)',
  width: '1.2em',
  height: '1.2em',
  borderRadius: '0.6em',
  cursor: 'default',
};

const infoTipStyle: CSSProperties = {
  position: 'absolute',
  whiteSpace: 'normal',
  width: 200,
  padding: 10,
  color: 'black',
  backgroundColor: 'rgb(228, 232, 255)',
  fontSize: '14px',
  boxShadow: '3px 3px rgb(141, 144, 166)',
};

const InfoTipBox: FC<{
  popupInfo: JSX.Element | string;
  left: number;
  bottom: number;
  clearDelay: () => void;
  toHide: () => void;
}> = ({ popupInfo, left, bottom, clearDelay, toHide }) => (
  <div
    {...{
      style: { ...infoTipStyle, left, bottom },
      onMouseOver: clearDelay,
      onFocus: clearDelay,
      onMouseLeave: toHide,
      onBlur: toHide,
    }}
  >
    {popupInfo}
  </div>
);

export const InfoMark: FC<{ style?: CSSProperties; popupInfo: JSX.Element | string }> = ({
  style = {},
  popupInfo,
}) => {
  const infoMarkRef = useRef<HTMLDivElement>(null);
  const delayTimeoutID = useRef<NodeJS.Timeout | null>(null);

  const [infoTipBoxPosition, setInfoTipBoxPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const tipHandler = useCallback(() => setInfoTipBoxPosition(null), []);

  const { tipsPoolMethods, popupDelay } =
    useTipsPool() ??
    (() => {
      throw Error('TipsPoolProvider should be in the root of the app');
    })();

  const hideInfoTipOnMouseLeave = () => {
    delayTimeoutID.current = setTimeout(() => setInfoTipBoxPosition(null), popupDelay);
  };

  const clearDelay = () => {
    delayTimeoutID.current && clearTimeout(delayTimeoutID.current);
    delayTimeoutID.current = null;
  };

  const showInfoTip = () => {
    if (infoTipBoxPosition) {
      clearDelay();

      return;
    }

    if (infoMarkRef.current) {
      tipsPoolMethods.hideOtherTips(tipHandler);
      const { x, y } = infoMarkRef.current.getBoundingClientRect();
      setInfoTipBoxPosition({ x, y });
    } else {
      throw Error('(PerformanceInfo) Info tip mark must exist');
    }
  };

  useEffect(() => {
    tipsPoolMethods.addTipHandler(tipHandler);

    return () => tipsPoolMethods.removeTipHandler(tipHandler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div
        {...{
          ref: infoMarkRef,
          style: { ...infoMarkStyle, ...style },
          onMouseOver: showInfoTip,
          onFocus: showInfoTip,
          onMouseLeave: hideInfoTipOnMouseLeave,
          onBlur: hideInfoTipOnMouseLeave,
          role: 'link',
          tabIndex: 0,
        }}
      >
        i
      </div>
      {infoTipBoxPosition && (
        <InfoTipBox
          {...{
            popupInfo,
            left: infoTipBoxPosition.x + 10,
            bottom:
              document.documentElement.clientHeight -
              document.documentElement.scrollTop -
              infoTipBoxPosition.y +
              5,
            clearDelay,
            toHide: hideInfoTipOnMouseLeave,
          }}
        />
      )}
    </>
  );
};
