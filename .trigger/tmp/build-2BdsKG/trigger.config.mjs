import {
  require_module_details_from_path,
  require_src
} from "./chunk-N75EG7ER.mjs";
import {
  defineConfig
} from "./chunk-4IHIUCUY.mjs";
import "./chunk-USHNXJ63.mjs";
import "./chunk-IORKQ53J.mjs";
import "./chunk-LJVEFIEN.mjs";
import {
  SpanKind,
  context,
  esm_exports,
  init_esm as init_esm2,
  trace
} from "./chunk-IA2HBA2V.mjs";
import {
  __commonJS,
  __name,
  __require,
  __toCommonJS,
  __toESM,
  init_esm
} from "./chunk-244PAGAH.mjs";

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/types/LogRecord.js
var require_LogRecord = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/types/LogRecord.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeverityNumber = void 0;
    var SeverityNumber;
    (function(SeverityNumber2) {
      SeverityNumber2[SeverityNumber2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
      SeverityNumber2[SeverityNumber2["TRACE"] = 1] = "TRACE";
      SeverityNumber2[SeverityNumber2["TRACE2"] = 2] = "TRACE2";
      SeverityNumber2[SeverityNumber2["TRACE3"] = 3] = "TRACE3";
      SeverityNumber2[SeverityNumber2["TRACE4"] = 4] = "TRACE4";
      SeverityNumber2[SeverityNumber2["DEBUG"] = 5] = "DEBUG";
      SeverityNumber2[SeverityNumber2["DEBUG2"] = 6] = "DEBUG2";
      SeverityNumber2[SeverityNumber2["DEBUG3"] = 7] = "DEBUG3";
      SeverityNumber2[SeverityNumber2["DEBUG4"] = 8] = "DEBUG4";
      SeverityNumber2[SeverityNumber2["INFO"] = 9] = "INFO";
      SeverityNumber2[SeverityNumber2["INFO2"] = 10] = "INFO2";
      SeverityNumber2[SeverityNumber2["INFO3"] = 11] = "INFO3";
      SeverityNumber2[SeverityNumber2["INFO4"] = 12] = "INFO4";
      SeverityNumber2[SeverityNumber2["WARN"] = 13] = "WARN";
      SeverityNumber2[SeverityNumber2["WARN2"] = 14] = "WARN2";
      SeverityNumber2[SeverityNumber2["WARN3"] = 15] = "WARN3";
      SeverityNumber2[SeverityNumber2["WARN4"] = 16] = "WARN4";
      SeverityNumber2[SeverityNumber2["ERROR"] = 17] = "ERROR";
      SeverityNumber2[SeverityNumber2["ERROR2"] = 18] = "ERROR2";
      SeverityNumber2[SeverityNumber2["ERROR3"] = 19] = "ERROR3";
      SeverityNumber2[SeverityNumber2["ERROR4"] = 20] = "ERROR4";
      SeverityNumber2[SeverityNumber2["FATAL"] = 21] = "FATAL";
      SeverityNumber2[SeverityNumber2["FATAL2"] = 22] = "FATAL2";
      SeverityNumber2[SeverityNumber2["FATAL3"] = 23] = "FATAL3";
      SeverityNumber2[SeverityNumber2["FATAL4"] = 24] = "FATAL4";
    })(SeverityNumber = exports.SeverityNumber || (exports.SeverityNumber = {}));
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/NoopLogger.js
var require_NoopLogger = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/NoopLogger.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NOOP_LOGGER = exports.NoopLogger = void 0;
    var NoopLogger = class {
      static {
        __name(this, "NoopLogger");
      }
      emit(_logRecord) {
      }
    };
    exports.NoopLogger = NoopLogger;
    exports.NOOP_LOGGER = new NoopLogger();
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/NoopLoggerProvider.js
var require_NoopLoggerProvider = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/NoopLoggerProvider.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NOOP_LOGGER_PROVIDER = exports.NoopLoggerProvider = void 0;
    var NoopLogger_1 = require_NoopLogger();
    var NoopLoggerProvider = class {
      static {
        __name(this, "NoopLoggerProvider");
      }
      getLogger(_name, _version, _options) {
        return new NoopLogger_1.NoopLogger();
      }
    };
    exports.NoopLoggerProvider = NoopLoggerProvider;
    exports.NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/ProxyLogger.js
var require_ProxyLogger = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/ProxyLogger.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyLogger = void 0;
    var NoopLogger_1 = require_NoopLogger();
    var ProxyLogger = class {
      static {
        __name(this, "ProxyLogger");
      }
      constructor(_provider, name, version, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
        this.options = options;
      }
      /**
       * Emit a log record. This method should only be used by log appenders.
       *
       * @param logRecord
       */
      emit(logRecord) {
        this._getLogger().emit(logRecord);
      }
      /**
       * Try to get a logger from the proxy logger provider.
       * If the proxy logger provider has no delegate, return a noop logger.
       */
      _getLogger() {
        if (this._delegate) {
          return this._delegate;
        }
        const logger = this._provider._getDelegateLogger(this.name, this.version, this.options);
        if (!logger) {
          return NoopLogger_1.NOOP_LOGGER;
        }
        this._delegate = logger;
        return this._delegate;
      }
    };
    exports.ProxyLogger = ProxyLogger;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/ProxyLoggerProvider.js
var require_ProxyLoggerProvider = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/ProxyLoggerProvider.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyLoggerProvider = void 0;
    var NoopLoggerProvider_1 = require_NoopLoggerProvider();
    var ProxyLogger_1 = require_ProxyLogger();
    var ProxyLoggerProvider = class {
      static {
        __name(this, "ProxyLoggerProvider");
      }
      getLogger(name, version, options) {
        var _a;
        return (_a = this._getDelegateLogger(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyLogger_1.ProxyLogger(this, name, version, options);
      }
      /**
       * Get the delegate logger provider.
       * Used by tests only.
       * @internal
       */
      _getDelegate() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER;
      }
      /**
       * Set the delegate logger provider
       * @internal
       */
      _setDelegate(delegate) {
        this._delegate = delegate;
      }
      /**
       * @internal
       */
      _getDelegateLogger(name, version, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getLogger(name, version, options);
      }
    };
    exports.ProxyLoggerProvider = ProxyLoggerProvider;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/platform/node/globalThis.js
var require_globalThis = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/platform/node/globalThis.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._globalThis = void 0;
    exports._globalThis = typeof globalThis === "object" ? globalThis : global;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/platform/node/index.js
var require_node = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/platform/node/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._globalThis = void 0;
    var globalThis_1 = require_globalThis();
    Object.defineProperty(exports, "_globalThis", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return globalThis_1._globalThis;
    }, "get") });
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/platform/index.js
var require_platform = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/platform/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._globalThis = void 0;
    var node_1 = require_node();
    Object.defineProperty(exports, "_globalThis", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1._globalThis;
    }, "get") });
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/internal/global-utils.js
var require_global_utils = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/internal/global-utils.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.API_BACKWARDS_COMPATIBILITY_VERSION = exports.makeGetter = exports._global = exports.GLOBAL_LOGS_API_KEY = void 0;
    var platform_1 = require_platform();
    exports.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
    exports._global = platform_1._globalThis;
    function makeGetter(requiredVersion, instance, fallback) {
      return (version) => version === requiredVersion ? instance : fallback;
    }
    __name(makeGetter, "makeGetter");
    exports.makeGetter = makeGetter;
    exports.API_BACKWARDS_COMPATIBILITY_VERSION = 1;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/api/logs.js
var require_logs = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/api/logs.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogsAPI = void 0;
    var global_utils_1 = require_global_utils();
    var NoopLoggerProvider_1 = require_NoopLoggerProvider();
    var ProxyLoggerProvider_1 = require_ProxyLoggerProvider();
    var LogsAPI = class _LogsAPI {
      static {
        __name(this, "LogsAPI");
      }
      constructor() {
        this._proxyLoggerProvider = new ProxyLoggerProvider_1.ProxyLoggerProvider();
      }
      static getInstance() {
        if (!this._instance) {
          this._instance = new _LogsAPI();
        }
        return this._instance;
      }
      setGlobalLoggerProvider(provider) {
        if (global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) {
          return this.getLoggerProvider();
        }
        global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY] = (0, global_utils_1.makeGetter)(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, provider, NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER);
        this._proxyLoggerProvider._setDelegate(provider);
        return provider;
      }
      /**
       * Returns the global logger provider.
       *
       * @returns LoggerProvider
       */
      getLoggerProvider() {
        var _a, _b;
        return (_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
      }
      /**
       * Returns a logger from the global logger provider.
       *
       * @returns Logger
       */
      getLogger(name, version, options) {
        return this.getLoggerProvider().getLogger(name, version, options);
      }
      /** Remove the global logger provider */
      disable() {
        delete global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY];
        this._proxyLoggerProvider = new ProxyLoggerProvider_1.ProxyLoggerProvider();
      }
    };
    exports.LogsAPI = LogsAPI;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/index.js
