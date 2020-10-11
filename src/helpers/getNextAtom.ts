import { atom, RecoilState } from 'recoil';
import type { State } from '../State/StateInterface';

const prefCountsRecords = new Map<string, number>();
export function getNextKey<K extends string>(prefix: K): K {
  let count = 0;
  if (prefCountsRecords.has(prefix)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    count = prefCountsRecords.get(prefix)! + 1;
  }
  prefCountsRecords.set(prefix, count);

  return `${prefix}-${count}` as K;
}

export function getNextAtom<K extends keyof State, D extends State[K] = State[K]>(
  prefix: K,
  defaultValue: D
): RecoilState<D> {
  return atom({ key: getNextKey(prefix), default: defaultValue });
}
