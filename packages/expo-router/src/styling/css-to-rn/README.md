# `css-to-rn`

The `css-to-rn` module is responsible for taking a CSS string and converting it an object that can be used at runtime in a React Native environment. It uses `lightningcss` to parse the styles, and its visitor API to traverse the output.

Style generally take two forms: `static` and `dynamic`.

`static` styles work as-is in React Native. No additional process need to be performed

`dynamic` styles take the form of

```
{
  type: "runtime",
  name: string
  arguments: any[]
}
```

Arguments can contain `static` or `dynamic` values. The runtime behaviour depends on the `name`. For example,

```
{
  type: "runtime",
  name: "rbg"
  arguments: [255, 0, 0, 1]
}
// Compiles to rgba(255, 0, 0, 1)

{
  type: "runtime",
  name: "var"
  arguments: ['my-variable']
}
// Compiles to the value of `--my-variable'
```

The runtime converstion is down when flatting the styles.
