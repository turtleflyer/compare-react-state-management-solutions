import type { ReactElement, RefObject } from 'react';

export type EventTimingType =
  | 'auxclick'
  | 'click'
  | 'contextmenu'
  | 'dblclick'
  | 'mousedown'
  | 'mouseenter'
  | 'mouseleave'
  | 'mouseout'
  | 'mouseover'
  | 'mouseup'
  | 'pointerover'
  | 'pointerenter'
  | 'pointerdown'
  | 'pointerup'
  | 'pointercancel'
  | 'pointerout'
  | 'pointerleave'
  | 'gotpointercapture'
  | 'lostpointercapture'
  | 'touchstart'
  | 'touchend'
  | 'touchcancel'
  | 'keydown'
  | 'keypress'
  | 'keyup'
  | 'beforeinput'
  | 'input'
  | 'compositionstart'
  | 'compositionupdate'
  | 'compositionend'
  | 'dragstart'
  | 'dragend'
  | 'dragenter'
  | 'dragleave'
  | 'dragover'
  | 'drop';

export type EntryType = 'longtask' | 'mark' | 'event';

export type StartMeasure = (t?: EventTimingType) => void;

export interface Measures {
  TTI: number;
  TBT: number;
  eventDelay?: number;
  eventDuration?: number;
}

export type Status = 'never' | 'pending' | 'done' | 'error';

export interface MetricsComponentProps {
  data: Measures | null;
  status?: Status;
}

export interface UsePerfObserverSettings {
  measureFromCreating: boolean;
}

export type CreateObserverResult = readonly [PerformanceObserver, () => () => void];

export type WrapMetricsComponentChildren = { children: ReactElement<MetricsComponentProps> };
