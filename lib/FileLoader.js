(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("FileLoader", function moduleClosure(global, WebModule, VERIFY /*, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var _fileLoadHandler = IN_NODE ? _nodeFileLoadHandler : _browserFileLoadHandler;
// --- class / interfaces ----------------------------------
var FileLoader = {
    "load":            FileLoader_load,            // FileLoader.load(url:URLString, responseType:ResponseTypeString, readyCallback:Function, errorCallback:Function = null, options:Object = {}):void
    "loadString":      FileLoader_loadString,      // FileLoader.loadString(url:URLString, readyCallback:Function, errorCallback:Function = null, options:Object = {}):void
    "loadText":        FileLoader_loadString,      // [alias]
    "loadJSON":        FileLoader_loadJSON,        // FileLoader.loadJSON(url:URLString, readyCallback:Function, errorCallback:Function = null, options:Object = {}):void
    "loadBlob":        FileLoader_loadBlob,        // FileLoader.loadBlob(url:URLString, readyCallback:Function, errorCallback:Function = null, options:Object = {}):void
    "loadArrayBuffer": FileLoader_loadArrayBuffer, // FileLoader.loadArrayBuffer(url:URLString, readyCallback:Function, errorCallback:Function = null, options:Object = {}):void
    "toArrayBuffer":   FileLoader_toArrayBuffer,   // FileLoader.toArrayBuffer(source:BlobURLString|URLString|Blob|File|TypedArray|ArrayBuffer,
                                                   //                          readyCallback:Function, errorCallback:Function = null, options:Object = {}):void
    "repository":      "https://github.com/uupaa/FileLoader.js",
};

// --- implements ------------------------------------------
function FileLoader_load(url,           // @arg URLString
                         responseType,  // @arg ResponseTypeString = "String" - ignore case string. "String", "Text", "JSON", "Blob", "ArrayBuffer"
                         readyCallback, // @arg Function - readyCallback(result:Any, url:URLString, httpStatusCode:UINT16):void
                         errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                         options) {     // @arg Object = {} - { timeout:UINT32 }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_load, "url");
        $valid($type(responseType,  "String|omit"),   FileLoader_load, "responseType");
        $valid($some(responseType,  "String|Text|JSON|Blob|ArrayBuffer", true), FileLoader_load, "responseType");
        $valid($type(readyCallback, "Function"),      FileLoader_load, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_load, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_load, "options");
        if (options) {
            $valid($keys(options,         "timeout"),     FileLoader_load, "options");
            $valid($type(options.timeout, "UINT32|omit"), FileLoader_load, "options.timeout");
        }
    }
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, responseType.toLowerCase(), options || {});
}

function FileLoader_loadString(url,           // @arg URLString
                               readyCallback, // @arg Function - readyCallback(result:String, url:URLString, httpStatusCode:UINT16):void
                               errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                               options) {     // @arg Object = {} - { timeout:UINT32 }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_loadString, "url");
        $valid($type(readyCallback, "Function"),      FileLoader_loadString, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadString, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadString, "options");
        if (options) {
            $valid($keys(options,         "timeout"),     FileLoader_loadString, "options");
            $valid($type(options.timeout, "UINT32|omit"), FileLoader_loadString, "options.timeout");
        }
    }
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "", options || {});
}

function FileLoader_loadJSON(url,           // @arg URLString
                             readyCallback, // @arg Function - readyCallback(result:JSON, url:URLString, httpStatusCode:UINT16):void
                             errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                             options) {     // @arg Object = {} - { timeout:UINT32 }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_loadJSON, "url");
        $valid($type(readyCallback, "Function"),      FileLoader_loadJSON, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadJSON, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadJSON, "options");
        if (options) {
            $valid($keys(options,         "timeout"),     FileLoader_loadJSON, "options");
            $valid($type(options.timeout, "UINT32|omit"), FileLoader_loadJSON, "options.timeout");
        }
    }
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "json", options || {});
}

function FileLoader_loadBlob(url,           // @arg URLString
                             readyCallback, // @arg Function - readyCallback(result:Blob, url:URLString, httpStatusCode:UINT16):void
                             errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                             options) {     // @arg Object = {} - { timeout:UINT32 }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_loadBlob, "url");
        $valid($type(readyCallback, "Function"),      FileLoader_loadBlob, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadBlob, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadBlob, "options");
        if (options) {
            $valid($keys(options,         "timeout"),     FileLoader_loadBlob, "options");
            $valid($type(options.timeout, "UINT32|omit"), FileLoader_loadBlob, "options.timeout");
        }
    }
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "blob", options || {});
}

function FileLoader_loadArrayBuffer(url,           // @arg URLString
                                    readyCallback, // @arg Function - readyCallback(result:ArrayBuffer, url:URLString, httpStatusCode:UINT16):void
                                    errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                                    options) {     // @arg Object = {} - { timeout:UINT32 }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_loadArrayBuffer, "url");
        $valid($type(readyCallback, "Function"),      FileLoader_loadArrayBuffer, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadArrayBuffer, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadArrayBuffer, "options");
        if (options) {
            $valid($keys(options,         "timeout"),     FileLoader_loadArrayBuffer, "options");
            $valid($type(options.timeout, "UINT32|omit"), FileLoader_loadArrayBuffer, "options.timeout");
        }
    }
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "arraybuffer", options || {});
}

function _browserFileLoadHandler(url, readyCallback, errorCallback, responseType, options) {
    var xhr = new XMLHttpRequest();

    // http://www.w3.org/TR/2008/WD-XMLHttpRequest2-20080225/
    if (responseType) {
        xhr["responseType"] = responseType;
    }
    xhr["onload"] = function() {
        if ((IN_NW || IN_EL) && xhr.status === 0) {
            readyCallback(xhr["response"], url, 200); // 200
        } else if (xhr.status >= 200 && xhr.status < 300) {
            readyCallback(xhr["response"], url, xhr.status); // 200 - 299
        } else if (errorCallback) {
            errorCallback(new Error(xhr["statusText"] || ""), url, xhr.status); // 404, 500, ...
        }
        gc(xhr);
        xhr = null;
    };
    xhr["onerror"] = function(event) {
        errorCallback(event, url, 500); // 500
        gc(xhr);
        xhr = null;
    };
    xhr["ontimeout"] = function(event) {
        errorCallback(event, url, 500); // 500
        gc(xhr);
        xhr = null;
    };
    if (options["timeout"]) {
        xhr["timeout"] = options["timeout"];
    }
    xhr.open("GET", url);
    xhr.send();

    function gc(xhr) {
        xhr["ontimeout"] = null;
        xhr["onerror"] = null;
        xhr["onload"] = null;
    }
}

function _nodeFileLoadHandler(url, readyCallback, errorCallback, responseType /*, options */) {
    var fs = require("fs");

    // TODO: timeout impl.

    switch (responseType) {
    case "":
    case "json":
        try {
            fs["readFile"](url, "utf8", function(error, text) {
                if (error) {
                    errorCallback(error, url, 500);
                } else {
                    if (responseType === "json") {
                        try {
                            readyCallback( JSON.parse(text), url, 200 );
                        } catch ( o__o ) {
                            errorCallback( o__o, url, 500 ); // JSON format error
                        }
                    } else {
                        readyCallback(text, url, 200);
                    }
                }
            });
        } catch ( o__o ) {
            errorCallback( o__o, url, o__o["code"] === "ENOENT" ? 404 : 500 );
        }
        break;
    case "arraybuffer":
        try {
            fs["readFile"](url, function(error, // @arg Error
                                         b) {   // @arg NodeBuffer
                if (error) {
                    errorCallback(error, url);
                } else {
                    // http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer/12101012#12101012
                    readyCallback( new Uint8Array(b)["buffer"], url );
                }
            });
        } catch ( o__o ) {
            errorCallback( o__o, url, o__o["code"] === "ENOENT" ? 404 : 500 );
        }
        break;
  //case "blob":
    default:
        errorCallback(new Error("Sorry, function is not implemented"), url);
    }
}

function FileLoader_toArrayBuffer(source,        // @arg BlobURLString|URLString|Blob|File|TypedArray|ArrayBuffer
                                  readyCallback, // @arg Function - readyCallback(result:ArrayBuffer, source:Any):void
                                  errorCallback, // @arg Function = null - errorCallback(error:Error, source:Any):void
                                  options) {     // @arg Object = {} - { timeout:UINT32 }
                                                 // @desc read file.
//{@dev
    if (VERIFY) {
        $valid($type(source,        "BlobURLString|URLString|Blob|File|TypedArray|ArrayBuffer"), FileLoader_toArrayBuffer, "source");
        $valid($type(readyCallback, "Function"),      FileLoader_loadArrayBuffer, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadArrayBuffer, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadArrayBuffer, "options");
        if (options) {
            $valid($keys(options,         "timeout"),     FileLoader_loadArrayBuffer, "options");
            $valid($type(options.timeout, "UINT32|omit"), FileLoader_loadArrayBuffer, "options.timeout");
        }
    }
//}@dev

    if (source) {
        if (global["ArrayBuffer"]) {
            if (source instanceof ArrayBuffer) { // ArrayBuffer -> ArrayBuffer
                readyCallback(source, source);
                return;
            }
            if (source["buffer"] instanceof ArrayBuffer) { // TypedArray -> ArrayBuffer
                readyCallback(source["buffer"], source);
                return;
            }
        }
        if (typeof source === "string") { // BlobURLString or URLString -> ArrayBuffer
            if (IN_NW || IN_EL) {
                if (_isLocalFile(source)) {
                    try {
                        var result = require("fs")["readFileSync"](source);

                        readyCallback( new Uint8Array(result)["buffer"], source );
                    } catch ( o__o ) {
                        if (errorCallback) {
                            errorCallback(o__o, source);
                        }
                    }
                    return;
                }
            }
            _fileLoadHandler(source, readyCallback, errorCallback, "arraybuffer", options || {});
            return;
        }
        if (global["Blob"] && global["FileReader"]) {
            if (source instanceof Blob) { // Blob or File -> ArrayBuffer

                var reader = new FileReader();

                reader["onload"] = function() {
                    readyCallback(reader["result"], source);
                    reader["onerror"] = null;
                    reader["onload"] = null;
                    reader = null;
                };
                reader["onerror"] = function() {
                    if (errorCallback) {
                        errorCallback(reader["error"], source);
                    }
                    reader["onerror"] = null;
                    reader["onload"] = null;
                    reader = null;
                };
                reader["readAsArrayBuffer"](source);
                return;
            }
        }
    }
    throw new TypeError("Unknown source responseType: " + Object.prototype.toString.call(source));

    function _isLocalFile(url) {
        return !/^(https?|wss?|blob):/.test(url);
    }
}

return FileLoader; // return entity

});

