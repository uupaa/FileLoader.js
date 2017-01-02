// FileLoader test

require("../../lib/WebModule.js");

WebModule.VERIFY  = true;
WebModule.VERBOSE = true;
WebModule.PUBLISH = true;

require("../../node_modules/uupaa.task.js/lib/Task.js");
require("../../node_modules/uupaa.task.js/lib/TaskMap.js");
require("../../node_modules/uupaa.typedarray.js/lib/TypedArray.js");
require("../../node_modules/uupaa.uri.js/lib/URISearchParams.js");
require("../../node_modules/uupaa.uri.js/lib/URI.js");
require("../wmtools.js");
require("../../lib/FileLoader.js");
require("../../lib/FileLoaderQueue.js");
require("../../release/FileLoader.n.min.js");
require("../testcase.js");

