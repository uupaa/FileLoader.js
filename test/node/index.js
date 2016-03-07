// FileLoader test

require("../../lib/WebModule.js");

WebModule.verify  = true;
WebModule.verbose = true;
WebModule.publish = true;


require("../wmtools.js");
require("../../lib/FileLoader.js");
require("../../release/FileLoader.n.min.js");
require("../testcase.js");

