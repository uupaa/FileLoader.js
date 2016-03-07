# FileLoader.js [![Build Status](https://travis-ci.org/uupaa/FileLoader.js.svg)](https://travis-ci.org/uupaa/FileLoader.js)

[![npm](https://nodei.co/npm/uupaa.fileloader.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.fileloader.js/)

File loader

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/FileLoader.js/wiki/)
- [API Spec](https://github.com/uupaa/FileLoader.js/wiki/FileLoader)

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/FileLoader.js"></script>
<script>

// load resource
FileLoader.loadString(URLString, function(string) { ... });
FileLoader.loadBlob(URLString, function(blob) { ... });
FileLoader.loadArrayBuffer(URLString, function(arrayBuffer) { ... });

// convert BlobURLString|URLString|Blob|File|TypedArray|ArrayBuffer to ArrayBuffer
FileLoader.toArrayBuffer(source, function(arrayBuffer) { ... });

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/FileLoader.js");

```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/FileLoader.js");

```

