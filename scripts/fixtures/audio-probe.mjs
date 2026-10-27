// Installed only by isolated browser acceptance. No probe or fake audio ships in the app.
export function audioProbe({ fixture, theme, preferences }) {
  if (!localStorage.getItem(fixture.storageKey))
    localStorage.setItem(
      fixture.storageKey,
      JSON.stringify({
        ...fixture.data,
        profile: { ...fixture.data.profile, theme, reduceMotion: true },
      }),
    );
  if (
    preferences &&
    !localStorage.getItem("@anla-ezberle-quiz/preferences/audio/v1")
  )
    localStorage.setItem(
      "@anla-ezberle-quiz/preferences/audio/v1",
      JSON.stringify(preferences),
    );
  const probe = {
    contexts: [],
    gains: [],
    starts: [],
    stops: [],
    decoded: 0,
    peak: 0,
    maxEffects: 0,
    failWrite: false,
  };
  window.__soundProbe = probe;
  const originalSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    if (probe.failWrite && key === "@anla-ezberle-quiz/preferences/audio/v1")
      throw Error("Synthetic storage failure");
    return originalSet.call(this, key, value);
  };
  const Base = window.AudioContext ?? window.webkitAudioContext;
  if (!Base) return;
  const active = new Map(),
    gainIds = new WeakMap();
  let id = 0;
  class MeasuredAudioContext extends Base {
    constructor(...args) {
      super(...args);
      probe.contexts.push(this);
    }
    decodeAudioData(...args) {
      const p = super.decodeAudioData(...args);
      p.then(
        () => probe.decoded++,
        () => {},
      );
      return p;
    }
    createGain() {
      const g = super.createGain(),
        gainId = probe.gains.length,
        analyser = super.createAnalyser();
      analyser.fftSize = 2048;
      probe.gains.push({ node: g, analyser });
      gainIds.set(g, gainId);
      const connect = g.connect.bind(g);
      g.connect = (target, ...args) => {
        if (target === this.destination) {
          connect(analyser);
          analyser.connect(target);
          return target;
        }
        return connect(target, ...args);
      };
      return g;
    }
    createBufferSource() {
      const node = super.createBufferSource(),
        nodeId = ++id,
        ctx = this;
      let gain = -1;
      const connect = node.connect.bind(node),
        start = node.start.bind(node),
        stop = node.stop.bind(node);
      node.connect = (target, ...args) => {
        gain = gainIds.get(target) ?? -1;
        return connect(target, ...args);
      };
      node.start = (...args) => {
        start(...args);
        const event = {
          id: nodeId,
          duration: node.buffer?.duration,
          loop: node.loop,
          gain,
          state: ctx.state,
          at: performance.now(),
          peak: 0,
          rms: 0,
        };
        probe.starts.push(event);
        active.set(nodeId, event);
        probe.maxEffects = Math.max(
          probe.maxEffects,
          [...active.values()].filter((x) => !x.loop).length,
        );
        const sample = () => {
          const a = probe.gains[gain]?.analyser;
          if (a) {
            const data = new Float32Array(a.fftSize);
            a.getFloatTimeDomainData(data);
            let squares = 0;
            for (const value of data) {
              event.peak = Math.max(event.peak, Math.abs(value));
              squares += value * value;
            }
            event.rms = Math.max(event.rms, Math.sqrt(squares / data.length));
            probe.peak = Math.max(probe.peak, event.peak);
          }
        };
        for (const delay of [30, 70, 150, 280]) setTimeout(sample, delay);
      };
      node.stop = (...args) => {
        active.delete(nodeId);
        probe.stops.push(nodeId);
        return stop(...args);
      };
      node.addEventListener("ended", () => active.delete(nodeId));
      return node;
    }
  }
  window.AudioContext = MeasuredAudioContext;
  if (window.webkitAudioContext)
    window.webkitAudioContext = MeasuredAudioContext;
}