var require_src2 = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/api-logs/build/src/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logs = exports.ProxyLoggerProvider = exports.ProxyLogger = exports.NoopLoggerProvider = exports.NOOP_LOGGER_PROVIDER = exports.NoopLogger = exports.NOOP_LOGGER = exports.SeverityNumber = void 0;
    var LogRecord_1 = require_LogRecord();
    Object.defineProperty(exports, "SeverityNumber", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return LogRecord_1.SeverityNumber;
    }, "get") });
    var NoopLogger_1 = require_NoopLogger();
    Object.defineProperty(exports, "NOOP_LOGGER", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return NoopLogger_1.NOOP_LOGGER;
    }, "get") });
    Object.defineProperty(exports, "NoopLogger", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return NoopLogger_1.NoopLogger;
    }, "get") });
    var NoopLoggerProvider_1 = require_NoopLoggerProvider();
    Object.defineProperty(exports, "NOOP_LOGGER_PROVIDER", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER;
    }, "get") });
    Object.defineProperty(exports, "NoopLoggerProvider", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return NoopLoggerProvider_1.NoopLoggerProvider;
    }, "get") });
    var ProxyLogger_1 = require_ProxyLogger();
    Object.defineProperty(exports, "ProxyLogger", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ProxyLogger_1.ProxyLogger;
    }, "get") });
    var ProxyLoggerProvider_1 = require_ProxyLoggerProvider();
    Object.defineProperty(exports, "ProxyLoggerProvider", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ProxyLoggerProvider_1.ProxyLoggerProvider;
    }, "get") });
    var logs_1 = require_logs();
    exports.logs = logs_1.LogsAPI.getInstance();
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/autoLoaderUtils.js
var require_autoLoaderUtils = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/autoLoaderUtils.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.disableInstrumentations = exports.enableInstrumentations = void 0;
    function enableInstrumentations(instrumentations, tracerProvider, meterProvider, loggerProvider) {
      for (let i = 0, j = instrumentations.length; i < j; i++) {
        const instrumentation = instrumentations[i];
        if (tracerProvider) {
          instrumentation.setTracerProvider(tracerProvider);
        }
        if (meterProvider) {
          instrumentation.setMeterProvider(meterProvider);
        }
        if (loggerProvider && instrumentation.setLoggerProvider) {
          instrumentation.setLoggerProvider(loggerProvider);
        }
        if (!instrumentation.getConfig().enabled) {
          instrumentation.enable();
        }
      }
    }
    __name(enableInstrumentations, "enableInstrumentations");
    exports.enableInstrumentations = enableInstrumentations;
    function disableInstrumentations(instrumentations) {
      instrumentations.forEach((instrumentation) => instrumentation.disable());
    }
    __name(disableInstrumentations, "disableInstrumentations");
    exports.disableInstrumentations = disableInstrumentations;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/autoLoader.js
var require_autoLoader = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/autoLoader.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerInstrumentations = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var api_logs_1 = require_src2();
    var autoLoaderUtils_1 = require_autoLoaderUtils();
    function registerInstrumentations(options) {
      const tracerProvider = options.tracerProvider || api_1.trace.getTracerProvider();
      const meterProvider = options.meterProvider || api_1.metrics.getMeterProvider();
      const loggerProvider = options.loggerProvider || api_logs_1.logs.getLoggerProvider();
      const instrumentations = options.instrumentations?.flat() ?? [];
      (0, autoLoaderUtils_1.enableInstrumentations)(instrumentations, tracerProvider, meterProvider, loggerProvider);
      return () => {
        (0, autoLoaderUtils_1.disableInstrumentations)(instrumentations);
      };
    }
    __name(registerInstrumentations, "registerInstrumentations");
    exports.registerInstrumentations = registerInstrumentations;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/semver.js
