import type { SoundName } from "./catalog";
export interface SoundPlayer {
  volume: number;
  readonly playing: boolean;
  play(restart?: boolean): void;
  pause(): void;
  release(): void;
}
export interface SoundDriver {
  prepare(): Promise<void>;
  unlock(): void | Promise<void>;
  player(name: SoundName): SoundPlayer;
  dispose(): void;
}
