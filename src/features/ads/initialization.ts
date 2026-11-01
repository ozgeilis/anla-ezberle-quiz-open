interface AdInitializationPort {
  configure(): Promise<unknown>;
  initialize(): Promise<unknown>;
  mute(): void;
}

export function createAdInitializer(port: AdInitializationPort) {
  let initialization: Promise<void> | undefined;
  return async () => {
    initialization ??= (async () => {
      await port.configure();
      await port.initialize();
      // Android GMA throws a native exception if this runs before initialize.
      // No ad requests are allowed until both steps have finished.
      port.mute();
    })();
    try {
      return await initialization;
    } catch (error) {
      initialization = undefined;
      throw error;
    }
  };
}
