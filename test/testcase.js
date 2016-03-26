var ModuleTestFileLoader = (function(global) {

var test = new Test(["FileLoader"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

if (IN_BROWSER || IN_NW || IN_EL || IN_WORKER || IN_NODE) {
    test.add([
    ]);
}
if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
        testFileLoader_loadString,
        testFileLoader_loadJSON,
        testFileLoader_loadBlob,
        testFileLoader_loadArrayBuffer,
        testFileLoader_toArrayBuffer_blob,
    ]);
}
if (IN_WORKER) {
    test.add([
    ]);
}
if (IN_NODE) {
    test.add([
    ]);
}

// --- test cases ------------------------------------------
function testFileLoader_loadString(test, pass, miss) {
    var source = "./index.html";

    var readyCallback = function(result, source) {
        test.done(pass());
    };
    var errorCallback = function(error, source) {
        test.done(miss());
    };

    FileLoader.loadString(source, readyCallback, errorCallback);
}

function testFileLoader_loadJSON(test, pass, miss) {
    var source = "../../package.json";

    var readyCallback = function(result, source) {
        if (result.name === "uupaa.fileloader.js") {
            test.done(pass());
        } else {
            test.done(miss());
        }
    };
    var errorCallback = function(error, source) {
        test.done(miss());
    };

    FileLoader.loadJSON(source, readyCallback, errorCallback);
}

function testFileLoader_loadBlob(test, pass, miss) {
    var source = "./index.html";

    var readyCallback = function(result, source) {
        if (result instanceof Blob) {
            test.done(pass());
        } else {
            test.done(miss());
        }
    };
    var errorCallback = function(error, source) {
        test.done(miss());
    };

    FileLoader.loadBlob(source, readyCallback, errorCallback);
}

function testFileLoader_loadArrayBuffer(test, pass, miss) {
    var source = "./index.html";

    var readyCallback = function(result, source) {
        if (result instanceof ArrayBuffer) {
            var u8a = new Uint8Array(result);
            console.log(u8a.length);
            test.done(pass());
        } else {
            test.done(miss());
        }
    };
    var errorCallback = function(error, source) {
        test.done(miss());
    };

    FileLoader.loadArrayBuffer(source, readyCallback, errorCallback);
}

function testFileLoader_toArrayBuffer_blob(test, pass, miss) {
    var source = new Blob(["hello"], { type: "text/plain" });

    var readyCallback = function(result, source) {
        if (result && result.byteLength === 5) {
            var text = String.fromCharCode.apply(null, new Uint8Array(result));
            if (text === "hello") {
                test.done(pass());
                return;
            }
        }
        test.done(miss());
    };
    var errorCallback = function(error, source) {
        test.done(miss());
    };

    FileLoader.toArrayBuffer(source, readyCallback, errorCallback);
}

return test.run();

})(GLOBAL);

