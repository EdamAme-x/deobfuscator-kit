# 🔧 JavaScript Deobfuscator Kit

The JavaScript Deobfuscator Kit is a collection of tools for deobfuscating
JavaScript code.\
It includes tools for deobfuscating code, replace array, and more.

Repeat each operation over and over again, and you will gradually return to the
original code.

## Installation

Call it deobfkit, as it is commonly known.

```bash
npm i -g deno
deno install -g -A -n deobfkit -f https://raw.githubusercontent.com/EdamAme-x/evex-builder/2143865311faf523ea37aea6062b20b8faf3c38d/main.ts
```

## Operations

- Synchrony (Support for any obfuscator)

  `deobfkit synchrony ./index.js`

  Please note code that it breaks down by accident.
- Deobfio (Support for [obfuscator.io](https://obfuscator.io))

  `deobfkit deobfio ./index.js`
  `deobfkit deobfio ./index.js -o ./output.js`

  Please note that all deadcode will disappear!
- Replace array

  `deobfkit replace-array ./index.js name="__0x2189"`

  **Before**
  ```js
  const __0x2189 = [1, 2, 3];

  console.log(__0x2189[0] + __0x2189[1] + __0x2189[2]);
  ```

  **After**
  ```js
  console.log(1 + 2 + 3);
  ```

  **Options** `--name`: The name of the array to be replaced
  `--ignore-side-effects`: Ignore side effects from function calls. Default is
  true

**Common Options**

- `--output`: Output the deobfuscated code to a file. Support `stdout`
- `--overwrite`: Overwrite the original file. Default is true.

## ToDo

- Cleanup Errors

## License

MIT
