import type { FC, ReactElement } from 'react';

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

export type MetricsComponentProps =
  | { status?: undefined; data: Measures | null; error?: Error }
  | { status: 'never' | 'pending'; data: null; error?: undefined }
  | { status: 'error'; data: null; error: Error }
  | { status: 'done'; data: Measures; error?: undefined };

export interface UsePerfMetricsSettings {
  measureFromCreating: boolean;
  name?: string;
}

export type UsePerfMetricsReturn = readonly [FC<WrapMetricsComponentChildren>, () => void];

export type CreateObserverResult = readonly [PerformanceObserver, () => () => void];

export type WrapMetricsComponentChildren = { children: ReactElement<MetricsComponentProps> };
