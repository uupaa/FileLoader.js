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
var DEFAULT_DELAY =   16; // ms
var CLEAR_DELAY   = 2000; // ms
// --- class / interfaces ----------------------------------
function FileLoaderQueue(options) { // @arg Object = {} - { maxConnections, queueDelay, retryDelay }
                                    // @options.maxConnections UINT8 = 3 - maxConnections
                                    // @options.queueDelay UINT32 = 16 - queue process delay. ms
                                    // @options.retryDelay UINT32 = 1000 - retry process delay. ms
//{@dev
    if (VERIFY) {
        $valid($type(options, "Object|omit"), FileLoaderQueue, "options");
        if (options) {
            $valid($keys(options, "maxConnections|queueDelay|retryDelay"), FileLoaderQueue, "options");
            $valid($type(options.maxConnections, "UINT8|omit"), FileLoaderQueue, "options.maxConnections");
            $valid($type(options.queueDelay,  "UINT8|omit"), FileLoaderQueue, "options.queueDelay");
            $valid($type(options.retryDelay,  "UINT8|omit"), FileLoaderQueue, "options.retryDelay");
        }
    }
//}@dev

    options = options || {};

    var maxConnections = options["maxConnections"] || 3;

    this._queueState = []; // [ "nop" or "locked", ... ]

    for (var i = 0; i < maxConnections; ++i) {
        this._queueState.push("nop");
    }

    this._queueDelay = options["queueDelay"] || DEFAULT_DELAY;
    this._retryDelay = options["retryDelay"] || 1000;
    this._highPriorityQueue = []; // [ job, ... ]
    this._midPriorityQueue  = []; // [ job, ... ]
    this._tickfn = _tick.bind(this);

    this._timerID = 0; // requestAnimationFrame/setTimeout/setInerval timer id.
    this._stopped = false;
}

