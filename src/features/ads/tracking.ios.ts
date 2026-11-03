import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import { authorizeTracking } from "./trackingPolicy";
export function mayUseAdvertisingTracking(interactive: boolean) {
  return authorizeTracking(interactive, {
    get: getTrackingPermissionsAsync,
    request: requestTrackingPermissionsAsync,
  });
}
