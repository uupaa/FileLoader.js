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
var _fileLoader = IN_NODE ? _nodeFileLoader : _browserFileLoader;
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
                         responseType,  // @arg ResponseTypeString = "string" - ignore case string. "string", "text", "json", "blob", "arraybuffer"
                         readyCallback, // @arg Function - readyCallback(result:Any, url:URLString, code:HTTPStatusCodeUINT16):void
                         errorCallback, // @arg Function = null - errorCallback(error:DetailError, url:URLString, code:HTTPStatusCodeUINT16):void
                         options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
    _fileLoader(url, responseType || "string", readyCallback, errorCallback, options);
}

function FileLoader_loadString(url,           // @arg URLString
                               readyCallback, // @arg Function - readyCallback(result:String, url:URLString, code:HTTPStatusCodeUINT16):void
                               errorCallback, // @arg Function = null - errorCallback(error:DetailError, url:URLString, code:HTTPStatusCodeUINT16):void
                               options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
    _fileLoader(url, "string", readyCallback, errorCallback, options);
}

function FileLoader_loadJSON(url,           // @arg URLString
                             readyCallback, // @arg Function - readyCallback(result:JSON, url:URLString, code:HTTPStatusCodeUINT16):void
                             errorCallback, // @arg Function = null - errorCallback(error:DetailError, url:URLString, code:HTTPStatusCodeUINT16):void
                             options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
    _fileLoader(url, "json", readyCallback, errorCallback, options);
}

function FileLoader_loadBlob(url,           // @arg URLString
                             readyCallback, // @arg Function - readyCallback(result:Blob, url:URLString, code:HTTPStatusCodeUINT16):void
                             errorCallback, // @arg Function = null - errorCallback(error:DetailError, url:URLString, code:HTTPStatusCodeUINT16):void
                             options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
    _fileLoader(url, "blob", readyCallback, errorCallback, options);
}

function FileLoader_loadArrayBuffer(url,           // @arg URLString
                                    readyCallback, // @arg Function - readyCallback(result:ArrayBuffer, url:URLString, code:HTTPStatusCodeUINT16):void
                                    errorCallback, // @arg Function = null - errorCallback(error:DetailError, url:URLString, code:HTTPStatusCodeUINT16):void
                                    options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
    _fileLoader(url, "arraybuffer", readyCallback, errorCallback, options);
}

function _browserFileLoader(url,           // @arg URLString
                            responseType,  // @arg ResponseTypeString - ignore case string. "string", "text", "json", "blob", "arraybuffer"
                            readyCallback, // @arg Function - readyCallback(result:Any, url:URLString, code:HTTPStatusCodeUINT16):void
                            errorCallback, // @arg Function = null - errorCallback(error:DetailError, url:URLString, code:HTTPStatusCodeUINT16):void
                            options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     _browserFileLoader, "url");
        $valid($type(responseType,  "String"),   _browserFileLoader, "responseType");
        $valid($some(responseType,  "string|text|json|blob|arraybuffer", true), _browserFileLoader, "responseType");
        $valid($type(readyCallback, "Function"),      _browserFileLoader, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), _browserFileLoader, "errorCallback");
        $valid($type(options,       "Object|omit"),   _browserFileLoader, "options");
        if (options) {
            $valid($keys(options,         "timeout|dump"), _browserFileLoader, "options");
            $valid($type(options.timeout, "UINT32|omit"),  _browserFileLoader, "options.timeout");
            $valid($type(options.dump,    "Boolean|omit"), _browserFileLoader, "options.dump");
        }
    }
//}@dev

    options = options || {};
    errorCallback = errorCallback || function(error, url, code) {
        console.error(error.message, url, code);
    };

    var xhr  = new XMLHttpRequest();
    var dump = options["dump"] || false;

    // http://www.w3.org/TR/2008/WD-XMLHttpRequest2-20080225/
    if (responseType && /string/i.test(responseType)) {
        responseType = "text";
    }
    if (responseType) {
        xhr["responseType"] = responseType.toLowerCase();
    }
    xhr["onload"] = function() {
        if (xhr.readyState === 4) {
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
            } else {
                _fireDetailError(errorCallback, xhr["statusText"] || "", url, xhr.status || 400);
            }
            gc(xhr);
            xhr = null;
        }
    };
    xhr["onerror"] = function(/* event */) { // @arg ProgressEvent
        _fireDetailError(errorCallback, "ERROR", url, 404);
        gc(xhr);
        xhr = null;
    };
    xhr["ontimeout"] = function(/* event */) { // @arg ProgressEvent
        _fireDetailError(errorCallback, "TIMEOUT", url, 408);
        gc(xhr);
        xhr = null;
    };
    xhr["onabort"] = function(/* event */) { // @arg ProgressEvent
        _fireDetailError(errorCallback, "ABORT", url, 400);
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

function _nodeFileLoader(url,           // @arg URLString
                         responseType,  // @arg ResponseTypeString - ignore case string. "string", "text", "json", "blob", "arraybuffer"
                         readyCallback, // @arg Function - readyCallback(result:Any, url:URLString, code:HTTPStatusCodeUINT16):void
                         errorCallback, // @arg Function = null - errorCallback(error:DetailError, url:URLString, code:HTTPStatusCodeUINT16):void
                         options) {     // @arg Object = {} - { timeout:UINT32, dump:Boolean }

//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),     _nodeFileLoader, "url");
        $valid($type(responseType,  "String"),        _nodeFileLoader, "responseType");
        $valid($some(responseType,  "string|text|json|blob|arraybuffer", true), _nodeFileLoader, "responseType");
        $valid($type(readyCallback, "Function"),      _nodeFileLoader, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), _nodeFileLoader, "errorCallback");
        $valid($type(options,       "Object|omit"),   _nodeFileLoader, "options");
        if (options) {
            $valid($keys(options,         "timeout|dump"), _nodeFileLoader, "options");
            $valid($type(options.timeout, "UINT32|omit"),  _nodeFileLoader, "options.timeout");
            $valid($type(options.dump,    "Boolean|omit"), _nodeFileLoader, "options.dump");
        }
    }
