(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("FileLoader", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var URI = WebModule["URI"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var _fileHandler = IN_NODE ? _nodeFileHandler : _browserFileHandler;
var NOP = function() {};
var _itemIndexCounter = 0;
// --- class / interfaces ----------------------------------
var FileLoader = {
    "VERBOSE":         VERBOSE,
    "DUMP_DIR":        "./dump/",
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
                         options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_load, "url");
        $valid($type(responseType,  "String|omit"),   FileLoader_load, "responseType");
        $valid($some(responseType,  "String|Text|JSON|Blob|ArrayBuffer", true), FileLoader_load, "responseType");
        $valid($type(readyCallback, "Function"),      FileLoader_load, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_load, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_load, "options");
        if (options) {
            $valid($keys(options,         "timeout|dump"), FileLoader_load, "options");
            $valid($type(options.timeout, "UINT32|omit"),  FileLoader_load, "options.timeout");
            $valid($type(options.dump,    "Boolean|omit"), FileLoader_load, "options.dump");
        }
    }
//}@dev

    _fileHandler(url, readyCallback, errorCallback || NOP, responseType.toLowerCase(), options || {});
}

function FileLoader_loadString(url,           // @arg URLString
                               readyCallback, // @arg Function - readyCallback(result:String, url:URLString, httpStatusCode:UINT16):void
                               errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                               options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_loadString, "url");
        $valid($type(readyCallback, "Function"),      FileLoader_loadString, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadString, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadString, "options");
        if (options) {
            $valid($keys(options,         "timeout|dump"), FileLoader_loadString, "options");
            $valid($type(options.timeout, "UINT32|omit"),  FileLoader_loadString, "options.timeout");
            $valid($type(options.dump,    "Boolean|omit"), FileLoader_loadString, "options.dump");
        }
    }
//}@dev

    _fileHandler(url, readyCallback, errorCallback || NOP, "", options || {});
}

function FileLoader_loadJSON(url,           // @arg URLString
                             readyCallback, // @arg Function - readyCallback(result:JSON, url:URLString, httpStatusCode:UINT16):void
                             errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                             options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_loadJSON, "url");
        $valid($type(readyCallback, "Function"),      FileLoader_loadJSON, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadJSON, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadJSON, "options");
        if (options) {
            $valid($keys(options,         "timeout|dump"), FileLoader_loadJSON, "options");
            $valid($type(options.timeout, "UINT32|omit"),  FileLoader_loadJSON, "options.timeout");
            $valid($type(options.dump,    "Boolean|omit"), FileLoader_loadJSON, "options.dump");
        }
    }
//}@dev

    _fileHandler(url, readyCallback, errorCallback || NOP, "json", options || {});
}

function FileLoader_loadBlob(url,           // @arg URLString
                             readyCallback, // @arg Function - readyCallback(result:Blob, url:URLString, httpStatusCode:UINT16):void
                             errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                             options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_loadBlob, "url");
        $valid($type(readyCallback, "Function"),      FileLoader_loadBlob, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadBlob, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadBlob, "options");
        if (options) {
            $valid($keys(options,         "timeout|dump"), FileLoader_loadBlob, "options");
            $valid($type(options.timeout, "UINT32|omit"),  FileLoader_loadBlob, "options.timeout");
            $valid($type(options.dump,    "Boolean|omit"), FileLoader_loadBlob, "options.dump");
        }
    }
//}@dev

    _fileHandler(url, readyCallback, errorCallback || NOP, "blob", options || {});
}

function FileLoader_loadArrayBuffer(url,           // @arg URLString
                                    readyCallback, // @arg Function - readyCallback(result:ArrayBuffer, url:URLString, httpStatusCode:UINT16):void
                                    errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16):void
                                    options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     FileLoader_loadArrayBuffer, "url");
        $valid($type(readyCallback, "Function"),      FileLoader_loadArrayBuffer, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), FileLoader_loadArrayBuffer, "errorCallback");
        $valid($type(options,       "Object|omit"),   FileLoader_loadArrayBuffer, "options");
        if (options) {
            $valid($keys(options,         "timeout|dump"), FileLoader_loadArrayBuffer, "options");
            $valid($type(options.timeout, "UINT32|omit"),  FileLoader_loadArrayBuffer, "options.timeout");
            $valid($type(options.dump,    "Boolean|omit"), FileLoader_loadArrayBuffer, "options.dump");
        }
    }