FileLoaderQueue["VERBOSE"] = VERBOSE;
FileLoaderQueue["prototype"] = Object.create(FileLoaderQueue, {
    "constructor":  { "value": FileLoaderQueue          }, // new FileLoaderQueue(maxConnections:UINT8 = 3):FileLoaderQueue
    "add":          { "value": FileLoaderQueue_add      }, // FileLoaderQueue#add(url, responseType, readyCallback, errorCallback, options):void
    "stop":         { "value": FileLoaderQueue_stop     }, // FileLoaderQueue#stop():void
    "clear":        { "value": FileLoaderQueue_clear    }, // FileLoaderQueue#clear():void
    "stopped": {
        "get": function()  {
            return this._stopped;
        }
    },
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
                             options) {     // @arg Object = {} - { retryCount, cacheBusting, highPriority, timeout, dump }
                                            // @options.retryCount UINT8 = 3 - retry count
                                            // @options.cacheBusting String = "" - cache busting keyword, enable cache busting.
                                            // @options.highPriority Boolean = false
                                            // @options.timeout UINT32 = 0
                                            // @options.dump Boolean = false
//{@dev
    if (VERIFY) {
        $valid($type(url,           "URLString"),          FileLoaderQueue_add, "url");
        $valid($type(responseType,  "ResponseTypeString"), FileLoaderQueue_add, "responseType");
        $valid($some(responseType,  "String|Text|JSON|Blob|ArrayBuffer", true), FileLoaderQueue_add, "responseType");
        $valid($type(readyCallback, "Function"),           FileLoaderQueue_add, "readyCallback");
        $valid($type(errorCallback, "Function|omit"),      FileLoaderQueue_add, "errorCallback");
        $valid($type(options,       "Object|omit"),        FileLoaderQueue_add, "options");
        if (options) {
            $valid($keys(options,   "retryCount|cacheBusting|highPriority|timeout|dump"), FileLoaderQueue_add, "options");
            $valid($type(options.retryCount,   "UINT8|omit"),   FileLoaderQueue_add, "options.retryCount");
            $valid($type(options.cacheBusting, "String|omit"),  FileLoaderQueue_add, "options.cacheBusting");
            $valid($type(options.highPriority, "Boolean|omit"), FileLoaderQueue_add, "options.highPriority");
            $valid($type(options.timeout,      "UINT32|omit"),  FileLoaderQueue_add, "options.timeout");
            $valid($type(options.dump,         "Boolean|omit"), FileLoaderQueue_add, "options.dump");
        }
    }
//}@dev

    options = options || {};

    var job = {
            url:            url,
            originalURL:    url,
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
    _startTimer.call(this);
}

function _startTimer() {
    if (this._highPriorityQueue.length + this._midPriorityQueue.length === 1) {
        this._timerID = setTimeout(this._tickfn, this._queueDelay);
    }
}

function FileLoaderQueue_stop() {
    if (FileLoaderQueue_stop["VERBOSE"]) {
        console.log("FileLoaderQueue_stop");
    }
    if (this._timerID) {
        clearTimeout(this._timerID);
        this._timerID = 0;
    }
    this._stopped = true;
}

function FileLoaderQueue_clear(clearCallback) { // @arg Function = null - clearCallback():void
    var that = this;
    var error = new Error("cancel");
    for (var i = 0, iz = this._highPriorityQueue.length; i < iz; ++i) {
        if (this._highPriorityQueue[i]) {
            var job = this._highPriorityQueue[i]; // url, retryCount, ...
            job.errorCallback(error, job.url, 500, job.options);
        }
    }
    for (var i = 0, iz = this._midPriorityQueue.length; i < iz; ++i) {
        if (this._midPriorityQueue[i]) {
            var job = this._midPriorityQueue[i]; // url, retryCount, ...
            job.errorCallback(error, job.url, 500, job.options);
        }
    }
    this._highPriorityQueue.length = 0;
    this._midPriorityQueue.length = 0;
    this._stopped = false;


    if (this._queueState.indexOf("locked") >= 0) {
        setTimeout(_clear, CLEAR_DELAY);
    } else {
        _clear();
    }

    function _clear() {
        if (FileLoaderQueue["VERBOSE"]) {
            console.log("FileLoaderQueue_clear queueState" + that._queueState.join());
        }
        for (var i = 0, iz = that._queueState.length; i < iz; ++i) {
            if (that._queueState[i] !== "nop") {
                that._queueState[i] = "nop"; // force unlock
            }
        }
        that._queue = [];
        that._stopped = false;
        if (clearCallback) {
            clearCallback();
        }
    }
}

function _tick() {
    var that = this;
    var length = this._highPriorityQueue.length + this._midPriorityQueue.length;

    if (length && this._stopped === false) {
        this._timerID = setTimeout(this._tickfn, this._queueDelay);

        if (this._queueState.indexOf("nop") >= 0) {
            this._queueState.forEach(function(state, index) {
                if (that._stopped) { return; }
                if (state === "locked") { return; } // locked -> skip

                // fetch a job from ordered queue.
                var job = that._highPriorityQueue.length ? that._highPriorityQueue.shift()
                        : that._midPriorityQueue.length  ? that._midPriorityQueue.shift()
                        : null;

                if (!job) { return; } // no job

                // update task state. nop -> locked
                that._queueState[index] = "locked";

                FileLoader["load"](job.url, job.responseType, function(result, url, httpStatusCode) {
                    if (that._stopped) {
                        job.errorCallback(new Error("cancel"), url, httpStatusCode, job.options);
                    } else {
                        job.readyCallback(result, url, httpStatusCode, job.options);
                    }
                    that._queueState[index] = "nop"; // locked -> nop
                }, function(error, url, httpStatusCode) {
                    if (that._stopped) {
                        job.errorCallback(error, url, httpStatusCode, job.options);
                    }

                    setTimeout(function() {
                        if (that._stopped) {
                            job.errorCallback(error, url, httpStatusCode, job.options);
                        }
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
                        that._queueState[index] = "nop"; // locked -> nop
                        _startTimer.call(that);
                    }, that._retryDelay);

                }, { "timeout": job.options["timeout"] || 0, "dump": job.options["dump"] });
            });
        }
    }
}

return FileLoaderQueue; // return entity

});

