// FileLoader test

require("../../lib/WebModule.js");

WebModule.VERIFY  = true;
WebModule.VERBOSE = true;
WebModule.PUBLISH = true;

require("../../node_modules/uupaa.typedarray.js/lib/TypedArray.js");
require("../wmtools.js");
require("../../lib/FileLoader.js");
require("../../release/FileLoader.n.min.js");
require("../testcase.js");