var require_semver = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/semver.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.satisfies = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var VERSION_REGEXP = /^(?:v)?(?<version>(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*))(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    var RANGE_REGEXP = /^(?<op><|>|=|==|<=|>=|~|\^|~>)?\s*(?:v)?(?<version>(?<major>x|X|\*|0|[1-9]\d*)(?:\.(?<minor>x|X|\*|0|[1-9]\d*))?(?:\.(?<patch>x|X|\*|0|[1-9]\d*))?)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    var operatorResMap = {
      ">": [1],
      ">=": [0, 1],
      "=": [0],
      "<=": [-1, 0],
      "<": [-1],
      "!=": [-1, 1]
    };
    function satisfies(version, range, options) {
      if (!_validateVersion(version)) {
        api_1.diag.error(`Invalid version: ${version}`);
        return false;
      }
      if (!range) {
        return true;
      }
      range = range.replace(/([<>=~^]+)\s+/g, "$1");
      const parsedVersion = _parseVersion(version);
      if (!parsedVersion) {
        return false;
      }
      const allParsedRanges = [];
      const checkResult = _doSatisfies(parsedVersion, range, allParsedRanges, options);
      if (checkResult && !options?.includePrerelease) {
        return _doPreleaseCheck(parsedVersion, allParsedRanges);
      }
      return checkResult;
    }
    __name(satisfies, "satisfies");
    exports.satisfies = satisfies;
    function _validateVersion(version) {
      return typeof version === "string" && VERSION_REGEXP.test(version);
    }
    __name(_validateVersion, "_validateVersion");
    function _doSatisfies(parsedVersion, range, allParsedRanges, options) {
      if (range.includes("||")) {
        const ranges = range.trim().split("||");
        for (const r of ranges) {
          if (_checkRange(parsedVersion, r, allParsedRanges, options)) {
            return true;
          }
        }
        return false;
      } else if (range.includes(" - ")) {
        range = replaceHyphen(range, options);
      } else if (range.includes(" ")) {
        const ranges = range.trim().replace(/\s{2,}/g, " ").split(" ");
        for (const r of ranges) {
          if (!_checkRange(parsedVersion, r, allParsedRanges, options)) {
            return false;
          }
        }
        return true;
      }
      return _checkRange(parsedVersion, range, allParsedRanges, options);
    }
    __name(_doSatisfies, "_doSatisfies");
    function _checkRange(parsedVersion, range, allParsedRanges, options) {
      range = _normalizeRange(range, options);
      if (range.includes(" ")) {
        return _doSatisfies(parsedVersion, range, allParsedRanges, options);
      } else {
        const parsedRange = _parseRange(range);
        allParsedRanges.push(parsedRange);
        return _satisfies(parsedVersion, parsedRange);
      }
    }
    __name(_checkRange, "_checkRange");
    function _satisfies(parsedVersion, parsedRange) {
      if (parsedRange.invalid) {
        return false;
      }
      if (!parsedRange.version || _isWildcard(parsedRange.version)) {
        return true;
      }
      let comparisonResult = _compareVersionSegments(parsedVersion.versionSegments || [], parsedRange.versionSegments || []);
      if (comparisonResult === 0) {
        const versionPrereleaseSegments = parsedVersion.prereleaseSegments || [];
        const rangePrereleaseSegments = parsedRange.prereleaseSegments || [];
        if (!versionPrereleaseSegments.length && !rangePrereleaseSegments.length) {
          comparisonResult = 0;
        } else if (!versionPrereleaseSegments.length && rangePrereleaseSegments.length) {
          comparisonResult = 1;
        } else if (versionPrereleaseSegments.length && !rangePrereleaseSegments.length) {
          comparisonResult = -1;
        } else {
          comparisonResult = _compareVersionSegments(versionPrereleaseSegments, rangePrereleaseSegments);
        }
      }
      return operatorResMap[parsedRange.op]?.includes(comparisonResult);
    }
    __name(_satisfies, "_satisfies");
    function _doPreleaseCheck(parsedVersion, allParsedRanges) {
      if (parsedVersion.prerelease) {
        return allParsedRanges.some((r) => r.prerelease && r.version === parsedVersion.version);
      }
      return true;
    }
    __name(_doPreleaseCheck, "_doPreleaseCheck");
    function _normalizeRange(range, options) {
      range = range.trim();
      range = replaceCaret(range, options);
      range = replaceTilde(range);
      range = replaceXRange(range, options);
      range = range.trim();
      return range;
    }
    __name(_normalizeRange, "_normalizeRange");
    function isX(id) {
      return !id || id.toLowerCase() === "x" || id === "*";
    }
    __name(isX, "isX");
    function _parseVersion(versionString) {
      const match = versionString.match(VERSION_REGEXP);
      if (!match) {
        api_1.diag.error(`Invalid version: ${versionString}`);
        return void 0;
      }
      const version = match.groups.version;
      const prerelease = match.groups.prerelease;
      const build = match.groups.build;
      const versionSegments = version.split(".");
      const prereleaseSegments = prerelease?.split(".");
      return {
        op: void 0,
        version,
        versionSegments,
        versionSegmentCount: versionSegments.length,
        prerelease,
        prereleaseSegments,
        prereleaseSegmentCount: prereleaseSegments ? prereleaseSegments.length : 0,
        build
      };
    }
    __name(_parseVersion, "_parseVersion");
    function _parseRange(rangeString) {
      if (!rangeString) {
        return {};
      }
      const match = rangeString.match(RANGE_REGEXP);
      if (!match) {
        api_1.diag.error(`Invalid range: ${rangeString}`);
        return {
          invalid: true
        };
      }
      let op = match.groups.op;
      const version = match.groups.version;
      const prerelease = match.groups.prerelease;
      const build = match.groups.build;
      const versionSegments = version.split(".");
      const prereleaseSegments = prerelease?.split(".");
      if (op === "==") {
        op = "=";
      }
      return {
        op: op || "=",
        version,
        versionSegments,
        versionSegmentCount: versionSegments.length,
        prerelease,
        prereleaseSegments,
        prereleaseSegmentCount: prereleaseSegments ? prereleaseSegments.length : 0,
        build
      };
    }
    __name(_parseRange, "_parseRange");
    function _isWildcard(s) {
      return s === "*" || s === "x" || s === "X";
    }
    __name(_isWildcard, "_isWildcard");
    function _parseVersionString(v) {
      const n = parseInt(v, 10);
      return isNaN(n) ? v : n;
    }
    __name(_parseVersionString, "_parseVersionString");
    function _normalizeVersionType(a, b) {
      if (typeof a === typeof b) {
        if (typeof a === "number") {
          return [a, b];
        } else if (typeof a === "string") {
          return [a, b];
        } else {
          throw new Error("Version segments can only be strings or numbers");
        }
      } else {
        return [String(a), String(b)];
      }
    }
    __name(_normalizeVersionType, "_normalizeVersionType");
    function _compareVersionStrings(v1, v2) {
      if (_isWildcard(v1) || _isWildcard(v2)) {
        return 0;
      }
      const [parsedV1, parsedV2] = _normalizeVersionType(_parseVersionString(v1), _parseVersionString(v2));
      if (parsedV1 > parsedV2) {
        return 1;
      } else if (parsedV1 < parsedV2) {
        return -1;
      }
      return 0;
    }
    __name(_compareVersionStrings, "_compareVersionStrings");
    function _compareVersionSegments(v1, v2) {
      for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
        const res = _compareVersionStrings(v1[i] || "0", v2[i] || "0");
        if (res !== 0) {
          return res;
        }
      }
      return 0;
    }
    __name(_compareVersionSegments, "_compareVersionSegments");
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var NUMERICIDENTIFIER = "0|[1-9]\\d*";
    var NONNUMERICIDENTIFIER = `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`;
    var GTLT = "((?:<|>)?=?)";
    var PRERELEASEIDENTIFIER = `(?:${NUMERICIDENTIFIER}|${NONNUMERICIDENTIFIER})`;
    var PRERELEASE = `(?:-(${PRERELEASEIDENTIFIER}(?:\\.${PRERELEASEIDENTIFIER})*))`;
    var BUILDIDENTIFIER = `${LETTERDASHNUMBER}+`;
    var BUILD = `(?:\\+(${BUILDIDENTIFIER}(?:\\.${BUILDIDENTIFIER})*))`;
    var XRANGEIDENTIFIER = `${NUMERICIDENTIFIER}|x|X|\\*`;
    var XRANGEPLAIN = `[v=\\s]*(${XRANGEIDENTIFIER})(?:\\.(${XRANGEIDENTIFIER})(?:\\.(${XRANGEIDENTIFIER})(?:${PRERELEASE})?${BUILD}?)?)?`;
    var XRANGE = `^${GTLT}\\s*${XRANGEPLAIN}$`;
    var XRANGE_REGEXP = new RegExp(XRANGE);
    var HYPHENRANGE = `^\\s*(${XRANGEPLAIN})\\s+-\\s+(${XRANGEPLAIN})\\s*$`;
    var HYPHENRANGE_REGEXP = new RegExp(HYPHENRANGE);
    var LONETILDE = "(?:~>?)";
    var TILDE = `^${LONETILDE}${XRANGEPLAIN}$`;
    var TILDE_REGEXP = new RegExp(TILDE);
    var LONECARET = "(?:\\^)";
    var CARET = `^${LONECARET}${XRANGEPLAIN}$`;
    var CARET_REGEXP = new RegExp(CARET);
    function replaceTilde(comp) {
      const r = TILDE_REGEXP;
      return comp.replace(r, (_, M, m, p, pr) => {
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        return ret;
      });
    }
    __name(replaceTilde, "replaceTilde");
    function replaceCaret(comp, options) {
      const r = CARET_REGEXP;
      const z = options?.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        return ret;
      });
    }
    __name(replaceCaret, "replaceCaret");
    function replaceXRange(comp, options) {
      const r = XRANGE_REGEXP;
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options?.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        return ret;
      });
    }
    __name(replaceXRange, "replaceXRange");
    function replaceHyphen(comp, options) {
      const r = HYPHENRANGE_REGEXP;
      return comp.replace(r, (_, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
        if (isX(fM)) {
          from = "";
        } else if (isX(fm)) {
          from = `>=${fM}.0.0${options?.includePrerelease ? "-0" : ""}`;
        } else if (isX(fp)) {
          from = `>=${fM}.${fm}.0${options?.includePrerelease ? "-0" : ""}`;
        } else if (fpr) {
          from = `>=${from}`;
        } else {
          from = `>=${from}${options?.includePrerelease ? "-0" : ""}`;
        }
        if (isX(tM)) {
          to = "";
        } else if (isX(tm)) {
          to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
          to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
          to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (options?.includePrerelease) {
          to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
          to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
      });
    }
    __name(replaceHyphen, "replaceHyphen");
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/shimmer.js
var require_shimmer = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/shimmer.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.massUnwrap = exports.unwrap = exports.massWrap = exports.wrap = void 0;
    var logger = console.error.bind(console);
    function defineProperty(obj, name, value) {
      const enumerable = !!obj[name] && Object.prototype.propertyIsEnumerable.call(obj, name);
      Object.defineProperty(obj, name, {
        configurable: true,
        enumerable,
        writable: true,
        value
      });
    }
    __name(defineProperty, "defineProperty");
    var wrap = /* @__PURE__ */ __name((nodule, name, wrapper) => {
      if (!nodule || !nodule[name]) {
        logger("no original function " + String(name) + " to wrap");
        return;
      }
      if (!wrapper) {
        logger("no wrapper function");
        logger(new Error().stack);
        return;
      }
      const original = nodule[name];
      if (typeof original !== "function" || typeof wrapper !== "function") {
        logger("original object and wrapper must be functions");
        return;
      }
      const wrapped = wrapper(original, name);
      defineProperty(wrapped, "__original", original);
      defineProperty(wrapped, "__unwrap", () => {
        if (nodule[name] === wrapped) {
          defineProperty(nodule, name, original);
        }
      });
      defineProperty(wrapped, "__wrapped", true);
      defineProperty(nodule, name, wrapped);
      return wrapped;
    }, "wrap");
    exports.wrap = wrap;
    var massWrap = /* @__PURE__ */ __name((nodules, names, wrapper) => {
      if (!nodules) {
        logger("must provide one or more modules to patch");
        logger(new Error().stack);
        return;
      } else if (!Array.isArray(nodules)) {
        nodules = [nodules];
      }
      if (!(names && Array.isArray(names))) {
        logger("must provide one or more functions to wrap on modules");
        return;
      }
      nodules.forEach((nodule) => {
        names.forEach((name) => {
          (0, exports.wrap)(nodule, name, wrapper);
        });
      });
    }, "massWrap");
    exports.massWrap = massWrap;
    var unwrap = /* @__PURE__ */ __name((nodule, name) => {
      if (!nodule || !nodule[name]) {
        logger("no function to unwrap.");
        logger(new Error().stack);
        return;
      }
      const wrapped = nodule[name];
      if (!wrapped.__unwrap) {
        logger("no original to unwrap to -- has " + String(name) + " already been unwrapped?");
      } else {
        wrapped.__unwrap();
        return;
      }
    }, "unwrap");
    exports.unwrap = unwrap;
    var massUnwrap = /* @__PURE__ */ __name((nodules, names) => {
      if (!nodules) {
        logger("must provide one or more modules to patch");
        logger(new Error().stack);
        return;
      } else if (!Array.isArray(nodules)) {
        nodules = [nodules];
      }
      if (!(names && Array.isArray(names))) {
        logger("must provide one or more functions to unwrap on modules");
        return;
      }
      nodules.forEach((nodule) => {
        names.forEach((name) => {
          (0, exports.unwrap)(nodule, name);
        });
      });
    }, "massUnwrap");
    exports.massUnwrap = massUnwrap;
    function shimmer(options) {
      if (options && options.logger) {
        if (typeof options.logger !== "function") {
          logger("new logger isn't a function, not replacing");
        } else {
          logger = options.logger;
        }
      }
    }
    __name(shimmer, "shimmer");
    exports.default = shimmer;
    shimmer.wrap = exports.wrap;
    shimmer.massWrap = exports.massWrap;
    shimmer.unwrap = exports.unwrap;
    shimmer.massUnwrap = exports.massUnwrap;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/instrumentation.js
var require_instrumentation = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/instrumentation.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InstrumentationAbstract = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var api_logs_1 = require_src2();
    var shimmer = require_shimmer();
    var InstrumentationAbstract = class {
      static {
        __name(this, "InstrumentationAbstract");
      }
      instrumentationName;
      instrumentationVersion;
      _config = {};
      _tracer;
      _meter;
      _logger;
      _diag;
      constructor(instrumentationName, instrumentationVersion, config) {
        this.instrumentationName = instrumentationName;
        this.instrumentationVersion = instrumentationVersion;
        this.setConfig(config);
        this._diag = api_1.diag.createComponentLogger({
          namespace: instrumentationName
        });
        this._tracer = api_1.trace.getTracer(instrumentationName, instrumentationVersion);
        this._meter = api_1.metrics.getMeter(instrumentationName, instrumentationVersion);
        this._logger = api_logs_1.logs.getLogger(instrumentationName, instrumentationVersion);
        this._updateMetricInstruments();
      }
      /* Api to wrap instrumented method */
      _wrap = shimmer.wrap;
      /* Api to unwrap instrumented methods */
      _unwrap = shimmer.unwrap;
      /* Api to mass wrap instrumented method */
      _massWrap = shimmer.massWrap;
      /* Api to mass unwrap instrumented methods */
      _massUnwrap = shimmer.massUnwrap;
      /* Returns meter */
      get meter() {
        return this._meter;
      }
      /**
       * Sets MeterProvider to this plugin
       * @param meterProvider
       */
      setMeterProvider(meterProvider) {
        this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
        this._updateMetricInstruments();
      }
      /* Returns logger */
      get logger() {
        return this._logger;
      }
      /**
       * Sets LoggerProvider to this plugin
       * @param loggerProvider
       */
      setLoggerProvider(loggerProvider) {
        this._logger = loggerProvider.getLogger(this.instrumentationName, this.instrumentationVersion);
      }
      /**
       * @experimental
       *
       * Get module definitions defined by {@link init}.
       * This can be used for experimental compile-time instrumentation.
       *
       * @returns an array of {@link InstrumentationModuleDefinition}
       */
      getModuleDefinitions() {
        const initResult = this.init() ?? [];
        if (!Array.isArray(initResult)) {
          return [initResult];
        }
        return initResult;
      }
      /**
       * Sets the new metric instruments with the current Meter.
       */
      _updateMetricInstruments() {
        return;
      }
      /* Returns InstrumentationConfig */
      getConfig() {
        return this._config;
      }
      /**
       * Sets InstrumentationConfig to this plugin
       * @param config
       */
      setConfig(config) {
        this._config = {
          enabled: true,
          ...config
        };
      }
      /**
       * Sets TraceProvider to this plugin
       * @param tracerProvider
       */
      setTracerProvider(tracerProvider) {
        this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
      }
      /* Returns tracer */
      get tracer() {
        return this._tracer;
      }
      /**
       * Execute span customization hook, if configured, and log any errors.
       * Any semantics of the trigger and info are defined by the specific instrumentation.
       * @param hookHandler The optional hook handler which the user has configured via instrumentation config
       * @param triggerName The name of the trigger for executing the hook for logging purposes
       * @param span The span to which the hook should be applied
       * @param info The info object to be passed to the hook, with useful data the hook may use
       */
      _runSpanCustomizationHook(hookHandler, triggerName, span, info) {
        if (!hookHandler) {
          return;
        }
        try {
          hookHandler(span, info);
        } catch (e) {
          this._diag.error(`Error running span customization hook due to exception in handler`, { triggerName }, e);
        }
      }
    };
    exports.InstrumentationAbstract = InstrumentationAbstract;
  }
});

