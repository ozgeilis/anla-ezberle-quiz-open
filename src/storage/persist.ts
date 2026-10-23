import { parseData, StoredData } from "./schema";

/** Return the new state only AFTER validated persistence succeeds. */
export async function persistChange(
  current: StoredData,
  transform: (current: StoredData) => StoredData,
  write: (serialized: string) => Promise<void>,
): Promise<StoredData> {
  const next = transform(current);
  const serialized = JSON.stringify(next);
  parseData(serialized);
  await write(serialized);
  return next;
}
