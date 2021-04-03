const prefCountsRecords = new Map<string, number>();

export function getNextKey<K extends string>(prefix: K): K {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const count = (prefCountsRecords.get(prefix) ?? -1) + 1;
  prefCountsRecords.set(prefix, count);

  return `${prefix}-${count}` as K;
}
