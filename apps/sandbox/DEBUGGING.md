# TypeScript plugin

To enable logging for the TypeScript plugin start your editor with TSS_LOG set:

```bash
# Your editor may create multiple ti-*.log files. To keep things clean we remove them
# and set the active process output to ti-current.log
# Ignore any 'find: missing argument to `-exec'' errors, that means you just didn't have any `ti-*.log` files present
find . -name 'ti-*' -exec rm {} +;TSS_LOG='-logToFile true -file ti-current.log -level verbose' code .
```
