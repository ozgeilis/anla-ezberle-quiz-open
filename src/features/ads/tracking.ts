// Android keeps its existing consent/advertising-ID policy. Web never loads GMA.
export async function mayUseAdvertisingTracking(_interactive: boolean) {
  return true;
}