//}@dev

    options = options || {};
    errorCallback = errorCallback || function(error, url, code) {
        console.error(error.message, url, code);
    };

    var timeout = options["timeout"] || 0;

    switch (responseType.toLowerCase()) {
    case "string":
    case "text":        _readFileAsync(url, "string", readyCallback, errorCallback, timeout); break;
    case "json":        _readFileAsync(url, "string", function(text, url/*, code */) {
                            _convertStringToJSON(text, url, readyCallback, errorCallback);
                        }, errorCallback, timeout);
                        break;
    case "arraybuffer": _readFileAsync(url, "binary", readyCallback, errorCallback, timeout); break;
    case "blob":        _readFileAsync(url, "binary", readyCallback, errorCallback, timeout); break; // [!] return ArrayBuffer
    }
}

function FileLoader_toArrayBuffer(source,        // @arg BlobURLString|URLString|Blob|File|TypedArray|ArrayBuffer
                                  readyCallback, // @arg Function - readyCallback(result:ArrayBuffer, source:Any):void
                                  errorCallback, // @arg Function = null - errorCallback(error:DetailError, source:Any):void
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

    errorCallback = errorCallback || function(error) {
        console.error("FileLoader_toArrayBuffer", error.message);
    };

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
                    _readFileAsync(source, "binary", function(result /*, url, code */) {
                        readyCallback(result, source);
                    }, function(error /*, url, code */) {
                        errorCallback(error, source);
                    });
                }
            }
            _fileLoader(source, "arraybuffer", readyCallback, errorCallback, options);
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
                                   errorCallback) { // @arg Function - errorCallback(error:DetailError, source:Blob):void
                                           // @ret ArrayBuffer
    if (!global["Blob"] || !global["FileReader"]) {
        errorCallback(new Error("Unsupported function"), source);
    } else {
        var reader = new FileReader();

        reader["onload"] = function() {
            readyCallback(reader["result"], source);
            reader["onerror"] = null;
            reader["onload"] = null;
            reader = null;
        };
        reader["onerror"] = function() {
            errorCallback(reader["error"], source);
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
                            }, function() {});
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

function _readFileAsync(url,           // @arg URLString
                        responseType,  // @arg String
                        readyCallback, // @arg Function - readyCallback(result:String|ArrayBuffer, url:URLString, code:HTTPStatusCodeUINT16):void
                        errorCallback, // @arg Function - errorCallback(error:DetailError, url:URLString, code:UINT16):void
                        timeout) {     // @arg UINT32
    var fs = require("fs");
    var absURL = _toAbsoluteURL(url);
    var timeouted = false;

    try {
        switch (responseType) {
        case "string": fs["readFile"](absURL, "utf8", _onfileread); break;
        case "binary": fs["readFile"](absURL,         _onfileread);
        }
    } catch ( o__o ) {
        _fireDetailError(errorCallback, o__o, url, o__o["code"] === "ENOENT" ? 404 : 400);
    } finally {
        if (timeout) {
            setTimeout(function() {
                timeouted = true;
            }, timeout);
        }
    }

    function _onfileread(error, response) {
        if (error) {
            _fireDetailError(errorCallback, error, url, 400);
        } else if (timeouted) {
            _fireDetailError(errorCallback, error, url, 408);
        } else {
            switch (responseType) {
            case "string": readyCallback(response, url, 200); break;
            case "binary": readyCallback(new Uint8Array(response)["buffer"], url, 200);
            }
        }
    }
}

function _toAbsoluteURL(url) {
    if ( URI["isRelative"](url) ) {
        var uriObject = URI(url);

        // relative url to remove "?query=string" and "#fragment"
        return uriObject["origin"] + uriObject["pathname"];
    }
    return url;
}

function _convertStringToJSON(str,             // @arg JSONString
                              url,             // @arg URLString - source url
                              readyCallback,   // @arg Function - readyCallback(json:JSONObject):void
                              errorCallback) { // @arg Function - errorCallback(error:DetailError):void
                                               // @ret JSONObject
    try {
        var json = JSON.parse(str);
        readyCallback(json, url, 200);
    } catch ( o__o ) {
        _fireDetailError(errorCallback, o__o, url, 400);
    }
}

function _fireDetailError(errorCallback, // @arg Function
                          error,         // @arg Error|ErrorMessageString
                          url,           // @arg URLString
                          code) {        // @arg HTTPStatusCodeUINT16
    error = error instanceof Error ? error
                                   : new Error(error);
    error["detail"] = { "url": url, "code": code };
    errorCallback(error, url, code);
}

return FileLoader; // return entity

});

