(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("FileLoader", function moduleClosure(global /*, WebModule, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var _fileLoadHandler = IN_NODE ? _nodeFileLoadHandler : _browserFileLoadHandler;
// --- class / interfaces ----------------------------------
var FileLoader = {
    "loadString":      FileLoader_loadString,      // FileLoader.loadString(url:URLString, readyCallback:Function, errorCallback:Function = null):void
    "loadJSON":        FileLoader_loadJSON,        // FileLoader.loadJSON(url:URLString, readyCallback:Function, errorCallback:Function = null):void
    "loadBlob":        FileLoader_loadBlob,        // FileLoader.loadBlob(url:URLString, readyCallback:Function, errorCallback:Function = null):void
    "loadArrayBuffer": FileLoader_loadArrayBuffer, // FileLoader.loadArrayBuffer(url:URLString, readyCallback:Function, errorCallback:Function = null):void
    "toArrayBuffer":   FileLoader_toArrayBuffer,   // FileLoader.toArrayBuffer(source:BlobURLString|URLString|Blob|File|TypedArray|ArrayBuffer,
                                                   //                          readyCallback:Function, errorCallback:Function = null):void
};

// --- implements ------------------------------------------
function FileLoader_loadString(url,             // @arg URLString
                               readyCallback,   // @arg Function - readyCallback(result:String, url:URLString, httpStatusCode:UINT16):void
                               errorCallback) { // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
//{@dev
    $valid($type(url,           "URLString"),     FileLoader_loadString, "url");
    $valid($type(readyCallback, "Function"),      FileLoader_loadString, "readyCallback");
    $valid($type(errorCallback, "Function|omit"), FileLoader_loadString, "errorCallback");
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "");
}

function FileLoader_loadJSON(url,             // @arg URLString
                             readyCallback,   // @arg Function - readyCallback(result:JSON, url:URLString, httpStatusCode:UINT16):void
                             errorCallback) { // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
//{@dev
    $valid($type(url,           "URLString"),     FileLoader_loadBlob, "url");
    $valid($type(readyCallback, "Function"),      FileLoader_loadBlob, "readyCallback");
    $valid($type(errorCallback, "Function|omit"), FileLoader_loadBlob, "errorCallback");
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "json");
}

function FileLoader_loadBlob(url,             // @arg URLString
                             readyCallback,   // @arg Function - readyCallback(result:Blob, url:URLString, httpStatusCode:UINT16):void
                             errorCallback) { // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
//{@dev
    $valid($type(url,           "URLString"),     FileLoader_loadBlob, "url");
    $valid($type(readyCallback, "Function"),      FileLoader_loadBlob, "readyCallback");
    $valid($type(errorCallback, "Function|omit"), FileLoader_loadBlob, "errorCallback");
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "blob");
}

function FileLoader_loadArrayBuffer(url,             // @arg URLString
                                    readyCallback,   // @arg Function - readyCallback(result:ArrayBuffer, url:URLString, httpStatusCode:UINT16):void
                                    errorCallback) { // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
//{@dev
    $valid($type(url,           "URLString"),     FileLoader_loadArrayBuffer, "url");
    $valid($type(readyCallback, "Function"),      FileLoader_loadArrayBuffer, "readyCallback");
    $valid($type(errorCallback, "Function|omit"), FileLoader_loadArrayBuffer, "errorCallback");
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "arraybuffer");
}

function _browserFileLoadHandler(url, readyCallback, errorCallback, type) {
    var xhr = new XMLHttpRequest();

    // http://www.w3.org/TR/2008/WD-XMLHttpRequest2-20080225/
    if (type) {
        xhr["responseType"] = type;
    }
    xhr["onload"] = function() {
        if ((IN_NW || IN_EL) && xhr.status === 0) {
            readyCallback(xhr["response"], url, 200); // 200
        } else if (xhr.status >= 200 && xhr.status < 300) {
            readyCallback(xhr["response"], url, xhr.status); // 200 - 299
        } else if (errorCallback) {
            errorCallback(new Error(xhr["statusText"] || ""), url, xhr.status); // 404, 500, ...
        }
        xhr["onerror"] = null;
        xhr["onload"] = null;
        xhr = null;
    };
    xhr["onerror"] = function(event) {
        errorCallback(event, url, 500); // 500
        xhr["onerror"] = null;
        xhr["onload"] = null;
        xhr = null;
    };
    xhr.open("GET", url);
    xhr.send();
}

function _nodeFileLoadHandler(url, readyCallback, errorCallback, type) {
    var fs = require("fs");

    switch (type) {
    case "":
    case "json":
        try {
            fs["readFile"](url, "utf8", function(error, text) {
                if (error) {
                    errorCallback(error, url, 500);
                } else {
                    if (type === "json") {
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

function FileLoader_toArrayBuffer(source,          // @arg BlobURLString|URLString|Blob|File|TypedArray|ArrayBuffer
                                  readyCallback,   // @arg Function - readyCallback(result:ArrayBuffer, source:Any):void
                                  errorCallback) { // @arg Function = null - errorCallback(error:Error, source:Any):void
                                                   // @desc read file.
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
            _fileLoadHandler(source, readyCallback, errorCallback, "arraybuffer");
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
    throw new TypeError("Unknown source type: " + Object.prototype.toString.call(source));

    function _isLocalFile(url) {
        return !/^(https?|wss?):/.test(url);
    }
}

return FileLoader; // return entity

});

