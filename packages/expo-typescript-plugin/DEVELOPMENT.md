# Motive

This TypeScript LSP plugins are not greatly documented. These are notes to hopefully explain things in greater detail

# Diagnostic messages

> https://www.nieknijland.nl/blog/how-to-write-a-diagnostics-typescript-language-service-plugin

There are three types of diagnostics

## Syntactic

Issues with the actual syntax of the file. If you can autofix it, it should be a Suggestion

## Semantic

Issues with the implementation within the file. E.g. A framework that requires something.

## Suggestion

Issues that can be fixed via autofix.
