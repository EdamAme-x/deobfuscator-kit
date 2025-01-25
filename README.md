# 🔧 JavaScript Deobfuscator Kit

The JavaScript Deobfuscator Kit is a collection of tools for deobfuscating JavaScript code.  
It includes tools for deobfuscating code, replace array, and more.

Repeat each operation over and over again, and you will gradually return to the original code.

## Installation
Call it deobfkit, as it is commonly known.

```bash
```

## Operations

- Synchrony (Support for any obfuscator)  
    `~ deobfkit synchrony ./index.js`
- Deobfio (Support for [obfuscator.io](https://obfuscator.io))  
    `~ deobfkit deobfio ./index.js`
- Replace array  
    `~ deobfkit replace-array ./index.js name="__0x2189"`
    
    **Before**
    ```js
        const __0x2189 = [1, 2, 3];

        console.log(__0x2189[0] + __0x2189[1] + __0x2189[2]);
    ```

    **After**
    ```js
        console.log(1 + 2 + 3);
    ```