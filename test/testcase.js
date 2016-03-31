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

if (IN_BROWSER || IN_NW || IN_EL || IN_WORKER) {
    test.add([
        testFileLoader_loadString,
        testFileLoader_loadText,
        testFileLoader_loadJSON,
        testFileLoader_loadBlob,
        testFileLoader_loadArrayBuffer,
        testFileLoader_toArrayBuffer,
    ]);
}
if (IN_NODE) {
    test.add([
        testFileLoader_loadString,
        testFileLoader_loadText,
        testFileLoader_loadJSON,
      //testFileLoader_loadBlob,
        testFileLoader_loadArrayBuffer,
        testFileLoader_toArrayBuffer,
    ]);
}

// --- test cases ------------------------------------------
function testFileLoader_loadString(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    FileLoader.loadString(url, function(result, url) {
        if ( /uupaa.fileloader.js/.test(result) ) {
            test.done(pass());
        } else {
            test.done(miss());
        }
    }, function(error) {
        test.done(miss());
    });
}

function testFileLoader_loadText(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    FileLoader.loadText(url, function(result, url) {
        if ( /uupaa.fileloader.js/.test(result) ) {
            test.done(pass());
        } else {
            test.done(miss());
        }
    }, function(error) {
        test.done(miss());
    });
}

function testFileLoader_loadJSON(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    FileLoader.loadJSON(url, function(result, url) {
        if (result.name === "uupaa.fileloader.js") {
            test.done(pass());
        } else {
            test.done(miss());
        }
    }, function(error) {
        test.done(miss());
    });
}

function testFileLoader_loadBlob(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    FileLoader.loadBlob(url, function(blob, url) {
        FileLoader.toArrayBuffer(blob, function(buffer) {
            var result = TypedArray.toString( new Uint8Array(buffer) );
            if ( /uupaa.fileloader.js/.test(result) ) {
                test.done(pass());
            } else {
                test.done(miss());
            }
        }, function(error) {
            test.done(miss());
        });
    }, function(error) {
        test.done(miss());
    });
}

function testFileLoader_loadArrayBuffer(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    FileLoader.loadArrayBuffer(url, function(buffer, url) {
        var result = TypedArray.toString( new Uint8Array(buffer) );
        if ( /uupaa.fileloader.js/.test(result) ) {
            test.done(pass());
        } else {
            test.done(miss());
        }
    }, function(error) {
        test.done(miss());
    });
}

function testFileLoader_toArrayBuffer(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    FileLoader.toArrayBuffer(url, function(buffer, url) {
        var result = TypedArray.toString( new Uint8Array(buffer) );
        if ( /uupaa.fileloader.js/.test(result) ) {
            test.done(pass());
        } else {
            test.done(miss());
        }
    }, function(error) {
        test.done(miss());
    });
}

return test.run();

})(GLOBAL);

