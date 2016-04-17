(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("FileLoaderQueue", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
/*
The FileLoaderQueue provides the ability to download the assets.

- API
    - FileLoaderQueue.addQueue()

 */
// --- dependency modules ----------------------------------
var URI        = WebModule["URI"];
var FileLoader = WebModule["FileLoader"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function FileLoaderQueue(options) { // @arg Object = {} - { maxConnections, queueInterval, retryInterval }
                                    // @options.maxConnections UINT8 = 3 - maxConnections
                                    // @options.queueInterval UINT32 = 16 - queue process interval. ms
                                    // @options.retryInterval UINT32 = 1000 - queue process interval. ms
//{@dev
    $valid($type(options, "Object|omit"), FileLoaderQueue, "options");
    if (options) {
        $valid($keys(options, "maxConnections|queueInterval|retryInterval"), FileLoaderQueue, "options");
        $valid($type(options.maxConnections, "UINT8|omit"), FileLoaderQueue, "options.maxConnections");
        $valid($type(options.queueInterval,  "UINT8|omit"), FileLoaderQueue, "options.queueInterval");
        $valid($type(options.retryInterval,  "UINT8|omit"), FileLoaderQueue, "options.retryInterval");
    }
//}@dev

    options = options || {};

    var maxConnections = options["maxConnections"] || 3;

    this._taskState = []; // [ "ready" or "progress", ... ]

    for (var i = 0; i < maxConnections; ++i) {
        this._taskState.push("ready");
    }

    this._queueInterval = options["queueInterval"] || 16;
    this._retryInterval = options["retryInterval"] || 1000;
    this._highPriorityQueue = []; // [ job, ... ]
    this._midPriorityQueue  = []; // [ job, ... ]
    this._tickfn = _tick.bind(this);
}

FileLoaderQueue["VERBOSE"] = VERBOSE;
FileLoaderQueue["prototype"] = Object.create(FileLoaderQueue, {
    "constructor":  { "value": FileLoaderQueue          }, // new FileLoaderQueue(maxConnections:UINT8 = 3):FileLoaderQueue
    "add":          { "value": FileLoaderQueue_add      }, // FileLoaderQueue#add(url, responseType, readyCallback, errorCallback, options):void
    "clear":        { "value": FileLoaderQueue_clear    }, // FileLoaderQueue#clear():void
    "length": {
        "get": function()  {
            return this._highPriorityQueue.length +
                   this._midPriorityQueue.length;
        }
    },
});

// --- implements ------------------------------------------
function FileLoaderQueue_add(url,           // @arg URLString
                             responseType,  // @arg ResponseTypeString = "String" - ignore case string. "String", "Text", "JSON", "Blob", "ArrayBuffer"
                             readyCallback, // @arg Function - readyCallback(result:Any, url:URLString, httpStatusCode:UINT16, options:Object):void
                             errorCallback, // @arg Function = null - errorCallback(error:Error, url:URLString, httpStatusCode:UINT16, options:Object):void
                             options) {     // @arg Object = {} - { retryCount, cacheBusting, highPriority, timeout }
                                            // @param.retryCount UINT8 = 3 - retry count
                                            // @param.cacheBusting String = "" - cache busting keyword, enable cache busting.
                                            // @param.highPriority Boolean = false
                                            // @param.timeout UINT32 = 0
//{@dev
    $valid($type(url,           "URLString"),          FileLoaderQueue_add, "url");
    $valid($type(responseType,  "ResponseTypeString"), FileLoaderQueue_add, "responseType");
    $valid($some(responseType,  "String|Text|JSON|Blob|ArrayBuffer", true), FileLoaderQueue_add, "responseType");
    $valid($type(readyCallback, "Function"),           FileLoaderQueue_add, "readyCallback");
    $valid($type(errorCallback, "Function|omit"),      FileLoaderQueue_add, "errorCallback");
    $valid($type(options,       "Object|omit"),        FileLoaderQueue_add, "options");
    if (options) {
        $valid($keys(options,   "retryCount|cacheBusting|highPriority|timeout"), FileLoaderQueue_add, "options");
        $valid($type(options.retryCount,   "UINT8|omit"),   FileLoaderQueue_add, "options.retryCount");
        $valid($type(options.cacheBusting, "String|omit"),  FileLoaderQueue_add, "options.cacheBusting");
        $valid($type(options.highPriority, "Boolean|omit"), FileLoaderQueue_add, "options.highPriority");
        $valid($type(options.timeout,      "UINT32|omit"),  FileLoaderQueue_add, "options.timeout");
    }
//}@dev

    options = options || {};

    var job = {
            url:            url,
            retryCount:     options["retryCount"]   || 3,
            cacheBusting:   options["cacheBusting"] || "",
            highPriority:   options["highPriority"] || false,
            responseType:   responseType,
            readyCallback:  readyCallback,
            errorCallback:  errorCallback || function() {},
            options:        options, // keep object ref
        };

    if (job.cacheBusting) {
        job.url = URI["addCacheBustingKeyword"](job.url, job.cacheBusting);
    }
    if (job.highPriority) {
        this._highPriorityQueue.push(job);
    } else {
        this._midPriorityQueue.push(job);
    }
    this._tickfn();
}

function FileLoaderQueue_clear() {
    this._highPriorityQueue.length = 0;
    this._midPriorityQueue.length = 0;
}

function _tick() {
    var that = this;
    var length = this._highPriorityQueue.length + this._midPriorityQueue.length;

    if (length) {
        setTimeout(this._tickfn, this._queueInterval);

        if (this._taskState.indexOf("ready") >= 0) {
            this._taskState.forEach(function(state, index) {
                if (state === "progress") { return; } // progress -> skip

                // fetch a job from ordered queue.
                var job = that._highPriorityQueue.length ? that._highPriorityQueue.shift()
                        : that._midPriorityQueue.length  ? that._midPriorityQueue.shift()
                        : null;

                if (!job) { return; } // no job

                // update task state. ready -> progress
                that._taskState[index] = "progress";

                FileLoader["load"](job.url, job.responseType, function(result, url, httpStatusCode) {
                    job.readyCallback(result, url, httpStatusCode, job.options);
                    that._taskState[index] = "ready"; // progress -> ready
                    that._tickfn();
                }, function(error, url, httpStatusCode) {

                    setTimeout(function() {
                        if (--job.retryCount > 0) {
                            // retry, add queue to tail.
                            if (job.highPriority) {
                                that._highPriorityQueue.push(job);
                            } else {
                                that._midPriorityQueue.push(job);
                            }
                        } else {
                            if (FileLoaderQueue["VERBOSE"]) {
                                console.error("FileLoaderQueue. retry out: " + job.url);
                            }
                            job.errorCallback(error, url, httpStatusCode, job.options);
                        }
                        that._taskState[index] = "ready"; // progress -> ready
                        that._tickfn();
                    }, that._retryInterval);

                }, { "timeout": job.options["timeout"] || 0 });
            });
        }
    }
}

return FileLoaderQueue; // return entity

});

