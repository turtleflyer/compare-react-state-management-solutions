import type { CSSProperties, FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useBlockingState } from './BlockingParametersProvider';
import { createOnFocus } from './createOnFocus';
import { usePerfInfoMethods } from './PerfInfoProvider';

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

const infotipStyle: CSSProperties = {
  position: 'absolute',
  whiteSpace: 'normal',
  width: 200,
  padding: 10,
  color: 'black',
  backgroundColor: 'rgb(228, 232, 255)',
  fontSize: '14px',
  boxShadow: '3px 3px rgb(141, 144, 166)',
};

const InfotipBox: FC<{
  popupInfo: JSX.Element | string;
  left: number;
  bottom: number;
  clearDelay: () => void;
  toHide: () => void;
}> = ({ popupInfo, left, bottom, clearDelay, toHide }) => (
  <div
    {...{
      style: { ...infotipStyle, left, bottom },
      onMouseOver: clearDelay,
      onFocus: clearDelay,
      onMouseLeave: toHide,
      onBlur: toHide,
    }}
  >
    {popupInfo}
  </div>
);

const infotipPositionOffset = { x: 10, y: 5 };

export const InfoMark: FC<{ style?: CSSProperties; popupInfo: JSX.Element | string }> = ({
  style = {},
  popupInfo,
}) => {
  const infoMarkRef = useRef<HTMLDivElement>(null);
  const delayTimeoutID = useRef<NodeJS.Timeout | null>(null);

  const [infotipBoxPosition, setInfoTipBoxPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const { popupDelay, addTipHandler, hideOtherTips, removeTipHandler } = usePerfInfoMethods();
  const tipHandler = (): void => setInfoTipBoxPosition(null);

  const { toBlock } = useBlockingState();

  const hideInfoTipOnMouseLeave = () => {
    delayTimeoutID.current = setTimeout(() => setInfoTipBoxPosition(null), popupDelay);
  };

  const clearDelay = () => {
    delayTimeoutID.current && clearTimeout(delayTimeoutID.current);
    delayTimeoutID.current = null;
  };

  const showInfoTip = (): void => {
    if (infotipBoxPosition) {
      clearDelay();

      return;
    }

    if (infoMarkRef.current) {
      hideOtherTips(tipHandler);
      const { x, y } = infoMarkRef.current.getBoundingClientRect();
      setInfoTipBoxPosition({ x, y });
    } else {
      throw Error('(PerformanceInfo) Info tip mark must exist');
    }
  };

  const onFocus = createOnFocus<HTMLDivElement>(toBlock, showInfoTip);

  useEffect(() => {
    addTipHandler(tipHandler);

    return () => removeTipHandler(tipHandler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div
        {...{
          ref: infoMarkRef,
          style: { ...infoMarkStyle, ...style },
          onMouseOver: showInfoTip,
          onFocus,
          onMouseLeave: hideInfoTipOnMouseLeave,
          onBlur: hideInfoTipOnMouseLeave,
          role: 'link',
          tabIndex: 0,
        }}
      >
        i
      </div>
      {infotipBoxPosition && (
        <InfotipBox
          {...{
            popupInfo,
            left: infotipBoxPosition.x + infotipPositionOffset.x,
            bottom:
              document.documentElement.clientHeight -
              document.documentElement.scrollTop -
              infotipBoxPosition.y +
              infotipPositionOffset.y,
            clearDelay,
            toHide: hideInfoTipOnMouseLeave,
          }}
        />
      )}
    </>
  );
};