// node_modules/@prisma/instrumentation/node_modules/require-in-the-middle/index.js
var require_require_in_the_middle = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/require-in-the-middle/index.js"(exports, module) {
    "use strict";
    init_esm();
    var path = __require("path");
    var Module = __require("module");
    var debug = require_src()("require-in-the-middle");
    var moduleDetailsFromPath = require_module_details_from_path();
    module.exports = Hook;
    module.exports.Hook = Hook;
    var builtinModules;
    var isCore;
    if (Module.isBuiltin) {
      isCore = Module.isBuiltin;
    } else if (Module.builtinModules) {
      isCore = /* @__PURE__ */ __name((moduleName) => {
        if (moduleName.startsWith("node:")) {
          return true;
        }
        if (builtinModules === void 0) {
          builtinModules = new Set(Module.builtinModules);
        }
        return builtinModules.has(moduleName);
      }, "isCore");
    } else {
      throw new Error("'require-in-the-middle' requires Node.js >=v9.3.0 or >=v8.10.0");
    }
    var normalize = /([/\\]index)?(\.js)?$/;
    var ExportsCache = class {
      static {
        __name(this, "ExportsCache");
      }
      constructor() {
        this._localCache = /* @__PURE__ */ new Map();
        this._kRitmExports = Symbol("RitmExports");
      }
      has(filename, isBuiltin) {
        if (this._localCache.has(filename)) {
          return true;
        } else if (!isBuiltin) {
          const mod = __require.cache[filename];
          return !!(mod && this._kRitmExports in mod);
        } else {
          return false;
        }
      }
      get(filename, isBuiltin) {
        const cachedExports = this._localCache.get(filename);
        if (cachedExports !== void 0) {
          return cachedExports;
        } else if (!isBuiltin) {
          const mod = __require.cache[filename];
          return mod && mod[this._kRitmExports];
        }
      }
      set(filename, exports2, isBuiltin) {
        if (isBuiltin) {
          this._localCache.set(filename, exports2);
        } else if (filename in __require.cache) {
          __require.cache[filename][this._kRitmExports] = exports2;
        } else {
          debug('non-core module is unexpectedly not in require.cache: "%s"', filename);
          this._localCache.set(filename, exports2);
        }
      }
    };
    function Hook(modules, options, onrequire) {
      if (this instanceof Hook === false) return new Hook(modules, options, onrequire);
      if (typeof modules === "function") {
        onrequire = modules;
        modules = null;
        options = null;
      } else if (typeof options === "function") {
        onrequire = options;
        options = null;
      }
      if (typeof Module._resolveFilename !== "function") {
        console.error("Error: Expected Module._resolveFilename to be a function (was: %s) - aborting!", typeof Module._resolveFilename);
        console.error("Please report this error as an issue related to Node.js %s at https://github.com/nodejs/require-in-the-middle/issues", process.version);
        return;
      }
      this._cache = new ExportsCache();
      this._unhooked = false;
      this._origRequire = Module.prototype.require;
      const self = this;
      const patching = /* @__PURE__ */ new Set();
      const internals = options ? options.internals === true : false;
      const hasWhitelist = Array.isArray(modules);
      debug("registering require hook");
      this._require = Module.prototype.require = function(id) {
        if (self._unhooked === true) {
          debug("ignoring require call - module is soft-unhooked");
          return self._origRequire.apply(this, arguments);
        }
        return patchedRequire.call(this, arguments, false);
      };
      if (typeof process.getBuiltinModule === "function") {
        this._origGetBuiltinModule = process.getBuiltinModule;
        this._getBuiltinModule = process.getBuiltinModule = function(id) {
          if (self._unhooked === true) {
            debug("ignoring process.getBuiltinModule call - module is soft-unhooked");
            return self._origGetBuiltinModule.apply(this, arguments);
          }
          return patchedRequire.call(this, arguments, true);
        };
      }
      function patchedRequire(args, coreOnly) {
        const id = args[0];
        const core = isCore(id);
        let filename;
        if (core) {
          filename = id;
          if (id.startsWith("node:")) {
            const idWithoutPrefix = id.slice(5);
            if (isCore(idWithoutPrefix)) {
              filename = idWithoutPrefix;
            }
          }
        } else if (coreOnly) {
          debug("call to process.getBuiltinModule with unknown built-in id");
          return self._origGetBuiltinModule.apply(this, args);
        } else {
          try {
            filename = Module._resolveFilename(id, this);
          } catch (resolveErr) {
            debug('Module._resolveFilename("%s") threw %j, calling original Module.require', id, resolveErr.message);
            return self._origRequire.apply(this, args);
          }
        }
        let moduleName, basedir;
        debug("processing %s module require('%s'): %s", core === true ? "core" : "non-core", id, filename);
        if (self._cache.has(filename, core) === true) {
          debug("returning already patched cached module: %s", filename);
          return self._cache.get(filename, core);
        }
        const isPatching = patching.has(filename);
        if (isPatching === false) {
          patching.add(filename);
        }
        const exports2 = coreOnly ? self._origGetBuiltinModule.apply(this, args) : self._origRequire.apply(this, args);
        if (isPatching === true) {
          debug("module is in the process of being patched already - ignoring: %s", filename);
          return exports2;
        }
        patching.delete(filename);
        if (core === true) {
          if (hasWhitelist === true && modules.includes(filename) === false) {
            debug("ignoring core module not on whitelist: %s", filename);
            return exports2;
          }
          moduleName = filename;
        } else if (hasWhitelist === true && modules.includes(filename)) {
          const parsedPath = path.parse(filename);
          moduleName = parsedPath.name;
          basedir = parsedPath.dir;
        } else {
          const stat = moduleDetailsFromPath(filename);
          if (stat === void 0) {
            debug("could not parse filename: %s", filename);
            return exports2;
          }
          moduleName = stat.name;
          basedir = stat.basedir;
          const fullModuleName = resolveModuleName(stat);
          debug("resolved filename to module: %s (id: %s, resolved: %s, basedir: %s)", moduleName, id, fullModuleName, basedir);
          let matchFound = false;
          if (hasWhitelist) {
            if (!id.startsWith(".") && modules.includes(id)) {
              moduleName = id;
              matchFound = true;
            }
            if (!modules.includes(moduleName) && !modules.includes(fullModuleName)) {
              return exports2;
            }
            if (modules.includes(fullModuleName) && fullModuleName !== moduleName) {
              moduleName = fullModuleName;
              matchFound = true;
            }
          }
          if (!matchFound) {
            let res;
            try {
              res = __require.resolve(moduleName, { paths: [basedir] });
            } catch (e) {
              debug("could not resolve module: %s", moduleName);
              self._cache.set(filename, exports2, core);
              return exports2;
            }
            if (res !== filename) {
              if (internals === true) {
                moduleName = moduleName + path.sep + path.relative(basedir, filename);
                debug("preparing to process require of internal file: %s", moduleName);
              } else {
                debug("ignoring require of non-main module file: %s", res);
                self._cache.set(filename, exports2, core);
                return exports2;
              }
            }
          }
        }
        self._cache.set(filename, exports2, core);
        debug("calling require hook: %s", moduleName);
        const patchedExports = onrequire(exports2, moduleName, basedir);
        self._cache.set(filename, patchedExports, core);
        debug("returning module: %s", moduleName);
        return patchedExports;
      }
      __name(patchedRequire, "patchedRequire");
    }
    __name(Hook, "Hook");
    Hook.prototype.unhook = function() {
      this._unhooked = true;
      if (this._require === Module.prototype.require) {
        Module.prototype.require = this._origRequire;
        debug("require unhook successful");
      } else {
        debug("require unhook unsuccessful");
      }
      if (process.getBuiltinModule !== void 0) {
        if (this._getBuiltinModule === process.getBuiltinModule) {
          process.getBuiltinModule = this._origGetBuiltinModule;
          debug("process.getBuiltinModule unhook successful");
        } else {
          debug("process.getBuiltinModule unhook unsuccessful");
        }
      }
    };
    function resolveModuleName(stat) {
      const normalizedPath = path.sep !== "/" ? stat.path.split(path.sep).join("/") : stat.path;
      return path.posix.join(stat.name, normalizedPath).replace(normalize, "");
    }
    __name(resolveModuleName, "resolveModuleName");
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/ModuleNameTrie.js
var require_ModuleNameTrie = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/ModuleNameTrie.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModuleNameTrie = exports.ModuleNameSeparator = void 0;
    exports.ModuleNameSeparator = "/";
    var ModuleNameTrieNode = class {
      static {
        __name(this, "ModuleNameTrieNode");
      }
      hooks = [];
      children = /* @__PURE__ */ new Map();
    };
    var ModuleNameTrie = class {
      static {
        __name(this, "ModuleNameTrie");
      }
      _trie = new ModuleNameTrieNode();
      _counter = 0;
      /**
       * Insert a module hook into the trie
       *
       * @param {Hooked} hook Hook
       */
      insert(hook) {
        let trieNode = this._trie;
        for (const moduleNamePart of hook.moduleName.split(exports.ModuleNameSeparator)) {
          let nextNode = trieNode.children.get(moduleNamePart);
          if (!nextNode) {
            nextNode = new ModuleNameTrieNode();
            trieNode.children.set(moduleNamePart, nextNode);
          }
          trieNode = nextNode;
        }
        trieNode.hooks.push({ hook, insertedId: this._counter++ });
      }
      /**
       * Search for matching hooks in the trie
       *
       * @param {string} moduleName Module name
       * @param {boolean} maintainInsertionOrder Whether to return the results in insertion order
       * @param {boolean} fullOnly Whether to return only full matches
       * @returns {Hooked[]} Matching hooks
       */
      search(moduleName, { maintainInsertionOrder, fullOnly } = {}) {
        let trieNode = this._trie;
        const results = [];
        let foundFull = true;
        for (const moduleNamePart of moduleName.split(exports.ModuleNameSeparator)) {
          const nextNode = trieNode.children.get(moduleNamePart);
          if (!nextNode) {
            foundFull = false;
            break;
          }
          if (!fullOnly) {
            results.push(...nextNode.hooks);
          }
          trieNode = nextNode;
        }
        if (fullOnly && foundFull) {
          results.push(...trieNode.hooks);
        }
        if (results.length === 0) {
          return [];
        }
        if (results.length === 1) {
          return [results[0].hook];
        }
        if (maintainInsertionOrder) {
          results.sort((a, b) => a.insertedId - b.insertedId);
        }
        return results.map(({ hook }) => hook);
      }
    };
    exports.ModuleNameTrie = ModuleNameTrie;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/RequireInTheMiddleSingleton.js