//}@dev

    _fileHandler(url, readyCallback, errorCallback || NOP, "arraybuffer", options || {});
}

function _browserFileHandler(url, readyCallback, errorCallback, responseType, options) {
    var xhr  = new XMLHttpRequest();
    var dump = options["dump"] || false;

    // http://www.w3.org/TR/2008/WD-XMLHttpRequest2-20080225/
    if (responseType) {
        xhr["responseType"] = responseType;
    }
    xhr["onload"] = function() {
        if ((IN_NW || IN_EL) && xhr.status === 0) { // maybe file: url
            if (dump) {
                _dump(url, xhr);
            }
            readyCallback(xhr["response"], url, 200); // code = 200
        } else if (xhr.status >= 200 && xhr.status < 300) {
            if (dump) {
                _dump(url, xhr);
            }
            readyCallback(xhr["response"], url, xhr.status); // code = 200 - 299
        } else if (errorCallback) {
            errorCallback(new Error(xhr["statusText"] || ""), url, xhr.status); // 404, 500, ...
        }
        gc(xhr);
        xhr = null;
    };
    xhr["onerror"] = function(/* event */) { // ProgressEvent
        errorCallback(new Error("ERROR"), url, 500); // 500
        gc(xhr);
        xhr = null;
    };
    xhr["ontimeout"] = function(/* event */) { // ProgressEvent
        errorCallback(new Error("TIMEOUT"), url, 500); // 500
        gc(xhr);
        xhr = null;
    };
    xhr["onabort"] = function(/* event */) { // ProgressEvent
        errorCallback(new Error("ABORT"), url, 500); // 500
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

function _nodeFileHandler(url, readyCallback, errorCallback, responseType, options) {
    var fs = require("fs");
    var originalURL = url;

    if ( URI["isRelative"](url) ) {
        var uriObject = URI(url);

        // relative url to remove "?query=string" and "#fragment"
        url = uriObject["origin"] + uriObject["pathname"];
    }

    var timeout = options.timeout || 0;
    var timeouted = false;

    switch (responseType) {
    case "":
    case "json":
        try {
            fs["readFile"](url, "utf8", function(error, text) {
                if (error || timeouted) {
                    errorCallback(error, originalURL, 500);
                } else {
                    if (responseType === "json") {
                        try {
                            readyCallback(JSON.parse(text), originalURL, 200);
                        } catch ( o__o ) {
                            errorCallback(o__o, originalURL, 500); // JSON format error
                        }
                    } else {
                        readyCallback(text, originalURL, 200);
                    }
                }
            });
        } catch ( o__o ) {
            errorCallback(o__o, originalURL, o__o["code"] === "ENOENT" ? 404 : 500);
        } finally {
            if (timeout) {
                setTimeout(function() {
                    timeouted = true;
                }, timeout);
            }
        }
        break;
    case "arraybuffer":
        try {
            fs["readFile"](url, function(error, // @arg Error
                                         b) {   // @arg NodeBuffer
                if (error || timeouted) {
                    errorCallback(error, originalURL, 500);
                } else {
                    // http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer/12101012#12101012
                    readyCallback(new Uint8Array(b)["buffer"], originalURL);
                }
            });
        } catch ( o__o ) {
            errorCallback(o__o, originalURL, o__o["code"] === "ENOENT" ? 404 : 500);
        } finally {
            if (timeout) {
                setTimeout(function() {
                    timeouted = true;
                }, timeout);
            }
        }
        break;
  //case "blob":
    default:
        errorCallback(new Error("Sorry, function is not implemented"), originalURL);
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
    errorCallback = errorCallback || NOP;

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
            if ( URI["isRelative"](source) ) {
                if (global["require"]) {
                    try {
                        var result = require("fs")["readFileSync"](source);

                        readyCallback( new Uint8Array(result)["buffer"], source );
                    } catch ( o__o ) {
                        errorCallback(o__o, source);
                    }
                    return;
                }
            }
            _fileHandler(source, readyCallback, errorCallback, "arraybuffer", options || {});
            return;
        }
        if (global["Blob"] && global["FileReader"]) {
            if (source instanceof Blob) { // Blob or File -> ArrayBuffer
                _convertBlobToArrayBuffer(source, readyCallback, errorCallback);
                return;
            }
        }
    }
    throw new TypeError("Unknown source responseType: " + Object.prototype.toString.call(source));
}

function _convertBlobToArrayBuffer(source,          // @arg Blob
                                   readyCallback,   // @arg Function - readyCallback(result:ArrayBuffer, source:Blob):void
                                   errorCallback) { // @arg Function = null - errorCallback(error:Error, source:Blob):void
                                           // @ret ArrayBuffer
//{@dev
    if (VERIFY) {
        $valid($type(source,        "Blob"),          _convertBlobToArrayBuffer, "source");
        $valid($type(readyCallback, "Function"),      _convertBlobToArrayBuffer, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), _convertBlobToArrayBuffer, "errorCallback");
    }
//}@dev

    if (!global["Blob"] || !global["FileReader"]) {
        if (errorCallback) {
            errorCallback(new Error("UNSUPPORTED FUNCTION"), source);
        }
    } else {
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
    }
}

