/**
 * This file handles the reactivity of our "units"
 * It maybe a overkill solution - if you can suggest a better method please create a Github Issue.
 *
 * The problem is that styles can conditionally use dynamic units (e.g. rem), and they
 * might not be on the top level, e.g. var(var(var(10rem)))
 * They also might in media/container queries and/or never used!
 *
 * I strugged finding a clean solution until I tried Signals.
 * Because they track their own usage, it means I can keep the complexity in this
 * file and keep the rest of the codebase rather clean.
 *
 * We are using eager signals with the Mobx stale algorithm
 *
 * This is heavily based upon:
 * - https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p
 * - https://medium.com/hackernoon/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254
 * - https://github.com/fabiospampinato/flimsy
 *
 * TODO: Currently we don't implement batching, as we don't have that many signals. Might
 * need to revisit this in the future.
 */
interface Computation<T = unknown> {
  fn: () => T;
  waiting: number;
  fresh: boolean;
  signal: Signal<T>;
  execute(): void;
  snapshot(): T;
  dependencies: Set<Set<Computation | (() => void)>>;
  subscribe(callback: () => void): () => void;
  stale(change: 1 | -1, fresh: boolean): void;
}

export interface Signal<T = unknown> {
  get(): T;
  snapshot(): T;
  set(value: T): void;
  stale(change: 1 | -1, fresh: boolean): void;
  subscribe(callback: () => void): () => void;
}

export type SignalLike<T = unknown> = { get(): T };

const context: Computation[] = [];

export function createSignal<T = unknown>(value: T): Signal<T> {
  const subscriptions = new Set<Computation | (() => void)>();

  const get = () => {
    const running = context[context.length - 1];
    if (running) {
      subscriptions.add(running);
      running.dependencies.add(subscriptions);
    }
    return value;
  };

  const snapshot = () => value;

  const set = (nextValue: T) => {
    if (Object.is(value, nextValue)) return;

    value = nextValue;

    stale(1, true);
    stale(-1, true);
  };

  const stale = (change: 1 | -1, fresh: boolean): void => {
    for (const subscriber of [...subscriptions]) {
      if (typeof subscriber === "function") {
        subscriber();
      } else {
        subscriber.stale(change, fresh);
      }
    }
  };

  const subscribe = (callback: () => void) => {
    subscriptions.add(callback);
    return () => {
      subscriptions.delete(callback);
    };
  };

  return { get, set, stale, subscribe, snapshot };
}

function cleanup(running: Computation) {
  for (const dep of running.dependencies) {
    dep.delete(running);
  }
  running.dependencies.clear();
}

export function createComputation<T = unknown>(fn: () => T) {
  const computation: Computation<T> = {
    fn,
    waiting: 0,
    fresh: false,
    signal: createSignal(undefined) as Signal<T>,
    dependencies: new Set(),
    snapshot: () => computation.signal.snapshot(),
    subscribe: (callback: () => void) => {
      computation.signal.subscribe(callback);
      return () => {
        cleanup(computation);
      };
    },
    execute() {
      cleanup(computation);
      context.push(computation);

      this.waiting = 0;
      this.fresh = false;

      this.signal.set(this.fn());
      context.pop();
    },
    stale(change: 1 | -1, fresh: boolean) {
      if (!this.waiting && change < 0) return;

      if (!this.waiting && change > 0) {
        this.signal.stale(1, false);
      }

      this.waiting += change;
      this.fresh ||= fresh;

      if (!this.waiting) {
        this.waiting = 0;

        if (this.fresh) {
          this.execute();
        }

        this.signal.stale(-1, false);
      }
    },
  };

  computation.execute();

  return computation;
}