var require_RequireInTheMiddleSingleton = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/RequireInTheMiddleSingleton.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RequireInTheMiddleSingleton = void 0;
    var require_in_the_middle_1 = require_require_in_the_middle();
    var path = __require("path");
    var ModuleNameTrie_1 = require_ModuleNameTrie();
    var isMocha = [
      "afterEach",
      "after",
      "beforeEach",
      "before",
      "describe",
      "it"
    ].every((fn) => {
      return typeof global[fn] === "function";
    });
    var RequireInTheMiddleSingleton = class _RequireInTheMiddleSingleton {
      static {
        __name(this, "RequireInTheMiddleSingleton");
      }
      _moduleNameTrie = new ModuleNameTrie_1.ModuleNameTrie();
      static _instance;
      constructor() {
        this._initialize();
      }
      _initialize() {
        new require_in_the_middle_1.Hook(
          // Intercept all `require` calls; we will filter the matching ones below
          null,
          { internals: true },
          (exports2, name, basedir) => {
            const normalizedModuleName = normalizePathSeparators(name);
            const matches = this._moduleNameTrie.search(normalizedModuleName, {
              maintainInsertionOrder: true,
              // For core modules (e.g. `fs`), do not match on sub-paths (e.g. `fs/promises').
              // This matches the behavior of `require-in-the-middle`.
              // `basedir` is always `undefined` for core modules.
              fullOnly: basedir === void 0
            });
            for (const { onRequire } of matches) {
              exports2 = onRequire(exports2, name, basedir);
            }
            return exports2;
          }
        );
      }
      /**
       * Register a hook with `require-in-the-middle`
       *
       * @param {string} moduleName Module name
       * @param {OnRequireFn} onRequire Hook function
       * @returns {Hooked} Registered hook
       */
      register(moduleName, onRequire) {
        const hooked = { moduleName, onRequire };
        this._moduleNameTrie.insert(hooked);
        return hooked;
      }
      /**
       * Get the `RequireInTheMiddleSingleton` singleton
       *
       * @returns {RequireInTheMiddleSingleton} Singleton of `RequireInTheMiddleSingleton`
       */
      static getInstance() {
        if (isMocha)
          return new _RequireInTheMiddleSingleton();
        return this._instance = this._instance ?? new _RequireInTheMiddleSingleton();
      }
    };
    exports.RequireInTheMiddleSingleton = RequireInTheMiddleSingleton;
    function normalizePathSeparators(moduleNameOrPath) {
      return path.sep !== ModuleNameTrie_1.ModuleNameSeparator ? moduleNameOrPath.split(path.sep).join(ModuleNameTrie_1.ModuleNameSeparator) : moduleNameOrPath;
    }
    __name(normalizePathSeparators, "normalizePathSeparators");
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/utils.js
var require_utils = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/utils.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isWrapped = exports.safeExecuteInTheMiddleAsync = exports.safeExecuteInTheMiddle = void 0;
    function safeExecuteInTheMiddle(execute, onFinish, preventThrowingError) {
      let error;
      let result;
      try {
        result = execute();
      } catch (e) {
        error = e;
      } finally {
        onFinish(error, result);
        if (error && !preventThrowingError) {
          throw error;
        }
        return result;
      }
    }
    __name(safeExecuteInTheMiddle, "safeExecuteInTheMiddle");
    exports.safeExecuteInTheMiddle = safeExecuteInTheMiddle;
    async function safeExecuteInTheMiddleAsync(execute, onFinish, preventThrowingError) {
      let error;
      let result;
      try {
        result = await execute();
      } catch (e) {
        error = e;
      } finally {
        onFinish(error, result);
        if (error && !preventThrowingError) {
          throw error;
        }
        return result;
      }
    }
    __name(safeExecuteInTheMiddleAsync, "safeExecuteInTheMiddleAsync");
    exports.safeExecuteInTheMiddleAsync = safeExecuteInTheMiddleAsync;
    function isWrapped(func) {
      return typeof func === "function" && typeof func.__original === "function" && typeof func.__unwrap === "function" && func.__wrapped === true;
    }
    __name(isWrapped, "isWrapped");
    exports.isWrapped = isWrapped;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/instrumentation.js
