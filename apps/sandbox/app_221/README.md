Modified repro of [#221](https://github.com/expo/router/issues/221).

The following cases should be possible:

- `/` =(push)=> `/two` =(push)=> `/protected` =(**replace**)=> `/permissions`

  - Can go back to `/two` => can go back to `/`
  - Can **replace** to `/protected` => can go back to `/two`

- Reload from `/permissions` goes to `/` (initial route name set to `index`).

## Issue

We were setting the exact results of `getStateFromPath` as the new navigation state. This would clear the history as `getStateFromPath` is agnostic to the current state.

## Solution

We now check if the `replace` action is going from one screen to a sibling screen in the same navigator. If so, we use more refined logic to handle `replace` actions.

`replace` actions are no longer applied to routing across navigators. In the future we might want to have a changed action that replaces the lowest common denominator of the current screen and the destination screen, then navigates.
