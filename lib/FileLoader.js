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
                               readyCallback,   // @arg Function - readyCallback(result:String, url:URLString):void
                               errorCallback) { // @arg Function = null - errorCallback(error:Error, url:URLString):void
//{@dev
    $valid($type(url,           "URLString"),     FileLoader_loadString, "url");
    $valid($type(readyCallback, "Function"),      FileLoader_loadString, "readyCallback");
    $valid($type(errorCallback, "Function|omit"), FileLoader_loadString, "errorCallback");
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "");
}

function FileLoader_loadJSON(url,             // @arg URLString
                             readyCallback,   // @arg Function - readyCallback(result:JSON, url:URLString):void
                             errorCallback) { // @arg Function = null - errorCallback(error:Error, url:URLString):void
//{@dev
    $valid($type(url,           "URLString"),     FileLoader_loadBlob, "url");
    $valid($type(readyCallback, "Function"),      FileLoader_loadBlob, "readyCallback");
    $valid($type(errorCallback, "Function|omit"), FileLoader_loadBlob, "errorCallback");
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "json");
}

function FileLoader_loadBlob(url,             // @arg URLString
                             readyCallback,   // @arg Function - readyCallback(result:Blob, url:URLString):void
                             errorCallback) { // @arg Function = null - errorCallback(error:Error, url:URLString):void
//{@dev
    $valid($type(url,           "URLString"),     FileLoader_loadBlob, "url");
    $valid($type(readyCallback, "Function"),      FileLoader_loadBlob, "readyCallback");
    $valid($type(errorCallback, "Function|omit"), FileLoader_loadBlob, "errorCallback");
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "blob");
}

function FileLoader_loadArrayBuffer(url,             // @arg URLString
                                    readyCallback,   // @arg Function - readyCallback(result:ArrayBuffer, statusCode:UINT, url:URLString):void
                                    errorCallback) { // @arg Function = null - errorCallback(error:Error, statusCode:UINT, url:URLString):void
//{@dev
    $valid($type(url,           "URLString"),     FileLoader_loadArrayBuffer, "url");
    $valid($type(readyCallback, "Function"),      FileLoader_loadArrayBuffer, "readyCallback");
    $valid($type(errorCallback, "Function|omit"), FileLoader_loadArrayBuffer, "errorCallback");
//}@dev

    _fileLoadHandler(url, readyCallback, errorCallback, "arraybuffer");
}

function _browserFileLoadHandler(url, readyCallback, errorCallback, type) {
    var xhr = new XMLHttpRequest();

    if (type) {
        xhr["responseType"] = type;
    }
    xhr["onload"] = function() {
        if ((IN_NW || IN_EL) && xhr.status === 0) {
            readyCallback(xhr["response"], 200, url); // 200
        } else if (xhr.status >= 200 && xhr.status < 300) {
            readyCallback(xhr["response"], xhr.status, url); // 200 - 299
        } else if (errorCallback) {
            errorCallback(new Error(xhr["statusText"] || ""), xhr.status, url); // 404, 500, ...
        }
        xhr["onerror"] = null;
        xhr["onload"] = null;
        xhr = null;
    };
    xhr["onerror"] = function(event) {
        errorCallback(event, 500, url); // 500
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
        fs["readFile"](url, "utf8", function(error, text) {
            if (error) {
                errorCallback(error, url);
            } else {
                readyCallback(text, url);
            }
        });
        break;
    case "json":
        fs["readFile"](url, "utf8", function(error, text) {
            if (error) {
                errorCallback(error, url);
            } else {
                try {
                    readyCallback( JSON.parse(text), url );
                } catch (error) {
                    errorCallback( error, url );
                }
            }
        });
        break;
    case "arraybuffer":
        fs["readFile"](url, function(error, // @arg Error
                                     b) {   // @arg NodeBuffer
            if (error) {
                errorCallback(error, url);
            } else {
                // http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer/12101012#12101012
                var arrayBuffer = b["buffer"]["slice"](b["byteOffset"],
                                                       b["byteOffset"] + b["byteLength"]);
                readyCallback(arrayBuffer, url);
            }
        });
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
        if (IN_NW || IN_EL) {
            if (typeof source === "string" && _isLocalFile(source)) { // BlobURLString or URLString
                try {
                    var fs = require("fs");
                    var result = fs["readFileSync"](source);
                    readyCallback(new Uint8Array(result).buffer, source);
                } catch ( o__o ) {
                    if (errorCallback) {
                        errorCallback(o__o, source);
                    }
                }
                return;
            }
        }
        if (global["XMLHttpRequest"]) {
            // http://www.w3.org/TR/2008/WD-XMLHttpRequest2-20080225/
            if (typeof source === "string") { // BlobURLString or URLString -> ArrayBuffer
                var xhr = new XMLHttpRequest();

                xhr["responseType"] = "arraybuffer";
                xhr["onload"] = function() {
                    if ((IN_NW || IN_EL) && xhr.status === 0) {
                        readyCallback(xhr["response"], source);
                    } else if (xhr.status >= 200 && xhr.status < 300) {
                        readyCallback(xhr["response"], source);
                    } else if (errorCallback) {
                        errorCallback( new Error(xhr["statusText"] || "", source) );
                    }
                    xhr["onerror"] = null;
                    xhr["onload"] = null;
                    xhr = null;
                };
                xhr["onerror"] = function(event) {
                    errorCallback(event, source);
                    xhr["onerror"] = null;
                    xhr["onload"] = null;
                    xhr = null;
                };
                xhr.open("GET", source);
                xhr.send();
                return;
            }
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
    throw new TypeError("Unknown source type");

    function _isLocalFile(url) {
        return !/^(https?|wss?):/.test(url);
    }
}

return FileLoader; // return entity

});