function _dump(url, xhr) {
    if (IN_NW || IN_EL) {
        var fs = global["require"]("fs");
        var dir = FileLoader["DUMP_DIR"];
        var responseType = xhr["responseType"] || "text";

        _makeDir(dir);

        var itemIndex       = _itemIndexCounter++;
        var indexFilePath   = dir + "index.json";
        var localFilePath   = dir + itemIndex + "." + URI(url)["file"];
        var response        = xhr["response"]; // arraybuffer / text / json ...
        var bytes           = 0;

        switch (responseType) {
        case "text":        bytes = response.length; break;
        case "json":        bytes = JSON.stringify(response).length; break;
        case "document":    bytes = response["documentElement"]["outerHTML"].length; break;
        case "arraybuffer": bytes = response.byteLength; break;
        case "blob":        bytes = response.size; break;
        }

        _updateIndexFile(indexFilePath, itemIndex, url, responseType, bytes, xhr["getAllResponseHeaders"]());

        switch (responseType) {
        case "text":        fs["writeFile"](localFilePath, response, "utf8"); break;
        case "json":        fs["writeFile"](localFilePath, JSON.stringify(response), "utf8"); break;
        case "document":    fs["writeFile"](localFilePath, response["documentElement"]["outerHTML"], "utf8"); break;
        case "arraybuffer": fs["writeFile"](localFilePath, new Buffer(response)); break;
        case "blob":        _convertBlobToArrayBuffer(response, function(arrayBuffer) {
                                fs["writeFile"](localFilePath, new Buffer(arrayBuffer));
                            });
        }
    }

    function _makeDir(dir) {
        if (!fs["existsSync"](dir)) { // if not exists -> make dir
            fs["mkdirSync"](dir);
        }
    }

    function _updateIndexFile(path, itemIndex, url, responseType, bytes, header) {
        //  json = {
        //      itemIndex: {
        //          "url": URLString,
        //          "date": DateTimeString,
        //          "time": UINT32,
        //          "type": ResponseTypeString,
        //          "bytes": UINT32,
        //          "header": ResponseHeaderString,
        //      }
        //  }
        var json = {};

        if ( fs["existsSync"](path) ) {
            json = JSON.parse(fs["readFileSync"](path, "utf8"));
        }

        json[itemIndex] = {
            "url":      url,
            "date":     new Date() + "",
            "time":     Date.now(),
            "type":     responseType,
            "header": header
        };
        fs["writeFileSync"](path, JSON.stringify(json, null, 2), "utf8");
    }
}

return FileLoader; // return entity

});

