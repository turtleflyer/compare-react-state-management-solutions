const prefCountsRecords = new Map<string, number>();

export function getNextKey<K extends string>(prefix: K): K {
  const count = (prefCountsRecords.get(prefix) ?? -1) + 1;
  prefCountsRecords.set(prefix, count);

  return `${prefix}-${count}` as K;
}
