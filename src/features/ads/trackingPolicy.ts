interface TrackingPermission {
  granted: boolean;
  canAskAgain: boolean;
}
export async function authorizeTracking(
  interactive: boolean,
  port: {
    get(): Promise<TrackingPermission>;
    request(): Promise<TrackingPermission>;
  },
) {
  const current = await port.get();
  if (current.granted) return true;
  if (!interactive || !current.canAskAgain) return false;
  return (await port.request()).granted;
}
