import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import type { Atom, State } from '../State/StateInterface';

export function getNextAtom<K extends keyof State>(prefix: K, defaultValue: State[K]): Atom<K> {
  return [getNextKey(prefix), defaultValue];
}