var require_instrumentation2 = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/instrumentation.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InstrumentationBase = void 0;
    var path = __require("path");
    var util_1 = __require("util");
    var semver_1 = require_semver();
    var shimmer_1 = require_shimmer();
    var instrumentation_1 = require_instrumentation();
    var RequireInTheMiddleSingleton_1 = require_RequireInTheMiddleSingleton();
    var import_in_the_middle_1 = __require("import-in-the-middle");
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var require_in_the_middle_1 = require_require_in_the_middle();
    var fs_1 = __require("fs");
    var utils_1 = require_utils();
    var InstrumentationBase2 = class extends instrumentation_1.InstrumentationAbstract {
      static {
        __name(this, "InstrumentationBase");
      }
      _modules;
      _hooks = [];
      _requireInTheMiddleSingleton = RequireInTheMiddleSingleton_1.RequireInTheMiddleSingleton.getInstance();
      _enabled = false;
      constructor(instrumentationName, instrumentationVersion, config) {
        super(instrumentationName, instrumentationVersion, config);
        let modules = this.init();
        if (modules && !Array.isArray(modules)) {
          modules = [modules];
        }
        this._modules = modules || [];
        if (this._config.enabled) {
          this.enable();
        }
      }
      _wrap = /* @__PURE__ */ __name((moduleExports, name, wrapper) => {
        if ((0, utils_1.isWrapped)(moduleExports[name])) {
          this._unwrap(moduleExports, name);
        }
        if (!util_1.types.isProxy(moduleExports)) {
          return (0, shimmer_1.wrap)(moduleExports, name, wrapper);
        } else {
          const wrapped = (0, shimmer_1.wrap)(Object.assign({}, moduleExports), name, wrapper);
          Object.defineProperty(moduleExports, name, {
            value: wrapped
          });
          return wrapped;
        }
      }, "_wrap");
      _unwrap = /* @__PURE__ */ __name((moduleExports, name) => {
        if (!util_1.types.isProxy(moduleExports)) {
          return (0, shimmer_1.unwrap)(moduleExports, name);
        } else {
          return Object.defineProperty(moduleExports, name, {
            value: moduleExports[name]
          });
        }
      }, "_unwrap");
      _massWrap = /* @__PURE__ */ __name((moduleExportsArray, names, wrapper) => {
        if (!moduleExportsArray) {
          api_1.diag.error("must provide one or more modules to patch");
          return;
        } else if (!Array.isArray(moduleExportsArray)) {
          moduleExportsArray = [moduleExportsArray];
        }
        if (!(names && Array.isArray(names))) {
          api_1.diag.error("must provide one or more functions to wrap on modules");
          return;
        }
        moduleExportsArray.forEach((moduleExports) => {
          names.forEach((name) => {
            this._wrap(moduleExports, name, wrapper);
          });
        });
      }, "_massWrap");
      _massUnwrap = /* @__PURE__ */ __name((moduleExportsArray, names) => {
        if (!moduleExportsArray) {
          api_1.diag.error("must provide one or more modules to patch");
          return;
        } else if (!Array.isArray(moduleExportsArray)) {
          moduleExportsArray = [moduleExportsArray];
        }
        if (!(names && Array.isArray(names))) {
          api_1.diag.error("must provide one or more functions to wrap on modules");
          return;
        }
        moduleExportsArray.forEach((moduleExports) => {
          names.forEach((name) => {
            this._unwrap(moduleExports, name);
          });
        });
      }, "_massUnwrap");
      _warnOnPreloadedModules() {
        this._modules.forEach((module2) => {
          const { name } = module2;
          try {
            const resolvedModule = __require.resolve(name);
            if (__require.cache[resolvedModule]) {
              this._diag.warn(`Module ${name} has been loaded before ${this.instrumentationName} so it might not work, please initialize it before requiring ${name}`);
            }
          } catch {
          }
        });
      }
      _extractPackageVersion(baseDir) {
        try {
          const json = (0, fs_1.readFileSync)(path.join(baseDir, "package.json"), {
            encoding: "utf8"
          });
          const version = JSON.parse(json).version;
          return typeof version === "string" ? version : void 0;
        } catch {
          api_1.diag.warn("Failed extracting version", baseDir);
        }
        return void 0;
      }
      _onRequire(module2, exports2, name, baseDir) {
        if (!baseDir) {
          if (typeof module2.patch === "function") {
            module2.moduleExports = exports2;
            if (this._enabled) {
              this._diag.debug("Applying instrumentation patch for nodejs core module on require hook", {
                module: module2.name
              });
              return module2.patch(exports2);
            }
          }
          return exports2;
        }
        const version = this._extractPackageVersion(baseDir);
        module2.moduleVersion = version;
        if (module2.name === name) {
          if (isSupported(module2.supportedVersions, version, module2.includePrerelease)) {
            if (typeof module2.patch === "function") {
              module2.moduleExports = exports2;
              if (this._enabled) {
                this._diag.debug("Applying instrumentation patch for module on require hook", {
                  module: module2.name,
                  version: module2.moduleVersion,
                  baseDir
                });
                return module2.patch(exports2, module2.moduleVersion);
              }
            }
          }
          return exports2;
        }
        const files = module2.files ?? [];
        const normalizedName = path.normalize(name);
        const supportedFileInstrumentations = files.filter((f) => f.name === normalizedName).filter((f) => isSupported(f.supportedVersions, version, module2.includePrerelease));
        return supportedFileInstrumentations.reduce((patchedExports, file) => {
          file.moduleExports = patchedExports;
          if (this._enabled) {
            this._diag.debug("Applying instrumentation patch for nodejs module file on require hook", {
              module: module2.name,
              version: module2.moduleVersion,
              fileName: file.name,
              baseDir
            });
            return file.patch(patchedExports, module2.moduleVersion);
          }
          return patchedExports;
        }, exports2);
      }
      enable() {
        if (this._enabled) {
          return;
        }
        this._enabled = true;
        if (this._hooks.length > 0) {
          for (const module2 of this._modules) {
            if (typeof module2.patch === "function" && module2.moduleExports) {
              this._diag.debug("Applying instrumentation patch for nodejs module on instrumentation enabled", {
                module: module2.name,
                version: module2.moduleVersion
              });
              module2.patch(module2.moduleExports, module2.moduleVersion);
            }
            for (const file of module2.files) {
              if (file.moduleExports) {
                this._diag.debug("Applying instrumentation patch for nodejs module file on instrumentation enabled", {
                  module: module2.name,
                  version: module2.moduleVersion,
                  fileName: file.name
                });
                file.patch(file.moduleExports, module2.moduleVersion);
              }
            }
          }
          return;
        }
        this._warnOnPreloadedModules();
        for (const module2 of this._modules) {
          const hookFn = /* @__PURE__ */ __name((exports2, name, baseDir) => {
            if (!baseDir && path.isAbsolute(name)) {
              const parsedPath = path.parse(name);
              name = parsedPath.name;
              baseDir = parsedPath.dir;
            }
            return this._onRequire(module2, exports2, name, baseDir);
          }, "hookFn");
          const onRequire = /* @__PURE__ */ __name((exports2, name, baseDir) => {
            return this._onRequire(module2, exports2, name, baseDir);
          }, "onRequire");
          const hook = path.isAbsolute(module2.name) ? new require_in_the_middle_1.Hook([module2.name], { internals: true }, onRequire) : this._requireInTheMiddleSingleton.register(module2.name, onRequire);
          this._hooks.push(hook);
          const esmHook = new import_in_the_middle_1.Hook([module2.name], { internals: false }, hookFn);
          this._hooks.push(esmHook);
        }
      }
      disable() {
        if (!this._enabled) {
          return;
        }
        this._enabled = false;
        for (const module2 of this._modules) {
          if (typeof module2.unpatch === "function" && module2.moduleExports) {
            this._diag.debug("Removing instrumentation patch for nodejs module on instrumentation disabled", {
              module: module2.name,
              version: module2.moduleVersion
            });
            module2.unpatch(module2.moduleExports, module2.moduleVersion);
          }
          for (const file of module2.files) {
            if (file.moduleExports) {
              this._diag.debug("Removing instrumentation patch for nodejs module file on instrumentation disabled", {
                module: module2.name,
                version: module2.moduleVersion,
                fileName: file.name
              });
              file.unpatch(file.moduleExports, module2.moduleVersion);
            }
          }
        }
      }
      isEnabled() {
        return this._enabled;
      }
    };
    exports.InstrumentationBase = InstrumentationBase2;
    function isSupported(supportedVersions, version, includePrerelease) {
      if (typeof version === "undefined") {
        return supportedVersions.includes("*");
      }
      return supportedVersions.some((supportedVersion) => {
        return (0, semver_1.satisfies)(version, supportedVersion, { includePrerelease });
      });
    }
    __name(isSupported, "isSupported");
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/normalize.js
var require_normalize = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/normalize.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalize = void 0;
    var path_1 = __require("path");
    Object.defineProperty(exports, "normalize", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return path_1.normalize;
    }, "get") });
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/index.js
var require_node2 = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalize = exports.InstrumentationBase = void 0;
    var instrumentation_1 = require_instrumentation2();
    Object.defineProperty(exports, "InstrumentationBase", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return instrumentation_1.InstrumentationBase;
    }, "get") });
    var normalize_1 = require_normalize();
    Object.defineProperty(exports, "normalize", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return normalize_1.normalize;
    }, "get") });
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/index.js
var require_platform2 = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalize = exports.InstrumentationBase = void 0;
    var node_1 = require_node2();
    Object.defineProperty(exports, "InstrumentationBase", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1.InstrumentationBase;
    }, "get") });
    Object.defineProperty(exports, "normalize", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1.normalize;
    }, "get") });
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/instrumentationNodeModuleDefinition.js
var require_instrumentationNodeModuleDefinition = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/instrumentationNodeModuleDefinition.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InstrumentationNodeModuleDefinition = void 0;
    var InstrumentationNodeModuleDefinition2 = class {
      static {
        __name(this, "InstrumentationNodeModuleDefinition");
      }
      name;
      supportedVersions;
      patch;
      unpatch;
      files;
      constructor(name, supportedVersions, patch, unpatch, files) {
        this.name = name;
        this.supportedVersions = supportedVersions;
        this.patch = patch;
        this.unpatch = unpatch;
        this.files = files || [];
      }
    };
    exports.InstrumentationNodeModuleDefinition = InstrumentationNodeModuleDefinition2;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/instrumentationNodeModuleFile.js
