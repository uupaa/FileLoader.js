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

test.add([
    testFileLoader_loadString,
    testFileLoader_loadText,
    testFileLoader_loadJSON,
    testFileLoader_loadArrayBuffer,
    testFileLoader_toArrayBuffer,
    testFileLoaderQueue_add,
    testFileLoaderQueue_add_retry_to_error,
    testFileLoaderQueue_add_cacheBusting,
    testFileLoaderQueue_add_highPriority,
    testFileLoaderQueue_clear,
]);

if (global["Blob"]) { // exclude IN_NODE
    test.add([
        testFileLoader_loadBlob,
    ]);
    if (IN_EL || IN_NW) {
        test.add([
            testFileLoader_loadBlobURL,
        ]);
    }
}

test.add([
    testFileLoader_loadString_options_dump,
    testFileLoader_loadJSON_options_dump,
    testFileLoader_loadArrayBuffer_options_dump,
]);

if (global["Blob"]) { // exclude IN_NODE
    test.add([
        testFileLoader_loadBlob_options_dump
    ]);
} else {
    // Node.js は Blob をサポートしていないため、loadBlog は ArrayBuffer を返す
    test.add([
        testFileLoader_loadBlob_options_dump_in_node
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

function testFileLoaderQueue_add(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    var queue = new FileLoaderQueue();

    queue.add(url, "json", function(result, url) {
        if (result.name === "uupaa.fileloader.js") {
            test.done(pass());
        } else {
            test.done(miss());
        }
    }, function(error) {
        test.done(miss());
    });
}

function testFileLoaderQueue_add_retry_to_error(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    url += ".404";

    var queue = new FileLoaderQueue();

    queue.add(url, "json", function(result, url) {
        test.done(miss());
    }, function(error) {
        test.done(pass());
    }, { retryCount: 2 });
}

function testFileLoaderQueue_add_cacheBusting(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    var queue = new FileLoaderQueue();

    queue.add(url, "json", function(result, url) {
console.log("testFileLoaderQueue_add_cacheBusting", url);
        if (/lol=/.test(url)) { // url has "...?lol=..."
            test.done(pass());
        } else {
            test.done(miss());
        }
    }, function(error, url) {
console.log("testFileLoaderQueue_add_cacheBusting", error, url);
        test.done(miss());
    }, { cacheBusting: "lol" });
}

function testFileLoaderQueue_add_highPriority(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    var task = new Task("testFileLoaderQueue_add_highPriority", 3, function(error, buffer) {
        if (buffer.join() === "HIGH,LOW,LOW") { // interrupt high priority job
            console.log( buffer.join() );
            test.done(pass());
        } else {
            test.done(miss());
        }
    });

    var queue = new FileLoaderQueue({ maxConnections: 1 });

    queue.add(url, "json", function(result, url) {
        if (/lol=/.test(url)) {
            task.buffer.push("LOW");
            task.pass();
        }
    }, null, { cacheBusting: "lol", highPriority: false });

    queue.add(url, "json", function(result, url) {
        if (/lol=/.test(url)) {
            task.buffer.push("LOW");
            task.pass();
        }
    }, null, { cacheBusting: "lol", highPriority: false });

    queue.add(url, "json", function(result, url) {
        if (/lol=/.test(url)) {
            task.buffer.push("HIGH");
            task.pass();
        }
    }, null, { cacheBusting: "lol", highPriority: true });
}

function testFileLoaderQueue_clear(test, pass, miss) {
    var url = "";

    var queue = new FileLoaderQueue({ maxConnections: 1 });

    queue.add(url, "json", function(result, url) { });
    queue.add(url, "json", function(result, url) { });
    queue.add(url, "json", function(result, url) { });
    queue.clear();

    if (queue.length === 0) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testFileLoader_loadBlobURL(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    FileLoader.loadBlob(url, function(blob, url) {
        var blobURL = URL.createObjectURL(blob);

        FileLoader.toArrayBuffer(blobURL, function(buffer) {
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

function testFileLoader_loadString_options_dump(test, pass, miss) {
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
    }, { dump: true });
}

function testFileLoader_loadJSON_options_dump(test, pass, miss) {
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
    }, { dump: true });
}

function testFileLoader_loadArrayBuffer_options_dump(test, pass, miss) {
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
    }, { dump: true });
}

function testFileLoader_loadBlob_options_dump(test, pass, miss) {
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
    }, { dump: true });
}

function testFileLoader_loadBlob_options_dump_in_node(test, pass, miss) {
    var url = IN_NODE ? "package.json" // Because node.js process.cwd() -> "~/your/path/FileLoader"
                      : "../../package.json";

    FileLoader.loadBlob(url, function(arraybuffer, url) { // Node.js では loadBlob は Blob ではなく ArrayBuffer を返す
            var result = TypedArray.toString( new Uint8Array(arraybuffer) );
            if ( /uupaa.fileloader.js/.test(result) ) {
                test.done(pass());
            } else {
                test.done(miss());
            }
    }, function(error) {
        test.done(miss());
    }, { dump: true });
}


return test.run();

})(GLOBAL);

