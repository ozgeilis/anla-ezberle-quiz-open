/** Server-only sequence; each operation is scoped to the freshly verified actor. */
export interface ErasureAdmin {
  files(actor: string): Promise<{ bucket: string; name: string }[]>;
  remove(bucket: string, names: string[]): Promise<void>;
  prepare(actor: string): Promise<boolean>;
  deleteAuth(actor: string): Promise<boolean>;
  verify(actor: string, email: string): Promise<boolean>;
}
export async function eraseAccount(
  admin: ErasureAdmin,
  actor: string,
  email: string,
) {
  // Storage has its own transaction boundary. A failed batch is retryable; never
  // delete metadata directly, never claim success while files/Auth cleanup failed.
  for (let batch = 0; batch < 20; batch++) {
    const files = await admin.files(actor);
    if (!files.length) {
      if (!(await admin.prepare(actor))) return false;
      if (!(await admin.deleteAuth(actor))) return false;
      return admin.verify(actor, email);
    }
    const buckets = new Map<string, string[]>();
    for (const file of files) {
      if (!file.bucket || !file.name)
        throw new Error("Invalid storage ownership response");
      buckets.set(file.bucket, [
        ...(buckets.get(file.bucket) ?? []),
        file.name,
      ]);
    }
    for (const [bucket, names] of buckets) await admin.remove(bucket, names);
  }
  return false;
}