var require_instrumentationNodeModuleFile = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/instrumentationNodeModuleFile.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InstrumentationNodeModuleFile = void 0;
    var index_1 = require_platform2();
    var InstrumentationNodeModuleFile = class {
      static {
        __name(this, "InstrumentationNodeModuleFile");
      }
      supportedVersions;
      patch;
      unpatch;
      name;
      constructor(name, supportedVersions, patch, unpatch) {
        this.supportedVersions = supportedVersions;
        this.patch = patch;
        this.unpatch = unpatch;
        this.name = (0, index_1.normalize)(name);
      }
    };
    exports.InstrumentationNodeModuleFile = InstrumentationNodeModuleFile;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/semconvStability.js
var require_semconvStability = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/semconvStability.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.semconvStabilityFromStr = exports.SemconvStability = void 0;
    var SemconvStability;
    (function(SemconvStability2) {
      SemconvStability2[SemconvStability2["STABLE"] = 1] = "STABLE";
      SemconvStability2[SemconvStability2["OLD"] = 2] = "OLD";
      SemconvStability2[SemconvStability2["DUPLICATE"] = 3] = "DUPLICATE";
    })(SemconvStability = exports.SemconvStability || (exports.SemconvStability = {}));
    function semconvStabilityFromStr(namespace, str) {
      let semconvStability = SemconvStability.OLD;
      const entries = str?.split(",").map((v) => v.trim()).filter((s) => s !== "");
      for (const entry of entries ?? []) {
        if (entry.toLowerCase() === namespace + "/dup") {
          semconvStability = SemconvStability.DUPLICATE;
          break;
        } else if (entry.toLowerCase() === namespace) {
          semconvStability = SemconvStability.STABLE;
        }
      }
      return semconvStability;
    }
    __name(semconvStabilityFromStr, "semconvStabilityFromStr");
    exports.semconvStabilityFromStr = semconvStabilityFromStr;
  }
});

// node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/index.js
var require_src3 = __commonJS({
  "node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/src/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.semconvStabilityFromStr = exports.SemconvStability = exports.safeExecuteInTheMiddleAsync = exports.safeExecuteInTheMiddle = exports.isWrapped = exports.InstrumentationNodeModuleFile = exports.InstrumentationNodeModuleDefinition = exports.InstrumentationBase = exports.registerInstrumentations = void 0;
    var autoLoader_1 = require_autoLoader();
    Object.defineProperty(exports, "registerInstrumentations", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return autoLoader_1.registerInstrumentations;
    }, "get") });
    var index_1 = require_platform2();
    Object.defineProperty(exports, "InstrumentationBase", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return index_1.InstrumentationBase;
    }, "get") });
    var instrumentationNodeModuleDefinition_1 = require_instrumentationNodeModuleDefinition();
    Object.defineProperty(exports, "InstrumentationNodeModuleDefinition", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return instrumentationNodeModuleDefinition_1.InstrumentationNodeModuleDefinition;
    }, "get") });
    var instrumentationNodeModuleFile_1 = require_instrumentationNodeModuleFile();
    Object.defineProperty(exports, "InstrumentationNodeModuleFile", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return instrumentationNodeModuleFile_1.InstrumentationNodeModuleFile;
    }, "get") });
    var utils_1 = require_utils();
    Object.defineProperty(exports, "isWrapped", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return utils_1.isWrapped;
    }, "get") });
    Object.defineProperty(exports, "safeExecuteInTheMiddle", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return utils_1.safeExecuteInTheMiddle;
    }, "get") });
    Object.defineProperty(exports, "safeExecuteInTheMiddleAsync", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return utils_1.safeExecuteInTheMiddleAsync;
    }, "get") });
    var semconvStability_1 = require_semconvStability();
    Object.defineProperty(exports, "SemconvStability", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return semconvStability_1.SemconvStability;
    }, "get") });
    Object.defineProperty(exports, "semconvStabilityFromStr", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return semconvStability_1.semconvStabilityFromStr;
    }, "get") });
  }
});

