Repro of [#221](https://github.com/expo/router/issues/277).

## Issue

The "wildcard" system didn't contain a name for matching the corresponding parameters in the path. This caused the params to not be included when running `getPathFromState`.

## Solution

We've changed the matching pattern of wildcards (rest params) from being formatted like `*` to be formatted like `*<name>` (e.g. `[...user]` -> `*user`). This change enables us to match the corresponding parameter name in the path and use it for `getPathFromState`.
