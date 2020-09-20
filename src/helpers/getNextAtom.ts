import type { RecoilState } from 'recoil';
import { atom } from 'recoil';

const prefCountsRecords = new Map<string, number>();
export function getNextKey(prefix: string): string {
  let count = 0;
  if (prefCountsRecords.has(prefix)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    count = prefCountsRecords.get(prefix)! + 1;
  }
  prefCountsRecords.set(prefix, count);

  return `${prefix}-${count}`;
}

export function getNextAtom<T>(prefix: string, defaultValue: T): RecoilState<T> {
  return atom({ key: getNextKey(prefix), default: defaultValue });
}