// trigger.config.ts
init_esm();

// node_modules/@prisma/instrumentation/dist/index.mjs
init_esm();
init_esm2();
var import_instrumentation = __toESM(require_src3(), 1);
init_esm2();
var showAllTraces = process.env.PRISMA_SHOW_ALL_TRACES === "true";
var nonSampledTraceParent = `00-10-10-00`;
function engineSpanKindToOtelSpanKind(engineSpanKind) {
  switch (engineSpanKind) {
    case "client":
      return SpanKind.CLIENT;
    case "internal":
    default:
      return SpanKind.INTERNAL;
  }
}
__name(engineSpanKindToOtelSpanKind, "engineSpanKindToOtelSpanKind");
var ActiveTracingHelper = class {
  static {
    __name(this, "ActiveTracingHelper");
  }
  tracerProvider;
  ignoreSpanTypes;
  constructor({ tracerProvider, ignoreSpanTypes }) {
    this.tracerProvider = tracerProvider;
    this.ignoreSpanTypes = ignoreSpanTypes;
  }
  isEnabled() {
    return true;
  }
  getTraceParent(context2) {
    const span = trace.getSpanContext(context2 ?? context.active());
    if (span) {
      return `00-${span.traceId}-${span.spanId}-0${span.traceFlags}`;
    }
    return nonSampledTraceParent;
  }
  dispatchEngineSpans(spans) {
    const tracer = this.tracerProvider.getTracer("prisma");
    const linkIds = /* @__PURE__ */ new Map();
    const roots = spans.filter((span) => span.parentId === null);
    for (const root of roots) {
      dispatchEngineSpan(tracer, root, spans, linkIds, this.ignoreSpanTypes);
    }
  }
  getActiveContext() {
    return context.active();
  }
  runInChildSpan(options, callback) {
    if (typeof options === "string") {
      options = { name: options };
    }
    if (options.internal && !showAllTraces) {
      return callback();
    }
    const tracer = this.tracerProvider.getTracer("prisma");
    const context2 = options.context ?? this.getActiveContext();
    const name = `prisma:client:${options.name}`;
    if (shouldIgnoreSpan(name, this.ignoreSpanTypes)) {
      return callback();
    }
    if (options.active === false) {
      const span = tracer.startSpan(name, options, context2);
      return endSpan(span, callback(span, context2));
    }
    return tracer.startActiveSpan(name, options, (span) => endSpan(span, callback(span, context2)));
  }
};
function dispatchEngineSpan(tracer, engineSpan, allSpans, linkIds, ignoreSpanTypes) {
  if (shouldIgnoreSpan(engineSpan.name, ignoreSpanTypes)) return;
  const spanOptions = {
    attributes: engineSpan.attributes,
    kind: engineSpanKindToOtelSpanKind(engineSpan.kind),
    startTime: engineSpan.startTime
  };
  tracer.startActiveSpan(engineSpan.name, spanOptions, (span) => {
    linkIds.set(engineSpan.id, span.spanContext().spanId);
    if (engineSpan.links) {
      span.addLinks(
        engineSpan.links.flatMap((link) => {
          const linkedId = linkIds.get(link);
          if (!linkedId) {
            return [];
          }
          return {
            context: {
              spanId: linkedId,
              traceId: span.spanContext().traceId,
              traceFlags: span.spanContext().traceFlags
            }
          };
        })
      );
    }
    const children = allSpans.filter((s) => s.parentId === engineSpan.id);
    for (const child of children) {
      dispatchEngineSpan(tracer, child, allSpans, linkIds, ignoreSpanTypes);
    }
    span.end(engineSpan.endTime);
  });
}
__name(dispatchEngineSpan, "dispatchEngineSpan");
function endSpan(span, result) {
  if (isPromiseLike(result)) {
    return result.then(
      (value) => {
        span.end();
        return value;
      },
      (reason) => {
        span.end();
        throw reason;
      }
    );
  }
  span.end();
  return result;
}
__name(endSpan, "endSpan");
function isPromiseLike(value) {
  return value != null && typeof value["then"] === "function";
}
__name(isPromiseLike, "isPromiseLike");
function shouldIgnoreSpan(spanName, ignoreSpanTypes) {
  return ignoreSpanTypes.some(
    (pattern) => typeof pattern === "string" ? pattern === spanName : pattern.test(spanName)
  );
}
__name(shouldIgnoreSpan, "shouldIgnoreSpan");
var package_default = {
  name: "@prisma/instrumentation",
  version: "7.0.0",
  description: "OpenTelemetry compliant instrumentation for Prisma Client",
  main: "dist/index.js",
  module: "dist/index.mjs",
  types: "dist/index.d.ts",
  exports: {
    ".": {
      require: {
        types: "./dist/index.d.ts",
        default: "./dist/index.js"
      },
      import: {
        types: "./dist/index.d.ts",
        default: "./dist/index.mjs"
      }
    }
  },
  license: "Apache-2.0",
  homepage: "https://www.prisma.io",
  repository: {
    type: "git",
    url: "https://github.com/prisma/prisma.git",
    directory: "packages/instrumentation"
  },
  bugs: "https://github.com/prisma/prisma/issues",
  devDependencies: {
    "@opentelemetry/api": "1.9.0",
    "@prisma/internals": "workspace:*",
    "@types/node": "~20.19.24",
    typescript: "5.4.5"
  },
  dependencies: {
    "@opentelemetry/instrumentation": "^0.207.0"
  },
  peerDependencies: {
    "@opentelemetry/api": "^1.8"
  },
  files: [
    "dist"
  ],
  keywords: [
    "prisma",
    "instrumentation",
    "opentelemetry",
    "otel"
  ],
  scripts: {
    dev: "DEV=true tsx helpers/build.ts",
    build: "tsx helpers/build.ts",
    prepublishOnly: "pnpm run build",
    test: "vitest run"
  },
  sideEffects: false
};
var VERSION = package_default.version;
var majorVersion = VERSION.split(".")[0];
var GLOBAL_INSTRUMENTATION_ACCESSOR_KEY = "PRISMA_INSTRUMENTATION";
var GLOBAL_VERSIONED_INSTRUMENTATION_ACCESSOR_KEY = `V${majorVersion}_PRISMA_INSTRUMENTATION`;
var NAME = package_default.name;
var MODULE_NAME = "@prisma/client";
var PrismaInstrumentation = class extends import_instrumentation.InstrumentationBase {
  static {
    __name(this, "PrismaInstrumentation");
  }
  tracerProvider;
  constructor(config = {}) {
    super(NAME, VERSION, config);
  }
  setTracerProvider(tracerProvider) {
    this.tracerProvider = tracerProvider;
  }
  init() {
    const module = new import_instrumentation.InstrumentationNodeModuleDefinition(MODULE_NAME, [VERSION]);
    return [module];
  }
  enable() {
    const config = this._config;
    const globalValue = {
      helper: new ActiveTracingHelper({
        tracerProvider: this.tracerProvider ?? trace.getTracerProvider(),
        ignoreSpanTypes: config.ignoreSpanTypes ?? []
      })
    };
    global[GLOBAL_INSTRUMENTATION_ACCESSOR_KEY] = globalValue;
    global[GLOBAL_VERSIONED_INSTRUMENTATION_ACCESSOR_KEY] = globalValue;
  }
  disable() {
    delete global[GLOBAL_INSTRUMENTATION_ACCESSOR_KEY];
    delete global[GLOBAL_VERSIONED_INSTRUMENTATION_ACCESSOR_KEY];
  }
  isEnabled() {
    return Boolean(global[GLOBAL_VERSIONED_INSTRUMENTATION_ACCESSOR_KEY]);
  }
};

// trigger.config.ts
var trigger_config_default = defineConfig({
  project: process.env.TRIGGER_PROJECT_REF,
  runtime: "node",
  logLevel: "info",
  maxDuration: 3600,
  // in seconds (1 hour)
  // The directories where your trigger tasks are located
  dirs: ["./src/trigger"],
  telemetry: {
    instrumentations: [new PrismaInstrumentation()]
  },
  build: {}
});
var resolveEnvVars = void 0;
export {
  trigger_config_default as default,
  resolveEnvVars
};
//# sourceMappingURL=trigger.config.mjs.map
