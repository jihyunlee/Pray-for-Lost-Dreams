var COMPILED = !0,
  goog = goog || {};
goog.global = this;
goog.DEBUG = !1;
goog.LOCALE = "en";
goog.provide = function(a) {
  if (!COMPILED) {
    if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');
    delete goog.implicitNamespaces_[a];
    for (var b = a;
      (b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) goog.implicitNamespaces_[b] = !0
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
};
COMPILED || (goog.isProvided_ = function(a) {
  return !goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for (var e; a.length && (e = a.shift());) !a.length && goog.isDef(b) ? c[e] = b : c = c[e] ? c[e] : c[e] = {}
};
goog.getObjectByName = function(a, b) {
  for (var c = a.split("."), e = b || goog.global, d; d = c.shift();)
    if (goog.isDefAndNotNull(e[d])) e = e[d];
    else return null;
  return e
};
goog.globalize = function(a, b) {
  var c = b || goog.global,
    e;
  for (e in a) c[e] = a[e]
};
goog.addDependency = function(a, b, c) {
  if (!COMPILED) {
    for (var e, a = a.replace(/\\/g, "/"), d = goog.dependencies_, f = 0; e = b[f]; f++) {
      d.nameToPath[e] = a;
      a in d.pathToNames || (d.pathToNames[a] = {});
      d.pathToNames[a][e] = true
    }
    for (e = 0; b = c[e]; e++) {
      a in d.requires || (d.requires[a] = {});
      d.requires[a][b] = true
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if (!COMPILED && !goog.isProvided_(a)) {
    if (goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if (b) {
        goog.included_[b] = true;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) return a.instance_;
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {
  pathToNames: {},
  nameToPath: {},
  requires: {},
  visited: {},
  written: {}
}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return typeof a != "undefined" && "write" in a
}, goog.findBasePath_ = function() {
  if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
  else if (goog.inHtmlDocument_())
    for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; b >= 0; --b) {
      var c = a[b].src,
        e = c.lastIndexOf("?"),
        e = e == -1 ? c.length : e;
      if (c.substr(e - 7, 7) == "base.js") {
        goog.basePath = c.substr(0, e - 7);
        break
      }
    }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = true)
}, goog.writeScriptTag_ = function(a) {
  if (goog.inHtmlDocument_()) {
    goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>');
    return true
  }
  return false
}, goog.writeScripts_ = function() {
  function a(d) {
    if (!(d in e.written)) {
      if (!(d in
          e.visited)) {
        e.visited[d] = true;
        if (d in e.requires)
          for (var g in e.requires[d])
            if (!goog.isProvided_(g))
              if (g in e.nameToPath) a(e.nameToPath[g]);
              else throw Error("Undefined nameToPath for " + g);
      }
      if (!(d in c)) {
        c[d] = true;
        b.push(d)
      }
    }
  }
  var b = [],
    c = {},
    e = goog.dependencies_,
    d;
  for (d in goog.included_) e.written[d] || a(d);
  for (d = 0; d < b.length; d++)
    if (b[d]) goog.importScript_(goog.basePath + b[d]);
    else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] :
    null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if (b == "object")
    if (a) {
      if (a instanceof Array) return "array";
      if (a instanceof Object) return b;
      var c = Object.prototype.toString.call(a);
      if (c == "[object Window]") return "object";
      if (c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) return "array";
      if (c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) return "function"
    } else return "null";
  else if (b == "function" && typeof a.call == "undefined") return "object";
  return b
};
goog.isDef = function(a) {
  return a !== void 0
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  var b = typeof a;
  return b == "object" && a != null || b == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  } catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if (b == "object" || b == "array") {
    if (a.clone) return a.clone();
    var b = b == "array" ? [] : {},
      c;
    for (c in a) b[c] = goog.cloneObject(a[c]);
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if (!a) throw Error();
  if (arguments.length > 2) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, e);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for (var c in b) a[c] = b[c]
};
goog.now = Date.now || function() {
  return +new Date
};
goog.globalEval = function(a) {
  if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
  else if (goog.global.eval) {
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval("var _et_ = 1;");
      if (typeof goog.global._et_ != "undefined") {
        delete goog.global._et_;
        goog.evalWorksForGlobals_ = true
      } else goog.evalWorksForGlobals_ = false
    }
    if (goog.evalWorksForGlobals_) goog.global.eval(a);
    else {
      var b = goog.global.document,
        c = b.createElement("script");
      c.type = "text/javascript";
      c.defer = false;
      c.appendChild(b.createTextNode(a));
      b.body.appendChild(c);
      b.body.removeChild(c)
    }
  } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
      return goog.cssNameMapping_[a] || a
    },
    e = function(a) {
      for (var a = a.split("-"), b = [], e = 0; e < a.length; e++) b.push(c(a[e]));
      return b.join("-")
    },
    e = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : e : function(a) {
      return a
    };
  return b ? a + "-" + e(b) : e(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {},
    e;
  for (e in c) var d = ("" + c[e]).replace(/\$/g, "$$$$"),
    a = a.replace(RegExp("\\{\\$" + e + "\\}", "gi"), d);
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {}
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var e = arguments.callee.caller;
  if (e.superClass_) return e.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
  for (var d = Array.prototype.slice.call(arguments, 2), f = false, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor)
    if (g.prototype[b] === e) f = true;
    else if (f) return g.prototype[b].apply(a, d);
  if (a[b] === e) return a.constructor.prototype[b].apply(a, d);
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.Unicode = {
  NBSP: "\u00a0"
};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.subs = function(a, b) {
  for (var c = 1; c < arguments.length; c++) var e = String(arguments[c]).replace(/\$/g, "$$$$"),
    a = a.replace(/\%s/, e);
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return /^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return !/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return !/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return !/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return !/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return " " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(),
    e = String(b).toLowerCase();
  return c < e ? -1 : c == e ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if (a == b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), e = b.toLowerCase().match(goog.string.numerateCompareRegExp_), d = Math.min(c.length, e.length), f = 0; f < d; f++) {
    var g = c[f],
      h = e[f];
    if (g != h) return c = parseInt(g, 10), !isNaN(c) && (e = parseInt(h, 10), !isNaN(e) && c - e) ? c - e : g < h ? -1 : 1
  }
  return c.length != e.length ? c.length - e.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if (b) return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;");
  if (!goog.string.allRe_.test(a)) return a; - 1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;")); - 1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;")); - 1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"'
    },
    c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, d) {
    var f = b[a];
    if (f) return f;
    if ("#" == d.charAt(0)) {
      var g = Number("0" + d.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch (c) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        if ("#" == c.charAt(0)) {
          var e = Number("0" + c.substr(1));
          if (!isNaN(e)) return String.fromCharCode(e)
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for (var c = b.length, e = 0; e < c; e++) {
    var d = 1 == c ? b : b.charAt(e);
    if (a.charAt(0) == d && a.charAt(a.length - 1) == d) return a.substring(1, a.length - 1)
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, e) {
  c && (a = goog.string.unescapeEntities(a));
  if (e && a.length > b) {
    e > b && (e = b);
    var d = a.length - e,
      a = a.substring(0, b - e) + "..." + a.substring(d)
  } else a.length > b && (e = Math.floor(b / 2), d = a.length - e, a = a.substring(0, e + b % 2) + "..." + a.substring(d));
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {
  "\x00": "\\0",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
  "\x0B": "\\x0B",
  '"': '\\"',
  "\\": "\\\\"
};
goog.string.jsEscapeCache_ = {
  "'": "\\'"
};
goog.string.quote = function(a) {
  a = String(a);
  if (a.quote) return a.quote();
  for (var b = ['"'], c = 0; c < a.length; c++) {
    var e = a.charAt(c),
      d = e.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[e] || (31 < d && 127 > d ? e : goog.string.escapeChar(e))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];
  if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
  var b = a,
    c = a.charCodeAt(0);
  if (31 < c && 127 > c) b = a;
  else {
    if (256 > c) {
      if (b = "\\x", 16 > c || 256 < c) b += "0"
    } else b = "\\u", 4096 > c && (b += "0");
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = !0;
  return b
};
goog.string.contains = function(a, b) {
  return -1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var e = a;
  0 <= b && (b < a.length && 0 < c) && (e = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return e
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf("."); - 1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for (var c = 0, e = goog.string.trim(String(a)).split("."), d = goog.string.trim(String(b)).split("."), f = Math.max(e.length, d.length), g = 0; 0 == c && g < f; g++) {
    var h = e[g] || "",
      j = d[g] || "",
      i = RegExp("(\\d*)(\\D*)", "g"),
      k = RegExp("(\\d*)(\\D*)", "g");
    do {
      var l = i.exec(h) || ["", "", ""],
        m = k.exec(j) || ["", "", ""];
      if (0 == l[0].length && 0 == m[0].length) break;
      var c = 0 == l[1].length ? 0 : parseInt(l[1], 10),
        n = 0 == m[1].length ? 0 : parseInt(m[1], 10),
        c = goog.string.compareElements_(c, n) || goog.string.compareElements_(0 ==
          l[2].length, 0 == m[2].length) || goog.string.compareElements_(l[2], m[2])
    } while (0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, e) {
  var d = "Assertion failed";
  if (c) var d = d + (": " + c),
    f = e;
  else a && (d += ": " + a, f = b);
  throw new goog.asserts.AssertionError("" + d, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if (goog.asserts.ENABLE_ASSERTS) throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, e) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a
};
goog.string.format = function(a, b) {
  var c = Array.prototype.slice.call(arguments),
    e = c.shift();
  if ("undefined" == typeof e) throw Error("[goog.string.format] Template required");
  return e.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, e, h, j, i, k, l) {
    if ("%" == i) return "%";
    var m = c.shift();
    if ("undefined" == typeof m) throw Error("[goog.string.format] Not enough arguments");
    arguments[0] = m;
    return goog.string.format.demuxes_[i].apply(null, arguments)
  })
};
goog.string.format.demuxes_ = {};
goog.string.format.demuxes_.s = function(a, b, c) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + goog.string.repeat(" ", c - a.length) : goog.string.repeat(" ", c - a.length) + a
};
goog.string.format.demuxes_.f = function(a, b, c, e, d) {
  e = a.toString();
  isNaN(d) || "" == d || (e = a.toFixed(d));
  var f;
  f = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (e = f + e);
  if (isNaN(c) || e.length >= c) return e;
  e = isNaN(d) ? Math.abs(a).toString() : Math.abs(a).toFixed(d);
  a = c - e.length - f.length;
  0 <= b.indexOf("-", 0) ? e = f + e + goog.string.repeat(" ", a) : (b = 0 <= b.indexOf("0", 0) ? "0" : " ", e = f + goog.string.repeat(b, a) + e);
  return e
};
goog.string.format.demuxes_.d = function(a, b, c, e, d, f, g, h) {
  return goog.string.format.demuxes_.f(parseInt(a, 10), b, c, e, 0, f, g, h)
};
goog.string.format.demuxes_.i = goog.string.format.demuxes_.d;
goog.string.format.demuxes_.u = goog.string.format.demuxes_.d;
var box2d = {
  b2Settings: {}
};
Object.defineProperty || (Object.defineProperty = function(a, b, c) {
  Object.__defineGetter__ && ("get" in c ? a.__defineGetter__(b, c.get) : "value" in c && a.__defineGetter__(b, c.value));
  Object.__defineSetter__ && ("set" in c ? a.__defineSetter__(b, c.set) : "value" in c && a.__defineSetter__(b, c.value))
});
box2d.DEBUG = !1;
goog.exportSymbol("box2d.DEBUG", box2d.DEBUG);
box2d.ENABLE_ASSERTS = box2d.DEBUG;
goog.exportSymbol("box2d.ENABLE_ASSERTS", box2d.ENABLE_ASSERTS);
box2d.b2Assert = function(a) {
  if (box2d.DEBUG && !a) debugger
};
goog.exportSymbol("box2d.b2Assert", box2d.b2Assert);
box2d.b2_maxFloat = 1E37;
goog.exportSymbol("box2d.b2_maxFloat", box2d.b2_maxFloat);
box2d.b2_epsilon = 1E-5;
goog.exportSymbol("box2d.b2_epsilon", box2d.b2_epsilon);
box2d.b2_epsilon_sq = box2d.b2_epsilon * box2d.b2_epsilon;
goog.exportSymbol("box2d.b2_epsilon_sq", box2d.b2_epsilon_sq);
box2d.b2_pi = Math.PI;
goog.exportSymbol("box2d.b2_pi", box2d.b2_pi);
box2d.b2_maxManifoldPoints = 2;
goog.exportSymbol("box2d.b2_maxManifoldPoints", box2d.b2_maxManifoldPoints);
box2d.b2_maxPolygonVertices = 8;
goog.exportSymbol("box2d.b2_maxPolygonVertices", box2d.b2_maxPolygonVertices);
box2d.b2_aabbExtension = 0.1;
goog.exportSymbol("box2d.b2_aabbExtension", box2d.b2_aabbExtension);
box2d.b2_aabbMultiplier = 2;
goog.exportSymbol("box2d.b2_aabbMultiplier", box2d.b2_aabbMultiplier);
box2d.b2_linearSlop = 0.0080;
goog.exportSymbol("box2d.b2_linearSlop", box2d.b2_linearSlop);
box2d.b2_angularSlop = 2 / 180 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_angularSlop", box2d.b2_angularSlop);
box2d.b2_polygonRadius = 2 * box2d.b2_linearSlop;
goog.exportSymbol("box2d.b2_polygonRadius", box2d.b2_polygonRadius);
box2d.b2_maxSubSteps = 8;
goog.exportSymbol("box2d.b2_maxSubSteps", box2d.b2_maxSubSteps);
box2d.b2_maxTOIContacts = 32;
goog.exportSymbol("box2d.b2_maxTOIContacts", box2d.b2_maxTOIContacts);
box2d.b2_velocityThreshold = 1;
goog.exportSymbol("box2d.b2_velocityThreshold", box2d.b2_velocityThreshold);
box2d.b2_maxLinearCorrection = 0.2;
goog.exportSymbol("box2d.b2_maxLinearCorrection", box2d.b2_maxLinearCorrection);
box2d.b2_maxAngularCorrection = 8 / 180 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_maxAngularCorrection", box2d.b2_maxAngularCorrection);
box2d.b2_maxTranslation = 2;
goog.exportSymbol("box2d.b2_maxTranslation", box2d.b2_maxTranslation);
box2d.b2_maxTranslationSquared = box2d.b2_maxTranslation * box2d.b2_maxTranslation;
goog.exportSymbol("box2d.b2_maxTranslationSquared", box2d.b2_maxTranslationSquared);
box2d.b2_maxRotation = 0.5 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_maxRotation", box2d.b2_maxRotation);
box2d.b2_maxRotationSquared = box2d.b2_maxRotation * box2d.b2_maxRotation;
goog.exportSymbol("box2d.b2_maxRotationSquared", box2d.b2_maxRotationSquared);
box2d.b2_baumgarte = 0.2;
goog.exportSymbol("box2d.b2_baumgarte", box2d.b2_baumgarte);
box2d.b2_toiBaumgarte = 0.75;
goog.exportSymbol("box2d.b2_toiBaumgarte", box2d.b2_toiBaumgarte);
box2d.b2_timeToSleep = 0.5;
goog.exportSymbol("box2d.b2_timeToSleep", box2d.b2_timeToSleep);
box2d.b2_linearSleepTolerance = 0.01;
goog.exportSymbol("box2d.b2_linearSleepTolerance", box2d.b2_linearSleepTolerance);
box2d.b2_angularSleepTolerance = 2 / 180 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_angularSleepTolerance", box2d.b2_angularSleepTolerance);
box2d.b2Alloc = function() {
  return null
};
goog.exportSymbol("box2d.b2Alloc", box2d.b2Alloc);
box2d.b2Free = function() {};
goog.exportSymbol("box2d.b2Free", box2d.b2Free);
box2d.b2Log = function(a, b) {
  var c = Array.prototype.slice.call(arguments),
    c = goog.string.format.apply(null, c.slice(0));
  window.console.log(c)
};
goog.exportSymbol("box2d.b2Log", box2d.b2Log);
box2d.b2Version = function(a, b, c) {
  this.major = a || 0;
  this.minor = b || 0;
  this.revision = c || 0
};
goog.exportSymbol("box2d.b2Version", box2d.b2Version);
box2d.b2Version.prototype.major = 0;
goog.exportProperty(box2d.b2Version.prototype, "major", box2d.b2Version.prototype.major);
box2d.b2Version.prototype.minor = 0;
goog.exportProperty(box2d.b2Version.prototype, "minor", box2d.b2Version.prototype.minor);
box2d.b2Version.prototype.revision = 0;
goog.exportProperty(box2d.b2Version.prototype, "revision", box2d.b2Version.prototype.revision);
box2d.b2Version.prototype.toString = function() {
  return this.major + "." + this.minor + "." + this.revision
};
goog.exportProperty(box2d.b2Version.prototype, "toString", box2d.b2Version.prototype.toString);
box2d.b2_version = new box2d.b2Version(2, 3, 0);
goog.exportSymbol("box2d.b2_version", box2d.b2_version);
box2d.b2_changelist = 251;
goog.exportSymbol("box2d.b2_changelist", box2d.b2_changelist);
box2d.b2ParseInt = function(a) {
  return parseInt(a, 10)
};
goog.exportSymbol("box2d.b2ParseInt", box2d.b2ParseInt);
box2d.b2ParseUInt = function(a) {
  return box2d.b2Abs(parseInt(a, 10))
};
goog.exportSymbol("box2d.b2ParseUInt", box2d.b2ParseUInt);
box2d.b2MakeArray = function(a, b) {
  a === void 0 && (a = 0);
  var c = Array(a);
  if (b !== void 0)
    for (var e = 0; e < a; ++e) c[e] = b(e);
  return c
};
goog.exportSymbol("box2d.b2MakeArray", box2d.b2MakeArray);
box2d.b2MakeNumberArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return 0
  })
};
goog.exportSymbol("box2d.b2MakeNumberArray", box2d.b2MakeNumberArray);
box2d.b2Math = {};
box2d.b2_pi_over_180 = box2d.b2_pi / 180;
goog.exportSymbol("box2d.b2_pi_over_180", box2d.b2_pi_over_180);
box2d.b2_180_over_pi = 180 / box2d.b2_pi;
goog.exportSymbol("box2d.b2_180_over_pi", box2d.b2_180_over_pi);
box2d.b2_two_pi = 2 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_two_pi", box2d.b2_two_pi);
box2d.b2Abs = function(a) {
  return 0 > a ? -a : a
};
goog.exportSymbol("box2d.b2Abs", box2d.b2Abs);
box2d.b2Min = function(a, b) {
  return a < b ? a : b
};
goog.exportSymbol("box2d.b2Min", box2d.b2Min);
box2d.b2Max = function(a, b) {
  return a > b ? a : b
};
goog.exportSymbol("box2d.b2Max", box2d.b2Max);
box2d.b2Clamp = function(a, b, c) {
  return a < b ? b : a > c ? c : a
};
goog.exportSymbol("box2d.b2Clamp", box2d.b2Clamp);
box2d.b2Swap = function(a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
  var c = a[0];
  a[0] = b[0];
  b[0] = c
};
goog.exportSymbol("box2d.b2Swap", box2d.b2Swap);
box2d.b2IsValid = function(a) {
  return isFinite(a)
};
goog.exportSymbol("box2d.b2IsValid", box2d.b2IsValid);
box2d.b2Sq = function(a) {
  return a * a
};
goog.exportSymbol("box2d.b2Sq", box2d.b2Sq);
box2d.b2InvSqrt = function(a) {
  return 1 / Math.sqrt(a)
};
goog.exportSymbol("box2d.b2InvSqrt", box2d.b2InvSqrt);
box2d.b2Sqrt = function(a) {
  return Math.sqrt(a)
};
goog.exportSymbol("box2d.b2Sqrt", box2d.b2Sqrt);
box2d.b2Pow = function(a, b) {
  return Math.pow(a, b)
};
goog.exportSymbol("box2d.b2Pow", box2d.b2Pow);
box2d.b2DegToRad = function(a) {
  return a * box2d.b2_pi_over_180
};
goog.exportSymbol("box2d.b2DegToRad", box2d.b2DegToRad);
box2d.b2RadToDeg = function(a) {
  return a * box2d.b2_180_over_pi
};
goog.exportSymbol("box2d.b2RadToDeg", box2d.b2RadToDeg);
box2d.b2Cos = function(a) {
  return Math.cos(a)
};
goog.exportSymbol("box2d.b2Cos", box2d.b2Cos);
box2d.b2Sin = function(a) {
  return Math.sin(a)
};
goog.exportSymbol("box2d.b2Sin", box2d.b2Sin);
box2d.b2Acos = function(a) {
  return Math.acos(a)
};
goog.exportSymbol("box2d.b2Acos", box2d.b2Acos);
box2d.b2Asin = function(a) {
  return Math.asin(a)
};
goog.exportSymbol("box2d.b2Asin", box2d.b2Asin);
box2d.b2Atan2 = function(a, b) {
  return Math.atan2(a, b)
};
goog.exportSymbol("box2d.b2Atan2", box2d.b2Atan2);
box2d.b2NextPowerOfTwo = function(a) {
  a |= a >> 1 & 2147483647;
  a |= a >> 2 & 1073741823;
  a |= a >> 4 & 268435455;
  a |= a >> 8 & 16777215;
  return (a | a >> 16 & 65535) + 1
};
goog.exportSymbol("box2d.b2NextPowerOfTwo", box2d.b2NextPowerOfTwo);
box2d.b2IsPowerOfTwo = function(a) {
  return 0 < a && 0 == (a & a - 1)
};
goog.exportSymbol("box2d.b2IsPowerOfTwo", box2d.b2IsPowerOfTwo);
box2d.b2Random = function() {
  return 2 * Math.random() - 1
};
goog.exportSymbol("box2d.b2Random", box2d.b2Random);
box2d.b2RandomRange = function(a, b) {
  return (b - a) * Math.random() + a
};
goog.exportSymbol("box2d.b2RandomRange", box2d.b2RandomRange);
box2d.b2Vec2 = function(a, b) {
  this.x = a || 0;
  this.y = b || 0
};
goog.exportSymbol("box2d.b2Vec2", box2d.b2Vec2);
box2d.b2Vec2.prototype.x = 0;
goog.exportProperty(box2d.b2Vec2.prototype, "x", box2d.b2Vec2.prototype.x);
box2d.b2Vec2.prototype.y = 0;
goog.exportProperty(box2d.b2Vec2.prototype, "y", box2d.b2Vec2.prototype.y);
box2d.b2Vec2_zero = new box2d.b2Vec2;
goog.exportSymbol("box2d.b2Vec2_zero", box2d.b2Vec2_zero);
box2d.b2Vec2.ZERO = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "ZERO", box2d.b2Vec2.ZERO);
box2d.b2Vec2.UNITX = new box2d.b2Vec2(1, 0);
goog.exportProperty(box2d.b2Vec2, "UNITX", box2d.b2Vec2.UNITX);
box2d.b2Vec2.UNITY = new box2d.b2Vec2(0, 1);
goog.exportProperty(box2d.b2Vec2, "UNITY", box2d.b2Vec2.UNITY);
box2d.b2Vec2.s_t0 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "s_t0", box2d.b2Vec2.s_t0);
box2d.b2Vec2.s_t1 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "s_t1", box2d.b2Vec2.s_t1);
box2d.b2Vec2.s_t2 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "s_t2", box2d.b2Vec2.s_t2);
box2d.b2Vec2.s_t3 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "s_t3", box2d.b2Vec2.s_t3);
box2d.b2Vec2.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2Vec2
  })
};
goog.exportProperty(box2d.b2Vec2, "MakeArray", box2d.b2Vec2.MakeArray);
box2d.b2Vec2.prototype.Clone = function() {
  return new box2d.b2Vec2(this.x, this.y)
};
goog.exportProperty(box2d.b2Vec2.prototype, "Clone", box2d.b2Vec2.prototype.Clone);
box2d.b2Vec2.prototype.SetZero = function() {
  this.y = this.x = 0;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SetZero", box2d.b2Vec2.prototype.SetZero);
box2d.b2Vec2.prototype.SetXY = function(a, b) {
  this.x = a;
  this.y = b;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SetXY", box2d.b2Vec2.prototype.SetXY);
box2d.b2Vec2.prototype.Copy = function(a) {
  this.x = a.x;
  this.y = a.y;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "Copy", box2d.b2Vec2.prototype.Copy);
box2d.b2Vec2.prototype.SelfAdd = function(a) {
  this.x += a.x;
  this.y += a.y;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfAdd", box2d.b2Vec2.prototype.SelfAdd);
box2d.b2Vec2.prototype.SelfAddXY = function(a, b) {
  this.x += a;
  this.y += b;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfAddXY", box2d.b2Vec2.prototype.SelfAddXY);
box2d.b2Vec2.prototype.SelfSub = function(a) {
  this.x -= a.x;
  this.y -= a.y;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfSub", box2d.b2Vec2.prototype.SelfSub);
box2d.b2Vec2.prototype.SelfSubXY = function(a, b) {
  this.x -= a;
  this.y -= b;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfSubXY", box2d.b2Vec2.prototype.SelfSubXY);
box2d.b2Vec2.prototype.SelfMul = function(a) {
  this.x *= a;
  this.y *= a;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMul", box2d.b2Vec2.prototype.SelfMul);
box2d.b2Vec2.prototype.SelfMulAdd = function(a, b) {
  this.x += a * b.x;
  this.y += a * b.y;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMulAdd", box2d.b2Vec2.prototype.SelfMulAdd);
box2d.b2Vec2.prototype.SelfMulSub = function(a, b) {
  this.x -= a * b.x;
  this.y -= a * b.y;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMulSub", box2d.b2Vec2.prototype.SelfMulSub);
box2d.b2Vec2.prototype.Dot = function(a) {
  return this.x * a.x + this.y * a.y
};
goog.exportProperty(box2d.b2Vec2.prototype, "Dot", box2d.b2Vec2.prototype.Dot);
box2d.b2Vec2.prototype.Cross = function(a) {
  return this.x * a.y - this.y * a.x
};
goog.exportProperty(box2d.b2Vec2.prototype, "Cross", box2d.b2Vec2.prototype.Cross);
box2d.b2Vec2.prototype.GetLength = function() {
  var a = this.x,
    b = this.y;
  return Math.sqrt(a * a + b * b)
};
goog.exportProperty(box2d.b2Vec2.prototype, "GetLength", box2d.b2Vec2.prototype.GetLength);
box2d.b2Vec2.prototype.GetLengthSquared = function() {
  var a = this.x,
    b = this.y;
  return a * a + b * b
};
goog.exportProperty(box2d.b2Vec2.prototype, "GetLengthSquared", box2d.b2Vec2.prototype.GetLengthSquared);
box2d.b2Vec2.prototype.Normalize = function() {
  var a = this.GetLength();
  if (a >= box2d.b2_epsilon) {
    var b = 1 / a;
    this.x *= b;
    this.y *= b
  }
  return a
};
goog.exportProperty(box2d.b2Vec2.prototype, "Normalize", box2d.b2Vec2.prototype.Normalize);
box2d.b2Vec2.prototype.SelfNormalize = function() {
  var a = this.GetLength();
  a >= box2d.b2_epsilon && (a = 1 / a, this.x *= a, this.y *= a);
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfNormalize", box2d.b2Vec2.prototype.SelfNormalize);
box2d.b2Vec2.prototype.SelfRotate = function(a) {
  var b = Math.cos(a),
    a = Math.sin(a),
    c = this.x;
  this.x = b * c - a * this.y;
  this.y = a * c + b * this.y;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfRotate", box2d.b2Vec2.prototype.SelfRotate);
box2d.b2Vec2.prototype.IsValid = function() {
  return isFinite(this.x) && isFinite(this.y)
};
goog.exportProperty(box2d.b2Vec2.prototype, "IsValid", box2d.b2Vec2.prototype.IsValid);
box2d.b2Vec2.prototype.SelfCrossVS = function(a) {
  var b = this.x;
  this.x = a * this.y;
  this.y = -a * b;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfCrossVS", box2d.b2Vec2.prototype.SelfCrossVS);
box2d.b2Vec2.prototype.SelfCrossSV = function(a) {
  var b = this.x;
  this.x = -a * this.y;
  this.y = a * b;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfCrossSV", box2d.b2Vec2.prototype.SelfCrossSV);
box2d.b2Vec2.prototype.SelfMinV = function(a) {
  this.x = box2d.b2Min(this.x, a.x);
  this.y = box2d.b2Min(this.y, a.y);
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMinV", box2d.b2Vec2.prototype.SelfMinV);
box2d.b2Vec2.prototype.SelfMaxV = function(a) {
  this.x = box2d.b2Max(this.x, a.x);
  this.y = box2d.b2Max(this.y, a.y);
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMaxV", box2d.b2Vec2.prototype.SelfMaxV);
box2d.b2Vec2.prototype.SelfAbs = function() {
  this.x = box2d.b2Abs(this.x);
  this.y = box2d.b2Abs(this.y);
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfAbs", box2d.b2Vec2.prototype.SelfAbs);
box2d.b2Vec2.prototype.SelfNeg = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfNeg", box2d.b2Vec2.prototype.SelfNeg);
box2d.b2Vec2.prototype.SelfSkew = function() {
  var a = this.x;
  this.x = -this.y;
  this.y = a;
  return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfSkew", box2d.b2Vec2.prototype.SelfSkew);
box2d.b2AbsV = function(a, b) {
  b.x = box2d.b2Abs(a.x);
  b.y = box2d.b2Abs(a.y);
  return b
};
goog.exportSymbol("box2d.b2AbsV", box2d.b2AbsV);
box2d.b2MinV = function(a, b, c) {
  c.x = box2d.b2Min(a.x, b.x);
  c.y = box2d.b2Min(a.y, b.y);
  return c
};
goog.exportSymbol("box2d.b2MinV", box2d.b2MinV);
box2d.b2MaxV = function(a, b, c) {
  c.x = box2d.b2Max(a.x, b.x);
  c.y = box2d.b2Max(a.y, b.y);
  return c
};
goog.exportSymbol("box2d.b2MaxV", box2d.b2MaxV);
box2d.b2ClampV = function(a, b, c, e) {
  e.x = box2d.b2Clamp(a.x, b.x, c.x);
  e.y = box2d.b2Clamp(a.y, b.y, c.y);
  return e
};
goog.exportSymbol("box2d.b2ClampV", box2d.b2ClampV);
box2d.b2RotateV = function(a, b, c) {
  var e = a.x,
    a = a.y,
    d = Math.cos(b),
    b = Math.sin(b);
  c.x = d * e - b * a;
  c.y = b * e + d * a;
  return c
};
goog.exportSymbol("box2d.b2RotateV", box2d.b2RotateV);
box2d.b2DotVV = function(a, b) {
  return a.x * b.x + a.y * b.y
};
goog.exportSymbol("box2d.b2DotVV", box2d.b2DotVV);
box2d.b2CrossVV = function(a, b) {
  return a.x * b.y - a.y * b.x
};
goog.exportSymbol("box2d.b2CrossVV", box2d.b2CrossVV);
box2d.b2CrossVS = function(a, b, c) {
  var e = a.x;
  c.x = b * a.y;
  c.y = -b * e;
  return c
};
goog.exportSymbol("box2d.b2CrossVS", box2d.b2CrossVS);
box2d.b2CrossVOne = function(a, b) {
  var c = a.x;
  b.x = a.y;
  b.y = -c;
  return b
};
goog.exportSymbol("box2d.b2CrossVOne", box2d.b2CrossVOne);
box2d.b2CrossSV = function(a, b, c) {
  var e = b.x;
  c.x = -a * b.y;
  c.y = a * e;
  return c
};
goog.exportSymbol("box2d.b2CrossSV", box2d.b2CrossSV);
box2d.b2CrossOneV = function(a, b) {
  var c = a.x;
  b.x = -a.y;
  b.y = c;
  return b
};
goog.exportSymbol("box2d.b2CrossOneV", box2d.b2CrossOneV);
box2d.b2AddVV = function(a, b, c) {
  if ("undefined" == typeof c) c = new box2d.b2Vec2();
  c.x = a.x + b.x;
  c.y = a.y + b.y;
  return c
};
goog.exportSymbol("box2d.b2AddVV", box2d.b2AddVV);
box2d.b2SubVV = function(a, b, c) {
  c.x = a.x - b.x;
  c.y = a.y - b.y;
  return c
};
goog.exportSymbol("box2d.b2SubVV", box2d.b2SubVV);
box2d.b2MulSV = function(a, b, c) {
  c.x = b.x * a;
  c.y = b.y * a;
  return c
};
goog.exportSymbol("box2d.b2MulSV", box2d.b2MulSV);
box2d.b2AddVMulSV = function(a, b, c, e) {
  e.x = a.x + b * c.x;
  e.y = a.y + b * c.y;
  return e
};
goog.exportSymbol("box2d.b2AddVMulSV", box2d.b2AddVMulSV);
box2d.b2SubVMulSV = function(a, b, c, e) {
  e.x = a.x - b * c.x;
  e.y = a.y - b * c.y;
  return e
};
goog.exportSymbol("box2d.b2SubVMulSV", box2d.b2SubVMulSV);
box2d.b2AddVCrossSV = function(a, b, c, e) {
  var d = c.x;
  e.x = a.x - b * c.y;
  e.y = a.y + b * d;
  return e
};
goog.exportSymbol("box2d.b2AddVCrossSV", box2d.b2AddVCrossSV);
box2d.b2MidVV = function(a, b, c) {
  c.x = 0.5 * (a.x + b.x);
  c.y = 0.5 * (a.y + b.y);
  return c
};
goog.exportSymbol("box2d.b2MidVV", box2d.b2MidVV);
box2d.b2ExtVV = function(a, b, c) {
  c.x = 0.5 * (b.x - a.x);
  c.y = 0.5 * (b.y - a.y);
  return c
};
goog.exportSymbol("box2d.b2ExtVV", box2d.b2ExtVV);
box2d.b2IsEqualToV = function(a, b) {
  return a.x == b.x && a.y == b.y
};
goog.exportSymbol("box2d.b2IsEqualToV", box2d.b2IsEqualToV);
box2d.b2DistanceVV = function(a, b) {
  var c = a.x - b.x,
    e = a.y - b.y;
  return Math.sqrt(c * c + e * e)
};
goog.exportSymbol("box2d.b2DistanceVV", box2d.b2DistanceVV);
box2d.b2DistanceSquaredVV = function(a, b) {
  var c = a.x - b.x,
    e = a.y - b.y;
  return c * c + e * e
};
goog.exportSymbol("box2d.b2DistanceSquaredVV", box2d.b2DistanceSquaredVV);
box2d.b2NegV = function(a, b) {
  b.x = -a.x;
  b.y = -a.y;
  return b
};
goog.exportSymbol("box2d.b2NegV", box2d.b2NegV);
box2d.b2Vec3 = function(a, b, c) {
  this.x = a || 0;
  this.y = b || 0;
  this.z = c || 0
};
goog.exportSymbol("box2d.b2Vec3", box2d.b2Vec3);
box2d.b2Vec3.prototype.x = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "x", box2d.b2Vec3.prototype.x);
box2d.b2Vec3.prototype.y = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "y", box2d.b2Vec3.prototype.y);
box2d.b2Vec3.prototype.z = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "z", box2d.b2Vec3.prototype.z);
box2d.b2Vec3.ZERO = new box2d.b2Vec3;
goog.exportProperty(box2d.b2Vec3, "ZERO", box2d.b2Vec3.ZERO);
box2d.b2Vec3.s_t0 = new box2d.b2Vec3;
goog.exportProperty(box2d.b2Vec3, "s_t0", box2d.b2Vec3.s_t0);
box2d.b2Vec3.prototype.Clone = function() {
  return new box2d.b2Vec3(this.x, this.y, this.z)
};
goog.exportProperty(box2d.b2Vec3.prototype, "Clone", box2d.b2Vec3.prototype.Clone);
box2d.b2Vec3.prototype.SetZero = function() {
  this.z = this.y = this.x = 0;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SetZero", box2d.b2Vec3.prototype.SetZero);
box2d.b2Vec3.prototype.SetXYZ = function(a, b, c) {
  this.x = a;
  this.y = b;
  this.z = c;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SetXYZ", box2d.b2Vec3.prototype.SetXYZ);
box2d.b2Vec3.prototype.Copy = function(a) {
  this.x = a.x;
  this.y = a.y;
  this.z = a.z;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "Copy", box2d.b2Vec3.prototype.Copy);
box2d.b2Vec3.prototype.SelfNeg = function() {
  this.x = -this.x;
  this.y = -this.y;
  this.z = -this.z;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfNeg", box2d.b2Vec3.prototype.SelfNeg);
box2d.b2Vec3.prototype.SelfAdd = function(a) {
  this.x += a.x;
  this.y += a.y;
  this.z += a.z;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfAdd", box2d.b2Vec3.prototype.SelfAdd);
box2d.b2Vec3.prototype.SelfAddXYZ = function(a, b, c) {
  this.x += a;
  this.y += b;
  this.z += c;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfAddXYZ", box2d.b2Vec3.prototype.SelfAddXYZ);
box2d.b2Vec3.prototype.SelfSub = function(a) {
  this.x -= a.x;
  this.y -= a.y;
  this.z -= a.z;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfSub", box2d.b2Vec3.prototype.SelfSub);
box2d.b2Vec3.prototype.SelfSubXYZ = function(a, b, c) {
  this.x -= a;
  this.y -= b;
  this.z -= c;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfSubXYZ", box2d.b2Vec3.prototype.SelfSubXYZ);
box2d.b2Vec3.prototype.SelfMul = function(a) {
  this.x *= a;
  this.y *= a;
  this.z *= a;
  return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfMul", box2d.b2Vec3.prototype.SelfMul);
box2d.b2DotV3V3 = function(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z
};
goog.exportSymbol("box2d.b2DotV3V3", box2d.b2DotV3V3);
box2d.b2CrossV3V3 = function(a, b, c) {
  var e = a.x,
    d = a.y,
    a = a.z,
    f = b.x,
    g = b.y,
    b = b.z;
  c.x = d * b - a * g;
  c.y = a * f - e * b;
  c.z = e * g - d * f;
  return c
};
goog.exportSymbol("box2d.b2CrossV3V3", box2d.b2CrossV3V3);
box2d.b2Mat22 = function() {
  this.ex = new box2d.b2Vec2(1, 0);
  this.ey = new box2d.b2Vec2(0, 1)
};
goog.exportSymbol("box2d.b2Mat22", box2d.b2Mat22);
box2d.b2Mat22.prototype.ex = null;
goog.exportProperty(box2d.b2Mat22.prototype, "ex", box2d.b2Mat22.prototype.ex);
box2d.b2Mat22.prototype.ey = null;
goog.exportProperty(box2d.b2Mat22.prototype, "ey", box2d.b2Mat22.prototype.ey);
box2d.b2Mat22.IDENTITY = new box2d.b2Mat22;
goog.exportProperty(box2d.b2Mat22, "IDENTITY", box2d.b2Mat22.IDENTITY);
box2d.b2Mat22.prototype.Clone = function() {
  return (new box2d.b2Mat22).Copy(this)
};
goog.exportProperty(box2d.b2Mat22.prototype, "Clone", box2d.b2Mat22.prototype.Clone);
box2d.b2Mat22.FromVV = function(a, b) {
  return (new box2d.b2Mat22).SetVV(a, b)
};
goog.exportProperty(box2d.b2Mat22, "FromVV", box2d.b2Mat22.FromVV);
box2d.b2Mat22.FromSSSS = function(a, b, c, e) {
  return (new box2d.b2Mat22).SetSSSS(a, b, c, e)
};
goog.exportProperty(box2d.b2Mat22, "FromSSSS", box2d.b2Mat22.FromSSSS);
box2d.b2Mat22.FromAngleRadians = function(a) {
  return (new box2d.b2Mat22).SetAngleRadians(a)
};
goog.exportProperty(box2d.b2Mat22, "FromAngleRadians", box2d.b2Mat22.FromAngleRadians);
box2d.b2Mat22.prototype.SetSSSS = function(a, b, c, e) {
  this.ex.SetXY(a, c);
  this.ey.SetXY(b, e);
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetSSSS", box2d.b2Mat22.prototype.SetSSSS);
box2d.b2Mat22.prototype.SetVV = function(a, b) {
  this.ex.Copy(a);
  this.ey.Copy(b);
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetVV", box2d.b2Mat22.prototype.SetVV);
box2d.b2Mat22.prototype.SetAngleRadians = function(a) {
  var b = Math.cos(a),
    a = Math.sin(a);
  this.ex.SetXY(b, a);
  this.ey.SetXY(-a, b);
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetAngleRadians", box2d.b2Mat22.prototype.SetAngleRadians);
box2d.b2Mat22.prototype.Copy = function(a) {
  this.ex.Copy(a.ex);
  this.ey.Copy(a.ey);
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "Copy", box2d.b2Mat22.prototype.Copy);
box2d.b2Mat22.prototype.SetIdentity = function() {
  this.ex.SetXY(1, 0);
  this.ey.SetXY(0, 1);
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetIdentity", box2d.b2Mat22.prototype.SetIdentity);
box2d.b2Mat22.prototype.SetZero = function() {
  this.ex.SetZero();
  this.ey.SetZero();
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetZero", box2d.b2Mat22.prototype.SetZero);
box2d.b2Mat22.prototype.GetAngleRadians = function() {
  return Math.atan2(this.ex.y, this.ex.x)
};
goog.exportProperty(box2d.b2Mat22.prototype, "GetAngleRadians", box2d.b2Mat22.prototype.GetAngleRadians);
box2d.b2Mat22.prototype.GetInverse = function(a) {
  var b = this.ex.x,
    c = this.ey.x,
    e = this.ex.y,
    d = this.ey.y,
    f = b * d - c * e;
  0 != f && (f = 1 / f);
  a.ex.x = f * d;
  a.ey.x = -f * c;
  a.ex.y = -f * e;
  a.ey.y = f * b;
  return a
};
goog.exportProperty(box2d.b2Mat22.prototype, "GetInverse", box2d.b2Mat22.prototype.GetInverse);
box2d.b2Mat22.prototype.Solve = function(a, b, c) {
  var e = this.ex.x,
    d = this.ey.x,
    f = this.ex.y,
    g = this.ey.y,
    h = e * g - d * f;
  0 != h && (h = 1 / h);
  c.x = h * (g * a - d * b);
  c.y = h * (e * b - f * a);
  return c
};
goog.exportProperty(box2d.b2Mat22.prototype, "Solve", box2d.b2Mat22.prototype.Solve);
box2d.b2Mat22.prototype.SelfAbs = function() {
  this.ex.SelfAbs();
  this.ey.SelfAbs();
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SelfAbs", box2d.b2Mat22.prototype.SelfAbs);
box2d.b2Mat22.prototype.SelfInv = function() {
  return this.GetInverse(this)
};
goog.exportProperty(box2d.b2Mat22.prototype, "SelfInv", box2d.b2Mat22.prototype.SelfInv);
box2d.b2Mat22.prototype.SelfAddM = function(a) {
  this.ex.SelfAdd(a.ex);
  this.ey.SelfAdd(a.ey);
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SelfAddM", box2d.b2Mat22.prototype.SelfAddM);
box2d.b2Mat22.prototype.SelfSubM = function(a) {
  this.ex.SelfSub(a.ex);
  this.ey.SelfSub(a.ey);
  return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SelfSubM", box2d.b2Mat22.prototype.SelfSubM);
box2d.b2AbsM = function(a, b) {
  var c = a.ex,
    e = a.ey;
  b.ex.x = box2d.b2Abs(c.x);
  b.ex.y = box2d.b2Abs(c.y);
  b.ey.x = box2d.b2Abs(e.x);
  b.ey.y = box2d.b2Abs(e.y);
  return b
};
goog.exportSymbol("box2d.b2AbsM", box2d.b2AbsM);
box2d.b2MulMV = function(a, b, c) {
  var e = a.ex,
    a = a.ey,
    d = b.x,
    b = b.y;
  c.x = e.x * d + a.x * b;
  c.y = e.y * d + a.y * b;
  return c
};
goog.exportSymbol("box2d.b2MulMV", box2d.b2MulMV);
box2d.b2MulTMV = function(a, b, c) {
  var e = a.ex,
    a = a.ey,
    d = b.x,
    b = b.y;
  c.x = e.x * d + e.y * b;
  c.y = a.x * d + a.y * b;
  return c
};
goog.exportSymbol("box2d.b2MulTMV", box2d.b2MulTMV);
box2d.b2AddMM = function(a, b, c) {
  var e = a.ex,
    a = a.ey,
    d = b.ex,
    b = b.ey;
  c.ex.x = e.x + d.x;
  c.ex.y = e.y + d.y;
  c.ey.x = a.x + b.x;
  c.ey.y = a.y + b.y;
  return c
};
goog.exportSymbol("box2d.b2AddMM", box2d.b2AddMM);
box2d.b2MulMM = function(a, b, c) {
  var e = a.ex.x,
    d = a.ex.y,
    f = a.ey.x,
    a = a.ey.y,
    g = b.ex.x,
    h = b.ex.y,
    j = b.ey.x,
    b = b.ey.y;
  c.ex.x = e * g + f * h;
  c.ex.y = d * g + a * h;
  c.ey.x = e * j + f * b;
  c.ey.y = d * j + a * b;
  return c
};
goog.exportSymbol("box2d.b2MulMM", box2d.b2MulMM);
box2d.b2MulTMM = function(a, b, c) {
  var e = a.ex.x,
    d = a.ex.y,
    f = a.ey.x,
    a = a.ey.y,
    g = b.ex.x,
    h = b.ex.y,
    j = b.ey.x,
    b = b.ey.y;
  c.ex.x = e * g + d * h;
  c.ex.y = f * g + a * h;
  c.ey.x = e * j + d * b;
  c.ey.y = f * j + a * b;
  return c
};
goog.exportSymbol("box2d.b2MulTMM", box2d.b2MulTMM);
box2d.b2Mat33 = function() {
  this.ex = new box2d.b2Vec3(1, 0, 0);
  this.ey = new box2d.b2Vec3(0, 1, 0);
  this.ez = new box2d.b2Vec3(0, 0, 1)
};
goog.exportSymbol("box2d.b2Mat33", box2d.b2Mat33);
box2d.b2Mat33.prototype.ex = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ex", box2d.b2Mat33.prototype.ex);
box2d.b2Mat33.prototype.ey = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ey", box2d.b2Mat33.prototype.ey);
box2d.b2Mat33.prototype.ez = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ez", box2d.b2Mat33.prototype.ez);
box2d.b2Mat33.IDENTITY = new box2d.b2Mat33;
goog.exportProperty(box2d.b2Mat33, "IDENTITY", box2d.b2Mat33.IDENTITY);
box2d.b2Mat33.prototype.Clone = function() {
  return (new box2d.b2Mat33).Copy(this)
};
goog.exportProperty(box2d.b2Mat33.prototype, "Clone", box2d.b2Mat33.prototype.Clone);
box2d.b2Mat33.prototype.SetVVV = function(a, b, c) {
  this.ex.Copy(a);
  this.ey.Copy(b);
  this.ez.Copy(c);
  return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "SetVVV", box2d.b2Mat33.prototype.SetVVV);
box2d.b2Mat33.prototype.Copy = function(a) {
  this.ex.Copy(a.ex);
  this.ey.Copy(a.ey);
  this.ez.Copy(a.ez);
  return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "Copy", box2d.b2Mat33.prototype.Copy);
box2d.b2Mat33.prototype.SetIdentity = function() {
  this.ex.SetXYZ(1, 0, 0);
  this.ey.SetXYZ(0, 1, 0);
  this.ez.SetXYZ(0, 0, 1);
  return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "SetIdentity", box2d.b2Mat33.prototype.SetIdentity);
box2d.b2Mat33.prototype.SetZero = function() {
  this.ex.SetZero();
  this.ey.SetZero();
  this.ez.SetZero();
  return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "SetZero", box2d.b2Mat33.prototype.SetZero);
box2d.b2Mat33.prototype.SelfAddM = function(a) {
  this.ex.SelfAdd(a.ex);
  this.ey.SelfAdd(a.ey);
  this.ez.SelfAdd(a.ez);
  return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "SelfAddM", box2d.b2Mat33.prototype.SelfAddM);
box2d.b2Mat33.prototype.Solve33 = function(a, b, c, e) {
  var d = this.ex.x,
    f = this.ex.y,
    g = this.ex.z,
    h = this.ey.x,
    j = this.ey.y,
    i = this.ey.z,
    k = this.ez.x,
    l = this.ez.y,
    m = this.ez.z,
    n = d * (j * m - i * l) + f * (i * k - h * m) + g * (h * l - j * k);
  0 != n && (n = 1 / n);
  e.x = n * (a * (j * m - i * l) + b * (i * k - h * m) + c * (h * l - j * k));
  e.y = n * (d * (b * m - c * l) + f * (c * k - a * m) + g * (a * l - b * k));
  e.z = n * (d * (j * c - i * b) + f * (i * a - h * c) + g * (h * b - j * a));
  return e
};
goog.exportProperty(box2d.b2Mat33.prototype, "Solve33", box2d.b2Mat33.prototype.Solve33);
box2d.b2Mat33.prototype.Solve22 = function(a, b, c) {
  var e = this.ex.x,
    d = this.ey.x,
    f = this.ex.y,
    g = this.ey.y,
    h = e * g - d * f;
  0 != h && (h = 1 / h);
  c.x = h * (g * a - d * b);
  c.y = h * (e * b - f * a);
  return c
};
goog.exportProperty(box2d.b2Mat33.prototype, "Solve22", box2d.b2Mat33.prototype.Solve22);
box2d.b2Mat33.prototype.GetInverse22 = function(a) {
  var b = this.ex.x,
    c = this.ey.x,
    e = this.ex.y,
    d = this.ey.y,
    f = b * d - c * e;
  0 != f && (f = 1 / f);
  a.ex.x = f * d;
  a.ey.x = -f * c;
  a.ex.z = 0;
  a.ex.y = -f * e;
  a.ey.y = f * b;
  a.ey.z = 0;
  a.ez.x = 0;
  a.ez.y = 0;
  a.ez.z = 0
};
goog.exportProperty(box2d.b2Mat33.prototype, "GetInverse22", box2d.b2Mat33.prototype.GetInverse22);
box2d.b2Mat33.prototype.GetSymInverse33 = function(a) {
  var b = box2d.b2DotV3V3(this.ex, box2d.b2CrossV3V3(this.ey, this.ez, box2d.b2Vec3.s_t0));
  0 != b && (b = 1 / b);
  var c = this.ex.x,
    e = this.ey.x,
    d = this.ez.x,
    f = this.ey.y,
    g = this.ez.y,
    h = this.ez.z;
  a.ex.x = b * (f * h - g * g);
  a.ex.y = b * (d * g - e * h);
  a.ex.z = b * (e * g - d * f);
  a.ey.x = a.ex.y;
  a.ey.y = b * (c * h - d * d);
  a.ey.z = b * (d * e - c * g);
  a.ez.x = a.ex.z;
  a.ez.y = a.ey.z;
  a.ez.z = b * (c * f - e * e)
};
goog.exportProperty(box2d.b2Mat33.prototype, "GetSymInverse33", box2d.b2Mat33.prototype.GetSymInverse33);
box2d.b2MulM33V3 = function(a, b, c) {
  var e = b.x,
    d = b.y,
    b = b.z;
  c.x = a.ex.x * e + a.ey.x * d + a.ez.x * b;
  c.y = a.ex.y * e + a.ey.y * d + a.ez.y * b;
  c.z = a.ex.z * e + a.ey.z * d + a.ez.z * b;
  return c
};
goog.exportSymbol("box2d.b2MulM33V3", box2d.b2MulM33V3);
box2d.b2MulM33XYZ = function(a, b, c, e, d) {
  d.x = a.ex.x * b + a.ey.x * c + a.ez.x * e;
  d.y = a.ex.y * b + a.ey.y * c + a.ez.y * e;
  d.z = a.ex.z * b + a.ey.z * c + a.ez.z * e;
  return d
};
goog.exportSymbol("box2d.b2MulM33XYZ", box2d.b2MulM33XYZ);
box2d.b2MulM33V2 = function(a, b, c) {
  var e = b.x,
    b = b.y;
  c.x = a.ex.x * e + a.ey.x * b;
  c.y = a.ex.y * e + a.ey.y * b;
  return c
};
goog.exportSymbol("box2d.b2MulM33V2", box2d.b2MulM33V2);
box2d.b2MulM33XY = function(a, b, c, e) {
  e.x = a.ex.x * b + a.ey.x * c;
  e.y = a.ex.y * b + a.ey.y * c;
  return e
};
goog.exportSymbol("box2d.b2MulM33XY", box2d.b2MulM33XY);
box2d.b2Rot = function(a) {
  a && (this.s = Math.sin(a), this.c = Math.cos(a))
};
goog.exportSymbol("box2d.b2Rot", box2d.b2Rot);
box2d.b2Rot.prototype.s = 0;
goog.exportProperty(box2d.b2Rot.prototype, "s", box2d.b2Rot.prototype.s);
box2d.b2Rot.prototype.c = 1;
goog.exportProperty(box2d.b2Rot.prototype, "c", box2d.b2Rot.prototype.c);
box2d.b2Rot.IDENTITY = new box2d.b2Rot;
goog.exportProperty(box2d.b2Rot, "IDENTITY", box2d.b2Rot.IDENTITY);
box2d.b2Rot.prototype.Clone = function() {
  return (new box2d.b2Rot).Copy(this)
};
goog.exportProperty(box2d.b2Rot.prototype, "Clone", box2d.b2Rot.prototype.Clone);
box2d.b2Rot.prototype.Copy = function(a) {
  this.s = a.s;
  this.c = a.c;
  return this
};
goog.exportProperty(box2d.b2Rot.prototype, "Copy", box2d.b2Rot.prototype.Copy);
box2d.b2Rot.prototype.SetAngleRadians = function(a) {
  this.s = Math.sin(a);
  this.c = Math.cos(a);
  return this
};
goog.exportProperty(box2d.b2Rot.prototype, "SetAngleRadians", box2d.b2Rot.prototype.SetAngleRadians);
box2d.b2Rot.prototype.SetIdentity = function() {
  this.s = 0;
  this.c = 1;
  return this
};
goog.exportProperty(box2d.b2Rot.prototype, "SetIdentity", box2d.b2Rot.prototype.SetIdentity);
box2d.b2Rot.prototype.GetAngleRadians = function() {
  return Math.atan2(this.s, this.c)
};
goog.exportProperty(box2d.b2Rot.prototype, "GetAngleRadians", box2d.b2Rot.prototype.GetAngleRadians);
box2d.b2Rot.prototype.GetXAxis = function(a) {
  a.x = this.c;
  a.y = this.s;
  return a
};
goog.exportProperty(box2d.b2Rot.prototype, "GetXAxis", box2d.b2Rot.prototype.GetXAxis);
box2d.b2Rot.prototype.GetYAxis = function(a) {
  a.x = -this.s;
  a.y = this.c;
  return a
};
goog.exportProperty(box2d.b2Rot.prototype, "GetYAxis", box2d.b2Rot.prototype.GetYAxis);
box2d.b2MulRR = function(a, b, c) {
  var e = a.c,
    a = a.s,
    d = b.c,
    b = b.s;
  c.s = a * d + e * b;
  c.c = e * d - a * b;
  return c
};
goog.exportSymbol("box2d.b2MulRR", box2d.b2MulRR);
box2d.b2MulTRR = function(a, b, c) {
  var e = a.c,
    a = a.s,
    d = b.c,
    b = b.s;
  c.s = e * b - a * d;
  c.c = e * d + a * b;
  return c
};
goog.exportSymbol("box2d.b2MulTRR", box2d.b2MulTRR);
box2d.b2MulRV = function(a, b, c) {
  var e = a.c,
    a = a.s,
    d = b.x,
    b = b.y;
  c.x = e * d - a * b;
  c.y = a * d + e * b;
  return c
};
goog.exportSymbol("box2d.b2MulRV", box2d.b2MulRV);
box2d.b2MulTRV = function(a, b, c) {
  var e = a.c,
    a = a.s,
    d = b.x,
    b = b.y;
  c.x = e * d + a * b;
  c.y = -a * d + e * b;
  return c
};
goog.exportSymbol("box2d.b2MulTRV", box2d.b2MulTRV);
box2d.b2Transform = function() {
  this.p = new box2d.b2Vec2;
  this.q = new box2d.b2Rot
};
goog.exportSymbol("box2d.b2Transform", box2d.b2Transform);
box2d.b2Transform.prototype.p = null;
goog.exportProperty(box2d.b2Transform.prototype, "p", box2d.b2Transform.prototype.p);
box2d.b2Transform.prototype.q = null;
goog.exportProperty(box2d.b2Transform.prototype, "q", box2d.b2Transform.prototype.q);
box2d.b2Transform.IDENTITY = new box2d.b2Transform;
goog.exportProperty(box2d.b2Transform, "IDENTITY", box2d.b2Transform.IDENTITY);
box2d.b2Transform.prototype.Clone = function() {
  return (new box2d.b2Transform).Copy(this)
};
goog.exportProperty(box2d.b2Transform.prototype, "Clone", box2d.b2Transform.prototype.Clone);
box2d.b2Transform.prototype.Copy = function(a) {
  this.p.Copy(a.p);
  this.q.Copy(a.q);
  return this
};
goog.exportProperty(box2d.b2Transform.prototype, "Copy", box2d.b2Transform.prototype.Copy);
box2d.b2Transform.prototype.SetIdentity = function() {
  this.p.SetZero();
  this.q.SetIdentity();
  return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetIdentity", box2d.b2Transform.prototype.SetIdentity);
box2d.b2Transform.prototype.SetPositionRotation = function(a, b) {
  this.p.Copy(a);
  this.q.Copy(b);
  return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetPositionRotation", box2d.b2Transform.prototype.SetPositionRotation);
box2d.b2Transform.prototype.SetPositionAngleRadians = function(a, b) {
  this.p.Copy(a);
  this.q.SetAngleRadians(b);
  return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetPositionAngleRadians", box2d.b2Transform.prototype.SetPositionAngleRadians);
box2d.b2Transform.prototype.SetPosition = function(a) {
  this.p.Copy(a);
  return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetPosition", box2d.b2Transform.prototype.SetPosition);
box2d.b2Transform.prototype.SetPositionXY = function(a, b) {
  this.p.SetXY(a, b);
  return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetPositionXY", box2d.b2Transform.prototype.SetPositionXY);
box2d.b2Transform.prototype.SetRotation = function(a) {
  this.q.Copy(a);
  return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetRotation", box2d.b2Transform.prototype.SetRotation);
box2d.b2Transform.prototype.SetRotationAngleRadians = function(a) {
  this.q.SetAngleRadians(a);
  return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetRotationAngleRadians", box2d.b2Transform.prototype.SetRotationAngleRadians);
box2d.b2Transform.prototype.GetPosition = function() {
  return this.p
};
goog.exportProperty(box2d.b2Transform.prototype, "GetPosition", box2d.b2Transform.prototype.GetPosition);
box2d.b2Transform.prototype.GetRotation = function() {
  return this.q
};
goog.exportProperty(box2d.b2Transform.prototype, "GetRotation", box2d.b2Transform.prototype.GetRotation);
box2d.b2Transform.prototype.GetRotationAngleRadians = function() {
  return this.q.GetAngleRadians()
};
goog.exportProperty(box2d.b2Transform.prototype, "GetRotationAngleRadians", box2d.b2Transform.prototype.GetRotationAngleRadians);
box2d.b2Transform.prototype.GetAngleRadians = function() {
  return this.q.GetAngleRadians()
};
goog.exportProperty(box2d.b2Transform.prototype, "GetAngleRadians", box2d.b2Transform.prototype.GetAngleRadians);
box2d.b2MulXV = function(a, b, c) {
  var e = a.q.c,
    d = a.q.s,
    f = b.x,
    b = b.y;
  if ("undefined" == typeof c) c = new box2d.b2Vec2();
  c.x = e * f - d * b + a.p.x;
  c.y = d * f + e * b + a.p.y;
  return c
};
goog.exportSymbol("box2d.b2MulXV", box2d.b2MulXV);
box2d.b2MulTXV = function(a, b, c) {
  var e = a.q.c,
    d = a.q.s,
    f = b.x - a.p.x,
    a = b.y - a.p.y;
  c.x = e * f + d * a;
  c.y = -d * f + e * a;
  return c
};
goog.exportSymbol("box2d.b2MulTXV", box2d.b2MulTXV);
box2d.b2MulXX = function(a, b, c) {
  box2d.b2MulRR(a.q, b.q, c.q);
  box2d.b2AddVV(box2d.b2MulRV(a.q, b.p, c.p), a.p, c.p);
  return c
};
goog.exportSymbol("box2d.b2MulXX", box2d.b2MulXX);
box2d.b2MulTXX = function(a, b, c) {
  box2d.b2MulTRR(a.q, b.q, c.q);
  box2d.b2MulTRV(a.q, box2d.b2SubVV(b.p, a.p, c.p), c.p);
  return c
};
goog.exportSymbol("box2d.b2MulTXX", box2d.b2MulTXX);
box2d.b2Sweep = function() {
  this.localCenter = new box2d.b2Vec2;
  this.c0 = new box2d.b2Vec2;
  this.c = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Sweep", box2d.b2Sweep);
box2d.b2Sweep.prototype.localCenter = null;
goog.exportProperty(box2d.b2Sweep.prototype, "localCenter", box2d.b2Sweep.prototype.localCenter);
box2d.b2Sweep.prototype.c0 = null;
goog.exportProperty(box2d.b2Sweep.prototype, "c0", box2d.b2Sweep.prototype.c0);
box2d.b2Sweep.prototype.c = null;
goog.exportProperty(box2d.b2Sweep.prototype, "c", box2d.b2Sweep.prototype.c);
box2d.b2Sweep.prototype.a0 = 0;
goog.exportProperty(box2d.b2Sweep.prototype, "a0", box2d.b2Sweep.prototype.a0);
box2d.b2Sweep.prototype.a = 0;
goog.exportProperty(box2d.b2Sweep.prototype, "a", box2d.b2Sweep.prototype.a);
box2d.b2Sweep.prototype.alpha0 = 0;
goog.exportProperty(box2d.b2Sweep.prototype, "alpha0", box2d.b2Sweep.prototype.alpha0);
box2d.b2Sweep.prototype.Clone = function() {
  return (new box2d.b2Sweep).Copy(this)
};
goog.exportProperty(box2d.b2Sweep.prototype, "Clone", box2d.b2Sweep.prototype.Clone);
box2d.b2Sweep.prototype.Copy = function(a) {
  this.localCenter.Copy(a.localCenter);
  this.c0.Copy(a.c0);
  this.c.Copy(a.c);
  this.a0 = a.a0;
  this.a = a.a;
  this.alpha0 = a.alpha0;
  return this
};
goog.exportProperty(box2d.b2Sweep.prototype, "Copy", box2d.b2Sweep.prototype.Copy);
box2d.b2Sweep.prototype.GetTransform = function(a, b) {
  var c = 1 - b;
  a.p.x = c * this.c0.x + b * this.c.x;
  a.p.y = c * this.c0.y + b * this.c.y;
  a.q.SetAngleRadians(c * this.a0 + b * this.a);
  a.p.SelfSub(box2d.b2MulRV(a.q, this.localCenter, box2d.b2Vec2.s_t0));
  return a
};
goog.exportProperty(box2d.b2Sweep.prototype, "GetTransform", box2d.b2Sweep.prototype.GetTransform);
box2d.b2Sweep.prototype.Advance = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(1 > this.alpha0);
  var b = (a - this.alpha0) / (1 - this.alpha0),
    c = 1 - b;
  this.c0.x = c * this.c0.x + b * this.c.x;
  this.c0.y = c * this.c0.y + b * this.c.y;
  this.a0 = c * this.a0 + b * this.a;
  this.alpha0 = a
};
goog.exportProperty(box2d.b2Sweep.prototype, "Advance", box2d.b2Sweep.prototype.Advance);
box2d.b2Sweep.prototype.Normalize = function() {
  var a = box2d.b2_two_pi * Math.floor(this.a0 / box2d.b2_two_pi);
  this.a0 -= a;
  this.a -= a
};
goog.exportProperty(box2d.b2Sweep.prototype, "Normalize", box2d.b2Sweep.prototype.Normalize);
box2d.b2ControllerEdge = function() {};
goog.exportSymbol("box2d.b2ControllerEdge", box2d.b2ControllerEdge);
box2d.b2ControllerEdge.prototype.controller = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "controller", box2d.b2ControllerEdge.prototype.controller);
box2d.b2ControllerEdge.prototype.body = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "body", box2d.b2ControllerEdge.prototype.body);
box2d.b2ControllerEdge.prototype.prevBody = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "prevBody", box2d.b2ControllerEdge.prototype.prevBody);
box2d.b2ControllerEdge.prototype.nextBody = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "nextBody", box2d.b2ControllerEdge.prototype.nextBody);
box2d.b2ControllerEdge.prototype.prevController = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "prevController", box2d.b2ControllerEdge.prototype.prevController);
box2d.b2ControllerEdge.prototype.nextController = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "nextController", box2d.b2ControllerEdge.prototype.nextController);
box2d.b2Controller = function() {};
goog.exportSymbol("box2d.b2Controller", box2d.b2Controller);
box2d.b2Controller.prototype.m_world = null;
goog.exportProperty(box2d.b2Controller.prototype, "m_world", box2d.b2Controller.prototype.m_world);
box2d.b2Controller.prototype.m_bodyList = null;
goog.exportProperty(box2d.b2Controller.prototype, "m_bodyList", box2d.b2Controller.prototype.m_bodyList);
box2d.b2Controller.prototype.m_bodyCount = 0;
goog.exportProperty(box2d.b2Controller.prototype, "m_bodyCount", box2d.b2Controller.prototype.m_bodyCount);
box2d.b2Controller.prototype.m_prev = null;
goog.exportProperty(box2d.b2Controller.prototype, "m_prev", box2d.b2Controller.prototype.m_prev);
box2d.b2Controller.prototype.m_next = null;
goog.exportProperty(box2d.b2Controller.prototype, "m_next", box2d.b2Controller.prototype.m_next);
box2d.b2Controller.prototype.Step = function() {};
goog.exportProperty(box2d.b2Controller.prototype, "Step", box2d.b2Controller.prototype.Step);
box2d.b2Controller.prototype.Draw = function() {};
goog.exportProperty(box2d.b2Controller.prototype, "Draw", box2d.b2Controller.prototype.Draw);
box2d.b2Controller.prototype.GetNext = function() {
  return this.m_next
};
goog.exportProperty(box2d.b2Controller.prototype, "GetNext", box2d.b2Controller.prototype.GetNext);
box2d.b2Controller.prototype.GetPrev = function() {
  return this.m_prev
};
goog.exportProperty(box2d.b2Controller.prototype, "GetPrev", box2d.b2Controller.prototype.GetPrev);
box2d.b2Controller.prototype.GetWorld = function() {
  return this.m_world
};
goog.exportProperty(box2d.b2Controller.prototype, "GetWorld", box2d.b2Controller.prototype.GetWorld);
box2d.b2Controller.prototype.GetBodyList = function() {
  return this.m_bodyList
};
goog.exportProperty(box2d.b2Controller.prototype, "GetBodyList", box2d.b2Controller.prototype.GetBodyList);
box2d.b2Controller.prototype.AddBody = function(a) {
  var b = new box2d.b2ControllerEdge;
  b.body = a;
  b.controller = this;
  b.nextBody = this.m_bodyList;
  b.prevBody = null;
  this.m_bodyList && (this.m_bodyList.prevBody = b);
  this.m_bodyList = b;
  ++this.m_bodyCount;
  b.nextController = a.m_controllerList;
  b.prevController = null;
  a.m_controllerList && (a.m_controllerList.prevController = b);
  a.m_controllerList = b;
  ++a.m_controllerCount
};
goog.exportProperty(box2d.b2Controller.prototype, "AddBody", box2d.b2Controller.prototype.AddBody);
box2d.b2Controller.prototype.RemoveBody = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_bodyCount);
  for (var b = this.m_bodyList; b && b.body != a;) b = b.nextBody;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null != b);
  b.prevBody && (b.prevBody.nextBody = b.nextBody);
  b.nextBody && (b.nextBody.prevBody = b.prevBody);
  this.m_bodyList == b && (this.m_bodyList = b.nextBody);
  --this.m_bodyCount;
  b.nextController && (b.nextController.prevController = b.prevController);
  b.prevController && (b.prevController.nextController = b.nextController);
  a.m_controllerList == b && (a.m_controllerList = b.nextController);
  --a.m_controllerCount
};
goog.exportProperty(box2d.b2Controller.prototype, "RemoveBody", box2d.b2Controller.prototype.RemoveBody);
box2d.b2Controller.prototype.Clear = function() {
  for (; this.m_bodyList;) this.RemoveBody(this.m_bodyList.body);
  this.m_bodyCount = 0
};
goog.exportProperty(box2d.b2Controller.prototype, "Clear", box2d.b2Controller.prototype.Clear);
box2d.b2ConstantAccelController = function() {
  box2d.b2Controller.call(this);
  this.A = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2ConstantAccelController, box2d.b2Controller);
goog.exportSymbol("box2d.b2ConstantAccelController", box2d.b2ConstantAccelController);
box2d.b2ConstantAccelController.prototype.A = null;
goog.exportProperty(box2d.b2ConstantAccelController.prototype, "A", box2d.b2ConstantAccelController.prototype.A);
box2d.b2ConstantAccelController.prototype.Step = function(a) {
  for (var a = box2d.b2MulSV(a.dt, this.A, box2d.b2ConstantAccelController.prototype.Step.s_dtA), b = this.m_bodyList; b; b = b.nextBody) {
    var c = b.body;
    c.IsAwake() && c.SetLinearVelocity(box2d.b2AddVV(c.GetLinearVelocity(), a, box2d.b2Vec2.s_t0))
  }
};
goog.exportProperty(box2d.b2ConstantAccelController.prototype, "Step", box2d.b2ConstantAccelController.prototype.Step);
box2d.b2ConstantAccelController.prototype.Step.s_dtA = new box2d.b2Vec2;
box2d.b2JointType = {
  e_unknownJoint: 0,
  e_revoluteJoint: 1,
  e_prismaticJoint: 2,
  e_distanceJoint: 3,
  e_pulleyJoint: 4,
  e_mouseJoint: 5,
  e_gearJoint: 6,
  e_wheelJoint: 7,
  e_weldJoint: 8,
  e_frictionJoint: 9,
  e_ropeJoint: 10,
  e_motorJoint: 11,
  e_areaJoint: 12
};
goog.exportSymbol("box2d.b2JointType", box2d.b2JointType);
goog.exportProperty(box2d.b2JointType, "e_unknownJoint", box2d.b2JointType.e_unknownJoint);
goog.exportProperty(box2d.b2JointType, "e_revoluteJoint", box2d.b2JointType.e_revoluteJoint);
goog.exportProperty(box2d.b2JointType, "e_prismaticJoint", box2d.b2JointType.e_prismaticJoint);
goog.exportProperty(box2d.b2JointType, "e_distanceJoint", box2d.b2JointType.e_distanceJoint);
goog.exportProperty(box2d.b2JointType, "e_pulleyJoint", box2d.b2JointType.e_pulleyJoint);
goog.exportProperty(box2d.b2JointType, "e_mouseJoint", box2d.b2JointType.e_mouseJoint);
goog.exportProperty(box2d.b2JointType, "e_gearJoint", box2d.b2JointType.e_gearJoint);
goog.exportProperty(box2d.b2JointType, "e_wheelJoint", box2d.b2JointType.e_wheelJoint);
goog.exportProperty(box2d.b2JointType, "e_weldJoint", box2d.b2JointType.e_weldJoint);
goog.exportProperty(box2d.b2JointType, "e_frictionJoint", box2d.b2JointType.e_frictionJoint);
goog.exportProperty(box2d.b2JointType, "e_ropeJoint", box2d.b2JointType.e_ropeJoint);
goog.exportProperty(box2d.b2JointType, "e_motorJoint", box2d.b2JointType.e_motorJoint);
goog.exportProperty(box2d.b2JointType, "e_areaJoint", box2d.b2JointType.e_areaJoint);
box2d.b2LimitState = {
  e_inactiveLimit: 0,
  e_atLowerLimit: 1,
  e_atUpperLimit: 2,
  e_equalLimits: 3
};
goog.exportSymbol("box2d.b2LimitState", box2d.b2LimitState);
goog.exportProperty(box2d.b2LimitState, "e_inactiveLimit", box2d.b2LimitState.e_inactiveLimit);
goog.exportProperty(box2d.b2LimitState, "e_atLowerLimit", box2d.b2LimitState.e_atLowerLimit);
goog.exportProperty(box2d.b2LimitState, "e_atUpperLimit", box2d.b2LimitState.e_atUpperLimit);
goog.exportProperty(box2d.b2LimitState, "e_equalLimits", box2d.b2LimitState.e_equalLimits);
box2d.b2Jacobian = function() {
  this.linear = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Jacobian", box2d.b2Jacobian);
box2d.b2Jacobian.prototype.linear = null;
goog.exportProperty(box2d.b2Jacobian.prototype, "linear", box2d.b2Jacobian.prototype.linear);
box2d.b2Jacobian.prototype.angularA = 0;
goog.exportProperty(box2d.b2Jacobian.prototype, "angularA", box2d.b2Jacobian.prototype.angularA);
box2d.b2Jacobian.prototype.angularB = 0;
goog.exportProperty(box2d.b2Jacobian.prototype, "angularB", box2d.b2Jacobian.prototype.angularB);
box2d.b2Jacobian.prototype.SetZero = function() {
  this.linear.SetZero();
  this.angularB = this.angularA = 0;
  return this
};
goog.exportProperty(box2d.b2Jacobian.prototype, "SetZero", box2d.b2Jacobian.prototype.SetZero);
box2d.b2Jacobian.prototype.Set = function(a, b, c) {
  this.linear.Copy(a);
  this.angularA = b;
  this.angularB = c;
  return this
};
goog.exportProperty(box2d.b2Jacobian.prototype, "Set", box2d.b2Jacobian.prototype.Set);
box2d.b2JointEdge = function() {};
goog.exportSymbol("box2d.b2JointEdge", box2d.b2JointEdge);
box2d.b2JointEdge.prototype.other = null;
goog.exportProperty(box2d.b2JointEdge.prototype, "other", box2d.b2JointEdge.prototype.other);
box2d.b2JointEdge.prototype.joint = null;
goog.exportProperty(box2d.b2JointEdge.prototype, "joint", box2d.b2JointEdge.prototype.joint);
box2d.b2JointEdge.prototype.prev = null;
goog.exportProperty(box2d.b2JointEdge.prototype, "prev", box2d.b2JointEdge.prototype.prev);
box2d.b2JointEdge.prototype.next = null;
goog.exportProperty(box2d.b2JointEdge.prototype, "next", box2d.b2JointEdge.prototype.next);
box2d.b2JointDef = function(a) {
  this.type = a
};
goog.exportSymbol("box2d.b2JointDef", box2d.b2JointDef);
box2d.b2JointDef.prototype.type = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(box2d.b2JointDef.prototype, "type", box2d.b2JointDef.prototype.type);
box2d.b2JointDef.prototype.userData = null;
goog.exportProperty(box2d.b2JointDef.prototype, "userData", box2d.b2JointDef.prototype.userData);
box2d.b2JointDef.prototype.bodyA = null;
goog.exportProperty(box2d.b2JointDef.prototype, "bodyA", box2d.b2JointDef.prototype.bodyA);
box2d.b2JointDef.prototype.bodyB = null;
goog.exportProperty(box2d.b2JointDef.prototype, "bodyB", box2d.b2JointDef.prototype.bodyB);
box2d.b2JointDef.prototype.collideConnected = !1;
goog.exportProperty(box2d.b2JointDef.prototype, "collideConnected", box2d.b2JointDef.prototype.collideConnected);
box2d.b2Joint = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.bodyA != a.bodyB);
  this.m_type = a.type;
  this.m_edgeA = new box2d.b2JointEdge;
  this.m_edgeB = new box2d.b2JointEdge;
  this.m_bodyA = a.bodyA;
  this.m_bodyB = a.bodyB;
  this.m_collideConnected = a.collideConnected;
  this.m_userData = a.userData
};
goog.exportSymbol("box2d.b2Joint", box2d.b2Joint);
box2d.b2Joint.prototype.m_type = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(box2d.b2Joint.prototype, "m_type", box2d.b2Joint.prototype.m_type);
box2d.b2Joint.prototype.m_prev = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_prev", box2d.b2Joint.prototype.m_prev);
box2d.b2Joint.prototype.m_next = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_next", box2d.b2Joint.prototype.m_next);
box2d.b2Joint.prototype.m_edgeA = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_edgeA", box2d.b2Joint.prototype.m_edgeA);
box2d.b2Joint.prototype.m_edgeB = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_edgeB", box2d.b2Joint.prototype.m_edgeB);
box2d.b2Joint.prototype.m_bodyA = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_bodyA", box2d.b2Joint.prototype.m_bodyA);
box2d.b2Joint.prototype.m_bodyB = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_bodyB", box2d.b2Joint.prototype.m_bodyB);
box2d.b2Joint.prototype.m_index = 0;
goog.exportProperty(box2d.b2Joint.prototype, "m_index", box2d.b2Joint.prototype.m_index);
box2d.b2Joint.prototype.m_islandFlag = !1;
goog.exportProperty(box2d.b2Joint.prototype, "m_islandFlag", box2d.b2Joint.prototype.m_islandFlag);
box2d.b2Joint.prototype.m_collideConnected = !1;
goog.exportProperty(box2d.b2Joint.prototype, "m_collideConnected", box2d.b2Joint.prototype.m_collideConnected);
box2d.b2Joint.prototype.m_userData = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_userData", box2d.b2Joint.prototype.m_userData);
box2d.b2Joint.prototype.GetAnchorA = function(a) {
  return a.SetZero()
};
goog.exportProperty(box2d.b2Joint.prototype, "GetAnchorA", box2d.b2Joint.prototype.GetAnchorA);
box2d.b2Joint.prototype.GetAnchorB = function(a) {
  return a.SetZero()
};
goog.exportProperty(box2d.b2Joint.prototype, "GetAnchorB", box2d.b2Joint.prototype.GetAnchorB);
box2d.b2Joint.prototype.GetReactionForce = function(a, b) {
  return b.SetZero()
};
goog.exportProperty(box2d.b2Joint.prototype, "GetReactionForce", box2d.b2Joint.prototype.GetReactionForce);
box2d.b2Joint.prototype.GetReactionTorque = function() {
  return 0
};
goog.exportProperty(box2d.b2Joint.prototype, "GetReactionTorque", box2d.b2Joint.prototype.GetReactionTorque);
box2d.b2Joint.prototype.InitVelocityConstraints = function() {};
goog.exportProperty(box2d.b2Joint.prototype, "InitVelocityConstraints", box2d.b2Joint.prototype.InitVelocityConstraints);
box2d.b2Joint.prototype.SolveVelocityConstraints = function() {};
goog.exportProperty(box2d.b2Joint.prototype, "SolveVelocityConstraints", box2d.b2Joint.prototype.SolveVelocityConstraints);
box2d.b2Joint.prototype.SolvePositionConstraints = function() {
  return !1
};
goog.exportProperty(box2d.b2Joint.prototype, "SolvePositionConstraints", box2d.b2Joint.prototype.SolvePositionConstraints);
box2d.b2Joint.prototype.GetType = function() {
  return this.m_type
};
goog.exportProperty(box2d.b2Joint.prototype, "GetType", box2d.b2Joint.prototype.GetType);
box2d.b2Joint.prototype.GetBodyA = function() {
  return this.m_bodyA
};
goog.exportProperty(box2d.b2Joint.prototype, "GetBodyA", box2d.b2Joint.prototype.GetBodyA);
box2d.b2Joint.prototype.GetBodyB = function() {
  return this.m_bodyB
};
goog.exportProperty(box2d.b2Joint.prototype, "GetBodyB", box2d.b2Joint.prototype.GetBodyB);
box2d.b2Joint.prototype.GetNext = function() {
  return this.m_next
};
goog.exportProperty(box2d.b2Joint.prototype, "GetNext", box2d.b2Joint.prototype.GetNext);
box2d.b2Joint.prototype.GetUserData = function() {
  return this.m_userData
};
goog.exportProperty(box2d.b2Joint.prototype, "GetUserData", box2d.b2Joint.prototype.GetUserData);
box2d.b2Joint.prototype.SetUserData = function(a) {
  this.m_userData = a
};
goog.exportProperty(box2d.b2Joint.prototype, "SetUserData", box2d.b2Joint.prototype.SetUserData);
box2d.b2Joint.prototype.GetCollideConnected = function() {
  return this.m_collideConnected
};
goog.exportProperty(box2d.b2Joint.prototype, "GetCollideConnected", box2d.b2Joint.prototype.GetCollideConnected);
box2d.b2Joint.prototype.Dump = function() {
  box2d.DEBUG && box2d.b2Log("// Dump is not supported for this joint type.\n")
};
goog.exportProperty(box2d.b2Joint.prototype, "Dump", box2d.b2Joint.prototype.Dump);
box2d.b2Joint.prototype.IsActive = function() {
  return this.m_bodyA.IsActive() && this.m_bodyB.IsActive()
};
goog.exportProperty(box2d.b2Joint.prototype, "IsActive", box2d.b2Joint.prototype.IsActive);
box2d.b2Joint.prototype.ShiftOrigin = function() {};
goog.exportProperty(box2d.b2Joint.prototype, "ShiftOrigin", box2d.b2Joint.prototype.ShiftOrigin);
box2d.b2Joint.Create = function(a) {
  var b = null;
  switch (a.type) {
    case box2d.b2JointType.e_distanceJoint:
      b = new box2d.b2DistanceJoint(a instanceof box2d.b2DistanceJointDef ? a : null);
      break;
    case box2d.b2JointType.e_mouseJoint:
      b = new box2d.b2MouseJoint(a instanceof box2d.b2MouseJointDef ? a : null);
      break;
    case box2d.b2JointType.e_prismaticJoint:
      b = new box2d.b2PrismaticJoint(a instanceof box2d.b2PrismaticJointDef ? a : null);
      break;
    case box2d.b2JointType.e_revoluteJoint:
      b = new box2d.b2RevoluteJoint(a instanceof box2d.b2RevoluteJointDef ? a : null);
      break;
    case box2d.b2JointType.e_pulleyJoint:
      b = new box2d.b2PulleyJoint(a instanceof box2d.b2PulleyJointDef ? a : null);
      break;
    case box2d.b2JointType.e_gearJoint:
      b = new box2d.b2GearJoint(a instanceof box2d.b2GearJointDef ? a : null);
      break;
    case box2d.b2JointType.e_wheelJoint:
      b = new box2d.b2WheelJoint(a instanceof box2d.b2WheelJointDef ? a : null);
      break;
    case box2d.b2JointType.e_weldJoint:
      b = new box2d.b2WeldJoint(a instanceof box2d.b2WeldJointDef ? a : null);
      break;
    case box2d.b2JointType.e_frictionJoint:
      b = new box2d.b2FrictionJoint(a instanceof box2d.b2FrictionJointDef ? a : null);
      break;
    case box2d.b2JointType.e_ropeJoint:
      b = new box2d.b2RopeJoint(a instanceof box2d.b2RopeJointDef ? a : null);
      break;
    case box2d.b2JointType.e_motorJoint:
      b = new box2d.b2MotorJoint(a instanceof box2d.b2MotorJointDef ? a : null);
      break;
    case box2d.b2JointType.e_areaJoint:
      b = new box2d.b2AreaJoint(a instanceof box2d.b2AreaJointDef ? a : null);
      break;
    default:
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
      break;
  }
  return b
};
goog.exportProperty(box2d.b2Joint, "Create", box2d.b2Joint.Create);
box2d.b2Joint.Destroy = function() {};
goog.exportProperty(box2d.b2Joint, "Destroy", box2d.b2Joint.Destroy);
box2d.b2RevoluteJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_revoluteJoint);
  this.localAnchorA = new box2d.b2Vec2(0, 0);
  this.localAnchorB = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2RevoluteJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2RevoluteJointDef", box2d.b2RevoluteJointDef);
box2d.b2RevoluteJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "localAnchorA", box2d.b2RevoluteJointDef.prototype.localAnchorA);
box2d.b2RevoluteJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "localAnchorB", box2d.b2RevoluteJointDef.prototype.localAnchorB);
box2d.b2RevoluteJointDef.prototype.referenceAngle = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "referenceAngle", box2d.b2RevoluteJointDef.prototype.referenceAngle);
box2d.b2RevoluteJointDef.prototype.enableLimit = !1;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "enableLimit", box2d.b2RevoluteJointDef.prototype.enableLimit);
box2d.b2RevoluteJointDef.prototype.lowerAngle = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "lowerAngle", box2d.b2RevoluteJointDef.prototype.lowerAngle);
box2d.b2RevoluteJointDef.prototype.upperAngle = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "upperAngle", box2d.b2RevoluteJointDef.prototype.upperAngle);
box2d.b2RevoluteJointDef.prototype.enableMotor = !1;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "enableMotor", box2d.b2RevoluteJointDef.prototype.enableMotor);
box2d.b2RevoluteJointDef.prototype.motorSpeed = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "motorSpeed", box2d.b2RevoluteJointDef.prototype.motorSpeed);
box2d.b2RevoluteJointDef.prototype.maxMotorTorque = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "maxMotorTorque", box2d.b2RevoluteJointDef.prototype.maxMotorTorque);

box2d.b2RevoluteJointDef.prototype.Initialize = function(a, b, c) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
  this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians()
};

goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "Initialize", box2d.b2RevoluteJointDef.prototype.Initialize);
box2d.b2RevoluteJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorA = new box2d.b2Vec2;
  this.m_localAnchorB = new box2d.b2Vec2;
  this.m_impulse = new box2d.b2Vec3;
  this.m_rA = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2;
  this.m_localCenterA = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_mass = new box2d.b2Mat33;
  this.m_qA = new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcA = new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_K = new box2d.b2Mat22;
  this.m_localAnchorA.Copy(a.localAnchorA);
  this.m_localAnchorB.Copy(a.localAnchorB);
  this.m_referenceAngle = a.referenceAngle;
  this.m_impulse.SetZero();
  this.m_motorImpulse = 0;
  this.m_lowerAngle = a.lowerAngle;
  this.m_upperAngle = a.upperAngle;
  this.m_maxMotorTorque = a.maxMotorTorque;
  this.m_motorSpeed = a.motorSpeed;
  this.m_enableLimit = a.enableLimit;
  this.m_enableMotor = a.enableMotor;
  this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
};
goog.inherits(box2d.b2RevoluteJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2RevoluteJoint", box2d.b2RevoluteJoint);
box2d.b2RevoluteJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_localAnchorA", box2d.b2RevoluteJoint.prototype.m_localAnchorA);
box2d.b2RevoluteJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_localAnchorB", box2d.b2RevoluteJoint.prototype.m_localAnchorB);
box2d.b2RevoluteJoint.prototype.m_impulse = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_impulse", box2d.b2RevoluteJoint.prototype.m_impulse);
box2d.b2RevoluteJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_motorImpulse", box2d.b2RevoluteJoint.prototype.m_motorImpulse);
box2d.b2RevoluteJoint.prototype.m_enableMotor = !1;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_enableMotor", box2d.b2RevoluteJoint.prototype.m_enableMotor);
box2d.b2RevoluteJoint.prototype.m_maxMotorTorque = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_maxMotorTorque", box2d.b2RevoluteJoint.prototype.m_maxMotorTorque);
box2d.b2RevoluteJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_motorSpeed", box2d.b2RevoluteJoint.prototype.m_motorSpeed);
box2d.b2RevoluteJoint.prototype.m_enableLimit = !1;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_enableLimit", box2d.b2RevoluteJoint.prototype.m_enableLimit);
box2d.b2RevoluteJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_referenceAngle", box2d.b2RevoluteJoint.prototype.m_referenceAngle);
box2d.b2RevoluteJoint.prototype.m_lowerAngle = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_lowerAngle", box2d.b2RevoluteJoint.prototype.m_lowerAngle);
box2d.b2RevoluteJoint.prototype.m_upperAngle = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_upperAngle", box2d.b2RevoluteJoint.prototype.m_upperAngle);
box2d.b2RevoluteJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_indexA", box2d.b2RevoluteJoint.prototype.m_indexA);
box2d.b2RevoluteJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_indexB", box2d.b2RevoluteJoint.prototype.m_indexB);
box2d.b2RevoluteJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_rA", box2d.b2RevoluteJoint.prototype.m_rA);
box2d.b2RevoluteJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_rB", box2d.b2RevoluteJoint.prototype.m_rB);
box2d.b2RevoluteJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_localCenterA", box2d.b2RevoluteJoint.prototype.m_localCenterA);
box2d.b2RevoluteJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_localCenterB", box2d.b2RevoluteJoint.prototype.m_localCenterB);
box2d.b2RevoluteJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_invMassA", box2d.b2RevoluteJoint.prototype.m_invMassA);
box2d.b2RevoluteJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_invMassB", box2d.b2RevoluteJoint.prototype.m_invMassB);
box2d.b2RevoluteJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_invIA", box2d.b2RevoluteJoint.prototype.m_invIA);
box2d.b2RevoluteJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_invIB", box2d.b2RevoluteJoint.prototype.m_invIB);
box2d.b2RevoluteJoint.prototype.m_mass = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_mass", box2d.b2RevoluteJoint.prototype.m_mass);
box2d.b2RevoluteJoint.prototype.m_motorMass = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_motorMass", box2d.b2RevoluteJoint.prototype.m_motorMass);
box2d.b2RevoluteJoint.prototype.m_limitState = box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_limitState", box2d.b2RevoluteJoint.prototype.m_limitState);
box2d.b2RevoluteJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_qA", box2d.b2RevoluteJoint.prototype.m_qA);
box2d.b2RevoluteJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_qB", box2d.b2RevoluteJoint.prototype.m_qB);
box2d.b2RevoluteJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_lalcA", box2d.b2RevoluteJoint.prototype.m_lalcA);
box2d.b2RevoluteJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_lalcB", box2d.b2RevoluteJoint.prototype.m_lalcB);
box2d.b2RevoluteJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_K", box2d.b2RevoluteJoint.prototype.m_K);
box2d.b2RevoluteJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].a,
    c = a.velocities[this.m_indexA].v,
    e = a.velocities[this.m_indexA].w,
    d = a.positions[this.m_indexB].a,
    f = a.velocities[this.m_indexB].v,
    g = a.velocities[this.m_indexB].w,
    h = this.m_qA.SetAngleRadians(b),
    j = this.m_qB.SetAngleRadians(d);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2MulRV(h, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2MulRV(j, this.m_lalcB, this.m_rB);
  var h = this.m_invMassA,
    j = this.m_invMassB,
    i = this.m_invIA,
    k = this.m_invIB,
    l = 0 == i + k;
  this.m_mass.ex.x = h + j + this.m_rA.y * this.m_rA.y * i + this.m_rB.y *
    this.m_rB.y * k;
  this.m_mass.ey.x = -this.m_rA.y * this.m_rA.x * i - this.m_rB.y * this.m_rB.x * k;
  this.m_mass.ez.x = -this.m_rA.y * i - this.m_rB.y * k;
  this.m_mass.ex.y = this.m_mass.ey.x;
  this.m_mass.ey.y = h + j + this.m_rA.x * this.m_rA.x * i + this.m_rB.x * this.m_rB.x * k;
  this.m_mass.ez.y = this.m_rA.x * i + this.m_rB.x * k;
  this.m_mass.ex.z = this.m_mass.ez.x;
  this.m_mass.ey.z = this.m_mass.ez.y;
  this.m_mass.ez.z = i + k;
  this.m_motorMass = i + k;
  0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass);
  if (!1 == this.m_enableMotor || l) this.m_motorImpulse = 0;
  this.m_enableLimit && !1 == l ? (b = d - b - this.m_referenceAngle, box2d.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * box2d.b2_angularSlop ? this.m_limitState = box2d.b2LimitState.e_equalLimits : b <= this.m_lowerAngle ? (this.m_limitState != box2d.b2LimitState.e_atLowerLimit && (this.m_impulse.z = 0), this.m_limitState = box2d.b2LimitState.e_atLowerLimit) : b >= this.m_upperAngle ? (this.m_limitState != box2d.b2LimitState.e_atUpperLimit && (this.m_impulse.z = 0), this.m_limitState = box2d.b2LimitState.e_atUpperLimit) : (this.m_limitState = box2d.b2LimitState.e_inactiveLimit,
    this.m_impulse.z = 0)) : this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
  a.step.warmStarting ? (this.m_impulse.SelfMul(a.step.dtRatio), this.m_motorImpulse *= a.step.dtRatio, b = box2d.b2RevoluteJoint.prototype.InitVelocityConstraints.s_P.SetXY(this.m_impulse.x, this.m_impulse.y), c.SelfMulSub(h, b), e -= i * (box2d.b2CrossVV(this.m_rA, b) + this.m_motorImpulse + this.m_impulse.z), f.SelfMulAdd(j, b), g += k * (box2d.b2CrossVV(this.m_rB, b) + this.m_motorImpulse + this.m_impulse.z)) : (this.m_impulse.SetZero(), this.m_motorImpulse =
    0);
  a.velocities[this.m_indexA].w = e;
  a.velocities[this.m_indexB].w = g
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "InitVelocityConstraints", box2d.b2RevoluteJoint.prototype.InitVelocityConstraints);
box2d.b2RevoluteJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    j = this.m_invIB,
    i = 0 == h + j;
  if (this.m_enableMotor && this.m_limitState != box2d.b2LimitState.e_equalLimits && !1 == i) {
    var k = d - c - this.m_motorSpeed,
      k = -this.m_motorMass * k,
      l = this.m_motorImpulse,
      m = a.step.dt * this.m_maxMotorTorque;
    this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse +
      k, -m, m);
    k = this.m_motorImpulse - l;
    c -= h * k;
    d += j * k
  }
  this.m_enableLimit && this.m_limitState != box2d.b2LimitState.e_inactiveLimit && !1 == i ? (i = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1), box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot1), k = this.m_mass.Solve33(i.x, i.y, d - c, box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse3).SelfNeg(), this.m_limitState == box2d.b2LimitState.e_equalLimits ? this.m_impulse.SelfAdd(k) :
    this.m_limitState == box2d.b2LimitState.e_atLowerLimit ? (l = this.m_impulse.z + k.z, 0 > l ? (l = -i.x + this.m_impulse.z * this.m_mass.ez.x, i = -i.y + this.m_impulse.z * this.m_mass.ez.y, i = this.m_mass.Solve22(l, i, box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_reduced), k.x = i.x, k.y = i.y, k.z = -this.m_impulse.z, this.m_impulse.x += i.x, this.m_impulse.y += i.y, this.m_impulse.z = 0) : this.m_impulse.SelfAdd(k)) : this.m_limitState == box2d.b2LimitState.e_atUpperLimit && (l = this.m_impulse.z + k.z, 0 < l ? (l = -i.x + this.m_impulse.z * this.m_mass.ez.x,
      i = -i.y + this.m_impulse.z * this.m_mass.ez.y, i = this.m_mass.Solve22(l, i, box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_reduced), k.x = i.x, k.y = i.y, k.z = -this.m_impulse.z, this.m_impulse.x += i.x, this.m_impulse.y += i.y, this.m_impulse.z = 0) : this.m_impulse.SelfAdd(k)), i = box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_P.SetXY(k.x, k.y), b.SelfMulSub(f, i), c -= h * (box2d.b2CrossVV(this.m_rA, i) + k.z), e.SelfMulAdd(g, i), d += j * (box2d.b2CrossVV(this.m_rB, i) + k.z)) : (k = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB,
    box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1), box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot), k = this.m_mass.Solve22(-k.x, -k.y, box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse2), this.m_impulse.x += k.x, this.m_impulse.y += k.y, b.SelfMulSub(f, k), c -= h * box2d.b2CrossVV(this.m_rA, k), e.SelfMulAdd(g, k), d += j * box2d.b2CrossVV(this.m_rB, k));
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SolveVelocityConstraints", box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints);
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot1 = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse3 = new box2d.b2Vec3;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_reduced = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse2 = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints = function(a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.positions[this.m_indexB].c,
    d = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngleRadians(c),
    g = this.m_qB.SetAngleRadians(d),
    h = 0,
    j = 0,
    j = 0 == this.m_invIA + this.m_invIB;
  if (this.m_enableLimit && this.m_limitState != box2d.b2LimitState.e_inactiveLimit && !1 == j) {
    var i = d - c - this.m_referenceAngle,
      j = 0;
    this.m_limitState == box2d.b2LimitState.e_equalLimits ? (i = box2d.b2Clamp(i - this.m_lowerAngle, -box2d.b2_maxAngularCorrection, box2d.b2_maxAngularCorrection), j = -this.m_motorMass * i, h = box2d.b2Abs(i)) : this.m_limitState == box2d.b2LimitState.e_atLowerLimit ? (i -= this.m_lowerAngle, h = -i, i = box2d.b2Clamp(i + box2d.b2_angularSlop, -box2d.b2_maxAngularCorrection, 0), j = -this.m_motorMass * i) : this.m_limitState == box2d.b2LimitState.e_atUpperLimit && (h = i -= this.m_upperAngle, i = box2d.b2Clamp(i - box2d.b2_angularSlop, 0, box2d.b2_maxAngularCorrection), j = -this.m_motorMass * i);
    c -= this.m_invIA * j;
    d += this.m_invIB * j
  }
  f.SetAngleRadians(c);
  g.SetAngleRadians(d);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  f = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var g = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
    i = box2d.b2SubVV(box2d.b2AddVV(e, g, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, f, box2d.b2Vec2.s_t1), box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_C),
    j = i.GetLength(),
    k = this.m_invMassA,
    l = this.m_invMassB,
    m = this.m_invIA,
    n = this.m_invIB,
    o = this.m_K;
  o.ex.x = k + l +
    m * f.y * f.y + n * g.y * g.y;
  o.ex.y = -m * f.x * f.y - n * g.x * g.y;
  o.ey.x = o.ex.y;
  o.ey.y = k + l + m * f.x * f.x + n * g.x * g.x;
  i = o.Solve(i.x, i.y, box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_impulse).SelfNeg();
  b.SelfMulSub(k, i);
  c -= m * box2d.b2CrossVV(f, i);
  e.SelfMulAdd(l, i);
  d += n * box2d.b2CrossVV(g, i);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = d;
  return j <= box2d.b2_linearSlop && h <= box2d.b2_angularSlop
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SolvePositionConstraints", box2d.b2RevoluteJoint.prototype.SolvePositionConstraints);
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_C = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetAnchorA", box2d.b2RevoluteJoint.prototype.GetAnchorA);
box2d.b2RevoluteJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetAnchorB", box2d.b2RevoluteJoint.prototype.GetAnchorB);
box2d.b2RevoluteJoint.prototype.GetReactionForce = function(a, b) {
  return b.SetXY(a * this.m_impulse.x, a * this.m_impulse.y)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetReactionForce", box2d.b2RevoluteJoint.prototype.GetReactionForce);
box2d.b2RevoluteJoint.prototype.GetReactionTorque = function(a) {
  return a * this.m_impulse.z
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetReactionTorque", box2d.b2RevoluteJoint.prototype.GetReactionTorque);
box2d.b2RevoluteJoint.prototype.GetLocalAnchorA = function() {
  return this.m_localAnchorA
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetLocalAnchorA", box2d.b2RevoluteJoint.prototype.GetLocalAnchorA);
box2d.b2RevoluteJoint.prototype.GetLocalAnchorB = function() {
  return this.m_localAnchorB
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetLocalAnchorB", box2d.b2RevoluteJoint.prototype.GetLocalAnchorB);
box2d.b2RevoluteJoint.prototype.GetReferenceAngle = function() {
  return this.m_referenceAngle
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetReferenceAngle", box2d.b2RevoluteJoint.prototype.GetReferenceAngle);
box2d.b2RevoluteJoint.prototype.GetJointAngleRadians = function() {
  return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetJointAngleRadians", box2d.b2RevoluteJoint.prototype.GetJointAngleRadians);
box2d.b2RevoluteJoint.prototype.GetJointSpeed = function() {
  return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetJointSpeed", box2d.b2RevoluteJoint.prototype.GetJointSpeed);
box2d.b2RevoluteJoint.prototype.IsMotorEnabled = function() {
  return this.m_enableMotor
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "IsMotorEnabled", box2d.b2RevoluteJoint.prototype.IsMotorEnabled);
box2d.b2RevoluteJoint.prototype.EnableMotor = function(a) {
  this.m_enableMotor != a && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_enableMotor = a)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "EnableMotor", box2d.b2RevoluteJoint.prototype.EnableMotor);
box2d.b2RevoluteJoint.prototype.GetMotorTorque = function(a) {
  return a * this.m_motorImpulse
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetMotorTorque", box2d.b2RevoluteJoint.prototype.GetMotorTorque);
box2d.b2RevoluteJoint.prototype.GetMotorSpeed = function() {
  return this.m_motorSpeed
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetMotorSpeed", box2d.b2RevoluteJoint.prototype.GetMotorSpeed);
box2d.b2RevoluteJoint.prototype.SetMaxMotorTorque = function(a) {
  this.m_maxMotorTorque = a
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SetMaxMotorTorque", box2d.b2RevoluteJoint.prototype.SetMaxMotorTorque);
box2d.b2RevoluteJoint.prototype.GetMaxMotorTorque = function() {
  return this.m_maxMotorTorque
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetMaxMotorTorque", box2d.b2RevoluteJoint.prototype.GetMaxMotorTorque);
box2d.b2RevoluteJoint.prototype.IsLimitEnabled = function() {
  return this.m_enableLimit
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "IsLimitEnabled", box2d.b2RevoluteJoint.prototype.IsLimitEnabled);
box2d.b2RevoluteJoint.prototype.EnableLimit = function(a) {
  a != this.m_enableLimit && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_enableLimit = a, this.m_impulse.z = 0)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "EnableLimit", box2d.b2RevoluteJoint.prototype.EnableLimit);
box2d.b2RevoluteJoint.prototype.GetLowerLimit = function() {
  return this.m_lowerAngle
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetLowerLimit", box2d.b2RevoluteJoint.prototype.GetLowerLimit);
box2d.b2RevoluteJoint.prototype.GetUpperLimit = function() {
  return this.m_upperAngle
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetUpperLimit", box2d.b2RevoluteJoint.prototype.GetUpperLimit);
box2d.b2RevoluteJoint.prototype.SetLimits = function(a, b) {
  if (a != this.m_lowerAngle || b != this.m_upperAngle) this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_impulse.z = 0, this.m_lowerAngle = a, this.m_upperAngle = b
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SetLimits", box2d.b2RevoluteJoint.prototype.SetLimits);
box2d.b2RevoluteJoint.prototype.SetMotorSpeed = function(a) {
  this.m_motorSpeed != a && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_motorSpeed = a)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SetMotorSpeed", box2d.b2RevoluteJoint.prototype.SetMotorSpeed);
box2d.b2RevoluteJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2RevoluteJointDef*/ var jd = new box2d.b2RevoluteJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
    box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
      this.m_localAnchorB.x, this.m_localAnchorB.y);
    box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
    box2d.b2Log("  jd.enableLimit = %s;\n", this.m_enableLimit ? "true" : "false");
    box2d.b2Log("  jd.lowerAngle = %.15f;\n", this.m_lowerAngle);
    box2d.b2Log("  jd.upperAngle = %.15f;\n", this.m_upperAngle);
    box2d.b2Log("  jd.enableMotor = %s;\n", this.m_enableMotor ? "true" : "false");
    box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
    box2d.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "Dump", box2d.b2RevoluteJoint.prototype.Dump);
box2d.b2PrismaticJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_prismaticJoint);
  this.localAnchorA = new box2d.b2Vec2;
  this.localAnchorB = new box2d.b2Vec2;
  this.localAxisA = new box2d.b2Vec2(1, 0)
};
goog.inherits(box2d.b2PrismaticJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2PrismaticJointDef", box2d.b2PrismaticJointDef);
box2d.b2PrismaticJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "localAnchorA", box2d.b2PrismaticJointDef.prototype.localAnchorA);
box2d.b2PrismaticJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "localAnchorB", box2d.b2PrismaticJointDef.prototype.localAnchorB);
box2d.b2PrismaticJointDef.prototype.localAxisA = null;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "localAxisA", box2d.b2PrismaticJointDef.prototype.localAxisA);
box2d.b2PrismaticJointDef.prototype.referenceAngle = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "referenceAngle", box2d.b2PrismaticJointDef.prototype.referenceAngle);
box2d.b2PrismaticJointDef.prototype.enableLimit = !1;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "enableLimit", box2d.b2PrismaticJointDef.prototype.enableLimit);
box2d.b2PrismaticJointDef.prototype.lowerTranslation = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "lowerTranslation", box2d.b2PrismaticJointDef.prototype.lowerTranslation);
box2d.b2PrismaticJointDef.prototype.upperTranslation = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "upperTranslation", box2d.b2PrismaticJointDef.prototype.upperTranslation);
box2d.b2PrismaticJointDef.prototype.enableMotor = !1;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "enableMotor", box2d.b2PrismaticJointDef.prototype.enableMotor);
box2d.b2PrismaticJointDef.prototype.maxMotorForce = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "maxMotorForce", box2d.b2PrismaticJointDef.prototype.maxMotorForce);
box2d.b2PrismaticJointDef.prototype.motorSpeed = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "motorSpeed", box2d.b2PrismaticJointDef.prototype.motorSpeed);
box2d.b2PrismaticJointDef.prototype.Initialize = function(a, b, c, e) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
  this.bodyA.GetLocalVector(e, this.localAxisA);
  this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians()
};
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "Initialize", box2d.b2PrismaticJointDef.prototype.Initialize);
box2d.b2PrismaticJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_localXAxisA = a.localAxisA.Clone().SelfNormalize();
  this.m_localYAxisA = box2d.b2CrossOneV(this.m_localXAxisA, new box2d.b2Vec2);
  this.m_referenceAngle = a.referenceAngle;
  this.m_impulse = new box2d.b2Vec3(0, 0, 0);
  this.m_lowerTranslation = a.lowerTranslation;
  this.m_upperTranslation = a.upperTranslation;
  this.m_maxMotorForce = a.maxMotorForce;
  this.m_motorSpeed = a.motorSpeed;
  this.m_enableLimit = a.enableLimit;
  this.m_enableMotor = a.enableMotor;
  this.m_localCenterA = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_axis = new box2d.b2Vec2(0, 0);
  this.m_perp = new box2d.b2Vec2(0, 0);
  this.m_K = new box2d.b2Mat33;
  this.m_K3 = new box2d.b2Mat33;
  this.m_K2 = new box2d.b2Mat22;
  this.m_qA = new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcA = new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_rA = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2
};
goog.inherits(box2d.b2PrismaticJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2PrismaticJoint", box2d.b2PrismaticJoint);
box2d.b2PrismaticJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localAnchorA", box2d.b2PrismaticJoint.prototype.m_localAnchorA);
box2d.b2PrismaticJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localAnchorB", box2d.b2PrismaticJoint.prototype.m_localAnchorB);
box2d.b2PrismaticJoint.prototype.m_localXAxisA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localXAxisA", box2d.b2PrismaticJoint.prototype.m_localXAxisA);
box2d.b2PrismaticJoint.prototype.m_localYAxisA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localYAxisA", box2d.b2PrismaticJoint.prototype.m_localYAxisA);
box2d.b2PrismaticJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_referenceAngle", box2d.b2PrismaticJoint.prototype.m_referenceAngle);
box2d.b2PrismaticJoint.prototype.m_impulse = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_impulse", box2d.b2PrismaticJoint.prototype.m_impulse);
box2d.b2PrismaticJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_motorImpulse", box2d.b2PrismaticJoint.prototype.m_motorImpulse);
box2d.b2PrismaticJoint.prototype.m_lowerTranslation = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_lowerTranslation", box2d.b2PrismaticJoint.prototype.m_lowerTranslation);
box2d.b2PrismaticJoint.prototype.m_upperTranslation = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_upperTranslation", box2d.b2PrismaticJoint.prototype.m_upperTranslation);
box2d.b2PrismaticJoint.prototype.m_maxMotorForce = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_maxMotorForce", box2d.b2PrismaticJoint.prototype.m_maxMotorForce);
box2d.b2PrismaticJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_motorSpeed", box2d.b2PrismaticJoint.prototype.m_motorSpeed);
box2d.b2PrismaticJoint.prototype.m_enableLimit = !1;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_enableLimit", box2d.b2PrismaticJoint.prototype.m_enableLimit);
box2d.b2PrismaticJoint.prototype.m_enableMotor = !1;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_enableMotor", box2d.b2PrismaticJoint.prototype.m_enableMotor);
box2d.b2PrismaticJoint.prototype.m_limitState = box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_limitState", box2d.b2PrismaticJoint.prototype.m_limitState);
box2d.b2PrismaticJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_indexA", box2d.b2PrismaticJoint.prototype.m_indexA);
box2d.b2PrismaticJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_indexB", box2d.b2PrismaticJoint.prototype.m_indexB);
box2d.b2PrismaticJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localCenterA", box2d.b2PrismaticJoint.prototype.m_localCenterA);
box2d.b2PrismaticJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localCenterB", box2d.b2PrismaticJoint.prototype.m_localCenterB);
box2d.b2PrismaticJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_invMassA", box2d.b2PrismaticJoint.prototype.m_invMassA);
box2d.b2PrismaticJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_invMassB", box2d.b2PrismaticJoint.prototype.m_invMassB);
box2d.b2PrismaticJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_invIA", box2d.b2PrismaticJoint.prototype.m_invIA);
box2d.b2PrismaticJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_invIB", box2d.b2PrismaticJoint.prototype.m_invIB);
box2d.b2PrismaticJoint.prototype.m_axis = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_axis", box2d.b2PrismaticJoint.prototype.m_axis);
box2d.b2PrismaticJoint.prototype.m_perp = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_perp", box2d.b2PrismaticJoint.prototype.m_perp);
box2d.b2PrismaticJoint.prototype.m_s1 = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_s1", box2d.b2PrismaticJoint.prototype.m_s1);
box2d.b2PrismaticJoint.prototype.m_s2 = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_s2", box2d.b2PrismaticJoint.prototype.m_s2);
box2d.b2PrismaticJoint.prototype.m_a1 = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_a1", box2d.b2PrismaticJoint.prototype.m_a1);
box2d.b2PrismaticJoint.prototype.m_a2 = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_a2", box2d.b2PrismaticJoint.prototype.m_a2);
box2d.b2PrismaticJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_K", box2d.b2PrismaticJoint.prototype.m_K);
box2d.b2PrismaticJoint.prototype.m_K3 = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_K3", box2d.b2PrismaticJoint.prototype.m_K3);
box2d.b2PrismaticJoint.prototype.m_K2 = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_K2", box2d.b2PrismaticJoint.prototype.m_K2);
box2d.b2PrismaticJoint.prototype.m_motorMass = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_motorMass", box2d.b2PrismaticJoint.prototype.m_motorMass);
box2d.b2PrismaticJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_qA", box2d.b2PrismaticJoint.prototype.m_qA);
box2d.b2PrismaticJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_qB", box2d.b2PrismaticJoint.prototype.m_qB);
box2d.b2PrismaticJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_lalcA", box2d.b2PrismaticJoint.prototype.m_lalcA);
box2d.b2PrismaticJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_lalcB", box2d.b2PrismaticJoint.prototype.m_lalcB);
box2d.b2PrismaticJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_rA", box2d.b2PrismaticJoint.prototype.m_rA);
box2d.b2PrismaticJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_rB", box2d.b2PrismaticJoint.prototype.m_rB);
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.velocities[this.m_indexA].v,
    e = a.velocities[this.m_indexA].w,
    d = a.positions[this.m_indexB].c,
    f = a.positions[this.m_indexB].a,
    g = a.velocities[this.m_indexB].v,
    h = a.velocities[this.m_indexB].w,
    j = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
    f = this.m_qB.SetAngleRadians(f);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  var i = box2d.b2MulRV(j, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var k = box2d.b2MulRV(f, this.m_lalcB, this.m_rB),
    l = box2d.b2AddVV(box2d.b2SubVV(d, b, box2d.b2Vec2.s_t0), box2d.b2SubVV(k,
      i, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_d),
    b = this.m_invMassA,
    d = this.m_invMassB,
    f = this.m_invIA,
    m = this.m_invIB;
  box2d.b2MulRV(j, this.m_localXAxisA, this.m_axis);
  this.m_a1 = box2d.b2CrossVV(box2d.b2AddVV(l, i, box2d.b2Vec2.s_t0), this.m_axis);
  this.m_a2 = box2d.b2CrossVV(k, this.m_axis);
  this.m_motorMass = b + d + f * this.m_a1 * this.m_a1 + m * this.m_a2 * this.m_a2;
  0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass);
  box2d.b2MulRV(j, this.m_localYAxisA, this.m_perp);
  this.m_s1 = box2d.b2CrossVV(box2d.b2AddVV(l,
    i, box2d.b2Vec2.s_t0), this.m_perp);
  this.m_s2 = box2d.b2CrossVV(k, this.m_perp);
  this.m_K.ex.x = b + d + f * this.m_s1 * this.m_s1 + m * this.m_s2 * this.m_s2;
  this.m_K.ex.y = f * this.m_s1 + m * this.m_s2;
  this.m_K.ex.z = f * this.m_s1 * this.m_a1 + m * this.m_s2 * this.m_a2;
  this.m_K.ey.x = this.m_K.ex.y;
  this.m_K.ey.y = f + m;
  0 == this.m_K.ey.y && (this.m_K.ey.y = 1);
  this.m_K.ey.z = f * this.m_a1 + m * this.m_a2;
  this.m_K.ez.x = this.m_K.ex.z;
  this.m_K.ez.y = this.m_K.ey.z;
  this.m_K.ez.z = b + d + f * this.m_a1 * this.m_a1 + m * this.m_a2 * this.m_a2;
  this.m_enableLimit ? (j = box2d.b2DotVV(this.m_axis,
    l), box2d.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * box2d.b2_linearSlop ? this.m_limitState = box2d.b2LimitState.e_equalLimits : j <= this.m_lowerTranslation ? this.m_limitState != box2d.b2LimitState.e_atLowerLimit && (this.m_limitState = box2d.b2LimitState.e_atLowerLimit, this.m_impulse.z = 0) : j >= this.m_upperTranslation ? this.m_limitState != box2d.b2LimitState.e_atUpperLimit && (this.m_limitState = box2d.b2LimitState.e_atUpperLimit, this.m_impulse.z = 0) : (this.m_limitState = box2d.b2LimitState.e_inactiveLimit, this.m_impulse.z =
    0)) : (this.m_limitState = box2d.b2LimitState.e_inactiveLimit, this.m_impulse.z = 0);
  !1 == this.m_enableMotor && (this.m_motorImpulse = 0);
  a.step.warmStarting ? (this.m_impulse.SelfMul(a.step.dtRatio), this.m_motorImpulse *= a.step.dtRatio, j = box2d.b2AddVV(box2d.b2MulSV(this.m_impulse.x, this.m_perp, box2d.b2Vec2.s_t0), box2d.b2MulSV(this.m_motorImpulse + this.m_impulse.z, this.m_axis, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_P), i = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse +
    this.m_impulse.z) * this.m_a1, k = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2, c.SelfMulSub(b, j), e -= f * i, g.SelfMulAdd(d, j), h += m * k) : (this.m_impulse.SetZero(), this.m_motorImpulse = 0);
  a.velocities[this.m_indexA].w = e;
  a.velocities[this.m_indexB].w = h
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "InitVelocityConstraints", box2d.b2PrismaticJoint.prototype.InitVelocityConstraints);
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_d = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    j = this.m_invIB;
  if (this.m_enableMotor && this.m_limitState != box2d.b2LimitState.e_equalLimits) {
    var i = box2d.b2DotVV(this.m_axis, box2d.b2SubVV(e, b, box2d.b2Vec2.s_t0)) + this.m_a2 * d - this.m_a1 * c,
      i = this.m_motorMass * (this.m_motorSpeed - i),
      k = this.m_motorImpulse,
      l = a.step.dt * this.m_maxMotorForce;
    this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + i, -l, l);
    i = this.m_motorImpulse - k;
    k = box2d.b2MulSV(i, this.m_axis, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P);
    l = i * this.m_a1;
    i *= this.m_a2;
    b.SelfMulSub(f, k);
    c -= h * l;
    e.SelfMulAdd(g, k);
    d += j * i
  }
  var l = box2d.b2DotVV(this.m_perp, box2d.b2SubVV(e, b, box2d.b2Vec2.s_t0)) + this.m_s2 * d - this.m_s1 * c,
    m = d - c;
  this.m_enableLimit && this.m_limitState != box2d.b2LimitState.e_inactiveLimit ? (i = box2d.b2DotVV(this.m_axis, box2d.b2SubVV(e,
    b, box2d.b2Vec2.s_t0)) + this.m_a2 * d - this.m_a1 * c, k = box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f1.Copy(this.m_impulse), i = this.m_K.Solve33(-l, -m, -i, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df3), this.m_impulse.SelfAdd(i), this.m_limitState == box2d.b2LimitState.e_atLowerLimit ? this.m_impulse.z = box2d.b2Max(this.m_impulse.z, 0) : this.m_limitState == box2d.b2LimitState.e_atUpperLimit && (this.m_impulse.z = box2d.b2Min(this.m_impulse.z, 0)), l = this.m_K.Solve22(-l - (this.m_impulse.z - k.z) *
    this.m_K.ez.x, -m - (this.m_impulse.z - k.z) * this.m_K.ez.y, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f2r), l.x += k.x, l.y += k.y, this.m_impulse.x = l.x, this.m_impulse.y = l.y, i.x = this.m_impulse.x - k.x, i.y = this.m_impulse.y - k.y, i.z = this.m_impulse.z - k.z, k = box2d.b2AddVV(box2d.b2MulSV(i.x, this.m_perp, box2d.b2Vec2.s_t0), box2d.b2MulSV(i.z, this.m_axis, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P), l = i.x * this.m_s1 + i.y + i.z * this.m_a1, i = i.x * this.m_s2 + i.y + i.z * this.m_a2) : (i =
    this.m_K.Solve22(-l, -m, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df2), this.m_impulse.x += i.x, this.m_impulse.y += i.y, k = box2d.b2MulSV(i.x, this.m_perp, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P), l = i.x * this.m_s1 + i.y, i = i.x * this.m_s2 + i.y);
  b.SelfMulSub(f, k);
  c -= h * l;
  e.SelfMulAdd(g, k);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d + j * i
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SolveVelocityConstraints", box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints);
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f2r = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f1 = new box2d.b2Vec3;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df3 = new box2d.b2Vec3;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df2 = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints = function(a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.positions[this.m_indexB].c,
    d = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngleRadians(c),
    g = this.m_qB.SetAngleRadians(d),
    h = this.m_invMassA,
    j = this.m_invMassB,
    i = this.m_invIA,
    k = this.m_invIB,
    l = box2d.b2MulRV(f, this.m_lalcA, this.m_rA),
    m = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
    n = box2d.b2SubVV(box2d.b2AddVV(e, m, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, l, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_d),
    o = box2d.b2MulRV(f, this.m_localXAxisA, this.m_axis),
    r = box2d.b2CrossVV(box2d.b2AddVV(n, l, box2d.b2Vec2.s_t0), o),
    g = box2d.b2CrossVV(m, o),
    f = box2d.b2MulRV(f, this.m_localYAxisA, this.m_perp),
    p = box2d.b2CrossVV(box2d.b2AddVV(n, l, box2d.b2Vec2.s_t0), f),
    q = box2d.b2CrossVV(m, f),
    s = box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse,
    v = box2d.b2DotVV(f, n),
    z = d - c - this.m_referenceAngle,
    l = box2d.b2Abs(v),
    m = box2d.b2Abs(z),
    u = !1,
    t = 0;
  this.m_enableLimit && (n = box2d.b2DotVV(o, n), box2d.b2Abs(this.m_upperTranslation -
    this.m_lowerTranslation) < 2 * box2d.b2_linearSlop ? (t = box2d.b2Clamp(n, -box2d.b2_maxLinearCorrection, box2d.b2_maxLinearCorrection), l = box2d.b2Max(l, box2d.b2Abs(n)), u = !0) : n <= this.m_lowerTranslation ? (t = box2d.b2Clamp(n - this.m_lowerTranslation + box2d.b2_linearSlop, -box2d.b2_maxLinearCorrection, 0), l = box2d.b2Max(l, this.m_lowerTranslation - n), u = !0) : n >= this.m_upperTranslation && (t = box2d.b2Clamp(n - this.m_upperTranslation - box2d.b2_linearSlop, 0, box2d.b2_maxLinearCorrection), l = box2d.b2Max(l, n - this.m_upperTranslation),
    u = !0));
  if (u) {
    var n = i * p + k * q,
      y = i * p * r + k * q * g,
      u = i + k;
    0 == u && (u = 1);
    var w = i * r + k * g,
      B = h + j + i * r * r + k * g * g,
      A = this.m_K3;
    A.ex.SetXYZ(h + j + i * p * p + k * q * q, n, y);
    A.ey.SetXYZ(n, u, w);
    A.ez.SetXYZ(y, w, B);
    s = A.Solve33(-v, -z, -t, s)
  } else n = i * p + k * q, u = i + k, 0 == u && (u = 1), t = this.m_K2, t.ex.SetXY(h + j + i * p * p + k * q * q, n), t.ey.SetXY(n, u), v = t.Solve(-v, -z, box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse1), s.x = v.x, s.y = v.y, s.z = 0;
  o = box2d.b2AddVV(box2d.b2MulSV(s.x, f, box2d.b2Vec2.s_t0), box2d.b2MulSV(s.z, o, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_P);
  r = s.x * p + s.y + s.z * r;
  g = s.x * q + s.y + s.z * g;
  b.SelfMulSub(h, o);
  c -= i * r;
  e.SelfMulAdd(j, o);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = d + k * g;
  return l <= box2d.b2_linearSlop && m <= box2d.b2_angularSlop
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SolvePositionConstraints", box2d.b2PrismaticJoint.prototype.SolvePositionConstraints);
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_d = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec3;
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse1 = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetAnchorA", box2d.b2PrismaticJoint.prototype.GetAnchorA);
box2d.b2PrismaticJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetAnchorB", box2d.b2PrismaticJoint.prototype.GetAnchorB);
box2d.b2PrismaticJoint.prototype.GetReactionForce = function(a, b) {
  return b.SetXY(a * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), a * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y))
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetReactionForce", box2d.b2PrismaticJoint.prototype.GetReactionForce);
box2d.b2PrismaticJoint.prototype.GetReactionTorque = function(a) {
  return a * this.m_impulse.y
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetReactionTorque", box2d.b2PrismaticJoint.prototype.GetReactionTorque);
box2d.b2PrismaticJoint.prototype.GetLocalAnchorA = function() {
  return this.m_localAnchorA
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetLocalAnchorA", box2d.b2PrismaticJoint.prototype.GetLocalAnchorA);
box2d.b2PrismaticJoint.prototype.GetLocalAnchorB = function() {
  return this.m_localAnchorB
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetLocalAnchorB", box2d.b2PrismaticJoint.prototype.GetLocalAnchorB);
box2d.b2PrismaticJoint.prototype.GetLocalAxisA = function() {
  return this.m_localXAxisA
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetLocalAxisA", box2d.b2PrismaticJoint.prototype.GetLocalAxisA);
box2d.b2PrismaticJoint.prototype.GetReferenceAngle = function() {
  return this.m_referenceAngle
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetReferenceAngle", box2d.b2PrismaticJoint.prototype.GetReferenceAngle);
box2d.b2PrismaticJoint.prototype.GetJointTranslation = function() {
  var a = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pA),
    b = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pB),
    a = box2d.b2SubVV(b, a, box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_d),
    b = this.m_bodyA.GetWorldVector(this.m_localXAxisA, box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_axis);
  return box2d.b2DotVV(a, b)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetJointTranslation", box2d.b2PrismaticJoint.prototype.GetJointTranslation);
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pA = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pB = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_d = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_axis = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetJointSpeed = function() {
  var a = this.m_bodyA,
    b = this.m_bodyB;
  box2d.b2SubVV(this.m_localAnchorA, a.m_sweep.localCenter, this.m_lalcA);
  var c = box2d.b2MulRV(a.m_xf.q, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, b.m_sweep.localCenter, this.m_lalcB);
  var e = box2d.b2MulRV(b.m_xf.q, this.m_lalcB, this.m_rB),
    d = box2d.b2AddVV(a.m_sweep.c, c, box2d.b2Vec2.s_t0),
    f = box2d.b2AddVV(b.m_sweep.c, e, box2d.b2Vec2.s_t1),
    d = box2d.b2SubVV(f, d, box2d.b2Vec2.s_t2),
    f = a.GetWorldVector(this.m_localXAxisA,
      this.m_axis),
    g = a.m_linearVelocity,
    h = b.m_linearVelocity,
    a = a.m_angularVelocity,
    b = b.m_angularVelocity;
  return box2d.b2DotVV(d, box2d.b2CrossSV(a, f, box2d.b2Vec2.s_t0)) + box2d.b2DotVV(f, box2d.b2SubVV(box2d.b2AddVCrossSV(h, b, e, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(g, a, c, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0))
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetJointSpeed", box2d.b2PrismaticJoint.prototype.GetJointSpeed);
box2d.b2PrismaticJoint.prototype.IsLimitEnabled = function() {
  return this.m_enableLimit
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "IsLimitEnabled", box2d.b2PrismaticJoint.prototype.IsLimitEnabled);
box2d.b2PrismaticJoint.prototype.EnableLimit = function(a) {
  a != this.m_enableLimit && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_enableLimit = a, this.m_impulse.z = 0)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "EnableLimit", box2d.b2PrismaticJoint.prototype.EnableLimit);
box2d.b2PrismaticJoint.prototype.GetLowerLimit = function() {
  return this.m_lowerTranslation
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetLowerLimit", box2d.b2PrismaticJoint.prototype.GetLowerLimit);
box2d.b2PrismaticJoint.prototype.GetUpperLimit = function() {
  return this.m_upperTranslation
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetUpperLimit", box2d.b2PrismaticJoint.prototype.GetUpperLimit);
box2d.b2PrismaticJoint.prototype.SetLimits = function(a, b) {
  if (a != this.m_lowerTranslation || b != this.m_upperTranslation) this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_lowerTranslation = a, this.m_upperTranslation = b, this.m_impulse.z = 0
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SetLimits", box2d.b2PrismaticJoint.prototype.SetLimits);
box2d.b2PrismaticJoint.prototype.IsMotorEnabled = function() {
  return this.m_enableMotor
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "IsMotorEnabled", box2d.b2PrismaticJoint.prototype.IsMotorEnabled);
box2d.b2PrismaticJoint.prototype.EnableMotor = function(a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_enableMotor = a
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "EnableMotor", box2d.b2PrismaticJoint.prototype.EnableMotor);
box2d.b2PrismaticJoint.prototype.SetMotorSpeed = function(a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_motorSpeed = a
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SetMotorSpeed", box2d.b2PrismaticJoint.prototype.SetMotorSpeed);
box2d.b2PrismaticJoint.prototype.GetMotorSpeed = function() {
  return this.m_motorSpeed
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetMotorSpeed", box2d.b2PrismaticJoint.prototype.GetMotorSpeed);
box2d.b2PrismaticJoint.prototype.SetMaxMotorForce = function(a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_maxMotorForce = a
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SetMaxMotorForce", box2d.b2PrismaticJoint.prototype.SetMaxMotorForce);
box2d.b2PrismaticJoint.prototype.GetMaxMotorForce = function() {
  return this.m_maxMotorForce
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetMaxMotorForce", box2d.b2PrismaticJoint.prototype.GetMaxMotorForce);
box2d.b2PrismaticJoint.prototype.GetMotorForce = function(a) {
  return a * this.m_motorImpulse
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetMotorForce", box2d.b2PrismaticJoint.prototype.GetMotorForce);
box2d.b2PrismaticJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2PrismaticJointDef*/ var jd = new box2d.b2PrismaticJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
    box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
      this.m_localAnchorB.x, this.m_localAnchorB.y);
    box2d.b2Log("  jd.localAxisA.SetXY(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
    box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
    box2d.b2Log("  jd.enableLimit = %s;\n", this.m_enableLimit ? "true" : "false");
    box2d.b2Log("  jd.lowerTranslation = %.15f;\n", this.m_lowerTranslation);
    box2d.b2Log("  jd.upperTranslation = %.15f;\n", this.m_upperTranslation);
    box2d.b2Log("  jd.enableMotor = %s;\n", this.m_enableMotor ? "true" : "false");
    box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
    box2d.b2Log("  jd.maxMotorForce = %.15f;\n", this.m_maxMotorForce);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "Dump", box2d.b2PrismaticJoint.prototype.Dump);
box2d.b2GearJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_gearJoint)
};
goog.inherits(box2d.b2GearJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2GearJointDef", box2d.b2GearJointDef);
box2d.b2GearJointDef.prototype.joint1 = null;
goog.exportProperty(box2d.b2GearJointDef.prototype, "joint1", box2d.b2GearJointDef.prototype.joint1);
box2d.b2GearJointDef.prototype.joint2 = null;
goog.exportProperty(box2d.b2GearJointDef.prototype, "joint2", box2d.b2GearJointDef.prototype.joint2);
box2d.b2GearJointDef.prototype.ratio = 1;
goog.exportProperty(box2d.b2GearJointDef.prototype, "ratio", box2d.b2GearJointDef.prototype.ratio);
box2d.b2GearJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_joint1 = a.joint1;
  this.m_joint2 = a.joint2;
  this.m_localAnchorA = new box2d.b2Vec2;
  this.m_localAnchorB = new box2d.b2Vec2;
  this.m_localAnchorC = new box2d.b2Vec2;
  this.m_localAnchorD = new box2d.b2Vec2;
  this.m_localAxisC = new box2d.b2Vec2;
  this.m_localAxisD = new box2d.b2Vec2;
  this.m_lcA = new box2d.b2Vec2;
  this.m_lcB = new box2d.b2Vec2;
  this.m_lcC = new box2d.b2Vec2;
  this.m_lcD = new box2d.b2Vec2;
  this.m_JvAC = new box2d.b2Vec2;
  this.m_JvBD = new box2d.b2Vec2;
  this.m_qA =
    new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_qC = new box2d.b2Rot;
  this.m_qD = new box2d.b2Rot;
  this.m_lalcA = new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_lalcC = new box2d.b2Vec2;
  this.m_lalcD = new box2d.b2Vec2;
  this.m_typeA = this.m_joint1.GetType();
  this.m_typeB = this.m_joint2.GetType();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_typeA == box2d.b2JointType.e_revoluteJoint || this.m_typeA == box2d.b2JointType.e_prismaticJoint);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_typeB == box2d.b2JointType.e_revoluteJoint ||
    this.m_typeB == box2d.b2JointType.e_prismaticJoint);
  var b, c;
  this.m_bodyC = this.m_joint1.GetBodyA();
  this.m_bodyA = this.m_joint1.GetBodyB();
  b = this.m_bodyA.m_xf;
  var e = this.m_bodyA.m_sweep.a;
  c = this.m_bodyC.m_xf;
  var d = this.m_bodyC.m_sweep.a;
  this.m_typeA == box2d.b2JointType.e_revoluteJoint ? (c = a.joint1, this.m_localAnchorC.Copy(c.m_localAnchorA), this.m_localAnchorA.Copy(c.m_localAnchorB), this.m_referenceAngleA = c.m_referenceAngle, this.m_localAxisC.SetZero(), b = e - d - this.m_referenceAngleA) : (d = a.joint1, this.m_localAnchorC.Copy(d.m_localAnchorA),
    this.m_localAnchorA.Copy(d.m_localAnchorB), this.m_referenceAngleA = d.m_referenceAngle, this.m_localAxisC.Copy(d.m_localXAxisA), e = this.m_localAnchorC, b = box2d.b2MulTRV(c.q, box2d.b2AddVV(box2d.b2MulRV(b.q, this.m_localAnchorA, box2d.b2Vec2.s_t0), box2d.b2SubVV(b.p, c.p, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), b = box2d.b2DotVV(box2d.b2SubVV(b, e, box2d.b2Vec2.s_t0), this.m_localAxisC));
  this.m_bodyD = this.m_joint2.GetBodyA();
  this.m_bodyB = this.m_joint2.GetBodyB();
  c = this.m_bodyB.m_xf;
  var d = this.m_bodyB.m_sweep.a,
    e = this.m_bodyD.m_xf,
    f = this.m_bodyD.m_sweep.a;
  this.m_typeB == box2d.b2JointType.e_revoluteJoint ? (c = a.joint2, this.m_localAnchorD.Copy(c.m_localAnchorA), this.m_localAnchorB.Copy(c.m_localAnchorB), this.m_referenceAngleB = c.m_referenceAngle, this.m_localAxisD.SetZero(), c = d - f - this.m_referenceAngleB) : (d = a.joint2, this.m_localAnchorD.Copy(d.m_localAnchorA), this.m_localAnchorB.Copy(d.m_localAnchorB), this.m_referenceAngleB = d.m_referenceAngle, this.m_localAxisD.Copy(d.m_localXAxisA), d = this.m_localAnchorD, c = box2d.b2MulTRV(e.q,
    box2d.b2AddVV(box2d.b2MulRV(c.q, this.m_localAnchorB, box2d.b2Vec2.s_t0), box2d.b2SubVV(c.p, e.p, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), c = box2d.b2DotVV(box2d.b2SubVV(c, d, box2d.b2Vec2.s_t0), this.m_localAxisD));
  this.m_ratio = a.ratio;
  this.m_constant = b + this.m_ratio * c;
  this.m_impulse = 0
};
goog.inherits(box2d.b2GearJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2GearJoint", box2d.b2GearJoint);
box2d.b2GearJoint.prototype.m_joint1 = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_joint1", box2d.b2GearJoint.prototype.m_joint1);
box2d.b2GearJoint.prototype.m_joint2 = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_joint2", box2d.b2GearJoint.prototype.m_joint2);
box2d.b2GearJoint.prototype.m_typeA = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_typeA", box2d.b2GearJoint.prototype.m_typeA);
box2d.b2GearJoint.prototype.m_typeB = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_typeB", box2d.b2GearJoint.prototype.m_typeB);
box2d.b2GearJoint.prototype.m_bodyC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_bodyC", box2d.b2GearJoint.prototype.m_bodyC);
box2d.b2GearJoint.prototype.m_bodyD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_bodyD", box2d.b2GearJoint.prototype.m_bodyD);
box2d.b2GearJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAnchorA", box2d.b2GearJoint.prototype.m_localAnchorA);
box2d.b2GearJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAnchorB", box2d.b2GearJoint.prototype.m_localAnchorB);
box2d.b2GearJoint.prototype.m_localAnchorC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAnchorC", box2d.b2GearJoint.prototype.m_localAnchorC);
box2d.b2GearJoint.prototype.m_localAnchorD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAnchorD", box2d.b2GearJoint.prototype.m_localAnchorD);
box2d.b2GearJoint.prototype.m_localAxisC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAxisC", box2d.b2GearJoint.prototype.m_localAxisC);
box2d.b2GearJoint.prototype.m_localAxisD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAxisD", box2d.b2GearJoint.prototype.m_localAxisD);
box2d.b2GearJoint.prototype.m_referenceAngleA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_referenceAngleA", box2d.b2GearJoint.prototype.m_referenceAngleA);
box2d.b2GearJoint.prototype.m_referenceAngleB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_referenceAngleB", box2d.b2GearJoint.prototype.m_referenceAngleB);
box2d.b2GearJoint.prototype.m_constant = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_constant", box2d.b2GearJoint.prototype.m_constant);
box2d.b2GearJoint.prototype.m_ratio = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_ratio", box2d.b2GearJoint.prototype.m_ratio);
box2d.b2GearJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_impulse", box2d.b2GearJoint.prototype.m_impulse);
box2d.b2GearJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_indexA", box2d.b2GearJoint.prototype.m_indexA);
box2d.b2GearJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_indexB", box2d.b2GearJoint.prototype.m_indexB);
box2d.b2GearJoint.prototype.m_indexC = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_indexC", box2d.b2GearJoint.prototype.m_indexC);
box2d.b2GearJoint.prototype.m_indexD = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_indexD", box2d.b2GearJoint.prototype.m_indexD);
box2d.b2GearJoint.prototype.m_lcA = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lcA", box2d.b2GearJoint.prototype.m_lcA);
box2d.b2GearJoint.prototype.m_lcB = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lcB", box2d.b2GearJoint.prototype.m_lcB);
box2d.b2GearJoint.prototype.m_lcC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lcC", box2d.b2GearJoint.prototype.m_lcC);
box2d.b2GearJoint.prototype.m_lcD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lcD", box2d.b2GearJoint.prototype.m_lcD);
box2d.b2GearJoint.prototype.m_mA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mA", box2d.b2GearJoint.prototype.m_mA);
box2d.b2GearJoint.prototype.m_mB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mB", box2d.b2GearJoint.prototype.m_mB);
box2d.b2GearJoint.prototype.m_mC = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mC", box2d.b2GearJoint.prototype.m_mC);
box2d.b2GearJoint.prototype.m_mD = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mD", box2d.b2GearJoint.prototype.m_mD);
box2d.b2GearJoint.prototype.m_iA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_iA", box2d.b2GearJoint.prototype.m_iA);
box2d.b2GearJoint.prototype.m_iB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_iB", box2d.b2GearJoint.prototype.m_iB);
box2d.b2GearJoint.prototype.m_iC = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_iC", box2d.b2GearJoint.prototype.m_iC);
box2d.b2GearJoint.prototype.m_iD = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_iD", box2d.b2GearJoint.prototype.m_iD);
box2d.b2GearJoint.prototype.m_JvAC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JvAC", box2d.b2GearJoint.prototype.m_JvAC);
box2d.b2GearJoint.prototype.m_JvBD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JvBD", box2d.b2GearJoint.prototype.m_JvBD);
box2d.b2GearJoint.prototype.m_JwA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JwA", box2d.b2GearJoint.prototype.m_JwA);
box2d.b2GearJoint.prototype.m_JwB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JwB", box2d.b2GearJoint.prototype.m_JwB);
box2d.b2GearJoint.prototype.m_JwC = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JwC", box2d.b2GearJoint.prototype.m_JwC);
box2d.b2GearJoint.prototype.m_JwD = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JwD", box2d.b2GearJoint.prototype.m_JwD);
box2d.b2GearJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mass", box2d.b2GearJoint.prototype.m_mass);
box2d.b2GearJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_qA", box2d.b2GearJoint.prototype.m_qA);
box2d.b2GearJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_qB", box2d.b2GearJoint.prototype.m_qB);
box2d.b2GearJoint.prototype.m_qC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_qC", box2d.b2GearJoint.prototype.m_qC);
box2d.b2GearJoint.prototype.m_qD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_qD", box2d.b2GearJoint.prototype.m_qD);
box2d.b2GearJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lalcA", box2d.b2GearJoint.prototype.m_lalcA);
box2d.b2GearJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lalcB", box2d.b2GearJoint.prototype.m_lalcB);
box2d.b2GearJoint.prototype.m_lalcC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lalcC", box2d.b2GearJoint.prototype.m_lalcC);
box2d.b2GearJoint.prototype.m_lalcD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lalcD", box2d.b2GearJoint.prototype.m_lalcD);
box2d.b2GearJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_indexC = this.m_bodyC.m_islandIndex;
  this.m_indexD = this.m_bodyD.m_islandIndex;
  this.m_lcA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_lcB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_lcC.Copy(this.m_bodyC.m_sweep.localCenter);
  this.m_lcD.Copy(this.m_bodyD.m_sweep.localCenter);
  this.m_mA = this.m_bodyA.m_invMass;
  this.m_mB = this.m_bodyB.m_invMass;
  this.m_mC =
    this.m_bodyC.m_invMass;
  this.m_mD = this.m_bodyD.m_invMass;
  this.m_iA = this.m_bodyA.m_invI;
  this.m_iB = this.m_bodyB.m_invI;
  this.m_iC = this.m_bodyC.m_invI;
  this.m_iD = this.m_bodyD.m_invI;
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.positions[this.m_indexB].a,
    d = a.velocities[this.m_indexB].v,
    f = a.velocities[this.m_indexB].w,
    g = a.positions[this.m_indexC].a,
    h = a.velocities[this.m_indexC].v,
    j = a.velocities[this.m_indexC].w,
    i = a.positions[this.m_indexD].a,
    k = a.velocities[this.m_indexD].v,
    l = a.velocities[this.m_indexD].w,
    m = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
    e = this.m_qB.SetAngleRadians(e),
    n = this.m_qC.SetAngleRadians(g),
    g = this.m_qD.SetAngleRadians(i);
  this.m_mass = 0;
  this.m_typeA == box2d.b2JointType.e_revoluteJoint ? (this.m_JvAC.SetZero(), this.m_JwC = this.m_JwA = 1, this.m_mass += this.m_iA + this.m_iC) : (i = box2d.b2MulRV(n, this.m_localAxisC, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u), box2d.b2SubVV(this.m_localAnchorC, this.m_lcC, this.m_lalcC), n = box2d.b2MulRV(n, this.m_lalcC, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rC),
    box2d.b2SubVV(this.m_localAnchorA, this.m_lcA, this.m_lalcA), m = box2d.b2MulRV(m, this.m_lalcA, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rA), this.m_JvAC.Copy(i), this.m_JwC = box2d.b2CrossVV(n, i), this.m_JwA = box2d.b2CrossVV(m, i), this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA);
  this.m_typeB == box2d.b2JointType.e_revoluteJoint ? (this.m_JvBD.SetZero(), this.m_JwD = this.m_JwB = this.m_ratio, this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD)) : (i =
    box2d.b2MulRV(g, this.m_localAxisD, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u), box2d.b2SubVV(this.m_localAnchorD, this.m_lcD, this.m_lalcD), m = box2d.b2MulRV(g, this.m_lalcD, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rD), box2d.b2SubVV(this.m_localAnchorB, this.m_lcB, this.m_lalcB), e = box2d.b2MulRV(e, this.m_lalcB, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rB), box2d.b2MulSV(this.m_ratio, i, this.m_JvBD), this.m_JwD = this.m_ratio * box2d.b2CrossVV(m, i), this.m_JwB = this.m_ratio * box2d.b2CrossVV(e,
      i), this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB);
  this.m_mass = 0 < this.m_mass ? 1 / this.m_mass : 0;
  a.step.warmStarting ? (b.SelfMulAdd(this.m_mA * this.m_impulse, this.m_JvAC), c += this.m_iA * this.m_impulse * this.m_JwA, d.SelfMulAdd(this.m_mB * this.m_impulse, this.m_JvBD), f += this.m_iB * this.m_impulse * this.m_JwB, h.SelfMulSub(this.m_mC * this.m_impulse, this.m_JvAC), j -= this.m_iC * this.m_impulse * this.m_JwC, k.SelfMulSub(this.m_mD * this.m_impulse, this.m_JvBD),
    l -= this.m_iD * this.m_impulse * this.m_JwD) : this.m_impulse = 0;
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = f;
  a.velocities[this.m_indexC].w = j;
  a.velocities[this.m_indexD].w = l
};
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rA = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rB = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rC = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rD = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = a.velocities[this.m_indexC].v,
    g = a.velocities[this.m_indexC].w,
    h = a.velocities[this.m_indexD].v,
    j = a.velocities[this.m_indexD].w,
    i = box2d.b2DotVV(this.m_JvAC, box2d.b2SubVV(b, f, box2d.b2Vec2.s_t0)) + box2d.b2DotVV(this.m_JvBD, box2d.b2SubVV(e, h, box2d.b2Vec2.s_t0)),
    i = i + (this.m_JwA * c - this.m_JwC * g + (this.m_JwB * d - this.m_JwD *
      j)),
    i = -this.m_mass * i;
  this.m_impulse += i;
  b.SelfMulAdd(this.m_mA * i, this.m_JvAC);
  c += this.m_iA * i * this.m_JwA;
  e.SelfMulAdd(this.m_mB * i, this.m_JvBD);
  d += this.m_iB * i * this.m_JwB;
  f.SelfMulSub(this.m_mC * i, this.m_JvAC);
  g -= this.m_iC * i * this.m_JwC;
  h.SelfMulSub(this.m_mD * i, this.m_JvBD);
  j -= this.m_iD * i * this.m_JwD;
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d;
  a.velocities[this.m_indexC].w = g;
  a.velocities[this.m_indexD].w = j
};
box2d.b2GearJoint.prototype.SolvePositionConstraints = function(a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.positions[this.m_indexB].c,
    d = a.positions[this.m_indexB].a,
    f = a.positions[this.m_indexC].c,
    g = a.positions[this.m_indexC].a,
    h = a.positions[this.m_indexD].c,
    j = a.positions[this.m_indexD].a,
    i = this.m_qA.SetAngleRadians(c),
    k = this.m_qB.SetAngleRadians(d),
    l = this.m_qC.SetAngleRadians(g),
    m = this.m_qD.SetAngleRadians(j),
    n = this.m_JvAC,
    o = this.m_JvBD,
    r, p, q = 0;
  if (this.m_typeA == box2d.b2JointType.e_revoluteJoint) n.SetZero(),
    i = r = 1, q += this.m_iA + this.m_iC, l = c - g - this.m_referenceAngleA;
  else {
    p = box2d.b2MulRV(l, this.m_localAxisC, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u);
    r = box2d.b2MulRV(l, this.m_lalcC, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rC);
    var s = box2d.b2MulRV(i, this.m_lalcA, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rA);
    n.Copy(p);
    i = box2d.b2CrossVV(r, p);
    r = box2d.b2CrossVV(s, p);
    q += this.m_mC + this.m_mA + this.m_iC * i * i + this.m_iA * r * r;
    p = this.m_lalcC;
    l = box2d.b2MulTRV(l, box2d.b2AddVV(s, box2d.b2SubVV(b,
      f, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0);
    l = box2d.b2DotVV(box2d.b2SubVV(l, p, box2d.b2Vec2.s_t0), this.m_localAxisC)
  }
  if (this.m_typeB == box2d.b2JointType.e_revoluteJoint) o.SetZero(), k = p = this.m_ratio, q += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD), m = d - j - this.m_referenceAngleB;
  else {
    p = box2d.b2MulRV(m, this.m_localAxisD, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u);
    var v = box2d.b2MulRV(m, this.m_lalcD, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rD),
      s = box2d.b2MulRV(k,
        this.m_lalcB, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rB);
    box2d.b2MulSV(this.m_ratio, p, o);
    k = this.m_ratio * box2d.b2CrossVV(v, p);
    p = this.m_ratio * box2d.b2CrossVV(s, p);
    q += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * k * k + this.m_iB * p * p;
    v = this.m_lalcD;
    m = box2d.b2MulTRV(m, box2d.b2AddVV(s, box2d.b2SubVV(e, h, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0);
    m = box2d.b2DotVV(box2d.b2SubVV(m, v, box2d.b2Vec2.s_t0), this.m_localAxisD)
  }
  m = l + this.m_ratio * m - this.m_constant;
  l = 0;
  0 < q && (l = -m /
    q);
  b.SelfMulAdd(this.m_mA * l, n);
  c += this.m_iA * l * r;
  e.SelfMulAdd(this.m_mB * l, o);
  d += this.m_iB * l * p;
  f.SelfMulSub(this.m_mC * l, n);
  g -= this.m_iC * l * i;
  h.SelfMulSub(this.m_mD * l, o);
  j -= this.m_iD * l * k;
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = d;
  a.positions[this.m_indexC].a = g;
  a.positions[this.m_indexD].a = j;
  return 0 < box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2GearJoint.prototype, "SolvePositionConstraints", box2d.b2GearJoint.prototype.SolvePositionConstraints);
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rA = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rB = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rC = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rD = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetAnchorA", box2d.b2GearJoint.prototype.GetAnchorA);
box2d.b2GearJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetAnchorB", box2d.b2GearJoint.prototype.GetAnchorB);
box2d.b2GearJoint.prototype.GetReactionForce = function(a, b) {
  return box2d.b2MulSV(a * this.m_impulse, this.m_JvAC, b)
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetReactionForce", box2d.b2GearJoint.prototype.GetReactionForce);
box2d.b2GearJoint.prototype.GetReactionTorque = function(a) {
  return a * this.m_impulse * this.m_JwA
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetReactionTorque", box2d.b2GearJoint.prototype.GetReactionTorque);
box2d.b2GearJoint.prototype.GetJoint1 = function() {
  return this.m_joint1
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetJoint1", box2d.b2GearJoint.prototype.GetJoint1);
box2d.b2GearJoint.prototype.GetJoint2 = function() {
  return this.m_joint2
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetJoint2", box2d.b2GearJoint.prototype.GetJoint2);
box2d.b2GearJoint.prototype.GetRatio = function() {
  return this.m_ratio
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetRatio", box2d.b2GearJoint.prototype.GetRatio);
box2d.b2GearJoint.prototype.SetRatio = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a));
  this.m_ratio = a
};
goog.exportProperty(box2d.b2GearJoint.prototype, "SetRatio", box2d.b2GearJoint.prototype.SetRatio);
box2d.b2GearJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex,
      c = this.m_joint1.m_index,
      e = this.m_joint2.m_index;
    box2d.b2Log("  /*box2d.b2GearJointDef*/ var jd = new box2d.b2GearJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.joint1 = joints[%d];\n", c);
    box2d.b2Log("  jd.joint2 = joints[%d];\n",
      e);
    box2d.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2GearJoint.prototype, "Dump", box2d.b2GearJoint.prototype.Dump);
box2d.b2DistanceProxy = function() {
  this.m_buffer = box2d.b2Vec2.MakeArray(2)
};
goog.exportSymbol("box2d.b2DistanceProxy", box2d.b2DistanceProxy);
box2d.b2DistanceProxy.prototype.m_buffer = null;
goog.exportProperty(box2d.b2DistanceProxy.prototype, "m_buffer", box2d.b2DistanceProxy.prototype.m_buffer);
box2d.b2DistanceProxy.prototype.m_vertices = null;
goog.exportProperty(box2d.b2DistanceProxy.prototype, "m_vertices", box2d.b2DistanceProxy.prototype.m_vertices);
box2d.b2DistanceProxy.prototype.m_count = 0;
goog.exportProperty(box2d.b2DistanceProxy.prototype, "m_count", box2d.b2DistanceProxy.prototype.m_count);
box2d.b2DistanceProxy.prototype.m_radius = 0;
goog.exportProperty(box2d.b2DistanceProxy.prototype, "m_radius", box2d.b2DistanceProxy.prototype.m_radius);
box2d.b2DistanceProxy.prototype.Reset = function() {
  this.m_vertices = null;
  this.m_radius = this.m_count = 0;
  return this
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "Reset", box2d.b2DistanceProxy.prototype.Reset);
box2d.b2DistanceProxy.prototype.SetShape = function(a, b) {
  switch (a.GetType()) {
    case box2d.b2ShapeType.e_circleShape:
      var c = a instanceof box2d.b2CircleShape ? a : null;
      this.m_vertices = [1, !0];
      this.m_vertices[0] = c.m_p;
      this.m_count = 1;
      this.m_radius = c.m_radius;
      break;
    case box2d.b2ShapeType.e_polygonShape:
      c = a instanceof box2d.b2PolygonShape ? a : null;
      this.m_vertices = c.m_vertices;
      this.m_count = c.m_count;
      this.m_radius = c.m_radius;
      break;
    case box2d.b2ShapeType.e_edgeShape:
      c = a instanceof box2d.b2EdgeShape ? a : null;
      this.m_vertices =
        Array(2);
      this.m_vertices[0] = c.m_vertex1;
      this.m_vertices[1] = c.m_vertex2;
      this.m_count = 2;
      this.m_radius = c.m_radius;
      break;
    case box2d.b2ShapeType.e_chainShape:
      c = a instanceof box2d.b2ChainShape ? a : null;
      box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && b < c.m_count);
      this.m_buffer[0].Copy(c.m_vertices[b]);
      b + 1 < c.m_count ? this.m_buffer[1].Copy(c.m_vertices[b + 1]) : this.m_buffer[1].Copy(c.m_vertices[0]);
      this.m_vertices = this.m_buffer;
      this.m_count = 2;
      this.m_radius = c.m_radius;
      break;
    default:
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!1)
  }
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "SetShape", box2d.b2DistanceProxy.prototype.SetShape);
box2d.b2DistanceProxy.prototype.GetSupport = function(a) {
  for (var b = 0, c = box2d.b2DotVV(this.m_vertices[0], a), e = 1; e < this.m_count; ++e) {
    var d = box2d.b2DotVV(this.m_vertices[e], a);
    d > c && (b = e, c = d)
  }
  return b
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "GetSupport", box2d.b2DistanceProxy.prototype.GetSupport);
box2d.b2DistanceProxy.prototype.GetSupportVertex = function(a) {
  for (var b = 0, c = box2d.b2DotVV(this.m_vertices[0], a), e = 1; e < this.m_count; ++e) {
    var d = box2d.b2DotVV(this.m_vertices[e], a);
    d > c && (b = e, c = d)
  }
  return this.m_vertices[b]
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "GetSupportVertex", box2d.b2DistanceProxy.prototype.GetSupportVertex);
box2d.b2DistanceProxy.prototype.GetVertexCount = function() {
  return this.m_count
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "GetVertexCount", box2d.b2DistanceProxy.prototype.GetVertexCount);
box2d.b2DistanceProxy.prototype.GetVertex = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a && a < this.m_count);
  return this.m_vertices[a]
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "GetVertex", box2d.b2DistanceProxy.prototype.GetVertex);
box2d.b2SimplexCache = function() {
  this.indexA = box2d.b2MakeNumberArray(3);
  this.indexB = box2d.b2MakeNumberArray(3)
};
goog.exportSymbol("box2d.b2SimplexCache", box2d.b2SimplexCache);
box2d.b2SimplexCache.prototype.metric = 0;
goog.exportProperty(box2d.b2SimplexCache.prototype, "metric", box2d.b2SimplexCache.prototype.metric);
box2d.b2SimplexCache.prototype.count = 0;
goog.exportProperty(box2d.b2SimplexCache.prototype, "count", box2d.b2SimplexCache.prototype.count);
box2d.b2SimplexCache.prototype.indexA = null;
goog.exportProperty(box2d.b2SimplexCache.prototype, "indexA", box2d.b2SimplexCache.prototype.indexA);
box2d.b2SimplexCache.prototype.indexB = null;
goog.exportProperty(box2d.b2SimplexCache.prototype, "indexB", box2d.b2SimplexCache.prototype.indexB);
box2d.b2SimplexCache.prototype.Reset = function() {
  this.count = this.metric = 0;
  return this
};
goog.exportProperty(box2d.b2SimplexCache.prototype, "Reset", box2d.b2SimplexCache.prototype.Reset);
box2d.b2DistanceInput = function() {
  this.proxyA = new box2d.b2DistanceProxy;
  this.proxyB = new box2d.b2DistanceProxy;
  this.transformA = new box2d.b2Transform;
  this.transformB = new box2d.b2Transform
};
goog.exportSymbol("box2d.b2DistanceInput", box2d.b2DistanceInput);
box2d.b2DistanceInput.prototype.proxyA = null;
goog.exportProperty(box2d.b2DistanceInput.prototype, "proxyA", box2d.b2DistanceInput.prototype.proxyA);
box2d.b2DistanceInput.prototype.proxyB = null;
goog.exportProperty(box2d.b2DistanceInput.prototype, "proxyB", box2d.b2DistanceInput.prototype.proxyB);
box2d.b2DistanceInput.prototype.transformA = null;
goog.exportProperty(box2d.b2DistanceInput.prototype, "transformA", box2d.b2DistanceInput.prototype.transformA);
box2d.b2DistanceInput.prototype.transformB = null;
goog.exportProperty(box2d.b2DistanceInput.prototype, "transformB", box2d.b2DistanceInput.prototype.transformB);
box2d.b2DistanceInput.prototype.useRadii = !1;
goog.exportProperty(box2d.b2DistanceInput.prototype, "useRadii", box2d.b2DistanceInput.prototype.useRadii);
box2d.b2DistanceInput.prototype.Reset = function() {
  this.proxyA.Reset();
  this.proxyB.Reset();
  this.transformA.SetIdentity();
  this.transformB.SetIdentity();
  this.useRadii = !1;
  return this
};
goog.exportProperty(box2d.b2DistanceInput.prototype, "Reset", box2d.b2DistanceInput.prototype.Reset);
box2d.b2DistanceOutput = function() {
  this.pointA = new box2d.b2Vec2;
  this.pointB = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2DistanceOutput", box2d.b2DistanceOutput);
box2d.b2DistanceOutput.prototype.pointA = null;
goog.exportProperty(box2d.b2DistanceOutput.prototype, "pointA", box2d.b2DistanceOutput.prototype.pointA);
box2d.b2DistanceOutput.prototype.pointB = null;
goog.exportProperty(box2d.b2DistanceOutput.prototype, "pointB", box2d.b2DistanceOutput.prototype.pointB);
box2d.b2DistanceOutput.prototype.distance = 0;
goog.exportProperty(box2d.b2DistanceOutput.prototype, "distance", box2d.b2DistanceOutput.prototype.distance);
box2d.b2DistanceOutput.prototype.iterations = 0;
goog.exportProperty(box2d.b2DistanceOutput.prototype, "iterations", box2d.b2DistanceOutput.prototype.iterations);
box2d.b2DistanceOutput.prototype.Reset = function() {
  this.pointA.SetZero();
  this.pointB.SetZero();
  this.iterations = this.distance = 0;
  return this
};
goog.exportProperty(box2d.b2DistanceOutput.prototype, "Reset", box2d.b2DistanceOutput.prototype.Reset);
box2d.b2_gjkCalls = 0;
goog.exportSymbol("box2d.b2_gjkCalls", box2d.b2_gjkCalls);
box2d.b2_gjkIters = 0;
goog.exportSymbol("box2d.b2_gjkIters", box2d.b2_gjkIters);
box2d.b2_gjkMaxIters = 0;
goog.exportSymbol("box2d.b2_gjkMaxIters", box2d.b2_gjkMaxIters);
box2d.b2SimplexVertex = function() {
  this.wA = new box2d.b2Vec2;
  this.wB = new box2d.b2Vec2;
  this.w = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2SimplexVertex", box2d.b2SimplexVertex);
box2d.b2SimplexVertex.prototype.wA = null;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "wA", box2d.b2SimplexVertex.prototype.wA);
box2d.b2SimplexVertex.prototype.wB = null;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "wB", box2d.b2SimplexVertex.prototype.wB);
box2d.b2SimplexVertex.prototype.w = null;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "w", box2d.b2SimplexVertex.prototype.w);
box2d.b2SimplexVertex.prototype.a = 0;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "a", box2d.b2SimplexVertex.prototype.a);
box2d.b2SimplexVertex.prototype.indexA = 0;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "indexA", box2d.b2SimplexVertex.prototype.indexA);
box2d.b2SimplexVertex.prototype.indexB = 0;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "indexB", box2d.b2SimplexVertex.prototype.indexB);
box2d.b2SimplexVertex.prototype.Copy = function(a) {
  this.wA.Copy(a.wA);
  this.wB.Copy(a.wB);
  this.w.Copy(a.w);
  this.a = a.a;
  this.indexA = a.indexA;
  this.indexB = a.indexB;
  return this
};
goog.exportProperty(box2d.b2SimplexVertex.prototype, "Copy", box2d.b2SimplexVertex.prototype.Copy);
box2d.b2Simplex = function() {
  this.m_v1 = new box2d.b2SimplexVertex;
  this.m_v2 = new box2d.b2SimplexVertex;
  this.m_v3 = new box2d.b2SimplexVertex;
  this.m_vertices = Array(3);
  this.m_vertices[0] = this.m_v1;
  this.m_vertices[1] = this.m_v2;
  this.m_vertices[2] = this.m_v3
};
goog.exportSymbol("box2d.b2Simplex", box2d.b2Simplex);
box2d.b2Simplex.prototype.m_v1 = null;
goog.exportProperty(box2d.b2Simplex.prototype, "m_v1", box2d.b2Simplex.prototype.m_v1);
box2d.b2Simplex.prototype.m_v2 = null;
goog.exportProperty(box2d.b2Simplex.prototype, "m_v2", box2d.b2Simplex.prototype.m_v2);
box2d.b2Simplex.prototype.m_v3 = null;
goog.exportProperty(box2d.b2Simplex.prototype, "m_v3", box2d.b2Simplex.prototype.m_v3);
box2d.b2Simplex.prototype.m_vertices = null;
goog.exportProperty(box2d.b2Simplex.prototype, "m_vertices", box2d.b2Simplex.prototype.m_vertices);
box2d.b2Simplex.prototype.ReadCache = function(a, b, c, e, d) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a.count && 3 >= a.count);
  this.m_count = a.count;
  for (var f = this.m_vertices, g = 0; g < this.m_count; ++g) {
    var h = f[g];
    h.indexA = a.indexA[g];
    h.indexB = a.indexB[g];
    var j = b.GetVertex(h.indexA),
      i = e.GetVertex(h.indexB);
    box2d.b2MulXV(c, j, h.wA);
    box2d.b2MulXV(d, i, h.wB);
    box2d.b2SubVV(h.wB, h.wA, h.w);
    h.a = 0
  }
  if (1 < this.m_count && (a = a.metric, g = this.GetMetric(), g < 0.5 * a || 2 * a < g || g < box2d.b2_epsilon)) this.m_count = 0;
  0 == this.m_count && (h = f[0],
    h.indexA = 0, h.indexB = 0, j = b.GetVertex(0), i = e.GetVertex(0), box2d.b2MulXV(c, j, h.wA), box2d.b2MulXV(d, i, h.wB), box2d.b2SubVV(h.wB, h.wA, h.w), this.m_count = h.a = 1)
};
goog.exportProperty(box2d.b2Simplex.prototype, "ReadCache", box2d.b2Simplex.prototype.ReadCache);
box2d.b2Simplex.prototype.WriteCache = function(a) {
  a.metric = this.GetMetric();
  a.count = this.m_count;
  for (var b = this.m_vertices, c = 0; c < this.m_count; ++c) a.indexA[c] = b[c].indexA, a.indexB[c] = b[c].indexB
};
goog.exportProperty(box2d.b2Simplex.prototype, "WriteCache", box2d.b2Simplex.prototype.WriteCache);
box2d.b2Simplex.prototype.GetSearchDirection = function(a) {
  switch (this.m_count) {
    case 1:
      return box2d.b2NegV(this.m_v1.w, a);
    case 2:
      var b = box2d.b2SubVV(this.m_v2.w, this.m_v1.w, a);
      return 0 < box2d.b2CrossVV(b, box2d.b2NegV(this.m_v1.w, box2d.b2Vec2.s_t0)) ? box2d.b2CrossOneV(b, a) : box2d.b2CrossVOne(b, a);
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero()
  }
};
goog.exportProperty(box2d.b2Simplex.prototype, "GetSearchDirection", box2d.b2Simplex.prototype.GetSearchDirection);
box2d.b2Simplex.prototype.GetClosestPoint = function(a) {
  switch (this.m_count) {
    case 0:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero();
    case 1:
      return a.Copy(this.m_v1.w);
    case 2:
      return a.SetXY(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
    case 3:
      return a.SetZero();
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero()
  }
};
goog.exportProperty(box2d.b2Simplex.prototype, "GetClosestPoint", box2d.b2Simplex.prototype.GetClosestPoint);
box2d.b2Simplex.prototype.GetWitnessPoints = function(a, b) {
  switch (this.m_count) {
    case 0:
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
      break;
    case 1:
      a.Copy(this.m_v1.wA);
      b.Copy(this.m_v1.wB);
      break;
    case 2:
      a.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
      a.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
      b.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
      b.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
      break;
    case 3:
      b.x = a.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x +
        this.m_v3.a * this.m_v3.wA.x;
      b.y = a.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
      break;
    default:
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!1)
  }
};
goog.exportProperty(box2d.b2Simplex.prototype, "GetWitnessPoints", box2d.b2Simplex.prototype.GetWitnessPoints);
box2d.b2Simplex.prototype.GetMetric = function() {
  switch (this.m_count) {
    case 0:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0;
    case 1:
      return 0;
    case 2:
      return box2d.b2DistanceVV(this.m_v1.w, this.m_v2.w);
    case 3:
      return box2d.b2CrossVV(box2d.b2SubVV(this.m_v2.w, this.m_v1.w, box2d.b2Vec2.s_t0), box2d.b2SubVV(this.m_v3.w, this.m_v1.w, box2d.b2Vec2.s_t1));
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0
  }
};
goog.exportProperty(box2d.b2Simplex.prototype, "GetMetric", box2d.b2Simplex.prototype.GetMetric);
box2d.b2Simplex.prototype.Solve2 = function() {
  var a = this.m_v1.w,
    b = this.m_v2.w,
    c = box2d.b2SubVV(b, a, box2d.b2Simplex.s_e12),
    a = -box2d.b2DotVV(a, c);
  0 >= a ? this.m_count = this.m_v1.a = 1 : (b = box2d.b2DotVV(b, c), 0 >= b ? (this.m_count = this.m_v2.a = 1, this.m_v1.Copy(this.m_v2)) : (c = 1 / (b + a), this.m_v1.a = b * c, this.m_v2.a = a * c, this.m_count = 2))
};
goog.exportProperty(box2d.b2Simplex.prototype, "Solve2", box2d.b2Simplex.prototype.Solve2);
box2d.b2Simplex.prototype.Solve3 = function() {
  var a = this.m_v1.w,
    b = this.m_v2.w,
    c = this.m_v3.w,
    e = box2d.b2SubVV(b, a, box2d.b2Simplex.s_e12),
    d = box2d.b2DotVV(a, e),
    f = box2d.b2DotVV(b, e),
    d = -d,
    g = box2d.b2SubVV(c, a, box2d.b2Simplex.s_e13),
    h = box2d.b2DotVV(a, g),
    j = box2d.b2DotVV(c, g),
    h = -h,
    i = box2d.b2SubVV(c, b, box2d.b2Simplex.s_e23),
    k = box2d.b2DotVV(b, i),
    i = box2d.b2DotVV(c, i),
    k = -k,
    g = box2d.b2CrossVV(e, g),
    e = g * box2d.b2CrossVV(b, c),
    c = g * box2d.b2CrossVV(c, a),
    a = g * box2d.b2CrossVV(a, b);
  0 >= d && 0 >= h ? this.m_count = this.m_v1.a = 1 : 0 < f &&
    0 < d && 0 >= a ? (j = 1 / (f + d), this.m_v1.a = f * j, this.m_v2.a = d * j, this.m_count = 2) : 0 < j && 0 < h && 0 >= c ? (f = 1 / (j + h), this.m_v1.a = j * f, this.m_v3.a = h * f, this.m_count = 2, this.m_v2.Copy(this.m_v3)) : 0 >= f && 0 >= k ? (this.m_count = this.m_v2.a = 1, this.m_v1.Copy(this.m_v2)) : 0 >= j && 0 >= i ? (this.m_count = this.m_v3.a = 1, this.m_v1.Copy(this.m_v3)) : 0 < i && 0 < k && 0 >= e ? (f = 1 / (i + k), this.m_v2.a = i * f, this.m_v3.a = k * f, this.m_count = 2, this.m_v1.Copy(this.m_v3)) : (f = 1 / (e + c + a), this.m_v1.a = e * f, this.m_v2.a = c * f, this.m_v3.a = a * f, this.m_count = 3)
};
goog.exportProperty(box2d.b2Simplex.prototype, "Solve3", box2d.b2Simplex.prototype.Solve3);
box2d.b2Simplex.s_e12 = new box2d.b2Vec2;
box2d.b2Simplex.s_e13 = new box2d.b2Vec2;
box2d.b2Simplex.s_e23 = new box2d.b2Vec2;
box2d.b2Distance = function(a, b, c) {
  ++box2d.b2_gjkCalls;
  var e = c.proxyA,
    d = c.proxyB,
    f = c.transformA,
    g = c.transformB,
    h = box2d.b2Distance.s_simplex;
  h.ReadCache(b, e, f, d, g);
  for (var j = h.m_vertices, i = box2d.b2Distance.s_saveA, k = box2d.b2Distance.s_saveB, l = 0, m = 0; 20 > m;) {
    for (var l = h.m_count, n = 0; n < l; ++n) i[n] = j[n].indexA, k[n] = j[n].indexB;
    switch (h.m_count) {
      case 1:
        break;
      case 2:
        h.Solve2();
        break;
      case 3:
        h.Solve3();
        break;
      default:
        box2d.ENABLE_ASSERTS && box2d.b2Assert(!1)
    }
    if (3 == h.m_count) break;
    var o = h.GetClosestPoint(box2d.b2Distance.s_p);
    o.GetLengthSquared();
    n = h.GetSearchDirection(box2d.b2Distance.s_d);
    if (n.GetLengthSquared() < box2d.b2_epsilon_sq) break;
    o = j[h.m_count];
    o.indexA = e.GetSupport(box2d.b2MulTRV(f.q, box2d.b2NegV(n, box2d.b2Vec2.s_t0), box2d.b2Distance.s_supportA));
    box2d.b2MulXV(f, e.GetVertex(o.indexA), o.wA);
    o.indexB = d.GetSupport(box2d.b2MulTRV(g.q, n, box2d.b2Distance.s_supportB));
    box2d.b2MulXV(g, d.GetVertex(o.indexB), o.wB);
    box2d.b2SubVV(o.wB, o.wA, o.w);
    ++m;
    ++box2d.b2_gjkIters;
    for (var r = !1, n = 0; n < l; ++n)
      if (o.indexA == i[n] && o.indexB ==
        k[n]) {
        r = !0;
        break
      }
    if (r) break;
    ++h.m_count
  }
  box2d.b2_gjkMaxIters = box2d.b2Max(box2d.b2_gjkMaxIters, m);
  h.GetWitnessPoints(a.pointA, a.pointB);
  a.distance = box2d.b2DistanceVV(a.pointA, a.pointB);
  a.iterations = m;
  h.WriteCache(b);
  c.useRadii && (b = e.m_radius, d = d.m_radius, a.distance > b + d && a.distance > box2d.b2_epsilon ? (a.distance -= b + d, c = box2d.b2SubVV(a.pointB, a.pointA, box2d.b2Distance.s_normal), c.Normalize(), a.pointA.SelfMulAdd(b, c), a.pointB.SelfMulSub(d, c)) : (o = box2d.b2MidVV(a.pointA, a.pointB, box2d.b2Distance.s_p), a.pointA.Copy(o),
    a.pointB.Copy(o), a.distance = 0))
};
goog.exportSymbol("box2d.b2Distance", box2d.b2Distance);
box2d.b2Distance.s_simplex = new box2d.b2Simplex;
box2d.b2Distance.s_saveA = box2d.b2MakeNumberArray(3);
box2d.b2Distance.s_saveB = box2d.b2MakeNumberArray(3);
box2d.b2Distance.s_p = new box2d.b2Vec2;
box2d.b2Distance.s_d = new box2d.b2Vec2;
box2d.b2Distance.s_normal = new box2d.b2Vec2;
box2d.b2Distance.s_supportA = new box2d.b2Vec2;
box2d.b2Distance.s_supportB = new box2d.b2Vec2;
box2d.b2WeldJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_weldJoint);
  this.localAnchorA = new box2d.b2Vec2;
  this.localAnchorB = new box2d.b2Vec2
};
goog.inherits(box2d.b2WeldJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2WeldJointDef", box2d.b2WeldJointDef);
box2d.b2WeldJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "localAnchorA", box2d.b2WeldJointDef.prototype.localAnchorA);
box2d.b2WeldJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "localAnchorB", box2d.b2WeldJointDef.prototype.localAnchorB);
box2d.b2WeldJointDef.prototype.referenceAngle = 0;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "referenceAngle", box2d.b2WeldJointDef.prototype.referenceAngle);
box2d.b2WeldJointDef.prototype.frequencyHz = 0;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "frequencyHz", box2d.b2WeldJointDef.prototype.frequencyHz);
box2d.b2WeldJointDef.prototype.dampingRatio = 0;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "dampingRatio", box2d.b2WeldJointDef.prototype.dampingRatio);
box2d.b2WeldJointDef.prototype.Initialize = function(a, b, c) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
  this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians()
};
goog.exportProperty(box2d.b2WeldJointDef.prototype, "Initialize", box2d.b2WeldJointDef.prototype.Initialize);
box2d.b2WeldJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_referenceAngle = a.referenceAngle;
  this.m_impulse = new box2d.b2Vec3(0, 0, 0);
  this.m_rA = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2;
  this.m_localCenterA = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_mass = new box2d.b2Mat33;
  this.m_qA = new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcA =
    new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_K = new box2d.b2Mat33
};
goog.inherits(box2d.b2WeldJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2WeldJoint", box2d.b2WeldJoint);
box2d.b2WeldJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_frequencyHz", box2d.b2WeldJoint.prototype.m_frequencyHz);
box2d.b2WeldJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_dampingRatio", box2d.b2WeldJoint.prototype.m_dampingRatio);
box2d.b2WeldJoint.prototype.m_bias = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_bias", box2d.b2WeldJoint.prototype.m_bias);
box2d.b2WeldJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_localAnchorA", box2d.b2WeldJoint.prototype.m_localAnchorA);
box2d.b2WeldJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_localAnchorB", box2d.b2WeldJoint.prototype.m_localAnchorB);
box2d.b2WeldJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_referenceAngle", box2d.b2WeldJoint.prototype.m_referenceAngle);
box2d.b2WeldJoint.prototype.m_gamma = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_gamma", box2d.b2WeldJoint.prototype.m_gamma);
box2d.b2WeldJoint.prototype.m_impulse = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_impulse", box2d.b2WeldJoint.prototype.m_impulse);
box2d.b2WeldJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_indexA", box2d.b2WeldJoint.prototype.m_indexA);
box2d.b2WeldJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_indexB", box2d.b2WeldJoint.prototype.m_indexB);
box2d.b2WeldJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_rA", box2d.b2WeldJoint.prototype.m_rA);
box2d.b2WeldJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_rB", box2d.b2WeldJoint.prototype.m_rB);
box2d.b2WeldJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_localCenterA", box2d.b2WeldJoint.prototype.m_localCenterA);
box2d.b2WeldJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_localCenterB", box2d.b2WeldJoint.prototype.m_localCenterB);
box2d.b2WeldJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_invMassA", box2d.b2WeldJoint.prototype.m_invMassA);
box2d.b2WeldJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_invMassB", box2d.b2WeldJoint.prototype.m_invMassB);
box2d.b2WeldJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_invIA", box2d.b2WeldJoint.prototype.m_invIA);
box2d.b2WeldJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_invIB", box2d.b2WeldJoint.prototype.m_invIB);
box2d.b2WeldJoint.prototype.m_mass = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_mass", box2d.b2WeldJoint.prototype.m_mass);
box2d.b2WeldJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_qA", box2d.b2WeldJoint.prototype.m_qA);
box2d.b2WeldJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_qB", box2d.b2WeldJoint.prototype.m_qB);
box2d.b2WeldJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_lalcA", box2d.b2WeldJoint.prototype.m_lalcA);
box2d.b2WeldJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_lalcB", box2d.b2WeldJoint.prototype.m_lalcB);
box2d.b2WeldJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_K", box2d.b2WeldJoint.prototype.m_K);
box2d.b2WeldJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].a,
    c = a.velocities[this.m_indexA].v,
    e = a.velocities[this.m_indexA].w,
    d = a.positions[this.m_indexB].a,
    f = a.velocities[this.m_indexB].v,
    g = a.velocities[this.m_indexB].w,
    h = this.m_qA.SetAngleRadians(b),
    j = this.m_qB.SetAngleRadians(d);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2MulRV(h, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2MulRV(j, this.m_lalcB, this.m_rB);
  var h = this.m_invMassA,
    j = this.m_invMassB,
    i = this.m_invIA,
    k = this.m_invIB,
    l = this.m_K;
  l.ex.x = h + j + this.m_rA.y * this.m_rA.y * i + this.m_rB.y *
    this.m_rB.y * k;
  l.ey.x = -this.m_rA.y * this.m_rA.x * i - this.m_rB.y * this.m_rB.x * k;
  l.ez.x = -this.m_rA.y * i - this.m_rB.y * k;
  l.ex.y = l.ey.x;
  l.ey.y = h + j + this.m_rA.x * this.m_rA.x * i + this.m_rB.x * this.m_rB.x * k;
  l.ez.y = this.m_rA.x * i + this.m_rB.x * k;
  l.ex.z = l.ez.x;
  l.ey.z = l.ez.y;
  l.ez.z = i + k;
  if (0 < this.m_frequencyHz) {
    l.GetInverse22(this.m_mass);
    var l = i + k,
      m = 0 < l ? 1 / l : 0,
      b = d - b - this.m_referenceAngle,
      d = 2 * box2d.b2_pi * this.m_frequencyHz,
      n = m * d * d,
      o = a.step.dt;
    this.m_gamma = o * (2 * m * this.m_dampingRatio * d + o * n);
    this.m_gamma = 0 != this.m_gamma ? 1 / this.m_gamma :
      0;
    this.m_bias = b * o * n * this.m_gamma;
    l += this.m_gamma;
    this.m_mass.ez.z = 0 != l ? 1 / l : 0
  } else l.GetSymInverse33(this.m_mass), this.m_bias = this.m_gamma = 0;
  a.step.warmStarting ? (this.m_impulse.SelfMul(a.step.dtRatio), l = box2d.b2WeldJoint.prototype.InitVelocityConstraints.s_P.SetXY(this.m_impulse.x, this.m_impulse.y), c.SelfMulSub(h, l), e -= i * (box2d.b2CrossVV(this.m_rA, l) + this.m_impulse.z), f.SelfMulAdd(j, l), g += k * (box2d.b2CrossVV(this.m_rB, l) + this.m_impulse.z)) : this.m_impulse.SetZero();
  a.velocities[this.m_indexA].w = e;
  a.velocities[this.m_indexB].w =
    g
};
box2d.b2WeldJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    j = this.m_invIB;
  if (0 < this.m_frequencyHz) {
    var i = -this.m_mass.ez.z * (d - c + this.m_bias + this.m_gamma * this.m_impulse.z);
    this.m_impulse.z += i;
    c -= h * i;
    d += j * i;
    i = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1),
      box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1);
    i = box2d.b2MulM33XY(this.m_mass, i.x, i.y, box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse1).SelfNeg();
    this.m_impulse.x += i.x;
    this.m_impulse.y += i.y;
    b.SelfMulSub(f, i);
    c -= h * box2d.b2CrossVV(this.m_rA, i);
    e.SelfMulAdd(g, i);
    d += j * box2d.b2CrossVV(this.m_rB, i)
  } else {
    var i = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1), box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1),
      k = box2d.b2MulM33XYZ(this.m_mass, i.x, i.y, d - c, box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse).SelfNeg();
    this.m_impulse.SelfAdd(k);
    i = box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_P.SetXY(k.x, k.y);
    b.SelfMulSub(f, i);
    c -= h * (box2d.b2CrossVV(this.m_rA, i) + k.z);
    e.SelfMulAdd(g, i);
    d += j * (box2d.b2CrossVV(this.m_rB, i) + k.z)
  }
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "SolveVelocityConstraints", box2d.b2WeldJoint.prototype.SolveVelocityConstraints);
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1 = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse1 = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec3;
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolvePositionConstraints = function(a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.positions[this.m_indexB].c,
    d = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngleRadians(c),
    g = this.m_qB.SetAngleRadians(d),
    h = this.m_invMassA,
    j = this.m_invMassB,
    i = this.m_invIA,
    k = this.m_invIB;
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  var l = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var m = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
    n = this.m_K;
  n.ex.x = h + j + l.y * l.y * i + m.y * m.y * k;
  n.ey.x = -l.y * l.x * i - m.y * m.x * k;
  n.ez.x = -l.y * i - m.y * k;
  n.ex.y = n.ey.x;
  n.ey.y = h + j + l.x * l.x * i + m.x * m.x * k;
  n.ez.y = l.x * i + m.x * k;
  n.ex.z = n.ez.x;
  n.ey.z = n.ez.y;
  n.ez.z = i + k;
  if (0 < this.m_frequencyHz) {
    var o = box2d.b2SubVV(box2d.b2AddVV(e, m, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, l, box2d.b2Vec2.s_t1), box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1),
      g = o.GetLength(),
      f = 0,
      n = n.Solve22(o.x, o.y, box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P).SelfNeg();
    b.SelfMulSub(h, n);
    c -= i * box2d.b2CrossVV(l, n);
    e.SelfMulAdd(j, n);
    d += k * box2d.b2CrossVV(m, n)
  } else o = box2d.b2SubVV(box2d.b2AddVV(e, m, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, l, box2d.b2Vec2.s_t1), box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1), l = d - c - this.m_referenceAngle, g = o.GetLength(), f = box2d.b2Abs(l), l = n.Solve33(o.x, o.y, l, box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_impulse).SelfNeg(), n = box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P.SetXY(l.x, l.y), b.SelfMulSub(h, n), c -= i * (box2d.b2CrossVV(this.m_rA,
    n) + l.z), e.SelfMulAdd(j, n), d += k * (box2d.b2CrossVV(this.m_rB, n) + l.z);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = d;
  return g <= box2d.b2_linearSlop && f <= box2d.b2_angularSlop
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "SolvePositionConstraints", box2d.b2WeldJoint.prototype.SolvePositionConstraints);
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1 = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec3;
box2d.b2WeldJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetAnchorA", box2d.b2WeldJoint.prototype.GetAnchorA);
box2d.b2WeldJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetAnchorB", box2d.b2WeldJoint.prototype.GetAnchorB);
box2d.b2WeldJoint.prototype.GetReactionForce = function(a, b) {
  return b.SetXY(a * this.m_impulse.x, a * this.m_impulse.y)
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetReactionForce", box2d.b2WeldJoint.prototype.GetReactionForce);
box2d.b2WeldJoint.prototype.GetReactionTorque = function(a) {
  return a * this.m_impulse.z
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetReactionTorque", box2d.b2WeldJoint.prototype.GetReactionTorque);
box2d.b2WeldJoint.prototype.GetLocalAnchorA = function() {
  return this.m_localAnchorA
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetLocalAnchorA", box2d.b2WeldJoint.prototype.GetLocalAnchorA);
box2d.b2WeldJoint.prototype.GetLocalAnchorB = function() {
  return this.m_localAnchorB
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetLocalAnchorB", box2d.b2WeldJoint.prototype.GetLocalAnchorB);
box2d.b2WeldJoint.prototype.GetReferenceAngle = function() {
  return this.m_referenceAngle
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetReferenceAngle", box2d.b2WeldJoint.prototype.GetReferenceAngle);
box2d.b2WeldJoint.prototype.SetFrequency = function(a) {
  this.m_frequencyHz = a
};
box2d.b2WeldJoint.prototype.GetFrequency = function() {
  return this.m_frequencyHz
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetFrequency", box2d.b2WeldJoint.prototype.GetFrequency);
box2d.b2WeldJoint.prototype.SetDampingRatio = function(a) {
  this.m_dampingRatio = a
};
box2d.b2WeldJoint.prototype.GetDampingRatio = function() {
  return this.m_dampingRatio
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetDampingRatio", box2d.b2WeldJoint.prototype.GetDampingRatio);
box2d.b2WeldJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2WeldJointDef*/ var jd = new box2d.b2WeldJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
    box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
      this.m_localAnchorB.x, this.m_localAnchorB.y);
    box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
    box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
    box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "Dump", box2d.b2WeldJoint.prototype.Dump);
box2d.b2RopeJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_ropeJoint);
  this.localAnchorA = new box2d.b2Vec2(-1, 0);
  this.localAnchorB = new box2d.b2Vec2(1, 0)
};
goog.inherits(box2d.b2RopeJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2RopeJointDef", box2d.b2RopeJointDef);
box2d.b2RopeJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2RopeJointDef.prototype, "localAnchorA", box2d.b2RopeJointDef.prototype.localAnchorA);
box2d.b2RopeJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2RopeJointDef.prototype, "localAnchorB", box2d.b2RopeJointDef.prototype.localAnchorB);
box2d.b2RopeJointDef.prototype.maxLength = 0;
goog.exportProperty(box2d.b2RopeJointDef.prototype, "maxLength", box2d.b2RopeJointDef.prototype.maxLength);
box2d.b2RopeJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_maxLength = a.maxLength;
  this.m_u = new box2d.b2Vec2;
  this.m_rA = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2;
  this.m_localCenterA = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_qA = new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcA = new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2
};
goog.inherits(box2d.b2RopeJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2RopeJoint", box2d.b2RopeJoint);
box2d.b2RopeJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_localAnchorA", box2d.b2RopeJoint.prototype.m_localAnchorA);
box2d.b2RopeJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_localAnchorB", box2d.b2RopeJoint.prototype.m_localAnchorB);
box2d.b2RopeJoint.prototype.m_maxLength = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_maxLength", box2d.b2RopeJoint.prototype.m_maxLength);
box2d.b2RopeJoint.prototype.m_length = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_length", box2d.b2RopeJoint.prototype.m_length);
box2d.b2RopeJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_impulse", box2d.b2RopeJoint.prototype.m_impulse);
box2d.b2RopeJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_indexA", box2d.b2RopeJoint.prototype.m_indexA);
box2d.b2RopeJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_indexB", box2d.b2RopeJoint.prototype.m_indexB);
box2d.b2RopeJoint.prototype.m_u = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_u", box2d.b2RopeJoint.prototype.m_u);
box2d.b2RopeJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_rA", box2d.b2RopeJoint.prototype.m_rA);
box2d.b2RopeJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_rB", box2d.b2RopeJoint.prototype.m_rB);
box2d.b2RopeJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_localCenterA", box2d.b2RopeJoint.prototype.m_localCenterA);
box2d.b2RopeJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_localCenterB", box2d.b2RopeJoint.prototype.m_localCenterB);
box2d.b2RopeJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_invMassA", box2d.b2RopeJoint.prototype.m_invMassA);
box2d.b2RopeJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_invMassB", box2d.b2RopeJoint.prototype.m_invMassB);
box2d.b2RopeJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_invIA", box2d.b2RopeJoint.prototype.m_invIA);
box2d.b2RopeJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_invIB", box2d.b2RopeJoint.prototype.m_invIB);
box2d.b2RopeJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_mass", box2d.b2RopeJoint.prototype.m_mass);
box2d.b2RopeJoint.prototype.m_state = box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_state", box2d.b2RopeJoint.prototype.m_state);
box2d.b2RopeJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_qA", box2d.b2RopeJoint.prototype.m_qA);
box2d.b2RopeJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_qB", box2d.b2RopeJoint.prototype.m_qB);
box2d.b2RopeJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_lalcA", box2d.b2RopeJoint.prototype.m_lalcA);
box2d.b2RopeJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_lalcB", box2d.b2RopeJoint.prototype.m_lalcB);
box2d.b2RopeJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.velocities[this.m_indexA].v,
    e = a.velocities[this.m_indexA].w,
    d = a.positions[this.m_indexB].c,
    f = a.positions[this.m_indexB].a,
    g = a.velocities[this.m_indexB].v,
    h = a.velocities[this.m_indexB].w,
    j = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
    f = this.m_qB.SetAngleRadians(f);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2MulRV(j, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2MulRV(f, this.m_lalcB, this.m_rB);
  this.m_u.Copy(d).SelfAdd(this.m_rB).SelfSub(b).SelfSub(this.m_rA);
  this.m_length =
    this.m_u.GetLength();
  this.m_state = 0 < this.m_length - this.m_maxLength ? box2d.b2LimitState.e_atUpperLimit : box2d.b2LimitState.e_inactiveLimit;
  this.m_length > box2d.b2_linearSlop ? (this.m_u.SelfMul(1 / this.m_length), b = box2d.b2CrossVV(this.m_rA, this.m_u), d = box2d.b2CrossVV(this.m_rB, this.m_u), b = this.m_invMassA + this.m_invIA * b * b + this.m_invMassB + this.m_invIB * d * d, this.m_mass = 0 != b ? 1 / b : 0, a.step.warmStarting ? (this.m_impulse *= a.step.dtRatio, b = box2d.b2MulSV(this.m_impulse, this.m_u, box2d.b2RopeJoint.prototype.InitVelocityConstraints.s_P),
    c.SelfMulSub(this.m_invMassA, b), e -= this.m_invIA * box2d.b2CrossVV(this.m_rA, b), g.SelfMulAdd(this.m_invMassB, b), h += this.m_invIB * box2d.b2CrossVV(this.m_rB, b)) : this.m_impulse = 0, a.velocities[this.m_indexA].w = e, a.velocities[this.m_indexB].w = h) : (this.m_u.SetZero(), this.m_impulse = this.m_mass = 0)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "InitVelocityConstraints", box2d.b2RopeJoint.prototype.InitVelocityConstraints);
box2d.b2RopeJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpA),
    g = box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpB),
    h = this.m_length - this.m_maxLength,
    f = box2d.b2DotVV(this.m_u, box2d.b2SubVV(g, f, box2d.b2Vec2.s_t0));
  0 > h && (f += a.step.inv_dt *
    h);
  h = -this.m_mass * f;
  f = this.m_impulse;
  this.m_impulse = box2d.b2Min(0, this.m_impulse + h);
  h = this.m_impulse - f;
  h = box2d.b2MulSV(h, this.m_u, box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_P);
  b.SelfMulSub(this.m_invMassA, h);
  c -= this.m_invIA * box2d.b2CrossVV(this.m_rA, h);
  e.SelfMulAdd(this.m_invMassB, h);
  d += this.m_invIB * box2d.b2CrossVV(this.m_rB, h);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "SolveVelocityConstraints", box2d.b2RopeJoint.prototype.SolveVelocityConstraints);
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.SolvePositionConstraints = function(a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.positions[this.m_indexB].c,
    d = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngleRadians(c),
    g = this.m_qB.SetAngleRadians(d);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  f = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var g = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
    h = this.m_u.Copy(e).SelfAdd(g).SelfSub(b).SelfSub(f),
    j = h.Normalize(),
    i = j - this.m_maxLength,
    i = box2d.b2Clamp(i, 0, box2d.b2_maxLinearCorrection),
    h = box2d.b2MulSV(-this.m_mass * i, h, box2d.b2RopeJoint.prototype.SolvePositionConstraints.s_P);
  b.SelfMulSub(this.m_invMassA, h);
  c -= this.m_invIA * box2d.b2CrossVV(f, h);
  e.SelfMulAdd(this.m_invMassB, h);
  d += this.m_invIB * box2d.b2CrossVV(g, h);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = d;
  return j - this.m_maxLength < box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "SolvePositionConstraints", box2d.b2RopeJoint.prototype.SolvePositionConstraints);
box2d.b2RopeJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetAnchorA", box2d.b2RopeJoint.prototype.GetAnchorA);
box2d.b2RopeJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetAnchorB", box2d.b2RopeJoint.prototype.GetAnchorB);
box2d.b2RopeJoint.prototype.GetReactionForce = function(a, b) {
  return box2d.b2MulSV(a * this.m_impulse, this.m_u, b)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetReactionForce", box2d.b2RopeJoint.prototype.GetReactionForce);
box2d.b2RopeJoint.prototype.GetReactionTorque = function() {
  return 0
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetReactionTorque", box2d.b2RopeJoint.prototype.GetReactionTorque);
box2d.b2RopeJoint.prototype.GetLocalAnchorA = function() {
  return this.m_localAnchorA
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetLocalAnchorA", box2d.b2RopeJoint.prototype.GetLocalAnchorA);
box2d.b2RopeJoint.prototype.GetLocalAnchorB = function() {
  return this.m_localAnchorB
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetLocalAnchorB", box2d.b2RopeJoint.prototype.GetLocalAnchorB);
box2d.b2RopeJoint.prototype.SetMaxLength = function(a) {
  this.m_maxLength = a
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "SetMaxLength", box2d.b2RopeJoint.prototype.SetMaxLength);
box2d.b2RopeJoint.prototype.GetMaxLength = function() {
  return this.m_maxLength
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetMaxLength", box2d.b2RopeJoint.prototype.GetMaxLength);
box2d.b2RopeJoint.prototype.GetLimitState = function() {
  return this.m_state
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetLimitState", box2d.b2RopeJoint.prototype.GetLimitState);
box2d.b2RopeJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2RopeJointDef*/ var jd = new box2d.b2RopeJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
    box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
      this.m_localAnchorB.x, this.m_localAnchorB.y);
    box2d.b2Log("  jd.maxLength = %.15f;\n", this.m_maxLength);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "Dump", box2d.b2RopeJoint.prototype.Dump);




box2d.b2GravityController = function() {
  box2d.b2Controller.call(this)
};
goog.inherits(box2d.b2GravityController, box2d.b2Controller);
goog.exportSymbol("box2d.b2GravityController", box2d.b2GravityController);
box2d.b2GravityController.prototype.G = 1;
goog.exportProperty(box2d.b2GravityController.prototype, "G", box2d.b2GravityController.prototype.G);
box2d.b2GravityController.prototype.invSqr = !0;
goog.exportProperty(box2d.b2GravityController.prototype, "invSqr", box2d.b2GravityController.prototype.invSqr);
box2d.b2GravityController.prototype.Step = function() {
  if (this.invSqr)
    for (var a = this.m_bodyList; a; a = a.nextBody)
      for (var b = a.body, c = b.GetWorldCenter(), e = b.GetMass(), d = this.m_bodyList; d != a; d = d.nextBody) {
        var f = d.body,
          g = f.GetWorldCenter(),
          h = f.GetMass(),
          j = g.x - c.x,
          i = g.y - c.y,
          k = j * j + i * i;
        k < box2d.b2_epsilon || (j = box2d.b2GravityController.prototype.Step.s_f.SetXY(j, i), j.SelfMul(this.G / k / box2d.b2Sqrt(k) * e * h), b.IsAwake() && b.ApplyForce(j, c), f.IsAwake() && f.ApplyForce(j.SelfMul(-1), g))
      } else
        for (a = this.m_bodyList; a; a = a.nextBody) {
          b =
            a.body;
          c = b.GetWorldCenter();
          e = b.GetMass();
          for (d = this.m_bodyList; d != a; d = d.nextBody) f = d.body, g = f.GetWorldCenter(), h = f.GetMass(), j = g.x - c.x, i = g.y - c.y, k = j * j + i * i, k < box2d.b2_epsilon || (j = box2d.b2GravityController.prototype.Step.s_f.SetXY(j, i), j.SelfMul(this.G / k * e * h), b.IsAwake() && b.ApplyForce(j, c), f.IsAwake() && f.ApplyForce(j.SelfMul(-1), g))
        }
};
goog.exportProperty(box2d.b2GravityController.prototype, "Step", box2d.b2GravityController.prototype.Step);
box2d.b2GravityController.prototype.Step.s_f = new box2d.b2Vec2;
box2d.b2Profile = function() {};
goog.exportSymbol("box2d.b2Profile", box2d.b2Profile);
box2d.b2Profile.prototype.step = 0;
goog.exportProperty(box2d.b2Profile.prototype, "step", box2d.b2Profile.prototype.step);
box2d.b2Profile.prototype.collide = 0;
goog.exportProperty(box2d.b2Profile.prototype, "collide", box2d.b2Profile.prototype.collide);
box2d.b2Profile.prototype.solve = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solve", box2d.b2Profile.prototype.solve);
box2d.b2Profile.prototype.solveInit = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solveInit", box2d.b2Profile.prototype.solveInit);
box2d.b2Profile.prototype.solveVelocity = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solveVelocity", box2d.b2Profile.prototype.solveVelocity);
box2d.b2Profile.prototype.solvePosition = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solvePosition", box2d.b2Profile.prototype.solvePosition);
box2d.b2Profile.prototype.broadphase = 0;
goog.exportProperty(box2d.b2Profile.prototype, "broadphase", box2d.b2Profile.prototype.broadphase);
box2d.b2Profile.prototype.solveTOI = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solveTOI", box2d.b2Profile.prototype.solveTOI);
box2d.b2Profile.prototype.Reset = function() {
  this.solveTOI = this.broadphase = this.solvePosition = this.solveVelocity = this.solveInit = this.solve = this.collide = this.step = 0;
  return this
};
goog.exportProperty(box2d.b2Profile.prototype, "Reset", box2d.b2Profile.prototype.Reset);
box2d.b2TimeStep = function() {};
goog.exportSymbol("box2d.b2TimeStep", box2d.b2TimeStep);
box2d.b2TimeStep.prototype.dt = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "dt", box2d.b2TimeStep.prototype.dt);
box2d.b2TimeStep.prototype.inv_dt = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "inv_dt", box2d.b2TimeStep.prototype.inv_dt);
box2d.b2TimeStep.prototype.dtRatio = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "dtRatio", box2d.b2TimeStep.prototype.dtRatio);
box2d.b2TimeStep.prototype.velocityIterations = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "velocityIterations", box2d.b2TimeStep.prototype.velocityIterations);
box2d.b2TimeStep.prototype.positionIterations = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "positionIterations", box2d.b2TimeStep.prototype.positionIterations);
box2d.b2TimeStep.prototype.warmStarting = !1;
goog.exportProperty(box2d.b2TimeStep.prototype, "warmStarting", box2d.b2TimeStep.prototype.warmStarting);
box2d.b2TimeStep.prototype.Copy = function(a) {
  this.dt = a.dt;
  this.inv_dt = a.inv_dt;
  this.dtRatio = a.dtRatio;
  this.positionIterations = a.positionIterations;
  this.velocityIterations = a.velocityIterations;
  this.warmStarting = a.warmStarting;
  return this
};
goog.exportProperty(box2d.b2TimeStep.prototype, "Copy", box2d.b2TimeStep.prototype.Copy);
box2d.b2Position = function() {
  this.c = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Position", box2d.b2Position);
box2d.b2Position.prototype.c = null;
goog.exportProperty(box2d.b2Position.prototype, "c", box2d.b2Position.prototype.c);
box2d.b2Position.prototype.a = 0;
goog.exportProperty(box2d.b2Position.prototype, "a", box2d.b2Position.prototype.a);
box2d.b2Position.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2Position
  })
};
goog.exportProperty(box2d.b2Position, "MakeArray", box2d.b2Position.MakeArray);
box2d.b2Velocity = function() {
  this.v = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Velocity", box2d.b2Velocity);
box2d.b2Velocity.prototype.v = null;
goog.exportProperty(box2d.b2Velocity.prototype, "v", box2d.b2Velocity.prototype.v);
box2d.b2Velocity.prototype.w = 0;
goog.exportProperty(box2d.b2Velocity.prototype, "w", box2d.b2Velocity.prototype.w);
box2d.b2Velocity.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2Velocity
  })
};
goog.exportProperty(box2d.b2Velocity, "MakeArray", box2d.b2Velocity.MakeArray);
box2d.b2SolverData = function() {
  this.step = new box2d.b2TimeStep
};
goog.exportSymbol("box2d.b2SolverData", box2d.b2SolverData);
box2d.b2SolverData.prototype.step = null;
goog.exportProperty(box2d.b2SolverData.prototype, "step", box2d.b2SolverData.prototype.step);
box2d.b2SolverData.prototype.positions = null;
goog.exportProperty(box2d.b2SolverData.prototype, "positions", box2d.b2SolverData.prototype.positions);
box2d.b2SolverData.prototype.velocities = null;
goog.exportProperty(box2d.b2SolverData.prototype, "velocities", box2d.b2SolverData.prototype.velocities);
box2d.b2Collision = {};
box2d.b2ContactFeatureType = {
  e_vertex: 0,
  e_face: 1
};
goog.exportSymbol("box2d.b2ContactFeatureType", box2d.b2ContactFeatureType);
goog.exportProperty(box2d.b2ContactFeatureType, "e_vertex", box2d.b2ContactFeatureType.e_vertex);
goog.exportProperty(box2d.b2ContactFeatureType, "e_face", box2d.b2ContactFeatureType.e_face);
box2d.b2ContactFeature = function(a) {
  this._id = a
};
goog.exportSymbol("box2d.b2ContactFeature", box2d.b2ContactFeature);
box2d.b2ContactFeature.prototype._id = null;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_id", box2d.b2ContactFeature.prototype._id);
box2d.b2ContactFeature.prototype._indexA = 0;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_indexA", box2d.b2ContactFeature.prototype._indexA);
box2d.b2ContactFeature.prototype._indexB = 0;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_indexB", box2d.b2ContactFeature.prototype._indexB);
box2d.b2ContactFeature.prototype._typeA = 0;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_typeA", box2d.b2ContactFeature.prototype._typeA);
box2d.b2ContactFeature.prototype._typeB = 0;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_typeB", box2d.b2ContactFeature.prototype._typeB);
Object.defineProperty(box2d.b2ContactFeature.prototype, "indexA", {
  enumerable: !1,
  configurable: !0,
  get: function() {
    return this._indexA
  },
  set: function(a) {
    this._indexA = a;
    this._id._key = this._id._key & 4294967040 | this._indexA & 255
  }
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "indexB", {
  enumerable: !1,
  configurable: !0,
  get: function() {
    return this._indexB
  },
  set: function(a) {
    this._indexB = a;
    this._id._key = this._id._key & 4294902015 | this._indexB << 8 & 65280
  }
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "typeA", {
  enumerable: !1,
  configurable: !0,
  get: function() {
    return this._typeA
  },
  set: function(a) {
    this._typeA = a;
    this._id._key = this._id._key & 4278255615 | this._typeA << 16 & 16711680
  }
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "typeB", {
  enumerable: !1,
  configurable: !0,
  get: function() {
    return this._typeB
  },
  set: function(a) {
    this._typeB = a;
    this._id._key = this._id._key & 16777215 | this._typeB << 24 & 4278190080
  }
});
box2d.b2ContactID = function() {
  this.cf = new box2d.b2ContactFeature(this)
};
goog.exportSymbol("box2d.b2ContactID", box2d.b2ContactID);
box2d.b2ContactID.prototype.cf = null;
goog.exportProperty(box2d.b2ContactID.prototype, "cf", box2d.b2ContactID.prototype.cf);
box2d.b2ContactID.prototype.key = 0;
goog.exportProperty(box2d.b2ContactID.prototype, "key", box2d.b2ContactID.prototype.key);
box2d.b2ContactID.prototype.Copy = function(a) {
  this.key = a.key;
  return this
};
goog.exportProperty(box2d.b2ContactID.prototype, "Copy", box2d.b2ContactID.prototype.Copy);
box2d.b2ContactID.prototype.Clone = function() {
  return (new box2d.b2ContactID).Copy(this)
};
goog.exportProperty(box2d.b2ContactID.prototype, "Clone", box2d.b2ContactID.prototype.Clone);
Object.defineProperty(box2d.b2ContactID.prototype, "key", {
  enumerable: !1,
  configurable: !0,
  get: function() {
    return this._key
  },
  set: function(a) {
    this._key = a;
    this.cf._indexA = this._key & 255;
    this.cf._indexB = this._key >> 8 & 255;
    this.cf._typeA = this._key >> 16 & 255;
    this.cf._typeB = this._key >> 24 & 255
  }
});
box2d.b2ManifoldPoint = function() {
  this.localPoint = new box2d.b2Vec2;
  this.id = new box2d.b2ContactID
};
goog.exportSymbol("box2d.b2ManifoldPoint", box2d.b2ManifoldPoint);
box2d.b2ManifoldPoint.prototype.localPoint = null;
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "localPoint", box2d.b2ManifoldPoint.prototype.localPoint);
box2d.b2ManifoldPoint.prototype.normalImpulse = 0;
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "normalImpulse", box2d.b2ManifoldPoint.prototype.normalImpulse);
box2d.b2ManifoldPoint.prototype.tangentImpulse = 0;
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "tangentImpulse", box2d.b2ManifoldPoint.prototype.tangentImpulse);
box2d.b2ManifoldPoint.prototype.id = null;
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "id", box2d.b2ManifoldPoint.prototype.id);
box2d.b2ManifoldPoint.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2ManifoldPoint
  })
};
goog.exportProperty(box2d.b2ManifoldPoint, "MakeArray", box2d.b2ManifoldPoint.MakeArray);
box2d.b2ManifoldPoint.prototype.Reset = function() {
  this.localPoint.SetZero();
  this.tangentImpulse = this.normalImpulse = 0;
  this.id.key = 0
};
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "Reset", box2d.b2ManifoldPoint.prototype.Reset);
box2d.b2ManifoldPoint.prototype.Copy = function(a) {
  this.localPoint.Copy(a.localPoint);
  this.normalImpulse = a.normalImpulse;
  this.tangentImpulse = a.tangentImpulse;
  this.id.Copy(a.id);
  return this
};
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "Copy", box2d.b2ManifoldPoint.prototype.Copy);
box2d.b2ManifoldType = {
  e_unknown: -1,
  e_circles: 0,
  e_faceA: 1,
  e_faceB: 2
};
goog.exportSymbol("box2d.b2ManifoldType", box2d.b2ManifoldType);
goog.exportProperty(box2d.b2ManifoldType, "e_unknown", box2d.b2ManifoldType.e_unknown);
goog.exportProperty(box2d.b2ManifoldType, "e_circles", box2d.b2ManifoldType.e_circles);
goog.exportProperty(box2d.b2ManifoldType, "e_faceA", box2d.b2ManifoldType.e_faceA);
goog.exportProperty(box2d.b2ManifoldType, "e_faceB", box2d.b2ManifoldType.e_faceB);
box2d.b2Manifold = function() {
  this.points = box2d.b2ManifoldPoint.MakeArray(box2d.b2_maxManifoldPoints);
  this.localNormal = new box2d.b2Vec2;
  this.localPoint = new box2d.b2Vec2;
  this.type = box2d.b2ManifoldType.e_unknown;
  this.pointCount = 0
};
goog.exportSymbol("box2d.b2Manifold", box2d.b2Manifold);
box2d.b2Manifold.prototype.points = null;
goog.exportProperty(box2d.b2Manifold.prototype, "points", box2d.b2Manifold.prototype.points);
box2d.b2Manifold.prototype.localNormal = null;
goog.exportProperty(box2d.b2Manifold.prototype, "localNormal", box2d.b2Manifold.prototype.localNormal);
box2d.b2Manifold.prototype.localPoint = null;
goog.exportProperty(box2d.b2Manifold.prototype, "localPoint", box2d.b2Manifold.prototype.localPoint);
box2d.b2Manifold.prototype.type = box2d.b2ManifoldType.e_unknown;
goog.exportProperty(box2d.b2Manifold.prototype, "type", box2d.b2Manifold.prototype.type);
box2d.b2Manifold.prototype.pointCount = 0;
goog.exportProperty(box2d.b2Manifold.prototype, "pointCount", box2d.b2Manifold.prototype.pointCount);
box2d.b2Manifold.prototype.Reset = function() {
  for (var a = 0, b = box2d.b2_maxManifoldPoints; a < b; ++a) this.points[a].Reset();
  this.localNormal.SetZero();
  this.localPoint.SetZero();
  this.type = box2d.b2ManifoldType.e_unknown;
  this.pointCount = 0
};
goog.exportProperty(box2d.b2Manifold.prototype, "Reset", box2d.b2Manifold.prototype.Reset);
box2d.b2Manifold.prototype.Copy = function(a) {
  this.pointCount = a.pointCount;
  for (var b = 0, c = box2d.b2_maxManifoldPoints; b < c; ++b) this.points[b].Copy(a.points[b]);
  this.localNormal.Copy(a.localNormal);
  this.localPoint.Copy(a.localPoint);
  this.type = a.type;
  return this
};
goog.exportProperty(box2d.b2Manifold.prototype, "Copy", box2d.b2Manifold.prototype.Copy);
box2d.b2Manifold.prototype.Clone = function() {
  return (new box2d.b2Manifold).Copy(this)
};
goog.exportProperty(box2d.b2Manifold.prototype, "Clone", box2d.b2Manifold.prototype.Clone);
box2d.b2WorldManifold = function() {
  this.normal = new box2d.b2Vec2;
  this.points = box2d.b2Vec2.MakeArray(box2d.b2_maxManifoldPoints)
};
goog.exportSymbol("box2d.b2WorldManifold", box2d.b2WorldManifold);
box2d.b2WorldManifold.prototype.normal = null;
goog.exportProperty(box2d.b2WorldManifold.prototype, "normal", box2d.b2WorldManifold.prototype.normal);
box2d.b2WorldManifold.prototype.points = null;
goog.exportProperty(box2d.b2WorldManifold.prototype, "points", box2d.b2WorldManifold.prototype.points);
box2d.b2WorldManifold.prototype.Initialize = function(a, b, c, e, d) {
  if (0 != a.pointCount) switch (a.type) {
    case box2d.b2ManifoldType.e_circles:
      this.normal.SetXY(1, 0);
      b = box2d.b2MulXV(b, a.localPoint, box2d.b2WorldManifold.prototype.Initialize.s_pointA);
      a = box2d.b2MulXV(e, a.points[0].localPoint, box2d.b2WorldManifold.prototype.Initialize.s_pointB);
      box2d.b2DistanceSquaredVV(b, a) > box2d.b2_epsilon_sq && box2d.b2SubVV(a, b, this.normal).SelfNormalize();
      var f = box2d.b2AddVMulSV(b, c, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cA),
        g = box2d.b2AddVMulSV(a, d, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cB);
      box2d.b2MidVV(f, g, this.points[0]);
      break;
    case box2d.b2ManifoldType.e_faceA:
      box2d.b2MulRV(b.q, a.localNormal, this.normal);
      for (var h = box2d.b2MulXV(b, a.localPoint, box2d.b2WorldManifold.prototype.Initialize.s_planePoint), j = 0, i = a.pointCount; j < i; ++j) {
        var k = box2d.b2MulXV(e, a.points[j].localPoint, box2d.b2WorldManifold.prototype.Initialize.s_clipPoint),
          f = c - box2d.b2DotVV(box2d.b2SubVV(k, h, box2d.b2Vec2.s_t0), this.normal),
          f = box2d.b2AddVMulSV(k,
            f, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cA),
          g = box2d.b2SubVMulSV(k, d, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cB);
        box2d.b2MidVV(f, g, this.points[j])
      }
      break;
    case box2d.b2ManifoldType.e_faceB:
      box2d.b2MulRV(e.q, a.localNormal, this.normal);
      h = box2d.b2MulXV(e, a.localPoint, box2d.b2WorldManifold.prototype.Initialize.s_planePoint);
      j = 0;
      for (i = a.pointCount; j < i; ++j) k = box2d.b2MulXV(b, a.points[j].localPoint, box2d.b2WorldManifold.prototype.Initialize.s_clipPoint), f = d - box2d.b2DotVV(box2d.b2SubVV(k,
        h, box2d.b2Vec2.s_t0), this.normal), g = box2d.b2AddVMulSV(k, f, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cB), f = box2d.b2SubVMulSV(k, c, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cA), box2d.b2MidVV(f, g, this.points[j]);
      this.normal.SelfNeg()
  }
};
goog.exportProperty(box2d.b2WorldManifold.prototype, "Initialize", box2d.b2WorldManifold.prototype.Initialize);
box2d.b2WorldManifold.prototype.Initialize.s_pointA = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_pointB = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_cA = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_cB = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_planePoint = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_clipPoint = new box2d.b2Vec2;
box2d.b2PointState = {
  b2_nullState: 0,
  b2_addState: 1,
  b2_persistState: 2,
  b2_removeState: 3
};
goog.exportSymbol("box2d.b2PointState", box2d.b2PointState);
goog.exportProperty(box2d.b2PointState, "b2_nullState   ", box2d.b2PointState.b2_nullState);
goog.exportProperty(box2d.b2PointState, "b2_addState    ", box2d.b2PointState.b2_addState);
goog.exportProperty(box2d.b2PointState, "b2_persistState", box2d.b2PointState.b2_persistState);
goog.exportProperty(box2d.b2PointState, "b2_removeState ", box2d.b2PointState.b2_removeState);
box2d.b2GetPointStates = function(a, b, c, e) {
  for (var d = 0, f = c.pointCount; d < f; ++d) {
    var g = c.points[d].id,
      g = g.key;
    a[d] = box2d.b2PointState.b2_removeState;
    for (var h = 0, j = e.pointCount; h < j; ++h)
      if (e.points[h].id.key == g) {
        a[d] = box2d.b2PointState.b2_persistState;
        break
      }
  }
  for (f = box2d.b2_maxManifoldPoints; d < f; ++d) a[d] = box2d.b2PointState.b2_nullState;
  d = 0;
  for (f = e.pointCount; d < f; ++d) {
    g = e.points[d].id;
    g = g.key;
    b[d] = box2d.b2PointState.b2_addState;
    h = 0;
    for (j = c.pointCount; h < j; ++h)
      if (c.points[h].id.key == g) {
        b[d] = box2d.b2PointState.b2_persistState;
        break
      }
  }
  for (f = box2d.b2_maxManifoldPoints; d < f; ++d) b[d] = box2d.b2PointState.b2_nullState
};
goog.exportSymbol("box2d.b2GetPointStates", box2d.b2GetPointStates);
box2d.b2ClipVertex = function() {
  this.v = new box2d.b2Vec2;
  this.id = new box2d.b2ContactID
};
goog.exportSymbol("box2d.b2ClipVertex", box2d.b2ClipVertex);
box2d.b2ClipVertex.prototype.v = null;
goog.exportProperty(box2d.b2ClipVertex.prototype, "v", box2d.b2ClipVertex.prototype.v);
box2d.b2ClipVertex.prototype.id = null;
goog.exportProperty(box2d.b2ClipVertex.prototype, "id", box2d.b2ClipVertex.prototype.id);
box2d.b2ClipVertex.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2ClipVertex
  })
};
goog.exportProperty(box2d.b2ClipVertex, "MakeArray", box2d.b2ClipVertex.MakeArray);
box2d.b2ClipVertex.prototype.Copy = function(a) {
  this.v.Copy(a.v);
  this.id.Copy(a.id);
  return this
};
goog.exportProperty(box2d.b2ClipVertex.prototype, "Copy", box2d.b2ClipVertex.prototype.Copy);
box2d.b2RayCastInput = function() {
  this.p1 = new box2d.b2Vec2;
  this.p2 = new box2d.b2Vec2;
  this.maxFraction = 1
};
goog.exportSymbol("box2d.b2RayCastInput", box2d.b2RayCastInput);
box2d.b2RayCastInput.prototype.p1 = null;
goog.exportProperty(box2d.b2RayCastInput.prototype, "p1", box2d.b2RayCastInput.prototype.p1);
box2d.b2RayCastInput.prototype.p2 = null;
goog.exportProperty(box2d.b2RayCastInput.prototype, "p2", box2d.b2RayCastInput.prototype.p2);
box2d.b2RayCastInput.prototype.maxFraction = 1;
goog.exportProperty(box2d.b2RayCastInput.prototype, "maxFraction", box2d.b2RayCastInput.prototype.maxFraction);
box2d.b2RayCastInput.prototype.Copy = function(a) {
  this.p1.Copy(a.p1);
  this.p2.Copy(a.p2);
  this.maxFraction = a.maxFraction;
  return this
};
goog.exportProperty(box2d.b2RayCastInput.prototype, "Copy", box2d.b2RayCastInput.prototype.Copy);
box2d.b2RayCastOutput = function() {
  this.normal = new box2d.b2Vec2;
  this.fraction = 0
};
goog.exportSymbol("box2d.b2RayCastOutput", box2d.b2RayCastOutput);
box2d.b2RayCastOutput.prototype.normal = null;
goog.exportProperty(box2d.b2RayCastOutput.prototype, "normal", box2d.b2RayCastOutput.prototype.normal);
box2d.b2RayCastOutput.prototype.fraction = 0;
goog.exportProperty(box2d.b2RayCastOutput.prototype, "fraction", box2d.b2RayCastOutput.prototype.fraction);
box2d.b2RayCastOutput.prototype.Copy = function(a) {
  this.normal.Copy(a.normal);
  this.fraction = a.fraction;
  return this
};
goog.exportProperty(box2d.b2RayCastOutput.prototype, "Copy", box2d.b2RayCastOutput.prototype.Copy);
box2d.b2AABB = function() {
  this.lowerBound = new box2d.b2Vec2;
  this.upperBound = new box2d.b2Vec2;
  this.m_cache_center = new box2d.b2Vec2;
  this.m_cache_extent = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2AABB", box2d.b2AABB);
box2d.b2AABB.prototype.lowerBound = null;
goog.exportProperty(box2d.b2AABB.prototype, "lowerBound", box2d.b2AABB.prototype.lowerBound);
box2d.b2AABB.prototype.upperBound = null;
goog.exportProperty(box2d.b2AABB.prototype, "upperBound", box2d.b2AABB.prototype.upperBound);
box2d.b2AABB.prototype.m_cache_center = null;
goog.exportProperty(box2d.b2AABB.prototype, "m_cache_center", box2d.b2AABB.prototype.m_cache_center);
box2d.b2AABB.prototype.m_cache_extent = null;
goog.exportProperty(box2d.b2AABB.prototype, "m_cache_extent", box2d.b2AABB.prototype.m_cache_extent);
box2d.b2AABB.prototype.Copy = function(a) {
  this.lowerBound.Copy(a.lowerBound);
  this.upperBound.Copy(a.upperBound);
  return this
};
goog.exportProperty(box2d.b2AABB.prototype, "Copy", box2d.b2AABB.prototype.Copy);
box2d.b2AABB.prototype.IsValid = function() {
  var a = this.upperBound.y - this.lowerBound.y;
  return a = (a = 0 <= this.upperBound.x - this.lowerBound.x && 0 <= a) && this.lowerBound.IsValid() && this.upperBound.IsValid()
};
goog.exportProperty(box2d.b2AABB.prototype, "IsValid", box2d.b2AABB.prototype.IsValid);
box2d.b2AABB.prototype.GetCenter = function() {
  return box2d.b2MidVV(this.lowerBound, this.upperBound, this.m_cache_center)
};
goog.exportProperty(box2d.b2AABB.prototype, "GetCenter", box2d.b2AABB.prototype.GetCenter);
box2d.b2AABB.prototype.GetExtents = function() {
  return box2d.b2ExtVV(this.lowerBound, this.upperBound, this.m_cache_extent)
};
goog.exportProperty(box2d.b2AABB.prototype, "GetExtents", box2d.b2AABB.prototype.GetExtents);
box2d.b2AABB.prototype.GetPerimeter = function() {
  return 2 * (this.upperBound.x - this.lowerBound.x + (this.upperBound.y - this.lowerBound.y))
};
goog.exportProperty(box2d.b2AABB.prototype, "GetPerimeter", box2d.b2AABB.prototype.GetPerimeter);
box2d.b2AABB.prototype.Combine1 = function(a) {
  this.lowerBound.x = box2d.b2Min(this.lowerBound.x, a.lowerBound.x);
  this.lowerBound.y = box2d.b2Min(this.lowerBound.y, a.lowerBound.y);
  this.upperBound.x = box2d.b2Max(this.upperBound.x, a.upperBound.x);
  this.upperBound.y = box2d.b2Max(this.upperBound.y, a.upperBound.y);
  return this
};
goog.exportProperty(box2d.b2AABB.prototype, "Combine1", box2d.b2AABB.prototype.Combine1);
box2d.b2AABB.prototype.Combine2 = function(a, b) {
  this.lowerBound.x = box2d.b2Min(a.lowerBound.x, b.lowerBound.x);
  this.lowerBound.y = box2d.b2Min(a.lowerBound.y, b.lowerBound.y);
  this.upperBound.x = box2d.b2Max(a.upperBound.x, b.upperBound.x);
  this.upperBound.y = box2d.b2Max(a.upperBound.y, b.upperBound.y);
  return this
};
goog.exportProperty(box2d.b2AABB.prototype, "Combine2", box2d.b2AABB.prototype.Combine2);
box2d.b2AABB.Combine = function(a, b, c) {
  c.Combine2(a, b);
  return c
};
goog.exportProperty(box2d.b2AABB, "Combine", box2d.b2AABB.Combine);
box2d.b2AABB.prototype.Contains = function(a) {
  var b;
  return b = (b = (b = (b = this.lowerBound.x <= a.lowerBound.x) && this.lowerBound.y <= a.lowerBound.y) && a.upperBound.x <= this.upperBound.x) && a.upperBound.y <= this.upperBound.y
};
goog.exportProperty(box2d.b2AABB.prototype, "Contains", box2d.b2AABB.prototype.Contains);
box2d.b2AABB.prototype.RayCast = function(a, b) {
  var c = -box2d.b2_maxFloat,
    e = box2d.b2_maxFloat,
    d = b.p1.x,
    f = b.p1.y,
    g = b.p2.x - b.p1.x,
    h = b.p2.y - b.p1.y,
    j = box2d.b2Abs(g),
    i = box2d.b2Abs(h),
    k = a.normal;
  if (j < box2d.b2_epsilon) {
    if (d < this.lowerBound.x || this.upperBound.x < d) return !1
  } else if (j = 1 / g, g = (this.lowerBound.x - d) * j, d = (this.upperBound.x - d) * j, j = -1, g > d && (j = g, g = d, d = j, j = 1), g > c && (k.x = j, k.y = 0, c = g), e = box2d.b2Min(e, d), c > e) return !1;
  if (i < box2d.b2_epsilon) {
    if (f < this.lowerBound.y || this.upperBound.y < f) return !1
  } else if (j = 1 / h, g =
    (this.lowerBound.y - f) * j, d = (this.upperBound.y - f) * j, j = -1, g > d && (j = g, g = d, d = j, j = 1), g > c && (k.x = 0, k.y = j, c = g), e = box2d.b2Min(e, d), c > e) return !1;
  if (0 > c || b.maxFraction < c) return !1;
  a.fraction = c;
  return !0
};
goog.exportProperty(box2d.b2AABB.prototype, "RayCast", box2d.b2AABB.prototype.RayCast);
box2d.b2AABB.prototype.TestOverlap = function(a) {
  var b = a.lowerBound.y - this.upperBound.y,
    c = this.lowerBound.y - a.upperBound.y;
  return 0 < a.lowerBound.x - this.upperBound.x || 0 < b || 0 < this.lowerBound.x - a.upperBound.x || 0 < c ? !1 : !0
};
goog.exportProperty(box2d.b2AABB.prototype, "TestOverlap", box2d.b2AABB.prototype.TestOverlap);
box2d.b2TestOverlapAABB = function(a, b) {
  var c = b.lowerBound.y - a.upperBound.y,
    e = a.lowerBound.y - b.upperBound.y;
  return 0 < b.lowerBound.x - a.upperBound.x || 0 < c || 0 < a.lowerBound.x - b.upperBound.x || 0 < e ? !1 : !0
};
goog.exportSymbol("box2d.b2TestOverlapAABB", box2d.b2TestOverlapAABB);
box2d.b2ClipSegmentToLine = function(a, b, c, e, d) {
  var f = 0,
    g = b[0],
    b = b[1],
    h = box2d.b2DotVV(c, g.v) - e,
    c = box2d.b2DotVV(c, b.v) - e;
  0 >= h && a[f++].Copy(g);
  0 >= c && a[f++].Copy(b);
  0 > h * c && (c = h / (h - c), e = a[f].v, e.x = g.v.x + c * (b.v.x - g.v.x), e.y = g.v.y + c * (b.v.y - g.v.y), a = a[f].id, a.cf.indexA = d, a.cf.indexB = g.id.cf.indexB, a.cf.typeA = box2d.b2ContactFeatureType.e_vertex, a.cf.typeB = box2d.b2ContactFeatureType.e_face, ++f);
  return f
};
goog.exportSymbol("box2d.b2ClipSegmentToLine", box2d.b2ClipSegmentToLine);
box2d.b2TestOverlapShape = function(a, b, c, e, d, f) {
  var g = box2d.b2TestOverlapShape.s_input.Reset();
  g.proxyA.SetShape(a, b);
  g.proxyB.SetShape(c, e);
  g.transformA.Copy(d);
  g.transformB.Copy(f);
  g.useRadii = !0;
  a = box2d.b2TestOverlapShape.s_simplexCache.Reset();
  a.count = 0;
  b = box2d.b2TestOverlapShape.s_output.Reset();
  box2d.b2Distance(b, a, g);
  return b.distance < 10 * box2d.b2_epsilon
};
goog.exportSymbol("box2d.b2TestOverlapShape", box2d.b2TestOverlapShape);
box2d.b2TestOverlapShape.s_input = new box2d.b2DistanceInput;
box2d.b2TestOverlapShape.s_simplexCache = new box2d.b2SimplexCache;
box2d.b2TestOverlapShape.s_output = new box2d.b2DistanceOutput;
box2d.b2_toiCalls = 0;
goog.exportSymbol("box2d.b2_toiCalls", box2d.b2_toiCalls);
box2d.b2_toiIters = 0;
goog.exportSymbol("box2d.b2_toiIters", box2d.b2_toiIters);
box2d.b2_toiMaxIters = 0;
goog.exportSymbol("box2d.b2_toiMaxIters", box2d.b2_toiMaxIters);
box2d.b2_toiRootIters = 0;
goog.exportSymbol("box2d.b2_toiRootIters", box2d.b2_toiRootIters);
box2d.b2_toiMaxRootIters = 0;
goog.exportSymbol("box2d.b2_toiMaxRootIters", box2d.b2_toiMaxRootIters);
box2d.b2TOIInput = function() {
  this.proxyA = new box2d.b2DistanceProxy;
  this.proxyB = new box2d.b2DistanceProxy;
  this.sweepA = new box2d.b2Sweep;
  this.sweepB = new box2d.b2Sweep
};
goog.exportSymbol("box2d.b2TOIInput", box2d.b2TOIInput);
box2d.b2TOIInput.prototype.proxyA = null;
goog.exportProperty(box2d.b2TOIInput.prototype, "proxyA", box2d.b2TOIInput.prototype.proxyA);
box2d.b2TOIInput.prototype.proxyB = null;
goog.exportProperty(box2d.b2TOIInput.prototype, "proxyB", box2d.b2TOIInput.prototype.proxyB);
box2d.b2TOIInput.prototype.sweepA = null;
goog.exportProperty(box2d.b2TOIInput.prototype, "sweepA", box2d.b2TOIInput.prototype.sweepA);
box2d.b2TOIInput.prototype.sweepB = null;
goog.exportProperty(box2d.b2TOIInput.prototype, "sweepB", box2d.b2TOIInput.prototype.sweepB);
box2d.b2TOIInput.prototype.tMax = 0;
goog.exportProperty(box2d.b2TOIInput.prototype, "tMax", box2d.b2TOIInput.prototype.tMax);
box2d.b2TOIOutputState = {
  e_unknown: 0,
  e_failed: 1,
  e_overlapped: 2,
  e_touching: 3,
  e_separated: 4
};
goog.exportSymbol("box2d.b2TOIOutputState", box2d.b2TOIOutputState);
goog.exportProperty(box2d.b2TOIOutputState, "e_unknown", box2d.b2TOIOutputState.e_unknown);
goog.exportProperty(box2d.b2TOIOutputState, "e_failed", box2d.b2TOIOutputState.e_failed);
goog.exportProperty(box2d.b2TOIOutputState, "e_overlapped", box2d.b2TOIOutputState.e_overlapped);
goog.exportProperty(box2d.b2TOIOutputState, "e_touching", box2d.b2TOIOutputState.e_touching);
goog.exportProperty(box2d.b2TOIOutputState, "e_separated", box2d.b2TOIOutputState.e_separated);
box2d.b2TOIOutput = function() {};
goog.exportSymbol("box2d.b2TOIOutput", box2d.b2TOIOutput);
box2d.b2TOIOutput.prototype.state = box2d.b2TOIOutputState.e_unknown;
goog.exportProperty(box2d.b2TOIOutput.prototype, "state", box2d.b2TOIOutput.prototype.state);
box2d.b2TOIOutput.prototype.t = 0;
goog.exportProperty(box2d.b2TOIOutput.prototype, "t", box2d.b2TOIOutput.prototype.t);
box2d.b2SeparationFunctionType = {
  e_unknown: -1,
  e_points: 0,
  e_faceA: 1,
  e_faceB: 2
};
goog.exportSymbol("box2d.b2SeparationFunctionType", box2d.b2SeparationFunctionType);
goog.exportProperty(box2d.b2SeparationFunctionType, "e_unknown", box2d.b2SeparationFunctionType.e_unknown);
goog.exportProperty(box2d.b2SeparationFunctionType, "e_points", box2d.b2SeparationFunctionType.e_points);
goog.exportProperty(box2d.b2SeparationFunctionType, "e_faceA", box2d.b2SeparationFunctionType.e_faceA);
goog.exportProperty(box2d.b2SeparationFunctionType, "e_faceB", box2d.b2SeparationFunctionType.e_faceB);
box2d.b2SeparationFunction = function() {
  this.m_sweepA = new box2d.b2Sweep;
  this.m_sweepB = new box2d.b2Sweep;
  this.m_localPoint = new box2d.b2Vec2;
  this.m_axis = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2SeparationFunction", box2d.b2SeparationFunction);
box2d.b2SeparationFunction.prototype.m_proxyA = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_proxyA", box2d.b2SeparationFunction.prototype.m_proxyA);
box2d.b2SeparationFunction.prototype.m_proxyB = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_proxyB", box2d.b2SeparationFunction.prototype.m_proxyB);
box2d.b2SeparationFunction.prototype.m_sweepA = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_sweepA", box2d.b2SeparationFunction.prototype.m_sweepA);
box2d.b2SeparationFunction.prototype.m_sweepB = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_sweepB", box2d.b2SeparationFunction.prototype.m_sweepB);
box2d.b2SeparationFunction.prototype.m_type = box2d.b2SeparationFunctionType.e_unknown;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_type", box2d.b2SeparationFunction.prototype.m_type);
box2d.b2SeparationFunction.prototype.m_localPoint = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_localPoint", box2d.b2SeparationFunction.prototype.m_localPoint);
box2d.b2SeparationFunction.prototype.m_axis = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_axis", box2d.b2SeparationFunction.prototype.m_axis);
box2d.b2SeparationFunction.prototype.Initialize = function(a, b, c, e, d, f) {
  this.m_proxyA = b;
  this.m_proxyB = e;
  b = a.count;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < b && 3 > b);
  this.m_sweepA.Copy(c);
  this.m_sweepB.Copy(d);
  c = box2d.b2TimeOfImpact.s_xfA;
  d = box2d.b2TimeOfImpact.s_xfB;
  this.m_sweepA.GetTransform(c, f);
  this.m_sweepB.GetTransform(d, f);
  if (1 == b) return this.m_type = box2d.b2SeparationFunctionType.e_points, b = this.m_proxyA.GetVertex(a.indexA[0]), a = this.m_proxyB.GetVertex(a.indexB[0]), c = box2d.b2MulXV(c, b, box2d.b2TimeOfImpact.s_pointA),
    d = box2d.b2MulXV(d, a, box2d.b2TimeOfImpact.s_pointB), box2d.b2SubVV(d, c, this.m_axis), a = this.m_axis.Normalize();
  a.indexA[0] == a.indexA[1] ? (this.m_type = box2d.b2SeparationFunctionType.e_faceB, b = this.m_proxyB.GetVertex(a.indexB[0]), e = this.m_proxyB.GetVertex(a.indexB[1]), box2d.b2CrossVOne(box2d.b2SubVV(e, b, box2d.b2Vec2.s_t0), this.m_axis).SelfNormalize(), f = box2d.b2MulRV(d.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), box2d.b2MidVV(b, e, this.m_localPoint), d = box2d.b2MulXV(d, this.m_localPoint, box2d.b2TimeOfImpact.s_pointB),
    b = this.m_proxyA.GetVertex(a.indexA[0]), c = box2d.b2MulXV(c, b, box2d.b2TimeOfImpact.s_pointA), a = box2d.b2DotVV(box2d.b2SubVV(c, d, box2d.b2Vec2.s_t0), f)) : (this.m_type = box2d.b2SeparationFunctionType.e_faceA, b = this.m_proxyA.GetVertex(a.indexA[0]), e = this.m_proxyA.GetVertex(a.indexA[1]), box2d.b2CrossVOne(box2d.b2SubVV(e, b, box2d.b2Vec2.s_t0), this.m_axis).SelfNormalize(), f = box2d.b2MulRV(c.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), box2d.b2MidVV(b, e, this.m_localPoint), c = box2d.b2MulXV(c, this.m_localPoint, box2d.b2TimeOfImpact.s_pointA),
    a = this.m_proxyB.GetVertex(a.indexB[0]), d = box2d.b2MulXV(d, a, box2d.b2TimeOfImpact.s_pointB), a = box2d.b2DotVV(box2d.b2SubVV(d, c, box2d.b2Vec2.s_t0), f));
  0 > a && (this.m_axis.SelfNeg(), a = -a);
  return a
};
goog.exportProperty(box2d.b2SeparationFunction.prototype, "Initialize", box2d.b2SeparationFunction.prototype.Initialize);
box2d.b2SeparationFunction.prototype.FindMinSeparation = function(a, b, c) {
  var e = box2d.b2TimeOfImpact.s_xfA,
    d = box2d.b2TimeOfImpact.s_xfB;
  this.m_sweepA.GetTransform(e, c);
  this.m_sweepB.GetTransform(d, c);
  switch (this.m_type) {
    case box2d.b2SeparationFunctionType.e_points:
      var f = box2d.b2MulTRV(e.q, this.m_axis, box2d.b2TimeOfImpact.s_axisA),
        g = box2d.b2MulTRV(d.q, box2d.b2NegV(this.m_axis, box2d.b2Vec2.s_t0), box2d.b2TimeOfImpact.s_axisB);
      a[0] = this.m_proxyA.GetSupport(f);
      b[0] = this.m_proxyB.GetSupport(g);
      a = this.m_proxyA.GetVertex(a[0]);
      b = this.m_proxyB.GetVertex(b[0]);
      e = box2d.b2MulXV(e, a, box2d.b2TimeOfImpact.s_pointA);
      d = box2d.b2MulXV(d, b, box2d.b2TimeOfImpact.s_pointB);
      return b = box2d.b2DotVV(box2d.b2SubVV(d, e, box2d.b2Vec2.s_t0), this.m_axis);
    case box2d.b2SeparationFunctionType.e_faceA:
      return c = box2d.b2MulRV(e.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), e = box2d.b2MulXV(e, this.m_localPoint, box2d.b2TimeOfImpact.s_pointA), g = box2d.b2MulTRV(d.q, box2d.b2NegV(c, box2d.b2Vec2.s_t0), box2d.b2TimeOfImpact.s_axisB), a[0] = -1, b[0] = this.m_proxyB.GetSupport(g),
        b = this.m_proxyB.GetVertex(b[0]), d = box2d.b2MulXV(d, b, box2d.b2TimeOfImpact.s_pointB), b = box2d.b2DotVV(box2d.b2SubVV(d, e, box2d.b2Vec2.s_t0), c);
    case box2d.b2SeparationFunctionType.e_faceB:
      return c = box2d.b2MulRV(d.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), d = box2d.b2MulXV(d, this.m_localPoint, box2d.b2TimeOfImpact.s_pointB), f = box2d.b2MulTRV(e.q, box2d.b2NegV(c, box2d.b2Vec2.s_t0), box2d.b2TimeOfImpact.s_axisA), b[0] = -1, a[0] = this.m_proxyA.GetSupport(f), a = this.m_proxyA.GetVertex(a[0]), e = box2d.b2MulXV(e, a, box2d.b2TimeOfImpact.s_pointA),
        b = box2d.b2DotVV(box2d.b2SubVV(e, d, box2d.b2Vec2.s_t0), c);
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a[0] = -1, b[0] = -1, 0
  }
};
goog.exportProperty(box2d.b2SeparationFunction.prototype, "FindMinSeparation", box2d.b2SeparationFunction.prototype.FindMinSeparation);
box2d.b2SeparationFunction.prototype.Evaluate = function(a, b, c) {
  var e = box2d.b2TimeOfImpact.s_xfA,
    d = box2d.b2TimeOfImpact.s_xfB;
  this.m_sweepA.GetTransform(e, c);
  this.m_sweepB.GetTransform(d, c);
  switch (this.m_type) {
    case box2d.b2SeparationFunctionType.e_points:
      return a = this.m_proxyA.GetVertex(a), b = this.m_proxyB.GetVertex(b), e = box2d.b2MulXV(e, a, box2d.b2TimeOfImpact.s_pointA), d = box2d.b2MulXV(d, b, box2d.b2TimeOfImpact.s_pointB), e = box2d.b2DotVV(box2d.b2SubVV(d, e, box2d.b2Vec2.s_t0), this.m_axis);
    case box2d.b2SeparationFunctionType.e_faceA:
      return c =
        box2d.b2MulRV(e.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), e = box2d.b2MulXV(e, this.m_localPoint, box2d.b2TimeOfImpact.s_pointA), b = this.m_proxyB.GetVertex(b), d = box2d.b2MulXV(d, b, box2d.b2TimeOfImpact.s_pointB), e = box2d.b2DotVV(box2d.b2SubVV(d, e, box2d.b2Vec2.s_t0), c);
    case box2d.b2SeparationFunctionType.e_faceB:
      return c = box2d.b2MulRV(d.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), d = box2d.b2MulXV(d, this.m_localPoint, box2d.b2TimeOfImpact.s_pointB), a = this.m_proxyA.GetVertex(a), e = box2d.b2MulXV(e, a, box2d.b2TimeOfImpact.s_pointA),
        e = box2d.b2DotVV(box2d.b2SubVV(e, d, box2d.b2Vec2.s_t0), c);
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0
  }
};
goog.exportProperty(box2d.b2SeparationFunction.prototype, "Evaluate", box2d.b2SeparationFunction.prototype.Evaluate);
box2d.b2TimeOfImpact = function(a, b) {
  ++box2d.b2_toiCalls;
  a.state = box2d.b2TOIOutputState.e_unknown;
  a.t = b.tMax;
  var c = b.proxyA,
    e = b.proxyB,
    d = box2d.b2TimeOfImpact.s_sweepA.Copy(b.sweepA),
    f = box2d.b2TimeOfImpact.s_sweepB.Copy(b.sweepB);
  d.Normalize();
  f.Normalize();
  var g = b.tMax,
    h = box2d.b2Max(box2d.b2_linearSlop, c.m_radius + e.m_radius - 3 * box2d.b2_linearSlop),
    j = 0.25 * box2d.b2_linearSlop;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(h > j);
  var i = 0,
    k = 0,
    l = box2d.b2TimeOfImpact.s_cache;
  l.count = 0;
  var m = box2d.b2TimeOfImpact.s_distanceInput;
  m.proxyA = b.proxyA;
  m.proxyB = b.proxyB;
  for (m.useRadii = !1;;) {
    var n = box2d.b2TimeOfImpact.s_xfA,
      o = box2d.b2TimeOfImpact.s_xfB;
    d.GetTransform(n, i);
    f.GetTransform(o, i);
    m.transformA.Copy(n);
    m.transformB.Copy(o);
    n = box2d.b2TimeOfImpact.s_distanceOutput;
    box2d.b2Distance(n, l, m);
    if (0 >= n.distance) {
      a.state = box2d.b2TOIOutputState.e_overlapped;
      a.t = 0;
      break
    }
    if (n.distance < h + j) {
      a.state = box2d.b2TOIOutputState.e_touching;
      a.t = i;
      break
    }
    n = box2d.b2TimeOfImpact.s_fcn;
    n.Initialize(l, c, d, e, f, i);
    for (var o = !1, r = g, p = 0;;) {
      var q = box2d.b2TimeOfImpact.s_indexA,
        s = box2d.b2TimeOfImpact.s_indexB,
        v = n.FindMinSeparation(q, s, r);
      if (v > h + j) {
        a.state = box2d.b2TOIOutputState.e_separated;
        a.t = g;
        o = !0;
        break
      }
      if (v > h - j) {
        i = r;
        break
      }
      var z = n.Evaluate(q[0], s[0], i);
      if (z < h - j) {
        a.state = box2d.b2TOIOutputState.e_failed;
        a.t = i;
        o = !0;
        break
      }
      if (z <= h + j) {
        a.state = box2d.b2TOIOutputState.e_touching;
        a.t = i;
        o = !0;
        break
      }
      for (var u = 0, t = i, y = r;;) {
        var w = 0,
          w = u & 1 ? t + (h - z) * (y - t) / (v - z) : 0.5 * (t + y),
          B = n.Evaluate(q[0], s[0], w);
        if (box2d.b2Abs(B - h) < j) {
          r = w;
          break
        }
        B > h ? (t = w, z = B) : (y = w, v = B);
        ++u;
        ++box2d.b2_toiRootIters;
        if (50 ==
          u) break
      }
      box2d.b2_toiMaxRootIters = box2d.b2Max(box2d.b2_toiMaxRootIters, u);
      ++p;
      if (p == box2d.b2_maxPolygonVertices) break
    }++k;
    ++box2d.b2_toiIters;
    if (o) break;
    if (20 == k) {
      a.state = box2d.b2TOIOutputState.e_failed;
      a.t = i;
      break
    }
  }
  box2d.b2_toiMaxIters = box2d.b2Max(box2d.b2_toiMaxIters, k)
};
goog.exportSymbol("box2d.b2TimeOfImpact", box2d.b2TimeOfImpact);
box2d.b2TimeOfImpact.s_cache = new box2d.b2SimplexCache;
box2d.b2TimeOfImpact.s_distanceInput = new box2d.b2DistanceInput;
box2d.b2TimeOfImpact.s_distanceOutput = new box2d.b2DistanceOutput;
box2d.b2TimeOfImpact.s_xfA = new box2d.b2Transform;
box2d.b2TimeOfImpact.s_xfB = new box2d.b2Transform;
box2d.b2TimeOfImpact.s_indexA = box2d.b2MakeNumberArray(1);
box2d.b2TimeOfImpact.s_indexB = box2d.b2MakeNumberArray(1);
box2d.b2TimeOfImpact.s_fcn = new box2d.b2SeparationFunction;
box2d.b2TimeOfImpact.s_sweepA = new box2d.b2Sweep;
box2d.b2TimeOfImpact.s_sweepB = new box2d.b2Sweep;
box2d.b2TimeOfImpact.s_pointA = new box2d.b2Vec2;
box2d.b2TimeOfImpact.s_pointB = new box2d.b2Vec2;
box2d.b2TimeOfImpact.s_normal = new box2d.b2Vec2;
box2d.b2TimeOfImpact.s_axisA = new box2d.b2Vec2;
box2d.b2TimeOfImpact.s_axisB = new box2d.b2Vec2;
box2d.b2MixFriction = function(a, b) {
  return box2d.b2Sqrt(a * b)
};
goog.exportSymbol("box2d.b2MixFriction", box2d.b2MixFriction);
box2d.b2MixRestitution = function(a, b) {
  return a > b ? a : b
};
goog.exportSymbol("box2d.b2MixRestitution", box2d.b2MixRestitution);
box2d.b2ContactEdge = function() {};
goog.exportSymbol("box2d.b2ContactEdge", box2d.b2ContactEdge);
box2d.b2ContactEdge.prototype.other = null;
goog.exportProperty(box2d.b2ContactEdge.prototype, "other", box2d.b2ContactEdge.prototype.other);
box2d.b2ContactEdge.prototype.contact = null;
goog.exportProperty(box2d.b2ContactEdge.prototype, "contact", box2d.b2ContactEdge.prototype.contact);
box2d.b2ContactEdge.prototype.prev = null;
goog.exportProperty(box2d.b2ContactEdge.prototype, "prev", box2d.b2ContactEdge.prototype.prev);
box2d.b2ContactEdge.prototype.next = null;
goog.exportProperty(box2d.b2ContactEdge.prototype, "next", box2d.b2ContactEdge.prototype.next);
box2d.b2ContactFlag = {
  e_none: 0,
  e_islandFlag: 1,
  e_touchingFlag: 2,
  e_enabledFlag: 4,
  e_filterFlag: 8,
  e_bulletHitFlag: 16,
  e_toiFlag: 32
};
goog.exportProperty(box2d.b2ContactFlag, "e_none", box2d.b2ContactFlag.e_none);
goog.exportProperty(box2d.b2ContactFlag, "e_islandFlag", box2d.b2ContactFlag.e_islandFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_touchingFlag", box2d.b2ContactFlag.e_touchingFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_enabledFlag", box2d.b2ContactFlag.e_enabledFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_filterFlag", box2d.b2ContactFlag.e_filterFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_bulletHitFlag", box2d.b2ContactFlag.e_bulletHitFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_toiFlag", box2d.b2ContactFlag.e_toiFlag);
box2d.b2Contact = function() {
  this.m_nodeA = new box2d.b2ContactEdge;
  this.m_nodeB = new box2d.b2ContactEdge;
  this.m_manifold = new box2d.b2Manifold;
  this.m_oldManifold = new box2d.b2Manifold
};
goog.exportSymbol("box2d.b2Contact", box2d.b2Contact);
box2d.b2Contact.prototype.m_flags = box2d.b2ContactFlag.e_none;
goog.exportProperty(box2d.b2Contact.prototype, "m_flags", box2d.b2Contact.prototype.m_flags);
box2d.b2Contact.prototype.m_prev = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_prev", box2d.b2Contact.prototype.m_prev);
box2d.b2Contact.prototype.m_next = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_next", box2d.b2Contact.prototype.m_next);
box2d.b2Contact.prototype.m_nodeA = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_nodeA", box2d.b2Contact.prototype.m_nodeA);
box2d.b2Contact.prototype.m_nodeB = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_nodeB", box2d.b2Contact.prototype.m_nodeB);
box2d.b2Contact.prototype.m_fixtureA = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_fixtureA", box2d.b2Contact.prototype.m_fixtureA);
box2d.b2Contact.prototype.m_fixtureB = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_fixtureB", box2d.b2Contact.prototype.m_fixtureB);
box2d.b2Contact.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_indexA", box2d.b2Contact.prototype.m_indexA);
box2d.b2Contact.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_indexB", box2d.b2Contact.prototype.m_indexB);
box2d.b2Contact.prototype.m_manifold = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_manifold", box2d.b2Contact.prototype.m_manifold);
box2d.b2Contact.prototype.m_toiCount = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_toiCount", box2d.b2Contact.prototype.m_toiCount);
box2d.b2Contact.prototype.m_toi = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_toi", box2d.b2Contact.prototype.m_toi);
box2d.b2Contact.prototype.m_friction = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_friction", box2d.b2Contact.prototype.m_friction);
box2d.b2Contact.prototype.m_restitution = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_restitution", box2d.b2Contact.prototype.m_restitution);
box2d.b2Contact.prototype.m_tangentSpeed = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_tangentSpeed", box2d.b2Contact.prototype.m_tangentSpeed);
box2d.b2Contact.prototype.m_oldManifold = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_oldManifold", box2d.b2Contact.prototype.m_oldManifold);
box2d.b2Contact.prototype.GetManifold = function() {
  return this.m_manifold
};
goog.exportProperty(box2d.b2Contact.prototype, "GetManifold", box2d.b2Contact.prototype.GetManifold);
box2d.b2Contact.prototype.GetWorldManifold = function(a) {
  var b = this.m_fixtureA.GetBody(),
    c = this.m_fixtureB.GetBody(),
    e = this.m_fixtureA.GetShape(),
    d = this.m_fixtureB.GetShape();
  a.Initialize(this.m_manifold, b.GetTransform(), e.m_radius, c.GetTransform(), d.m_radius)
};
goog.exportProperty(box2d.b2Contact.prototype, "GetWorldManifold", box2d.b2Contact.prototype.GetWorldManifold);
box2d.b2Contact.prototype.IsTouching = function() {
  return (this.m_flags & box2d.b2ContactFlag.e_touchingFlag) == box2d.b2ContactFlag.e_touchingFlag
};
goog.exportProperty(box2d.b2Contact.prototype, "IsTouching", box2d.b2Contact.prototype.IsTouching);
box2d.b2Contact.prototype.SetEnabled = function(a) {
  this.m_flags = a ? this.m_flags | box2d.b2ContactFlag.e_enabledFlag : this.m_flags & ~box2d.b2ContactFlag.e_enabledFlag
};
goog.exportProperty(box2d.b2Contact.prototype, "SetEnabled", box2d.b2Contact.prototype.SetEnabled);
box2d.b2Contact.prototype.IsEnabled = function() {
  return (this.m_flags & box2d.b2ContactFlag.e_enabledFlag) == box2d.b2ContactFlag.e_enabledFlag
};
goog.exportProperty(box2d.b2Contact.prototype, "IsEnabled", box2d.b2Contact.prototype.IsEnabled);
box2d.b2Contact.prototype.GetNext = function() {
  return this.m_next
};
goog.exportProperty(box2d.b2Contact.prototype, "GetNext", box2d.b2Contact.prototype.GetNext);
box2d.b2Contact.prototype.GetFixtureA = function() {
  return this.m_fixtureA
};
goog.exportProperty(box2d.b2Contact.prototype, "GetFixtureA", box2d.b2Contact.prototype.GetFixtureA);
box2d.b2Contact.prototype.GetChildIndexA = function() {
  return this.m_indexA
};
goog.exportProperty(box2d.b2Contact.prototype, "GetChildIndexA", box2d.b2Contact.prototype.GetChildIndexA);
box2d.b2Contact.prototype.GetFixtureB = function() {
  return this.m_fixtureB
};
goog.exportProperty(box2d.b2Contact.prototype, "GetFixtureB", box2d.b2Contact.prototype.GetFixtureB);
box2d.b2Contact.prototype.GetChildIndexB = function() {
  return this.m_indexB
};
goog.exportProperty(box2d.b2Contact.prototype, "GetChildIndexB", box2d.b2Contact.prototype.GetChildIndexB);
box2d.b2Contact.prototype.Evaluate = function() {};
goog.exportProperty(box2d.b2Contact.prototype, "Evaluate", box2d.b2Contact.prototype.Evaluate);
box2d.b2Contact.prototype.FlagForFiltering = function() {
  this.m_flags |= box2d.b2ContactFlag.e_filterFlag
};
goog.exportProperty(box2d.b2Contact.prototype, "FlagForFiltering", box2d.b2Contact.prototype.FlagForFiltering);
box2d.b2Contact.prototype.SetFriction = function(a) {
  this.m_friction = a
};
goog.exportProperty(box2d.b2Contact.prototype, "SetFriction", box2d.b2Contact.prototype.SetFriction);
box2d.b2Contact.prototype.GetFriction = function() {
  return this.m_friction
};
goog.exportProperty(box2d.b2Contact.prototype, "GetFriction", box2d.b2Contact.prototype.GetFriction);
box2d.b2Contact.prototype.ResetFriction = function() {
  this.m_friction = box2d.b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction)
};
goog.exportProperty(box2d.b2Contact.prototype, "ResetFriction", box2d.b2Contact.prototype.ResetFriction);
box2d.b2Contact.prototype.SetRestitution = function(a) {
  this.m_restitution = a
};
goog.exportProperty(box2d.b2Contact.prototype, "SetRestitution", box2d.b2Contact.prototype.SetRestitution);
box2d.b2Contact.prototype.GetRestitution = function() {
  return this.m_restitution
};
goog.exportProperty(box2d.b2Contact.prototype, "GetRestitution", box2d.b2Contact.prototype.GetRestitution);
box2d.b2Contact.prototype.ResetRestitution = function() {
  this.m_restitution = box2d.b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution)
};
goog.exportProperty(box2d.b2Contact.prototype, "ResetRestitution", box2d.b2Contact.prototype.ResetRestitution);
box2d.b2Contact.prototype.SetTangentSpeed = function(a) {
  this.m_tangentSpeed = a
};
goog.exportProperty(box2d.b2Contact.prototype, "SetTangentSpeed", box2d.b2Contact.prototype.SetTangentSpeed);
box2d.b2Contact.prototype.GetTangentSpeed = function() {
  return this.m_tangentSpeed
};
goog.exportProperty(box2d.b2Contact.prototype, "GetTangentSpeed", box2d.b2Contact.prototype.GetTangentSpeed);
box2d.b2Contact.prototype.Reset = function(a, b, c, e) {
  this.m_flags = box2d.b2ContactFlag.e_enabledFlag;
  this.m_fixtureA = a;
  this.m_fixtureB = c;
  this.m_indexA = b;
  this.m_indexB = e;
  this.m_manifold.pointCount = 0;
  this.m_next = this.m_prev = null;
  this.m_nodeA.contact = null;
  this.m_nodeA.prev = null;
  this.m_nodeA.next = null;
  this.m_nodeA.other = null;
  this.m_nodeB.contact = null;
  this.m_nodeB.prev = null;
  this.m_nodeB.next = null;
  this.m_nodeB.other = null;
  this.m_toiCount = 0;
  this.m_friction = box2d.b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
  this.m_restitution = box2d.b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution)
};
goog.exportProperty(box2d.b2Contact.prototype, "Reset", box2d.b2Contact.prototype.Reset);
box2d.b2Contact.prototype.Update = function(a) {
  var b = this.m_oldManifold;
  this.m_oldManifold = this.m_manifold;
  this.m_manifold = b;
  this.m_flags |= box2d.b2ContactFlag.e_enabledFlag;
  var c = !1,
    b = (this.m_flags & box2d.b2ContactFlag.e_touchingFlag) == box2d.b2ContactFlag.e_touchingFlag,
    e = this.m_fixtureA.IsSensor(),
    d = this.m_fixtureB.IsSensor(),
    e = e || d,
    d = this.m_fixtureA.GetBody(),
    f = this.m_fixtureB.GetBody(),
    c = d.GetTransform(),
    g = f.GetTransform();
  if (e) d = this.m_fixtureA.GetShape(), f = this.m_fixtureB.GetShape(), c = box2d.b2TestOverlapShape(d,
    this.m_indexA, f, this.m_indexB, c, g), this.m_manifold.pointCount = 0;
  else {
    this.Evaluate(this.m_manifold, c, g);
    c = 0 < this.m_manifold.pointCount;
    for (g = 0; g < this.m_manifold.pointCount; ++g) {
      var h = this.m_manifold.points[g];
      h.normalImpulse = 0;
      h.tangentImpulse = 0;
      for (var j = h.id, i = 0; i < this.m_oldManifold.pointCount; ++i) {
        var k = this.m_oldManifold.points[i];
        if (k.id.key == j.key) {
          h.normalImpulse = k.normalImpulse;
          h.tangentImpulse = k.tangentImpulse;
          break
        }
      }
    }
    c != b && (d.SetAwake(!0), f.SetAwake(!0))
  }
  this.m_flags = c ? this.m_flags | box2d.b2ContactFlag.e_touchingFlag :
    this.m_flags & ~box2d.b2ContactFlag.e_touchingFlag;
  !1 == b && (!0 == c && a) && a.BeginContact(this);
  !0 == b && (!1 == c && a) && a.EndContact(this);
  !1 == e && (c && a) && a.PreSolve(this, this.m_oldManifold)
};
goog.exportProperty(box2d.b2Contact.prototype, "Update", box2d.b2Contact.prototype.Update);
box2d.b2Contact.prototype.ComputeTOI = function(a, b) {
  var c = box2d.b2Contact.prototype.ComputeTOI.s_input;
  c.proxyA.SetShape(this.m_fixtureA.GetShape(), this.m_indexA);
  c.proxyB.SetShape(this.m_fixtureB.GetShape(), this.m_indexB);
  c.sweepA.Copy(a);
  c.sweepB.Copy(b);
  c.tMax = box2d.b2_linearSlop;
  var e = box2d.b2Contact.prototype.ComputeTOI.s_output;
  box2d.b2TimeOfImpact(e, c);
  return e.t
};
goog.exportProperty(box2d.b2Contact.prototype, "ComputeTOI", box2d.b2Contact.prototype.ComputeTOI);
box2d.b2Contact.prototype.ComputeTOI.s_input = new box2d.b2TOIInput;
box2d.b2Contact.prototype.ComputeTOI.s_output = new box2d.b2TOIOutput;
box2d.b2ContactRegister = function() {};
goog.exportSymbol("box2d.b2ContactRegister", box2d.b2ContactRegister);
box2d.b2ContactRegister.prototype.createFcn = null;
box2d.b2ContactRegister.prototype.destroyFcn = null;
box2d.b2ContactRegister.prototype.primary = !1;
box2d.b2ContactFactory = function(a) {
  this.m_allocator = a;
  this.InitializeRegisters()
};
goog.exportSymbol("box2d.b2ContactFactory", box2d.b2ContactFactory);
box2d.b2ContactFactory.prototype.m_allocator = null;
box2d.b2ContactFactory.prototype.AddType = function(a, b, c, e) {
  var d = box2d.b2MakeArray(256, function() {
      return a()
    }),
    b = function(b) {
      return 0 < d.length ? d.pop() : a(b)
    },
    f = function(a) {
      d.push(a)
    };
  this.m_registers[c][e].pool = d;
  this.m_registers[c][e].createFcn = b;
  this.m_registers[c][e].destroyFcn = f;
  this.m_registers[c][e].primary = !0;
  c != e && (this.m_registers[e][c].pool = d, this.m_registers[e][c].createFcn = b, this.m_registers[e][c].destroyFcn = f, this.m_registers[e][c].primary = !1)
};
goog.exportProperty(box2d.b2ContactFactory.prototype, "AddType", box2d.b2ContactFactory.prototype.AddType);
box2d.b2ContactFactory.prototype.InitializeRegisters = function() {
  this.m_registers = Array(box2d.b2ShapeType.e_shapeTypeCount);
  for (var a = 0; a < box2d.b2ShapeType.e_shapeTypeCount; a++) {
    this.m_registers[a] = Array(box2d.b2ShapeType.e_shapeTypeCount);
    for (var b = 0; b < box2d.b2ShapeType.e_shapeTypeCount; b++) this.m_registers[a][b] = new box2d.b2ContactRegister
  }
  this.AddType(box2d.b2CircleContact.Create, box2d.b2CircleContact.Destroy, box2d.b2ShapeType.e_circleShape, box2d.b2ShapeType.e_circleShape);
  this.AddType(box2d.b2PolygonAndCircleContact.Create,
    box2d.b2PolygonAndCircleContact.Destroy, box2d.b2ShapeType.e_polygonShape, box2d.b2ShapeType.e_circleShape);
  this.AddType(box2d.b2PolygonContact.Create, box2d.b2PolygonContact.Destroy, box2d.b2ShapeType.e_polygonShape, box2d.b2ShapeType.e_polygonShape);
  this.AddType(box2d.b2EdgeAndCircleContact.Create, box2d.b2EdgeAndCircleContact.Destroy, box2d.b2ShapeType.e_edgeShape, box2d.b2ShapeType.e_circleShape);
  this.AddType(box2d.b2EdgeAndPolygonContact.Create, box2d.b2EdgeAndPolygonContact.Destroy, box2d.b2ShapeType.e_edgeShape,
    box2d.b2ShapeType.e_polygonShape);
  this.AddType(box2d.b2ChainAndCircleContact.Create, box2d.b2ChainAndCircleContact.Destroy, box2d.b2ShapeType.e_chainShape, box2d.b2ShapeType.e_circleShape);
  this.AddType(box2d.b2ChainAndPolygonContact.Create, box2d.b2ChainAndPolygonContact.Destroy, box2d.b2ShapeType.e_chainShape, box2d.b2ShapeType.e_polygonShape)
};
goog.exportProperty(box2d.b2ContactFactory.prototype, "InitializeRegisters", box2d.b2ContactFactory.prototype.InitializeRegisters);
box2d.b2ContactFactory.prototype.Create = function(a, b, c, e) {
  var d = a.GetType(),
    f = c.GetType();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= d && d < box2d.b2ShapeType.e_shapeTypeCount);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= f && f < box2d.b2ShapeType.e_shapeTypeCount);
  d = this.m_registers[d][f];
  f = d.createFcn;
  return null != f ? (d.primary ? (d = f(this.m_allocator), d.Reset(a, b, c, e)) : (d = f(this.m_allocator), d.Reset(c, e, a, b)), d) : null
};
goog.exportProperty(box2d.b2ContactFactory.prototype, "Create", box2d.b2ContactFactory.prototype.Create);
box2d.b2ContactFactory.prototype.Destroy = function(a) {
  var b = a.m_fixtureA,
    c = a.m_fixtureB;
  0 < a.m_manifold.pointCount && (!1 == b.IsSensor() && !1 == c.IsSensor()) && (b.GetBody().SetAwake(!0), c.GetBody().SetAwake(!0));
  b = b.GetType();
  c = c.GetType();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && c < box2d.b2ShapeType.e_shapeTypeCount);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && c < box2d.b2ShapeType.e_shapeTypeCount);
  c = this.m_registers[b][c].destroyFcn;
  c(a, this.m_allocator)
};
goog.exportProperty(box2d.b2ContactFactory.prototype, "Destroy", box2d.b2ContactFactory.prototype.Destroy);
box2d.b2PolygonAndCircleContact = function() {
  box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2PolygonAndCircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2PolygonAndCircleContact", box2d.b2PolygonAndCircleContact);
box2d.b2PolygonAndCircleContact.Create = function() {
  return new box2d.b2PolygonAndCircleContact
};
goog.exportProperty(box2d.b2PolygonAndCircleContact, "Create", box2d.b2PolygonAndCircleContact.Create);
box2d.b2PolygonAndCircleContact.Destroy = function() {};
goog.exportProperty(box2d.b2PolygonAndCircleContact, "Destroy", box2d.b2PolygonAndCircleContact.Destroy);
box2d.b2PolygonAndCircleContact.prototype.Reset = function(a, b, c, e) {
  box2d.b2PolygonAndCircleContact.superClass_.Reset.call(this, a, b, c, e);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() == box2d.b2ShapeType.e_polygonShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() == box2d.b2ShapeType.e_circleShape)
};
goog.exportProperty(box2d.b2PolygonAndCircleContact.prototype, "Reset", box2d.b2PolygonAndCircleContact.prototype.Reset);
box2d.b2PolygonAndCircleContact.prototype.Evaluate = function(a, b, c) {
  var e = this.m_fixtureA.GetShape(),
    d = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2PolygonShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
  box2d.b2CollidePolygonAndCircle(a, e instanceof box2d.b2PolygonShape ? e : null, b, d instanceof box2d.b2CircleShape ? d : null, c)
};
goog.exportProperty(box2d.b2PolygonAndCircleContact.prototype, "Evaluate", box2d.b2PolygonAndCircleContact.prototype.Evaluate);
box2d.b2EdgeAndPolygonContact = function() {
  box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2EdgeAndPolygonContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2EdgeAndPolygonContact", box2d.b2EdgeAndPolygonContact);
box2d.b2EdgeAndPolygonContact.Create = function() {
  return new box2d.b2EdgeAndPolygonContact
};
goog.exportProperty(box2d.b2EdgeAndPolygonContact, "Create", box2d.b2EdgeAndPolygonContact.Create);
box2d.b2EdgeAndPolygonContact.Destroy = function() {};
goog.exportProperty(box2d.b2EdgeAndPolygonContact, "Destroy", box2d.b2EdgeAndPolygonContact.Destroy);
box2d.b2EdgeAndPolygonContact.prototype.Reset = function(a, b, c, e) {
  box2d.b2EdgeAndPolygonContact.superClass_.Reset.call(this, a, b, c, e);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() == box2d.b2ShapeType.e_edgeShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() == box2d.b2ShapeType.e_polygonShape)
};
goog.exportProperty(box2d.b2EdgeAndPolygonContact.prototype, "Reset", box2d.b2EdgeAndPolygonContact.prototype.Reset);
box2d.b2EdgeAndPolygonContact.prototype.Evaluate = function(a, b, c) {
  var e = this.m_fixtureA.GetShape(),
    d = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2EdgeShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2PolygonShape);
  box2d.b2CollideEdgeAndPolygon(a, e instanceof box2d.b2EdgeShape ? e : null, b, d instanceof box2d.b2PolygonShape ? d : null, c)
};
goog.exportProperty(box2d.b2EdgeAndPolygonContact.prototype, "Evaluate", box2d.b2EdgeAndPolygonContact.prototype.Evaluate);
box2d.b2MassData = function() {
  this.center = new box2d.b2Vec2(0, 0)
};
goog.exportSymbol("box2d.b2MassData", box2d.b2MassData);
box2d.b2MassData.prototype.mass = 0;
goog.exportProperty(box2d.b2MassData.prototype, "mass", box2d.b2MassData.prototype.mass);
box2d.b2MassData.prototype.center = null;
goog.exportProperty(box2d.b2MassData.prototype, "center", box2d.b2MassData.prototype.center);
box2d.b2MassData.prototype.I = 0;
goog.exportProperty(box2d.b2MassData.prototype, "I", box2d.b2MassData.prototype.I);
box2d.b2ShapeType = {
  e_unknown: -1,
  e_circleShape: 0,
  e_edgeShape: 1,
  e_polygonShape: 2,
  e_chainShape: 3,
  e_shapeTypeCount: 4
};
goog.exportSymbol("box2d.b2ShapeType", box2d.b2ShapeType);
goog.exportProperty(box2d.b2ShapeType, "e_unknown", box2d.b2ShapeType.e_unknown);
goog.exportProperty(box2d.b2ShapeType, "e_circleShape", box2d.b2ShapeType.e_circleShape);
goog.exportProperty(box2d.b2ShapeType, "e_edgeShape", box2d.b2ShapeType.e_edgeShape);
goog.exportProperty(box2d.b2ShapeType, "e_polygonShape", box2d.b2ShapeType.e_polygonShape);
goog.exportProperty(box2d.b2ShapeType, "e_chainShape", box2d.b2ShapeType.e_chainShape);
goog.exportProperty(box2d.b2ShapeType, "e_shapeTypeCount", box2d.b2ShapeType.e_shapeTypeCount);
box2d.b2Shape = function(a, b) {
  this.m_type = a;
  this.m_radius = b
};
goog.exportSymbol("box2d.b2Shape", box2d.b2Shape);
box2d.b2Shape.prototype.m_type = box2d.b2ShapeType.e_unknown;
goog.exportProperty(box2d.b2Shape.prototype, "m_type", box2d.b2Shape.prototype.m_type);
box2d.b2Shape.prototype.m_radius = 0;
goog.exportProperty(box2d.b2Shape.prototype, "m_radius", box2d.b2Shape.prototype.m_radius);
box2d.b2Shape.prototype.Clone = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
  return null
};
goog.exportProperty(box2d.b2Shape.prototype, "Clone", box2d.b2Shape.prototype.Clone);
box2d.b2Shape.prototype.Copy = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_type == a.m_type);
  this.m_radius = a.m_radius;
  return this
};
goog.exportProperty(box2d.b2Shape.prototype, "Copy", box2d.b2Shape.prototype.Copy);
box2d.b2Shape.prototype.GetType = function() {
  return this.m_type
};
goog.exportProperty(box2d.b2Shape.prototype, "GetType", box2d.b2Shape.prototype.GetType);
box2d.b2Shape.prototype.GetChildCount = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return 0
};
goog.exportProperty(box2d.b2Shape.prototype, "GetChildCount", box2d.b2Shape.prototype.GetChildCount);
box2d.b2Shape.prototype.TestPoint = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return !1
};
goog.exportProperty(box2d.b2Shape.prototype, "TestPoint", box2d.b2Shape.prototype.TestPoint);
box2d.b2Shape.prototype.RayCast = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return !1
};
goog.exportProperty(box2d.b2Shape.prototype, "RayCast", box2d.b2Shape.prototype.RayCast);
box2d.b2Shape.prototype.ComputeAABB = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual")
};
goog.exportProperty(box2d.b2Shape.prototype, "ComputeAABB", box2d.b2Shape.prototype.ComputeAABB);
box2d.b2Shape.prototype.ComputeMass = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual")
};
goog.exportProperty(box2d.b2Shape.prototype, "ComputeMass", box2d.b2Shape.prototype.ComputeMass);
box2d.b2Shape.prototype.ComputeSubmergedArea = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return 0
};
goog.exportProperty(box2d.b2Shape.prototype, "ComputeSubmergedArea", box2d.b2Shape.prototype.ComputeSubmergedArea);
box2d.b2PolygonShape = function() {
  box2d.b2Shape.call(this, box2d.b2ShapeType.e_polygonShape, box2d.b2_polygonRadius);
  this.m_centroid = new box2d.b2Vec2(0, 0);
  this.m_vertices = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
  this.m_normals = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices)
};
goog.inherits(box2d.b2PolygonShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2PolygonShape", box2d.b2PolygonShape);
box2d.b2PolygonShape.prototype.m_centroid = null;
goog.exportProperty(box2d.b2PolygonShape.prototype, "m_centroid", box2d.b2PolygonShape.prototype.m_centroid);
box2d.b2PolygonShape.prototype.m_vertices = null;
goog.exportProperty(box2d.b2PolygonShape.prototype, "m_vertices", box2d.b2PolygonShape.prototype.m_vertices);
box2d.b2PolygonShape.prototype.m_normals = null;
goog.exportProperty(box2d.b2PolygonShape.prototype, "m_normals", box2d.b2PolygonShape.prototype.m_normals);
box2d.b2PolygonShape.prototype.m_count = 0;
goog.exportProperty(box2d.b2PolygonShape.prototype, "m_count", box2d.b2PolygonShape.prototype.m_count);
box2d.b2PolygonShape.prototype.Clone = function() {
  return (new box2d.b2PolygonShape).Copy(this)
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "Clone", box2d.b2PolygonShape.prototype.Clone);
box2d.b2PolygonShape.prototype.Copy = function(a) {
  box2d.b2PolygonShape.superClass_.Copy.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2PolygonShape);
  this.m_centroid.Copy(a.m_centroid);
  this.m_count = a.m_count;
  for (var b = 0, c = this.m_count; b < c; ++b) this.m_vertices[b].Copy(a.m_vertices[b]), this.m_normals[b].Copy(a.m_normals[b]);
  return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "Copy", box2d.b2PolygonShape.prototype.Copy);
box2d.b2PolygonShape.prototype.SetAsBox = function(a, b) {
  this.m_count = 4;
  this.m_vertices[0].SetXY(-a, -b);
  this.m_vertices[1].SetXY(a, -b);
  this.m_vertices[2].SetXY(a, b);
  this.m_vertices[3].SetXY(-a, b);
  this.m_normals[0].SetXY(0, -1);
  this.m_normals[1].SetXY(1, 0);
  this.m_normals[2].SetXY(0, 1);
  this.m_normals[3].SetXY(-1, 0);
  this.m_centroid.SetZero();
  return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "SetAsBox", box2d.b2PolygonShape.prototype.SetAsBox);
box2d.b2PolygonShape.prototype.SetAsOrientedBox = function(a, b, c, e) {
  this.m_count = 4;
  this.m_vertices[0].SetXY(-a, -b);
  this.m_vertices[1].SetXY(a, -b);
  this.m_vertices[2].SetXY(a, b);
  this.m_vertices[3].SetXY(-a, b);
  this.m_normals[0].SetXY(0, -1);
  this.m_normals[1].SetXY(1, 0);
  this.m_normals[2].SetXY(0, 1);
  this.m_normals[3].SetXY(-1, 0);
  this.m_centroid.Copy(c);
  a = new box2d.b2Transform;
  a.SetPosition(c);
  a.SetRotationAngleRadians(e);
  c = 0;
  for (e = this.m_count; c < e; ++c) box2d.b2MulXV(a, this.m_vertices[c], this.m_vertices[c]),
    box2d.b2MulRV(a.q, this.m_normals[c], this.m_normals[c]);
  return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "SetAsOrientedBox", box2d.b2PolygonShape.prototype.SetAsOrientedBox);
box2d.b2PolygonShape.ComputeCentroid = function(a, b, c) {
  c = c || new box2d.b2Vec2;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= b);
  c.SetZero();
  for (var e = 0, d = box2d.b2PolygonShape.ComputeCentroid.s_pRef.SetZero(), f = 1 / 3, g = 0; g < b; ++g) {
    var h = d,
      j = a[g],
      i = a[(g + 1) % b],
      k = box2d.b2SubVV(j, h, box2d.b2PolygonShape.ComputeCentroid.s_e1),
      l = box2d.b2SubVV(i, h, box2d.b2PolygonShape.ComputeCentroid.s_e2),
      k = 0.5 * box2d.b2CrossVV(k, l),
      e = e + k;
    c.x += k * f * (h.x + j.x + i.x);
    c.y += k * f * (h.y + j.y + i.y)
  }
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e > box2d.b2_epsilon);
  c.SelfMul(1 / e);
  return c
};
goog.exportProperty(box2d.b2PolygonShape, "ComputeCentroid", box2d.b2PolygonShape.ComputeCentroid);
box2d.b2PolygonShape.ComputeCentroid.s_pRef = new box2d.b2Vec2;
box2d.b2PolygonShape.ComputeCentroid.s_e1 = new box2d.b2Vec2;
box2d.b2PolygonShape.ComputeCentroid.s_e2 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.SetAsVector = function(a, b) {
  void 0 === b && (b = a.length);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= b && b <= box2d.b2_maxPolygonVertices);
  if (3 > b) return this.SetAsBox(1, 1);
  for (var c = box2d.b2Min(b, box2d.b2_maxPolygonVertices), e = box2d.b2PolygonShape.prototype.SetAsVector.s_ps, d = 0; d < c; ++d) e[d].Copy(a[d]);
  for (var f = 0, g = e[0].x, d = 1; d < b; ++d) {
    var h = e[d].x;
    if (h > g || h == g && e[d].y < e[f].y) f = d, g = h
  }
  h = box2d.b2PolygonShape.prototype.SetAsVector.s_hull;
  g = 0;
  for (d = f;;) {
    h[g] = d;
    for (var j = 0, i = 1; i < c; ++i)
      if (j ==
        d) j = i;
      else {
        var k = box2d.b2SubVV(e[j], e[h[g]], box2d.b2PolygonShape.prototype.SetAsVector.s_r),
          l = box2d.b2SubVV(e[i], e[h[g]], box2d.b2PolygonShape.prototype.SetAsVector.s_v),
          m = box2d.b2CrossVV(k, l);
        0 > m && (j = i);
        0 == m && l.GetLengthSquared() > k.GetLengthSquared() && (j = i)
      }++g;
    d = j;
    if (j == f) break
  }
  this.m_count = g;
  for (d = 0; d < g; ++d) this.m_vertices[d].Copy(e[h[d]]);
  d = 0;
  for (c = g; d < c; ++d) e = box2d.b2SubVV(this.m_vertices[(d + 1) % c], this.m_vertices[d], box2d.b2Vec2.s_t0), box2d.ENABLE_ASSERTS && box2d.b2Assert(e.GetLengthSquared() >
    box2d.b2_epsilon_sq), box2d.b2CrossVOne(e, this.m_normals[d]).SelfNormalize();
  box2d.b2PolygonShape.ComputeCentroid(this.m_vertices, g, this.m_centroid);
  return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "SetAsVector", box2d.b2PolygonShape.prototype.SetAsVector);
box2d.b2PolygonShape.prototype.SetAsVector.s_ps = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
box2d.b2PolygonShape.prototype.SetAsVector.s_hull = box2d.b2MakeNumberArray(box2d.b2_maxPolygonVertices);
box2d.b2PolygonShape.prototype.SetAsVector.s_r = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.SetAsVector.s_v = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.SetAsArray = function(a, b) {
  return this.SetAsVector(a, b)
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "SetAsArray", box2d.b2PolygonShape.prototype.SetAsArray);
box2d.b2PolygonShape.prototype.GetChildCount = function() {
  return 1
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "GetChildCount", box2d.b2PolygonShape.prototype.GetChildCount);
box2d.b2PolygonShape.prototype.TestPoint = function(a, b) {
  for (var c = box2d.b2MulTXV(a, b, box2d.b2PolygonShape.prototype.TestPoint.s_pLocal), e = 0, d = this.m_count; e < d; ++e)
    if (0 < box2d.b2DotVV(this.m_normals[e], box2d.b2SubVV(c, this.m_vertices[e], box2d.b2Vec2.s_t0))) return !1;
  return !0
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "TestPoint", box2d.b2PolygonShape.prototype.TestPoint);
box2d.b2PolygonShape.prototype.TestPoint.s_pLocal = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.RayCast = function(a, b, c) {
  for (var e = box2d.b2MulTXV(c, b.p1, box2d.b2PolygonShape.prototype.RayCast.s_p1), d = box2d.b2MulTXV(c, b.p2, box2d.b2PolygonShape.prototype.RayCast.s_p2), d = box2d.b2SubVV(d, e, box2d.b2PolygonShape.prototype.RayCast.s_d), f = 0, g = b.maxFraction, h = -1, j = 0, i = this.m_count; j < i; ++j) {
    var k = box2d.b2DotVV(this.m_normals[j], box2d.b2SubVV(this.m_vertices[j], e, box2d.b2Vec2.s_t0)),
      l = box2d.b2DotVV(this.m_normals[j], d);
    if (0 == l) {
      if (0 > k) return !1
    } else 0 > l && k < f * l ? (f = k / l, h = j) :
      0 < l && k < g * l && (g = k / l);
    if (g < f) return !1
  }
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= f && f <= b.maxFraction);
  return 0 <= h ? (a.fraction = f, box2d.b2MulRV(c.q, this.m_normals[h], a.normal), !0) : !1
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "RayCast", box2d.b2PolygonShape.prototype.RayCast);
box2d.b2PolygonShape.prototype.RayCast.s_p1 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.RayCast.s_p2 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.RayCast.s_d = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeAABB = function(a, b) {
  for (var c = box2d.b2MulXV(b, this.m_vertices[0], a.lowerBound), e = a.upperBound.Copy(c), d = 0, f = this.m_count; d < f; ++d) {
    var g = box2d.b2MulXV(b, this.m_vertices[d], box2d.b2PolygonShape.prototype.ComputeAABB.s_v);
    box2d.b2MinV(g, c, c);
    box2d.b2MaxV(g, e, e)
  }
  d = this.m_radius;
  c.SelfSubXY(d, d);
  e.SelfAddXY(d, d)
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "ComputeAABB", box2d.b2PolygonShape.prototype.ComputeAABB);
box2d.b2PolygonShape.prototype.ComputeAABB.s_v = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeMass = function(a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= this.m_count);
  for (var c = box2d.b2PolygonShape.prototype.ComputeMass.s_center.SetZero(), e = 0, d = 0, f = box2d.b2PolygonShape.prototype.ComputeMass.s_s.SetZero(), g = 0, h = this.m_count; g < h; ++g) f.SelfAdd(this.m_vertices[g]);
  f.SelfMul(1 / this.m_count);
  for (var j = 1 / 3, g = 0, h = this.m_count; g < h; ++g) {
    var i = box2d.b2SubVV(this.m_vertices[g], f, box2d.b2PolygonShape.prototype.ComputeMass.s_e1),
      k = box2d.b2SubVV(this.m_vertices[(g + 1) %
        h], f, box2d.b2PolygonShape.prototype.ComputeMass.s_e2),
      l = box2d.b2CrossVV(i, k),
      m = 0.5 * l,
      e = e + m;
    c.SelfAdd(box2d.b2MulSV(m * j, box2d.b2AddVV(i, k, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t1));
    var m = i.x,
      i = i.y,
      n = k.x,
      k = k.y,
      d = d + 0.25 * j * l * (m * m + n * m + n * n + (i * i + k * i + k * k))
  }
  a.mass = b * e;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e > box2d.b2_epsilon);
  c.SelfMul(1 / e);
  box2d.b2AddVV(c, f, a.center);
  a.I = b * d;
  a.I += a.mass * (box2d.b2DotVV(a.center, a.center) - box2d.b2DotVV(c, c))
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "ComputeMass", box2d.b2PolygonShape.prototype.ComputeMass);
box2d.b2PolygonShape.prototype.ComputeMass.s_center = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeMass.s_s = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeMass.s_e1 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeMass.s_e2 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.Validate = function() {
  for (var a = 0; a < this.m_count; ++a)
    for (var b = a, c = (a + 1) % this.m_count, e = this.m_vertices[b], d = box2d.b2SubVV(this.m_vertices[c], e, box2d.b2PolygonShape.prototype.Validate.s_e), f = 0; f < this.m_count; ++f)
      if (!(f == b || f == c)) {
        var g = box2d.b2SubVV(this.m_vertices[f], e, box2d.b2PolygonShape.prototype.Validate.s_v);
        if (0 > box2d.b2CrossVV(d, g)) return !1
      }
  return !0
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "Validate", box2d.b2PolygonShape.prototype.Validate);
box2d.b2PolygonShape.prototype.Validate.s_e = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.Validate.s_v = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea = function(a, b, c, e) {
  for (var d = box2d.b2MulTRV(c.q, a, box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_normalL), f = b - box2d.b2DotVV(a, c.p), g = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_depths, h = 0, j = -1, b = -1, i = !1, a = 0, k = this.m_count; a < k; ++a) {
    g[a] = box2d.b2DotVV(d, this.m_vertices[a]) - f;
    var l = g[a] < -box2d.b2_epsilon;
    0 < a && (l ? i || (j = a - 1, h++) : i && (b = a - 1, h++));
    i = l
  }
  switch (h) {
    case 0:
      return i ? (a = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_md, this.ComputeMass(a,
        1), box2d.b2MulXV(c, a.center, e), a.mass) : 0;
    case 1:
      -1 == j ? j = this.m_count - 1 : b = this.m_count - 1
  }
  a = (j + 1) % this.m_count;
  d = (b + 1) % this.m_count;
  f = (0 - g[j]) / (g[a] - g[j]);
  g = (0 - g[b]) / (g[d] - g[b]);
  j = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_intoVec.SetXY(this.m_vertices[j].x * (1 - f) + this.m_vertices[a].x * f, this.m_vertices[j].y * (1 - f) + this.m_vertices[a].y * f);
  b = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_outoVec.SetXY(this.m_vertices[b].x * (1 - g) + this.m_vertices[d].x * g, this.m_vertices[b].y * (1 - g) + this.m_vertices[d].y *
    g);
  g = 0;
  f = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_center.SetZero();
  h = this.m_vertices[a];
  for (i = null; a != d;) a = (a + 1) % this.m_count, i = a == d ? b : this.m_vertices[a], k = 0.5 * ((h.x - j.x) * (i.y - j.y) - (h.y - j.y) * (i.x - j.x)), g += k, f.x += k * (j.x + h.x + i.x) / 3, f.y += k * (j.y + h.y + i.y) / 3, h = i;
  f.SelfMul(1 / g);
  box2d.b2MulXV(c, f, e);
  return g
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "ComputeSubmergedArea", box2d.b2PolygonShape.prototype.ComputeSubmergedArea);
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_normalL = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_depths = box2d.b2MakeNumberArray(box2d.b2_maxPolygonVertices);
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_md = new box2d.b2MassData;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_intoVec = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_outoVec = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_center = new box2d.b2Vec2;
box2d.b2PolygonShape.MakeAsBox = function(a, b) {
  return (new box2d.b2PolygonShape).SetAsBox(a, b)
};
goog.exportProperty(box2d.b2PolygonShape, "MakeAsBox", box2d.b2PolygonShape.MakeAsBox);
box2d.b2PolygonShape.MakeAsOrientedBox = function(a, b, c, e) {
  return (new box2d.b2PolygonShape).SetAsOrientedBox(a, b, c, e)
};
goog.exportProperty(box2d.b2PolygonShape, "MakeAsOrientedBox", box2d.b2PolygonShape.MakeAsOrientedBox);
box2d.b2PolygonShape.MakeAsVector = function(a, b) {
  return (new box2d.b2PolygonShape).SetAsVector(a, b)
};
goog.exportProperty(box2d.b2PolygonShape, "MakeAsVector", box2d.b2PolygonShape.MakeAsVector);
box2d.b2PolygonShape.MakeAsArray = function(a, b) {
  return (new box2d.b2PolygonShape).SetAsArray(a, b)
};
goog.exportProperty(box2d.b2PolygonShape, "MakeAsArray", box2d.b2PolygonShape.MakeAsArray);
box2d.b2CollideEdge = {};
box2d.b2CollideEdgeAndCircle = function(a, b, c, e, d) {
  a.pointCount = 0;
  var c = box2d.b2MulTXV(c, box2d.b2MulXV(d, e.m_p, box2d.b2Vec2.s_t0), box2d.b2CollideEdgeAndCircle.s_Q),
    f = b.m_vertex1,
    g = b.m_vertex2,
    h = box2d.b2SubVV(g, f, box2d.b2CollideEdgeAndCircle.s_e),
    j = box2d.b2DotVV(h, box2d.b2SubVV(g, c, box2d.b2Vec2.s_t0)),
    i = box2d.b2DotVV(h, box2d.b2SubVV(c, f, box2d.b2Vec2.s_t0)),
    k = b.m_radius + e.m_radius,
    d = box2d.b2CollideEdgeAndCircle.s_id;
  d.cf.indexB = 0;
  d.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
  if (0 >= i) {
    var l = f,
      j = box2d.b2SubVV(c,
        l, box2d.b2CollideEdgeAndCircle.s_d),
      j = box2d.b2DotVV(j, j);
    if (!(j > k * k)) {
      if (b.m_hasVertex0 && (b = box2d.b2SubVV(f, b.m_vertex0, box2d.b2CollideEdgeAndCircle.s_e1), 0 < box2d.b2DotVV(b, box2d.b2SubVV(f, c, box2d.b2Vec2.s_t0)))) return;
      d.cf.indexA = 0;
      d.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
      a.pointCount = 1;
      a.type = box2d.b2ManifoldType.e_circles;
      a.localNormal.SetZero();
      a.localPoint.Copy(l);
      a.points[0].id.Copy(d);
      a.points[0].localPoint.Copy(e.m_p)
    }
  } else if (0 >= j) {
    if (l = g, j = box2d.b2SubVV(c, l, box2d.b2CollideEdgeAndCircle.s_d),
      j = box2d.b2DotVV(j, j), !(j > k * k)) {
      if (b.m_hasVertex3 && (f = box2d.b2SubVV(b.m_vertex3, g, box2d.b2CollideEdgeAndCircle.s_e2), 0 < box2d.b2DotVV(f, box2d.b2SubVV(c, g, box2d.b2Vec2.s_t0)))) return;
      d.cf.indexA = 1;
      d.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
      a.pointCount = 1;
      a.type = box2d.b2ManifoldType.e_circles;
      a.localNormal.SetZero();
      a.localPoint.Copy(l);
      a.points[0].id.Copy(d);
      a.points[0].localPoint.Copy(e.m_p)
    }
  } else b = box2d.b2DotVV(h, h), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < b), l = box2d.b2CollideEdgeAndCircle.s_P,
    l.x = 1 / b * (j * f.x + i * g.x), l.y = 1 / b * (j * f.y + i * g.y), j = box2d.b2SubVV(c, l, box2d.b2CollideEdgeAndCircle.s_d), j = box2d.b2DotVV(j, j), j > k * k || (l = box2d.b2CollideEdgeAndCircle.s_n.SetXY(-h.y, h.x), 0 > box2d.b2DotVV(l, box2d.b2SubVV(c, f, box2d.b2Vec2.s_t0)) && l.SetXY(-l.x, -l.y), l.Normalize(), d.cf.indexA = 0, d.cf.typeA = box2d.b2ContactFeatureType.e_face, a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, a.localNormal.Copy(l), a.localPoint.Copy(f), a.points[0].id.Copy(d), a.points[0].localPoint.Copy(e.m_p))
};
goog.exportSymbol("box2d.b2CollideEdgeAndCircle", box2d.b2CollideEdgeAndCircle);
box2d.b2CollideEdgeAndCircle.s_Q = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_e = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_d = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_e1 = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_e2 = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_P = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_n = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_id = new box2d.b2ContactID;
box2d.b2EPAxisType = {
  e_unknown: 0,
  e_edgeA: 1,
  e_edgeB: 2
};
goog.exportSymbol("box2d.b2EPAxisType", box2d.b2EPAxisType);
goog.exportProperty(box2d.b2EPAxisType, "e_unknown", box2d.b2EPAxisType.e_unknown);
goog.exportProperty(box2d.b2EPAxisType, "e_edgeA", box2d.b2EPAxisType.e_edgeA);
goog.exportProperty(box2d.b2EPAxisType, "e_edgeB", box2d.b2EPAxisType.e_edgeB);
box2d.b2EPAxis = function() {};
goog.exportSymbol("box2d.b2EPAxis", box2d.b2EPAxis);
box2d.b2EPAxis.prototype.type = box2d.b2EPAxisType.e_unknown;
goog.exportProperty(box2d.b2EPAxis.prototype, "type", box2d.b2EPAxis.prototype.type);
box2d.b2EPAxis.prototype.index = 0;
goog.exportProperty(box2d.b2EPAxis.prototype, "index", box2d.b2EPAxis.prototype.index);
box2d.b2EPAxis.prototype.separation = 0;
goog.exportProperty(box2d.b2EPAxis.prototype, "separation", box2d.b2EPAxis.prototype.separation);
box2d.b2TempPolygon = function() {
  this.vertices = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
  this.normals = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
  this.count = 0
};
goog.exportSymbol("box2d.b2TempPolygon", box2d.b2TempPolygon);
box2d.b2TempPolygon.prototype.vertices = null;
goog.exportProperty(box2d.b2TempPolygon.prototype, "vertices", box2d.b2TempPolygon.prototype.vertices);
box2d.b2TempPolygon.prototype.normals = null;
goog.exportProperty(box2d.b2TempPolygon.prototype, "normals", box2d.b2TempPolygon.prototype.normals);
box2d.b2TempPolygon.prototype.count = 0;
goog.exportProperty(box2d.b2TempPolygon.prototype, "count", box2d.b2TempPolygon.prototype.count);
box2d.b2ReferenceFace = function() {
  this.i2 = this.i1 = 0;
  this.v1 = new box2d.b2Vec2;
  this.v2 = new box2d.b2Vec2;
  this.normal = new box2d.b2Vec2;
  this.sideNormal1 = new box2d.b2Vec2;
  this.sideOffset1 = 0;
  this.sideNormal2 = new box2d.b2Vec2;
  this.sideOffset2 = 0
};
goog.exportSymbol("box2d.b2ReferenceFace", box2d.b2ReferenceFace);
box2d.b2ReferenceFace.prototype.i1 = 0;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "i1", box2d.b2ReferenceFace.prototype.i1);
box2d.b2ReferenceFace.prototype.i2 = 0;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "i2", box2d.b2ReferenceFace.prototype.i2);
box2d.b2ReferenceFace.prototype.v1 = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "v1", box2d.b2ReferenceFace.prototype.v1);
box2d.b2ReferenceFace.prototype.v2 = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "v2", box2d.b2ReferenceFace.prototype.v2);
box2d.b2ReferenceFace.prototype.normal = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "normal", box2d.b2ReferenceFace.prototype.normal);
box2d.b2ReferenceFace.prototype.sideNormal1 = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "sideNormal1", box2d.b2ReferenceFace.prototype.sideNormal1);
box2d.b2ReferenceFace.prototype.sideOffset1 = 0;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "sideOffset1", box2d.b2ReferenceFace.prototype.sideOffset1);
box2d.b2ReferenceFace.prototype.sideNormal2 = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "sideNormal2", box2d.b2ReferenceFace.prototype.sideNormal2);
box2d.b2ReferenceFace.prototype.sideOffset2 = 0;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "sideOffset2", box2d.b2ReferenceFace.prototype.sideOffset2);
box2d.b2EPColliderVertexType = {
  e_isolated: 0,
  e_concave: 1,
  e_convex: 2
};
goog.exportSymbol("box2d.b2EPColliderVertexType", box2d.b2EPColliderVertexType);
goog.exportProperty(box2d.b2EPColliderVertexType, "e_isolated", box2d.b2EPColliderVertexType.e_isolated);
goog.exportProperty(box2d.b2EPColliderVertexType, "e_concave", box2d.b2EPColliderVertexType.e_concave);
goog.exportProperty(box2d.b2EPColliderVertexType, "e_convex", box2d.b2EPColliderVertexType.e_convex);
box2d.b2EPCollider = function() {
  this.m_polygonB = new box2d.b2TempPolygon;
  this.m_xf = new box2d.b2Transform;
  this.m_centroidB = new box2d.b2Vec2;
  this.m_v0 = new box2d.b2Vec2;
  this.m_v1 = new box2d.b2Vec2;
  this.m_v2 = new box2d.b2Vec2;
  this.m_v3 = new box2d.b2Vec2;
  this.m_normal0 = new box2d.b2Vec2;
  this.m_normal1 = new box2d.b2Vec2;
  this.m_normal2 = new box2d.b2Vec2;
  this.m_normal = new box2d.b2Vec2;
  this.m_type2 = this.m_type1 = box2d.b2EPColliderVertexType.e_isolated;
  this.m_lowerLimit = new box2d.b2Vec2;
  this.m_upperLimit = new box2d.b2Vec2;
  this.m_radius = 0;
  this.m_front = !1
};
goog.exportSymbol("box2d.b2EPCollider", box2d.b2EPCollider);
box2d.b2EPCollider.prototype.m_polygonB = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_polygonB", box2d.b2EPCollider.prototype.m_polygonB);
box2d.b2EPCollider.prototype.m_xf = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_xf", box2d.b2EPCollider.prototype.m_xf);
box2d.b2EPCollider.prototype.m_centroidB = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_centroidB", box2d.b2EPCollider.prototype.m_centroidB);
box2d.b2EPCollider.prototype.m_v0 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_v0", box2d.b2EPCollider.prototype.m_v0);
box2d.b2EPCollider.prototype.m_v1 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_v1", box2d.b2EPCollider.prototype.m_v1);
box2d.b2EPCollider.prototype.m_v2 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_v2", box2d.b2EPCollider.prototype.m_v2);
box2d.b2EPCollider.prototype.m_v3 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_v3", box2d.b2EPCollider.prototype.m_v3);
box2d.b2EPCollider.prototype.m_normal0 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_normal0", box2d.b2EPCollider.prototype.m_normal0);
box2d.b2EPCollider.prototype.m_normal1 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_normal1", box2d.b2EPCollider.prototype.m_normal1);
box2d.b2EPCollider.prototype.m_normal2 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_normal2", box2d.b2EPCollider.prototype.m_normal2);
box2d.b2EPCollider.prototype.m_normal = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_normal", box2d.b2EPCollider.prototype.m_normal);
box2d.b2EPCollider.prototype.m_type1 = box2d.b2EPColliderVertexType.e_isolated;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_type1", box2d.b2EPCollider.prototype.m_type1);
box2d.b2EPCollider.prototype.m_type2 = box2d.b2EPColliderVertexType.e_isolated;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_type2", box2d.b2EPCollider.prototype.m_type2);
box2d.b2EPCollider.prototype.m_lowerLimit = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_lowerLimit", box2d.b2EPCollider.prototype.m_lowerLimit);
box2d.b2EPCollider.prototype.m_upperLimit = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_upperLimit", box2d.b2EPCollider.prototype.m_upperLimit);
box2d.b2EPCollider.prototype.m_radius = 0;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_radius", box2d.b2EPCollider.prototype.m_radius);
box2d.b2EPCollider.prototype.m_front = !1;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_front", box2d.b2EPCollider.prototype.m_front);
box2d.b2EPCollider.prototype.Collide = function(a, b, c, e, d) {
  box2d.b2MulTXX(c, d, this.m_xf);
  box2d.b2MulXV(this.m_xf, e.m_centroid, this.m_centroidB);
  this.m_v0.Copy(b.m_vertex0);
  this.m_v1.Copy(b.m_vertex1);
  this.m_v2.Copy(b.m_vertex2);
  this.m_v3.Copy(b.m_vertex3);
  c = b.m_hasVertex0;
  b = b.m_hasVertex3;
  d = box2d.b2SubVV(this.m_v2, this.m_v1, box2d.b2EPCollider.s_edge1);
  d.Normalize();
  this.m_normal1.SetXY(d.y, -d.x);
  var f = box2d.b2DotVV(this.m_normal1, box2d.b2SubVV(this.m_centroidB, this.m_v1, box2d.b2Vec2.s_t0)),
    g = 0,
    h = 0,
    j = !1,
    i = !1;
  c && (g = box2d.b2SubVV(this.m_v1, this.m_v0, box2d.b2EPCollider.s_edge0), g.Normalize(), this.m_normal0.SetXY(g.y, -g.x), j = 0 <= box2d.b2CrossVV(g, d), g = box2d.b2DotVV(this.m_normal0, box2d.b2SubVV(this.m_centroidB, this.m_v0, box2d.b2Vec2.s_t0)));
  b && (h = box2d.b2SubVV(this.m_v3, this.m_v2, box2d.b2EPCollider.s_edge2), h.Normalize(), this.m_normal2.SetXY(h.y, -h.x), i = 0 < box2d.b2CrossVV(d, h), h = box2d.b2DotVV(this.m_normal2, box2d.b2SubVV(this.m_centroidB, this.m_v2, box2d.b2Vec2.s_t0)));
  c && b ? j && i ? (this.m_front = 0 <= g ||
    0 <= f || 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal0), this.m_upperLimit.Copy(this.m_normal2)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : j ? (this.m_front = 0 <= g || 0 <= f && 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal0), this.m_upperLimit.Copy(this.m_normal1)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal2).SelfNeg(),
    this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : i ? (this.m_front = 0 <= h || 0 <= g && 0 <= f) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal2)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal0).SelfNeg()) : (this.m_front = 0 <= g && 0 <= f && 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal1)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
    this.m_lowerLimit.Copy(this.m_normal2).SelfNeg(), this.m_upperLimit.Copy(this.m_normal0).SelfNeg()) : c ? j ? ((this.m_front = 0 <= g || 0 <= f) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal0)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1)), this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : (this.m_front = 0 <= g && 0 <= f) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
    this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal0).SelfNeg()) : b ? i ? (this.m_front = 0 <= f || 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal2)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal1)) : ((this.m_front = 0 <= f && 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg()) : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
    this.m_lowerLimit.Copy(this.m_normal2).SelfNeg()), this.m_upperLimit.Copy(this.m_normal1)) : (this.m_front = 0 <= f) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal1));
  this.m_polygonB.count = e.m_count;
  f = 0;
  for (g = e.m_count; f < g; ++f) box2d.b2MulXV(this.m_xf, e.m_vertices[f], this.m_polygonB.vertices[f]), box2d.b2MulRV(this.m_xf.q,
    e.m_normals[f], this.m_polygonB.normals[f]);
  this.m_radius = 2 * box2d.b2_polygonRadius;
  a.pointCount = 0;
  c = this.ComputeEdgeSeparation(box2d.b2EPCollider.s_edgeAxis);
  if (c.type != box2d.b2EPAxisType.e_unknown && !(c.separation > this.m_radius) && (b = this.ComputePolygonSeparation(box2d.b2EPCollider.s_polygonAxis), !(b.type != box2d.b2EPAxisType.e_unknown && b.separation > this.m_radius))) {
    c = b.type == box2d.b2EPAxisType.e_unknown ? c : b.separation > 0.98 * c.separation + 0.0010 ? b : c;
    d = box2d.b2EPCollider.s_ie;
    b = box2d.b2EPCollider.s_rf;
    if (c.type == box2d.b2EPAxisType.e_edgeA) {
      a.type = box2d.b2ManifoldType.e_faceA;
      h = 0;
      j = box2d.b2DotVV(this.m_normal, this.m_polygonB.normals[0]);
      f = 1;
      for (g = this.m_polygonB.count; f < g; ++f) i = box2d.b2DotVV(this.m_normal, this.m_polygonB.normals[f]), i < j && (j = i, h = f);
      g = h;
      f = (g + 1) % this.m_polygonB.count;
      h = d[0];
      h.v.Copy(this.m_polygonB.vertices[g]);
      h.id.cf.indexA = 0;
      h.id.cf.indexB = g;
      h.id.cf.typeA = box2d.b2ContactFeatureType.e_face;
      h.id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
      g = d[1];
      g.v.Copy(this.m_polygonB.vertices[f]);
      g.id.cf.indexA = 0;
      g.id.cf.indexB = f;
      g.id.cf.typeA = box2d.b2ContactFeatureType.e_face;
      g.id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
      this.m_front ? (b.i1 = 0, b.i2 = 1, b.v1.Copy(this.m_v1), b.v2.Copy(this.m_v2), b.normal.Copy(this.m_normal1)) : (b.i1 = 1, b.i2 = 0, b.v1.Copy(this.m_v2), b.v2.Copy(this.m_v1), b.normal.Copy(this.m_normal1).SelfNeg())
    } else a.type = box2d.b2ManifoldType.e_faceB, h = d[0], h.v.Copy(this.m_v1), h.id.cf.indexA = 0, h.id.cf.indexB = c.index, h.id.cf.typeA = box2d.b2ContactFeatureType.e_vertex, h.id.cf.typeB =
      box2d.b2ContactFeatureType.e_face, g = d[1], g.v.Copy(this.m_v2), g.id.cf.indexA = 0, g.id.cf.indexB = c.index, g.id.cf.typeA = box2d.b2ContactFeatureType.e_vertex, g.id.cf.typeB = box2d.b2ContactFeatureType.e_face, b.i1 = c.index, b.i2 = (b.i1 + 1) % this.m_polygonB.count, b.v1.Copy(this.m_polygonB.vertices[b.i1]), b.v2.Copy(this.m_polygonB.vertices[b.i2]), b.normal.Copy(this.m_polygonB.normals[b.i1]);
    b.sideNormal1.SetXY(b.normal.y, -b.normal.x);
    b.sideNormal2.Copy(b.sideNormal1).SelfNeg();
    b.sideOffset1 = box2d.b2DotVV(b.sideNormal1,
      b.v1);
    b.sideOffset2 = box2d.b2DotVV(b.sideNormal2, b.v2);
    f = box2d.b2EPCollider.s_clipPoints1;
    h = box2d.b2EPCollider.s_clipPoints2;
    g = 0;
    g = box2d.b2ClipSegmentToLine(f, d, b.sideNormal1, b.sideOffset1, b.i1);
    if (!(g < box2d.b2_maxManifoldPoints) && (g = box2d.b2ClipSegmentToLine(h, f, b.sideNormal2, b.sideOffset2, b.i2), !(g < box2d.b2_maxManifoldPoints))) {
      c.type == box2d.b2EPAxisType.e_edgeA ? (a.localNormal.Copy(b.normal), a.localPoint.Copy(b.v1)) : (a.localNormal.Copy(e.m_normals[b.i1]), a.localPoint.Copy(e.m_vertices[b.i1]));
      f =
        e = 0;
      for (g = box2d.b2_maxManifoldPoints; f < g; ++f) box2d.b2DotVV(b.normal, box2d.b2SubVV(h[f].v, b.v1, box2d.b2Vec2.s_t0)) <= this.m_radius && (d = a.points[e], c.type == box2d.b2EPAxisType.e_edgeA ? (box2d.b2MulTXV(this.m_xf, h[f].v, d.localPoint), d.id = h[f].id) : (d.localPoint.Copy(h[f].v), d.id.cf.typeA = h[f].id.cf.typeB, d.id.cf.typeB = h[f].id.cf.typeA, d.id.cf.indexA = h[f].id.cf.indexB, d.id.cf.indexB = h[f].id.cf.indexA), ++e);
      a.pointCount = e
    }
  }
};
goog.exportProperty(box2d.b2EPCollider.prototype, "Collide", box2d.b2EPCollider.prototype.Collide);
box2d.b2EPCollider.s_edge1 = new box2d.b2Vec2;
box2d.b2EPCollider.s_edge0 = new box2d.b2Vec2;
box2d.b2EPCollider.s_edge2 = new box2d.b2Vec2;
box2d.b2EPCollider.s_ie = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_rf = new box2d.b2ReferenceFace;
box2d.b2EPCollider.s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_edgeAxis = new box2d.b2EPAxis;
box2d.b2EPCollider.s_polygonAxis = new box2d.b2EPAxis;
box2d.b2EPCollider.prototype.ComputeEdgeSeparation = function(a) {
  a.type = box2d.b2EPAxisType.e_edgeA;
  a.index = this.m_front ? 0 : 1;
  a.separation = box2d.b2_maxFloat;
  for (var b = 0, c = this.m_polygonB.count; b < c; ++b) {
    var e = box2d.b2DotVV(this.m_normal, box2d.b2SubVV(this.m_polygonB.vertices[b], this.m_v1, box2d.b2Vec2.s_t0));
    e < a.separation && (a.separation = e)
  }
  return a
};
goog.exportProperty(box2d.b2EPCollider.prototype, "ComputeEdgeSeparation", box2d.b2EPCollider.prototype.ComputeEdgeSeparation);
box2d.b2EPCollider.prototype.ComputePolygonSeparation = function(a) {
  a.type = box2d.b2EPAxisType.e_unknown;
  a.index = -1;
  a.separation = -box2d.b2_maxFloat;
  for (var b = box2d.b2EPCollider.s_perp.SetXY(-this.m_normal.y, this.m_normal.x), c = 0, e = this.m_polygonB.count; c < e; ++c) {
    var d = box2d.b2NegV(this.m_polygonB.normals[c], box2d.b2EPCollider.s_n),
      f = box2d.b2DotVV(d, box2d.b2SubVV(this.m_polygonB.vertices[c], this.m_v1, box2d.b2Vec2.s_t0)),
      g = box2d.b2DotVV(d, box2d.b2SubVV(this.m_polygonB.vertices[c], this.m_v2, box2d.b2Vec2.s_t0)),
      f = box2d.b2Min(f, g);
    if (f > this.m_radius) {
      a.type = box2d.b2EPAxisType.e_edgeB;
      a.index = c;
      a.separation = f;
      break
    }
    if (0 <= box2d.b2DotVV(d, b)) {
      if (box2d.b2DotVV(box2d.b2SubVV(d, this.m_upperLimit, box2d.b2Vec2.s_t0), this.m_normal) < -box2d.b2_angularSlop) continue
    } else if (box2d.b2DotVV(box2d.b2SubVV(d, this.m_lowerLimit, box2d.b2Vec2.s_t0), this.m_normal) < -box2d.b2_angularSlop) continue;
    f > a.separation && (a.type = box2d.b2EPAxisType.e_edgeB, a.index = c, a.separation = f)
  }
  return a
};
goog.exportProperty(box2d.b2EPCollider.prototype, "ComputePolygonSeparation", box2d.b2EPCollider.prototype.ComputePolygonSeparation);
box2d.b2EPCollider.s_n = new box2d.b2Vec2;
box2d.b2EPCollider.s_perp = new box2d.b2Vec2;
box2d.b2CollideEdgeAndPolygon = function(a, b, c, e, d) {
  box2d.b2CollideEdgeAndPolygon.s_collider.Collide(a, b, c, e, d)
};
goog.exportSymbol("box2d.b2CollideEdgeAndPolygon", box2d.b2CollideEdgeAndPolygon);
box2d.b2CollideEdgeAndPolygon.s_collider = new box2d.b2EPCollider;
box2d.b2EdgeShape = function() {
  box2d.b2Shape.call(this, box2d.b2ShapeType.e_edgeShape, box2d.b2_polygonRadius);
  this.m_vertex1 = new box2d.b2Vec2;
  this.m_vertex2 = new box2d.b2Vec2;
  this.m_vertex0 = new box2d.b2Vec2;
  this.m_vertex3 = new box2d.b2Vec2
};
goog.inherits(box2d.b2EdgeShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2EdgeShape", box2d.b2EdgeShape);
box2d.b2EdgeShape.prototype.m_vertex1 = null;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_vertex1", box2d.b2EdgeShape.prototype.m_vertex1);
box2d.b2EdgeShape.prototype.m_vertex2 = null;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_vertex2", box2d.b2EdgeShape.prototype.m_vertex2);
box2d.b2EdgeShape.prototype.m_vertex0 = null;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_vertex0", box2d.b2EdgeShape.prototype.m_vertex0);
box2d.b2EdgeShape.prototype.m_vertex3 = null;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_vertex3", box2d.b2EdgeShape.prototype.m_vertex3);
box2d.b2EdgeShape.prototype.m_hasVertex0 = !1;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_hasVertex0", box2d.b2EdgeShape.prototype.m_hasVertex0);
box2d.b2EdgeShape.prototype.m_hasVertex3 = !1;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_hasVertex3", box2d.b2EdgeShape.prototype.m_hasVertex3);
box2d.b2EdgeShape.prototype.SetAsEdge = function(a, b) {
  this.m_vertex1.Copy(a);
  this.m_vertex2.Copy(b);
  this.m_hasVertex3 = this.m_hasVertex0 = !1;
  return this
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "SetAsEdge", box2d.b2EdgeShape.prototype.SetAsEdge);
box2d.b2EdgeShape.prototype.Clone = function() {
  return (new box2d.b2EdgeShape).Copy(this)
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "Clone", box2d.b2EdgeShape.prototype.Clone);
box2d.b2EdgeShape.prototype.Copy = function(a) {
  box2d.b2EdgeShape.superClass_.Copy.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2EdgeShape);
  this.m_vertex1.Copy(a.m_vertex1);
  this.m_vertex2.Copy(a.m_vertex2);
  this.m_vertex0.Copy(a.m_vertex0);
  this.m_vertex3.Copy(a.m_vertex3);
  this.m_hasVertex0 = a.m_hasVertex0;
  this.m_hasVertex3 = a.m_hasVertex3;
  return this
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "Copy", box2d.b2EdgeShape.prototype.Copy);
box2d.b2EdgeShape.prototype.GetChildCount = function() {
  return 1
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "GetChildCount", box2d.b2EdgeShape.prototype.GetChildCount);
box2d.b2EdgeShape.prototype.TestPoint = function() {
  return !1
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "TestPoint", box2d.b2EdgeShape.prototype.TestPoint);
box2d.b2EdgeShape.prototype.RayCast = function(a, b, c) {
  var e = box2d.b2MulTXV(c, b.p1, box2d.b2EdgeShape.prototype.RayCast.s_p1),
    c = box2d.b2MulTXV(c, b.p2, box2d.b2EdgeShape.prototype.RayCast.s_p2),
    d = box2d.b2SubVV(c, e, box2d.b2EdgeShape.prototype.RayCast.s_d),
    c = this.m_vertex1,
    f = this.m_vertex2,
    g = box2d.b2SubVV(f, c, box2d.b2EdgeShape.prototype.RayCast.s_e),
    h = a.normal.SetXY(g.y, -g.x).SelfNormalize(),
    g = box2d.b2DotVV(h, box2d.b2SubVV(c, e, box2d.b2Vec2.s_t0)),
    h = box2d.b2DotVV(h, d);
  if (0 == h) return !1;
  h = g / h;
  if (0 > h || b.maxFraction <
    h) return !1;
  b = box2d.b2AddVMulSV(e, h, d, box2d.b2EdgeShape.prototype.RayCast.s_q);
  e = box2d.b2SubVV(f, c, box2d.b2EdgeShape.prototype.RayCast.s_r);
  f = box2d.b2DotVV(e, e);
  if (0 == f) return !1;
  c = box2d.b2DotVV(box2d.b2SubVV(b, c, box2d.b2Vec2.s_t0), e) / f;
  if (0 > c || 1 < c) return !1;
  a.fraction = h;
  0 < g && a.normal.SelfNeg();
  return !0
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "RayCast", box2d.b2EdgeShape.prototype.RayCast);
box2d.b2EdgeShape.prototype.RayCast.s_p1 = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_p2 = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_d = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_e = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_q = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_r = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.ComputeAABB = function(a, b) {
  var c = box2d.b2MulXV(b, this.m_vertex1, box2d.b2EdgeShape.prototype.ComputeAABB.s_v1),
    e = box2d.b2MulXV(b, this.m_vertex2, box2d.b2EdgeShape.prototype.ComputeAABB.s_v2);
  box2d.b2MinV(c, e, a.lowerBound);
  box2d.b2MaxV(c, e, a.upperBound);
  c = this.m_radius;
  a.lowerBound.SelfSubXY(c, c);
  a.upperBound.SelfAddXY(c, c)
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "ComputeAABB", box2d.b2EdgeShape.prototype.ComputeAABB);
box2d.b2EdgeShape.prototype.ComputeAABB.s_v1 = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.ComputeAABB.s_v2 = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.ComputeMass = function(a) {
  a.mass = 0;
  box2d.b2MidVV(this.m_vertex1, this.m_vertex2, a.center);
  a.I = 0
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "ComputeMass", box2d.b2EdgeShape.prototype.ComputeMass);
box2d.b2EdgeShape.prototype.ComputeSubmergedArea = function(a, b, c, e) {
  e.SetZero();
  return 0
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "ComputeSubmergedArea", box2d.b2EdgeShape.prototype.ComputeSubmergedArea);
box2d.b2ChainShape = function() {
  box2d.b2Shape.call(this, box2d.b2ShapeType.e_chainShape, box2d.b2_polygonRadius);
  this.m_prevVertex = new box2d.b2Vec2;
  this.m_nextVertex = new box2d.b2Vec2
};
goog.inherits(box2d.b2ChainShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2ChainShape", box2d.b2ChainShape);
box2d.b2ChainShape.prototype.m_vertices = null;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_vertices", box2d.b2ChainShape.prototype.m_vertices);
box2d.b2ChainShape.prototype.m_count = 0;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_count", box2d.b2ChainShape.prototype.m_count);
box2d.b2ChainShape.prototype.m_prevVertex = null;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_prevVertex", box2d.b2ChainShape.prototype.m_prevVertex);
box2d.b2ChainShape.prototype.m_nextVertex = null;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_nextVertex", box2d.b2ChainShape.prototype.m_nextVertex);
box2d.b2ChainShape.prototype.m_hasPrevVertex = !1;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_hasPrevVertex", box2d.b2ChainShape.prototype.m_hasPrevVertex);
box2d.b2ChainShape.prototype.m_hasNextVertex = !1;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_hasNextVertex", box2d.b2ChainShape.prototype.m_hasNextVertex);
box2d.b2ChainShape.prototype.CreateLoop = function(a, b) {
  b = b || a.length;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null == this.m_vertices && 0 == this.m_count);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= b);
  if (box2d.ENABLE_ASSERTS)
    for (var c = 1; c < b; ++c) box2d.b2Assert(box2d.b2DistanceSquaredVV(a[c - 1], a[c]) > box2d.b2_linearSlop * box2d.b2_linearSlop);
  this.m_count = b + 1;
  this.m_vertices = box2d.b2Vec2.MakeArray(this.m_count);
  for (c = 0; c < b; ++c) this.m_vertices[c].Copy(a[c]);
  this.m_vertices[b].Copy(this.m_vertices[0]);
  this.m_prevVertex.Copy(this.m_vertices[this.m_count -
    2]);
  this.m_nextVertex.Copy(this.m_vertices[1]);
  this.m_hasNextVertex = this.m_hasPrevVertex = !0;
  return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "CreateLoop", box2d.b2ChainShape.prototype.CreateLoop);
box2d.b2ChainShape.prototype.CreateChain = function(a, b) {
  b = b || a.length;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null == this.m_vertices && 0 == this.m_count);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(2 <= b);
  if (box2d.ENABLE_ASSERTS)
    for (var c = 1; c < b; ++c) box2d.b2Assert(box2d.b2DistanceSquaredVV(a[c - 1], a[c]) > box2d.b2_linearSlop * box2d.b2_linearSlop);
  this.m_count = b;
  this.m_vertices = box2d.b2Vec2.MakeArray(b);
  for (c = 0; c < b; ++c) this.m_vertices[c].Copy(a[c]);
  this.m_hasNextVertex = this.m_hasPrevVertex = !1;
  return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "CreateChain", box2d.b2ChainShape.prototype.CreateChain);
box2d.b2ChainShape.prototype.SetPrevVertex = function(a) {
  this.m_prevVertex.Copy(a);
  this.m_hasprevVertex = !0;
  return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "SetPrevVertex", box2d.b2ChainShape.prototype.SetPrevVertex);
box2d.b2ChainShape.prototype.SetNextVertex = function(a) {
  this.m_nextVertex.Copy(a);
  this.m_hasNextVertex = !0;
  return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "SetNextVertex", box2d.b2ChainShape.prototype.SetNextVertex);
box2d.b2ChainShape.prototype.Clone = function() {
  return (new box2d.b2ChainShape).Copy(this)
};
goog.exportProperty(box2d.b2ChainShape.prototype, "Clone", box2d.b2ChainShape.prototype.Clone);
box2d.b2ChainShape.prototype.Copy = function(a) {
  box2d.b2ChainShape.superClass_.Copy.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2ChainShape);
  this.CreateChain(a.m_vertices, a.m_count);
  this.m_prevVertex.Copy(a.m_prevVertex);
  this.m_nextVertex.Copy(a.m_nextVertex);
  this.m_hasPrevVertex = a.m_hasPrevVertex;
  this.m_hasNextVertex = a.m_hasNextVertex;
  return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "Copy", box2d.b2ChainShape.prototype.Copy);
box2d.b2ChainShape.prototype.GetChildCount = function() {
  return this.m_count - 1
};
goog.exportProperty(box2d.b2ChainShape.prototype, "GetChildCount", box2d.b2ChainShape.prototype.GetChildCount);
box2d.b2ChainShape.prototype.GetChildEdge = function(a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && b < this.m_count - 1);
  a.m_type = box2d.b2ShapeType.e_edgeShape;
  a.m_radius = this.m_radius;
  a.m_vertex1.Copy(this.m_vertices[b]);
  a.m_vertex2.Copy(this.m_vertices[b + 1]);
  0 < b ? (a.m_vertex0.Copy(this.m_vertices[b - 1]), a.m_hasVertex0 = !0) : (a.m_vertex0.Copy(this.m_prevVertex), a.m_hasVertex0 = this.m_hasPrevVertex);
  b < this.m_count - 2 ? (a.m_vertex3.Copy(this.m_vertices[b + 2]), a.m_hasVertex3 = !0) : (a.m_vertex3.Copy(this.m_nextVertex),
    a.m_hasVertex3 = this.m_hasNextVertex)
};
goog.exportProperty(box2d.b2ChainShape.prototype, "GetChildEdge", box2d.b2ChainShape.prototype.GetChildEdge);
box2d.b2ChainShape.prototype.TestPoint = function() {
  return !1
};
goog.exportProperty(box2d.b2ChainShape.prototype, "TestPoint", box2d.b2ChainShape.prototype.TestPoint);
box2d.b2ChainShape.prototype.RayCast = function(a, b, c, e) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e < this.m_count);
  var d = box2d.b2ChainShape.s_edgeShape;
  d.m_vertex1.Copy(this.m_vertices[e]);
  d.m_vertex2.Copy(this.m_vertices[(e + 1) % this.m_count]);
  return d.RayCast(a, b, c, 0)
};
goog.exportProperty(box2d.b2ChainShape.prototype, "RayCast", box2d.b2ChainShape.prototype.RayCast);
box2d.b2ChainShape.s_edgeShape = new box2d.b2EdgeShape;
goog.exportProperty(box2d.b2ChainShape, "s_edgeShape", box2d.b2ChainShape.s_edgeShape);
box2d.b2ChainShape.prototype.ComputeAABB = function(a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c < this.m_count);
  var e = this.m_vertices[(c + 1) % this.m_count],
    c = box2d.b2MulXV(b, this.m_vertices[c], box2d.b2ChainShape.prototype.ComputeAABB.s_v1),
    b = box2d.b2MulXV(b, e, box2d.b2ChainShape.prototype.ComputeAABB.s_v2);
  box2d.b2MinV(c, b, a.lowerBound);
  box2d.b2MaxV(c, b, a.upperBound)
};
goog.exportProperty(box2d.b2ChainShape.prototype, "ComputeAABB", box2d.b2ChainShape.prototype.ComputeAABB);
box2d.b2ChainShape.prototype.ComputeAABB.s_v1 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2ChainShape.prototype.ComputeAABB, "s_v1", box2d.b2ChainShape.prototype.ComputeAABB.s_v1);
box2d.b2ChainShape.prototype.ComputeAABB.s_v2 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2ChainShape.prototype.ComputeAABB, "s_v2", box2d.b2ChainShape.prototype.ComputeAABB.s_v2);
box2d.b2ChainShape.prototype.ComputeMass = function(a) {
  a.mass = 0;
  a.center.SetZero();
  a.I = 0
};
goog.exportProperty(box2d.b2ChainShape.prototype, "ComputeMass", box2d.b2ChainShape.prototype.ComputeMass);
box2d.b2ChainShape.prototype.ComputeSubmergedArea = function(a, b, c, e) {
  e.SetZero();
  return 0
};
goog.exportProperty(box2d.b2ChainShape.prototype, "ComputeSubmergedArea", box2d.b2ChainShape.prototype.ComputeSubmergedArea);
box2d.b2ChainAndPolygonContact = function() {
  box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2ChainAndPolygonContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2ChainAndPolygonContact", box2d.b2ChainAndPolygonContact);
box2d.b2ChainAndPolygonContact.Create = function() {
  return new box2d.b2ChainAndPolygonContact
};
goog.exportProperty(box2d.b2ChainAndPolygonContact, "Create", box2d.b2ChainAndPolygonContact.Create);
box2d.b2ChainAndPolygonContact.Destroy = function() {};
goog.exportProperty(box2d.b2ChainAndPolygonContact, "Destroy", box2d.b2ChainAndPolygonContact.Destroy);
box2d.b2ChainAndPolygonContact.prototype.Reset = function(a, b, c, e) {
  box2d.b2ChainAndPolygonContact.superClass_.Reset.call(this, a, b, c, e);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() == box2d.b2ShapeType.e_chainShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() == box2d.b2ShapeType.e_polygonShape)
};
goog.exportProperty(box2d.b2ChainAndPolygonContact.prototype, "Reset", box2d.b2ChainAndPolygonContact.prototype.Reset);
box2d.b2ChainAndPolygonContact.prototype.Evaluate = function(a, b, c) {
  var e = this.m_fixtureA.GetShape(),
    d = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2ChainShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2PolygonShape);
  var f = box2d.b2ChainAndPolygonContact.prototype.Evaluate.s_edge;
  (e instanceof box2d.b2ChainShape ? e : null).GetChildEdge(f, this.m_indexA);
  box2d.b2CollideEdgeAndPolygon(a, f, b, d instanceof box2d.b2PolygonShape ? d : null, c)
};
goog.exportProperty(box2d.b2ChainAndPolygonContact.prototype, "Evaluate", box2d.b2ChainAndPolygonContact.prototype.Evaluate);
box2d.b2ChainAndPolygonContact.prototype.Evaluate.s_edge = new box2d.b2EdgeShape;
box2d.b2CollidePolygon = {};
box2d.b2EdgeSeparation = function(a, b, c, e, d) {
  var f = a.m_count,
    g = a.m_vertices,
    h = a.m_normals,
    a = e.m_count,
    e = e.m_vertices;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= c && c < f);
  for (var f = box2d.b2MulRV(b.q, h[c], box2d.b2EdgeSeparation.s_normal1World), j = box2d.b2MulTRV(d.q, f, box2d.b2EdgeSeparation.s_normal1), h = 0, i = box2d.b2_maxFloat, k = 0; k < a; ++k) {
    var l = box2d.b2DotVV(e[k], j);
    l < i && (i = l, h = k)
  }
  b = box2d.b2MulXV(b, g[c], box2d.b2EdgeSeparation.s_v1);
  d = box2d.b2MulXV(d, e[h], box2d.b2EdgeSeparation.s_v2);
  return box2d.b2DotVV(box2d.b2SubVV(d,
    b, box2d.b2Vec2.s_t0), f)
};
goog.exportSymbol("box2d.b2EdgeSeparation", box2d.b2EdgeSeparation);
box2d.b2EdgeSeparation.s_normal1World = new box2d.b2Vec2;
box2d.b2EdgeSeparation.s_normal1 = new box2d.b2Vec2;
box2d.b2EdgeSeparation.s_v1 = new box2d.b2Vec2;
box2d.b2EdgeSeparation.s_v2 = new box2d.b2Vec2;
box2d.b2FindMaxSeparation = function(a, b, c, e, d) {
  for (var f = b.m_count, g = b.m_normals, h = box2d.b2SubVV(box2d.b2MulXV(d, e.m_centroid, box2d.b2Vec2.s_t0), box2d.b2MulXV(c, b.m_centroid, box2d.b2Vec2.s_t1), box2d.b2FindMaxSeparation.s_d), j = box2d.b2MulTRV(c.q, h, box2d.b2FindMaxSeparation.s_dLocal1), h = 0, i = -box2d.b2_maxFloat, k = 0; k < f; ++k) {
    var l = box2d.b2DotVV(g[k], j);
    l > i && (i = l, h = k)
  }
  var g = box2d.b2EdgeSeparation(b, c, h, e, d),
    j = (h + f - 1) % f,
    i = box2d.b2EdgeSeparation(b, c, j, e, d),
    k = (h + 1) % f,
    l = box2d.b2EdgeSeparation(b, c, k, e, d),
    m = 0,
    n = 0,
    o = 0;
  if (i > g && i > l) o = -1, m = j, n = i;
  else if (l > g) o = 1, m = k, n = l;
  else return a[0] = h, g;
  for (;;)
    if (h = -1 == o ? (m + f - 1) % f : (m + 1) % f, g = box2d.b2EdgeSeparation(b, c, h, e, d), g > n) m = h, n = g;
    else break;
  a[0] = m;
  return n
};
goog.exportSymbol("box2d.b2FindMaxSeparation", box2d.b2FindMaxSeparation);
box2d.b2FindMaxSeparation.s_d = new box2d.b2Vec2;
box2d.b2FindMaxSeparation.s_dLocal1 = new box2d.b2Vec2;
box2d.b2FindIncidentEdge = function(a, b, c, e, d, f) {
  var g = b.m_count,
    h = b.m_normals,
    j = d.m_count,
    b = d.m_vertices,
    d = d.m_normals;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= e && e < g);
  for (var c = box2d.b2MulTRV(f.q, box2d.b2MulRV(c.q, h[e], box2d.b2Vec2.s_t0), box2d.b2FindIncidentEdge.s_normal1), g = 0, h = box2d.b2_maxFloat, i = 0; i < j; ++i) {
    var k = box2d.b2DotVV(c, d[i]);
    k < h && (h = k, g = i)
  }
  d = g;
  j = (d + 1) % j;
  c = a[0];
  box2d.b2MulXV(f, b[d], c.v);
  c = c.id.cf;
  c.indexA = e;
  c.indexB = d;
  c.typeA = box2d.b2ContactFeatureType.e_face;
  c.typeB = box2d.b2ContactFeatureType.e_vertex;
  a = a[1];
  box2d.b2MulXV(f, b[j], a.v);
  f = a.id.cf;
  f.indexA = e;
  f.indexB = j;
  f.typeA = box2d.b2ContactFeatureType.e_face;
  f.typeB = box2d.b2ContactFeatureType.e_vertex
};
goog.exportSymbol("box2d.b2FindIncidentEdge", box2d.b2FindIncidentEdge);
box2d.b2FindIncidentEdge.s_normal1 = new box2d.b2Vec2;
box2d.b2CollidePolygons = function(a, b, c, e, d) {
  a.pointCount = 0;
  var f = b.m_radius + e.m_radius,
    g = box2d.b2CollidePolygons.s_edgeA;
  g[0] = 0;
  var h = box2d.b2FindMaxSeparation(g, b, c, e, d);
  if (!(h > f)) {
    var j = box2d.b2CollidePolygons.s_edgeB;
    j[0] = 0;
    var i = box2d.b2FindMaxSeparation(j, e, d, b, c);
    if (!(i > f)) {
      var k = 0,
        l = 0;
      i > 0.98 * h + 0.0010 ? (h = e, e = b, b = d, k = j[0], a.type = box2d.b2ManifoldType.e_faceB, l = 1) : (h = b, b = c, c = d, k = g[0], a.type = box2d.b2ManifoldType.e_faceA, l = 0);
      g = box2d.b2CollidePolygons.s_incidentEdge;
      box2d.b2FindIncidentEdge(g, h,
        b, k, e, c);
      var d = h.m_vertices,
        j = k,
        h = (k + 1) % h.m_count,
        m = d[j],
        n = d[h],
        k = box2d.b2SubVV(n, m, box2d.b2CollidePolygons.s_localTangent);
      k.Normalize();
      var d = box2d.b2CrossVOne(k, box2d.b2CollidePolygons.s_localNormal),
        e = box2d.b2MidVV(m, n, box2d.b2CollidePolygons.s_planePoint),
        i = box2d.b2MulRV(b.q, k, box2d.b2CollidePolygons.s_tangent),
        k = box2d.b2CrossVOne(i, box2d.b2CollidePolygons.s_normal),
        m = box2d.b2MulXV(b, m, box2d.b2CollidePolygons.s_v11),
        o = box2d.b2MulXV(b, n, box2d.b2CollidePolygons.s_v12),
        b = box2d.b2DotVV(k, m),
        n = -box2d.b2DotVV(i,
          m) + f,
        o = box2d.b2DotVV(i, o) + f,
        r = box2d.b2CollidePolygons.s_clipPoints1,
        m = box2d.b2CollidePolygons.s_clipPoints2,
        p = box2d.b2NegV(i, box2d.b2CollidePolygons.s_ntangent),
        g = box2d.b2ClipSegmentToLine(r, g, p, n, j);
      if (!(2 > g) && (g = box2d.b2ClipSegmentToLine(m, r, i, o, h), !(2 > g))) {
        a.localNormal.Copy(d);
        a.localPoint.Copy(e);
        for (j = g = 0; j < box2d.b2_maxManifoldPoints; ++j) d = m[j], box2d.b2DotVV(k, d.v) - b <= f && (h = a.points[g], box2d.b2MulTXV(c, d.v, h.localPoint), h.id.Copy(d.id), l && (d = h.id.cf, h.id.cf.indexA = d.indexB, h.id.cf.indexB = d.indexA,
          h.id.cf.typeA = d.typeB, h.id.cf.typeB = d.typeA), ++g);
        a.pointCount = g
      }
    }
  }
};
goog.exportSymbol("box2d.b2CollidePolygons", box2d.b2CollidePolygons);
box2d.b2CollidePolygons.s_incidentEdge = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_edgeA = box2d.b2MakeNumberArray(1);
box2d.b2CollidePolygons.s_edgeB = box2d.b2MakeNumberArray(1);
box2d.b2CollidePolygons.s_localTangent = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_localNormal = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_planePoint = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_normal = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_tangent = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_ntangent = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_v11 = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_v12 = new box2d.b2Vec2;
box2d.b2PolygonContact = function() {
  box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2PolygonContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2PolygonContact", box2d.b2PolygonContact);
box2d.b2PolygonContact.Create = function() {
  return new box2d.b2PolygonContact
};
goog.exportProperty(box2d.b2PolygonContact, "Create", box2d.b2PolygonContact.Create);
box2d.b2PolygonContact.Destroy = function() {};
goog.exportProperty(box2d.b2PolygonContact, "Destroy", box2d.b2PolygonContact.Destroy);
box2d.b2PolygonContact.prototype.Reset = function(a, b, c, e) {
  box2d.b2PolygonContact.superClass_.Reset.call(this, a, b, c, e)
};
goog.exportProperty(box2d.b2PolygonContact.prototype, "Reset", box2d.b2PolygonContact.prototype.Reset);
box2d.b2PolygonContact.prototype.Evaluate = function(a, b, c) {
  var e = this.m_fixtureA.GetShape(),
    d = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2PolygonShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2PolygonShape);
  box2d.b2CollidePolygons(a, e instanceof box2d.b2PolygonShape ? e : null, b, d instanceof box2d.b2PolygonShape ? d : null, c)
};
goog.exportProperty(box2d.b2PolygonContact.prototype, "Evaluate", box2d.b2PolygonContact.prototype.Evaluate);
box2d.b2CollideCircle = {};
box2d.b2CollideCircles = function(a, b, c, e, d) {
  a.pointCount = 0;
  c = box2d.b2MulXV(c, b.m_p, box2d.b2CollideCircles.s_pA);
  d = box2d.b2MulXV(d, e.m_p, box2d.b2CollideCircles.s_pB);
  d = box2d.b2DistanceSquaredVV(c, d);
  c = b.m_radius + e.m_radius;
  d > c * c || (a.type = box2d.b2ManifoldType.e_circles, a.localPoint.Copy(b.m_p), a.localNormal.SetZero(), a.pointCount = 1, a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0)
};
goog.exportSymbol("box2d.b2CollideCircles", box2d.b2CollideCircles);
box2d.b2CollideCircles.s_pA = new box2d.b2Vec2;
box2d.b2CollideCircles.s_pB = new box2d.b2Vec2;
box2d.b2CollidePolygonAndCircle = function(a, b, c, e, d) {
  a.pointCount = 0;
  for (var d = box2d.b2MulXV(d, e.m_p, box2d.b2CollidePolygonAndCircle.s_c), c = box2d.b2MulTXV(c, d, box2d.b2CollidePolygonAndCircle.s_cLocal), f = 0, g = -box2d.b2_maxFloat, d = b.m_radius + e.m_radius, h = b.m_count, j = b.m_vertices, b = b.m_normals, i = 0; i < h; ++i) {
    var k = box2d.b2DotVV(b[i], box2d.b2SubVV(c, j[i], box2d.b2Vec2.s_t0));
    if (k > d) return;
    k > g && (g = k, f = i)
  }
  i = f;
  k = j[i];
  h = j[(i + 1) % h];
  g < box2d.b2_epsilon ? (a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, a.localNormal.Copy(b[f]),
    box2d.b2MidVV(k, h, a.localPoint), a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0) : (g = box2d.b2DotVV(box2d.b2SubVV(c, k, box2d.b2Vec2.s_t0), box2d.b2SubVV(h, k, box2d.b2Vec2.s_t1)), f = box2d.b2DotVV(box2d.b2SubVV(c, h, box2d.b2Vec2.s_t0), box2d.b2SubVV(k, h, box2d.b2Vec2.s_t1)), 0 >= g ? box2d.b2DistanceSquaredVV(c, k) > d * d || (a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, box2d.b2SubVV(c, k, a.localNormal).SelfNormalize(), a.localPoint.Copy(k), a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0) : 0 >= f ? box2d.b2DistanceSquaredVV(c,
    h) > d * d || (a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, box2d.b2SubVV(c, h, a.localNormal).SelfNormalize(), a.localPoint.Copy(h), a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0) : (f = box2d.b2MidVV(k, h, box2d.b2CollidePolygonAndCircle.s_faceCenter), g = box2d.b2DotVV(box2d.b2SubVV(c, f, box2d.b2Vec2.s_t1), b[i]), g > d || (a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, a.localNormal.Copy(b[i]).SelfNormalize(), a.localPoint.Copy(f), a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0)))
};
goog.exportSymbol("box2d.b2CollidePolygonAndCircle", box2d.b2CollidePolygonAndCircle);
box2d.b2CollidePolygonAndCircle.s_c = new box2d.b2Vec2;
box2d.b2CollidePolygonAndCircle.s_cLocal = new box2d.b2Vec2;
box2d.b2CollidePolygonAndCircle.s_faceCenter = new box2d.b2Vec2;
box2d.b2CircleContact = function() {
  box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2CircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2CircleContact", box2d.b2CircleContact);
box2d.b2CircleContact.Create = function() {
  return new box2d.b2CircleContact
};
goog.exportProperty(box2d.b2CircleContact, "Create", box2d.b2CircleContact.Create);
box2d.b2CircleContact.Destroy = function() {};
goog.exportProperty(box2d.b2CircleContact, "Destroy", box2d.b2CircleContact.Destroy);
box2d.b2CircleContact.prototype.Reset = function(a, b, c, e) {
  box2d.b2CircleContact.superClass_.Reset.call(this, a, b, c, e)
};
goog.exportProperty(box2d.b2CircleContact.prototype, "Reset", box2d.b2CircleContact.prototype.Reset);
box2d.b2CircleContact.prototype.Evaluate = function(a, b, c) {
  var e = this.m_fixtureA.GetShape(),
    d = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2CircleShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
  box2d.b2CollideCircles(a, e instanceof box2d.b2CircleShape ? e : null, b, d instanceof box2d.b2CircleShape ? d : null, c)
};
goog.exportProperty(box2d.b2CircleContact.prototype, "Evaluate", box2d.b2CircleContact.prototype.Evaluate);
box2d.b2ChainAndCircleContact = function() {
  box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2ChainAndCircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2ChainAndCircleContact", box2d.b2ChainAndCircleContact);
box2d.b2ChainAndCircleContact.Create = function() {
  return new box2d.b2ChainAndCircleContact
};
goog.exportProperty(box2d.b2ChainAndCircleContact, "Create", box2d.b2ChainAndCircleContact.Create);
box2d.b2ChainAndCircleContact.Destroy = function() {};
goog.exportProperty(box2d.b2ChainAndCircleContact, "Destroy", box2d.b2ChainAndCircleContact.Destroy);
box2d.b2ChainAndCircleContact.prototype.Reset = function(a, b, c, e) {
  box2d.b2ChainAndCircleContact.superClass_.Reset.call(this, a, b, c, e);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() == box2d.b2ShapeType.e_chainShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() == box2d.b2ShapeType.e_circleShape)
};
goog.exportProperty(box2d.b2ChainAndCircleContact.prototype, "Reset", box2d.b2ChainAndCircleContact.prototype.Reset);
box2d.b2ChainAndCircleContact.prototype.Evaluate = function(a, b, c) {
  var e = this.m_fixtureA.GetShape(),
    d = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2ChainShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
  var f = box2d.b2ChainAndCircleContact.prototype.Evaluate.s_edge;
  (e instanceof box2d.b2ChainShape ? e : null).GetChildEdge(f, this.m_indexA);
  box2d.b2CollideEdgeAndCircle(a, f, b, d instanceof box2d.b2CircleShape ? d : null, c)
};
goog.exportProperty(box2d.b2ChainAndCircleContact.prototype, "Evaluate", box2d.b2ChainAndCircleContact.prototype.Evaluate);
box2d.b2ChainAndCircleContact.prototype.Evaluate.s_edge = new box2d.b2EdgeShape;
box2d.b2EdgeAndCircleContact = function() {
  box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2EdgeAndCircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2EdgeAndCircleContact", box2d.b2EdgeAndCircleContact);
box2d.b2EdgeAndCircleContact.Create = function() {
  return new box2d.b2EdgeAndCircleContact
};
goog.exportProperty(box2d.b2EdgeAndCircleContact, "Create", box2d.b2EdgeAndCircleContact.Create);
box2d.b2EdgeAndCircleContact.Destroy = function() {};
goog.exportProperty(box2d.b2EdgeAndCircleContact, "Destroy", box2d.b2EdgeAndCircleContact.Destroy);
box2d.b2EdgeAndCircleContact.prototype.Reset = function(a, b, c, e) {
  box2d.b2EdgeAndCircleContact.superClass_.Reset.call(this, a, b, c, e);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() == box2d.b2ShapeType.e_edgeShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() == box2d.b2ShapeType.e_circleShape)
};
goog.exportProperty(box2d.b2EdgeAndCircleContact.prototype, "Reset", box2d.b2EdgeAndCircleContact.prototype.Reset);
box2d.b2EdgeAndCircleContact.prototype.Evaluate = function(a, b, c) {
  var e = this.m_fixtureA.GetShape(),
    d = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2EdgeShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
  box2d.b2CollideEdgeAndCircle(a, e instanceof box2d.b2EdgeShape ? e : null, b, d instanceof box2d.b2CircleShape ? d : null, c)
};
goog.exportProperty(box2d.b2EdgeAndCircleContact.prototype, "Evaluate", box2d.b2EdgeAndCircleContact.prototype.Evaluate);
box2d.b2VelocityConstraintPoint = function() {
  this.rA = new box2d.b2Vec2;
  this.rB = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2VelocityConstraintPoint", box2d.b2VelocityConstraintPoint);
box2d.b2VelocityConstraintPoint.prototype.rA = null;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "rA", box2d.b2VelocityConstraintPoint.prototype.rA);
box2d.b2VelocityConstraintPoint.prototype.rB = null;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "rB", box2d.b2VelocityConstraintPoint.prototype.rB);
box2d.b2VelocityConstraintPoint.prototype.normalImpulse = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "normalImpulse", box2d.b2VelocityConstraintPoint.prototype.normalImpulse);
box2d.b2VelocityConstraintPoint.prototype.tangentImpulse = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "tangentImpulse", box2d.b2VelocityConstraintPoint.prototype.tangentImpulse);
box2d.b2VelocityConstraintPoint.prototype.normalMass = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "normalMass", box2d.b2VelocityConstraintPoint.prototype.normalMass);
box2d.b2VelocityConstraintPoint.prototype.tangentMass = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "tangentMass", box2d.b2VelocityConstraintPoint.prototype.tangentMass);
box2d.b2VelocityConstraintPoint.prototype.velocityBias = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "velocityBias", box2d.b2VelocityConstraintPoint.prototype.velocityBias);
box2d.b2VelocityConstraintPoint.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2VelocityConstraintPoint
  })
};
goog.exportProperty(box2d.b2VelocityConstraintPoint, "MakeArray", box2d.b2VelocityConstraintPoint.MakeArray);
box2d.b2ContactVelocityConstraint = function() {
  this.points = box2d.b2VelocityConstraintPoint.MakeArray(box2d.b2_maxManifoldPoints);
  this.normal = new box2d.b2Vec2;
  this.tangent = new box2d.b2Vec2;
  this.normalMass = new box2d.b2Mat22;
  this.K = new box2d.b2Mat22
};
goog.exportSymbol("box2d.b2ContactVelocityConstraint", box2d.b2ContactVelocityConstraint);
box2d.b2ContactVelocityConstraint.prototype.points = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "points", box2d.b2ContactVelocityConstraint.prototype.points);
box2d.b2ContactVelocityConstraint.prototype.normal = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "normal", box2d.b2ContactVelocityConstraint.prototype.normal);
box2d.b2ContactVelocityConstraint.prototype.tangent = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "tangent", box2d.b2ContactVelocityConstraint.prototype.tangent);
box2d.b2ContactVelocityConstraint.prototype.normalMass = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "normalMass", box2d.b2ContactVelocityConstraint.prototype.normalMass);
box2d.b2ContactVelocityConstraint.prototype.K = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "K", box2d.b2ContactVelocityConstraint.prototype.K);
box2d.b2ContactVelocityConstraint.prototype.indexA = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "indexA", box2d.b2ContactVelocityConstraint.prototype.indexA);
box2d.b2ContactVelocityConstraint.prototype.indexB = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "indexB", box2d.b2ContactVelocityConstraint.prototype.indexB);
box2d.b2ContactVelocityConstraint.prototype.invMassA = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "invMassA", box2d.b2ContactVelocityConstraint.prototype.invMassA);
box2d.b2ContactVelocityConstraint.prototype.invMassB = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "invMassB", box2d.b2ContactVelocityConstraint.prototype.invMassB);
box2d.b2ContactVelocityConstraint.prototype.invIA = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "invIA", box2d.b2ContactVelocityConstraint.prototype.invIA);
box2d.b2ContactVelocityConstraint.prototype.invIB = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "invIB", box2d.b2ContactVelocityConstraint.prototype.invIB);
box2d.b2ContactVelocityConstraint.prototype.friction = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "friction", box2d.b2ContactVelocityConstraint.prototype.friction);
box2d.b2ContactVelocityConstraint.prototype.restitution = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "restitution", box2d.b2ContactVelocityConstraint.prototype.restitution);
box2d.b2ContactVelocityConstraint.prototype.tangentSpeed = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "tangentSpeed", box2d.b2ContactVelocityConstraint.prototype.tangentSpeed);
box2d.b2ContactVelocityConstraint.prototype.pointCount = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "pointCount", box2d.b2ContactVelocityConstraint.prototype.pointCount);
box2d.b2ContactVelocityConstraint.prototype.contactIndex = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "contactIndex", box2d.b2ContactVelocityConstraint.prototype.contactIndex);
box2d.b2ContactVelocityConstraint.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2ContactVelocityConstraint
  })
};
goog.exportProperty(box2d.b2ContactVelocityConstraint, "MakeArray", box2d.b2ContactVelocityConstraint.MakeArray);
box2d.b2ContactPositionConstraint = function() {
  this.localPoints = box2d.b2Vec2.MakeArray(box2d.b2_maxManifoldPoints);
  this.localNormal = new box2d.b2Vec2;
  this.localPoint = new box2d.b2Vec2;
  this.localCenterA = new box2d.b2Vec2;
  this.localCenterB = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2ContactPositionConstraint", box2d.b2ContactPositionConstraint);
box2d.b2ContactPositionConstraint.prototype.localPoints = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localPoints", box2d.b2ContactPositionConstraint.prototype.localPoints);
box2d.b2ContactPositionConstraint.prototype.localNormal = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localNormal", box2d.b2ContactPositionConstraint.prototype.localNormal);
box2d.b2ContactPositionConstraint.prototype.localPoint = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localPoint", box2d.b2ContactPositionConstraint.prototype.localPoint);
box2d.b2ContactPositionConstraint.prototype.indexA = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "indexA", box2d.b2ContactPositionConstraint.prototype.indexA);
box2d.b2ContactPositionConstraint.prototype.indexB = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "indexB", box2d.b2ContactPositionConstraint.prototype.indexB);
box2d.b2ContactPositionConstraint.prototype.invMassA = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "invMassA", box2d.b2ContactPositionConstraint.prototype.invMassA);
box2d.b2ContactPositionConstraint.prototype.invMassB = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "invMassB", box2d.b2ContactPositionConstraint.prototype.invMassB);
box2d.b2ContactPositionConstraint.prototype.localCenterA = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localCenterA", box2d.b2ContactPositionConstraint.prototype.localCenterA);
box2d.b2ContactPositionConstraint.prototype.localCenterB = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localCenterB", box2d.b2ContactPositionConstraint.prototype.localCenterB);
box2d.b2ContactPositionConstraint.prototype.invIA = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "invIA", box2d.b2ContactPositionConstraint.prototype.invIA);
box2d.b2ContactPositionConstraint.prototype.invIB = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "invIB", box2d.b2ContactPositionConstraint.prototype.invIB);
box2d.b2ContactPositionConstraint.prototype.type = box2d.b2ManifoldType.e_unknown;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "type", box2d.b2ContactPositionConstraint.prototype.type);
box2d.b2ContactPositionConstraint.prototype.radiusA = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "radiusA", box2d.b2ContactPositionConstraint.prototype.radiusA);
box2d.b2ContactPositionConstraint.prototype.radiusB = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "radiusB", box2d.b2ContactPositionConstraint.prototype.radiusB);
box2d.b2ContactPositionConstraint.prototype.pointCount = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "pointCount", box2d.b2ContactPositionConstraint.prototype.pointCount);
box2d.b2ContactPositionConstraint.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2ContactPositionConstraint
  })
};
goog.exportProperty(box2d.b2ContactPositionConstraint, "MakeArray", box2d.b2ContactPositionConstraint.MakeArray);
box2d.b2ContactSolverDef = function() {
  this.step = new box2d.b2TimeStep
};
goog.exportSymbol("box2d.b2ContactSolverDef", box2d.b2ContactSolverDef);
box2d.b2ContactSolverDef.prototype.step = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "step", box2d.b2ContactSolverDef.prototype.step);
box2d.b2ContactSolverDef.prototype.contacts = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "contacts", box2d.b2ContactSolverDef.prototype.contacts);
box2d.b2ContactSolverDef.prototype.count = 0;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "count", box2d.b2ContactSolverDef.prototype.count);
box2d.b2ContactSolverDef.prototype.positions = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "positions", box2d.b2ContactSolverDef.prototype.positions);
box2d.b2ContactSolverDef.prototype.velocities = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "velocities", box2d.b2ContactSolverDef.prototype.velocities);
box2d.b2ContactSolverDef.prototype.allocator = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "allocator", box2d.b2ContactSolverDef.prototype.allocator);
box2d.b2ContactSolver = function() {
  this.m_step = new box2d.b2TimeStep;
  this.m_positionConstraints = box2d.b2ContactPositionConstraint.MakeArray(1024);
  this.m_velocityConstraints = box2d.b2ContactVelocityConstraint.MakeArray(1024)
};
goog.exportSymbol("box2d.b2ContactSolver", box2d.b2ContactSolver);
box2d.b2ContactSolver.prototype.m_step = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_step", box2d.b2ContactSolver.prototype.m_step);
box2d.b2ContactSolver.prototype.m_positions = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_positions", box2d.b2ContactSolver.prototype.m_positions);
box2d.b2ContactSolver.prototype.m_velocities = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_velocities", box2d.b2ContactSolver.prototype.m_velocities);
box2d.b2ContactSolver.prototype.m_allocator = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_allocator", box2d.b2ContactSolver.prototype.m_allocator);
box2d.b2ContactSolver.prototype.m_positionConstraints = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_positionConstraints", box2d.b2ContactSolver.prototype.m_positionConstraints);
box2d.b2ContactSolver.prototype.m_velocityConstraints = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_velocityConstraints", box2d.b2ContactSolver.prototype.m_velocityConstraints);
box2d.b2ContactSolver.prototype.m_contacts = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_contacts", box2d.b2ContactSolver.prototype.m_contacts);
box2d.b2ContactSolver.prototype.m_count = 0;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_count", box2d.b2ContactSolver.prototype.m_count);
box2d.b2ContactSolver.prototype.Initialize = function(a) {
  this.m_step.Copy(a.step);
  this.m_allocator = a.allocator;
  this.m_count = a.count;
  if (this.m_positionConstraints.length < this.m_count) {
    var b = box2d.b2Max(2 * this.m_positionConstraints.length, this.m_count);
    for (box2d.DEBUG && window.console.log("box2d.b2ContactSolver.m_positionConstraints: " + b); this.m_positionConstraints.length < b;) this.m_positionConstraints[this.m_positionConstraints.length] = new box2d.b2ContactPositionConstraint
  }
  if (this.m_velocityConstraints.length <
    this.m_count) {
    b = box2d.b2Max(2 * this.m_velocityConstraints.length, this.m_count);
    for (box2d.DEBUG && window.console.log("box2d.b2ContactSolver.m_velocityConstraints: " + b); this.m_velocityConstraints.length < b;) this.m_velocityConstraints[this.m_velocityConstraints.length] = new box2d.b2ContactVelocityConstraint
  }
  this.m_positions = a.positions;
  this.m_velocities = a.velocities;
  this.m_contacts = a.contacts;
  for (var c, e, d, f, g, h, j, i, a = 0, b = this.m_count; a < b; ++a) {
    d = this.m_contacts[a];
    f = d.m_fixtureA;
    g = d.m_fixtureB;
    c = f.GetShape();
    e = g.GetShape();
    c = c.m_radius;
    e = e.m_radius;
    h = f.GetBody();
    j = g.GetBody();
    g = d.GetManifold();
    i = g.pointCount;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < i);
    f = this.m_velocityConstraints[a];
    f.friction = d.m_friction;
    f.restitution = d.m_restitution;
    f.tangentSpeed = d.m_tangentSpeed;
    f.indexA = h.m_islandIndex;
    f.indexB = j.m_islandIndex;
    f.invMassA = h.m_invMass;
    f.invMassB = j.m_invMass;
    f.invIA = h.m_invI;
    f.invIB = j.m_invI;
    f.contactIndex = a;
    f.pointCount = i;
    f.K.SetZero();
    f.normalMass.SetZero();
    d = this.m_positionConstraints[a];
    d.indexA =
      h.m_islandIndex;
    d.indexB = j.m_islandIndex;
    d.invMassA = h.m_invMass;
    d.invMassB = j.m_invMass;
    d.localCenterA.Copy(h.m_sweep.localCenter);
    d.localCenterB.Copy(j.m_sweep.localCenter);
    d.invIA = h.m_invI;
    d.invIB = j.m_invI;
    d.localNormal.Copy(g.localNormal);
    d.localPoint.Copy(g.localPoint);
    d.pointCount = i;
    d.radiusA = c;
    d.radiusB = e;
    d.type = g.type;
    c = 0;
    for (e = i; c < e; ++c) h = g.points[c], i = f.points[c], this.m_step.warmStarting ? (i.normalImpulse = this.m_step.dtRatio * h.normalImpulse, i.tangentImpulse = this.m_step.dtRatio * h.tangentImpulse) :
      (i.normalImpulse = 0, i.tangentImpulse = 0), i.rA.SetZero(), i.rB.SetZero(), i.normalMass = 0, i.tangentMass = 0, i.velocityBias = 0, d.localPoints[c].Copy(h.localPoint)
  }
  return this
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "Initialize", box2d.b2ContactSolver.prototype.Initialize);
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints = function() {
  var a, b, c, e, d, f, g, h, j, i, k, l, m, n, o, r, p, q, s, v, z = box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfA,
    u = box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfB,
    t = box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_worldManifold;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    d = this.m_velocityConstraints[a];
    f = this.m_positionConstraints[a];
    c = f.radiusA;
    e = f.radiusB;
    g = this.m_contacts[d.contactIndex].GetManifold();
    h = d.indexA;
    j = d.indexB;
    i = d.invMassA;
    k = d.invMassB;
    l = d.invIA;
    m = d.invIB;
    n = f.localCenterA;
    o = f.localCenterB;
    f = this.m_positions[h].c;
    r = this.m_positions[h].a;
    p = this.m_velocities[h].v;
    h = this.m_velocities[h].w;
    q = this.m_positions[j].c;
    s = this.m_positions[j].a;
    v = this.m_velocities[j].v;
    j = this.m_velocities[j].w;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < g.pointCount);
    z.q.SetAngleRadians(r);
    u.q.SetAngleRadians(s);
    box2d.b2SubVV(f, box2d.b2MulRV(z.q, n, box2d.b2Vec2.s_t0), z.p);
    box2d.b2SubVV(q, box2d.b2MulRV(u.q, o, box2d.b2Vec2.s_t0),
      u.p);
    t.Initialize(g, z, c, u, e);
    d.normal.Copy(t.normal);
    box2d.b2CrossVOne(d.normal, d.tangent);
    e = d.pointCount;
    for (c = 0; c < e; ++c) g = d.points[c], box2d.b2SubVV(t.points[c], f, g.rA), box2d.b2SubVV(t.points[c], q, g.rB), n = box2d.b2CrossVV(g.rA, d.normal), o = box2d.b2CrossVV(g.rB, d.normal), n = i + k + l * n * n + m * o * o, g.normalMass = 0 < n ? 1 / n : 0, o = d.tangent, n = box2d.b2CrossVV(g.rA, o), o = box2d.b2CrossVV(g.rB, o), n = i + k + l * n * n + m * o * o, g.tangentMass = 0 < n ? 1 / n : 0, g.velocityBias = 0, n = box2d.b2DotVV(d.normal, box2d.b2SubVV(box2d.b2AddVCrossSV(v, j, g.rB,
      box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(p, h, g.rA, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0)), n < -box2d.b2_velocityThreshold && (g.velocityBias += -d.restitution * n);
    2 == d.pointCount && (p = d.points[0], q = d.points[1], f = box2d.b2CrossVV(p.rA, d.normal), p = box2d.b2CrossVV(p.rB, d.normal), h = box2d.b2CrossVV(q.rA, d.normal), j = box2d.b2CrossVV(q.rB, d.normal), q = i + k + l * f * f + m * p * p, v = i + k + l * h * h + m * j * j, i = i + k + l * f * h + m * p * j, q * q < 1E3 * (q * v - i * i) ? (d.K.ex.SetXY(q, i), d.K.ey.SetXY(i, v), d.K.GetInverse(d.normalMass)) : d.pointCount = 1)
  }
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "InitializeVelocityConstraints", box2d.b2ContactSolver.prototype.InitializeVelocityConstraints);
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfA = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfB = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_worldManifold = new box2d.b2WorldManifold;
box2d.b2ContactSolver.prototype.WarmStart = function() {
  var a, b, c, e, d, f, g, h, j, i, k, l, m, n, o, r, p, q, s = box2d.b2ContactSolver.prototype.WarmStart.s_P;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    d = this.m_velocityConstraints[a];
    f = d.indexA;
    g = d.indexB;
    h = d.invMassA;
    j = d.invIA;
    i = d.invMassB;
    k = d.invIB;
    e = d.pointCount;
    l = this.m_velocities[f].v;
    m = this.m_velocities[f].w;
    n = this.m_velocities[g].v;
    o = this.m_velocities[g].w;
    r = d.normal;
    p = d.tangent;
    for (c = 0; c < e; ++c) q = d.points[c], box2d.b2AddVV(box2d.b2MulSV(q.normalImpulse, r, box2d.b2Vec2.s_t0),
      box2d.b2MulSV(q.tangentImpulse, p, box2d.b2Vec2.s_t1), s), m -= j * box2d.b2CrossVV(q.rA, s), l.SelfMulSub(h, s), o += k * box2d.b2CrossVV(q.rB, s), n.SelfMulAdd(i, s);
    this.m_velocities[f].w = m;
    this.m_velocities[g].w = o
  }
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "WarmStart", box2d.b2ContactSolver.prototype.WarmStart);
box2d.b2ContactSolver.prototype.WarmStart.s_P = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints = function() {
  var a, b, c, e, d, f, g, h, j, i, k, l, m, n, o, r, p, q, s, v = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv,
    z = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv1,
    u = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv2,
    t, y, w = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P,
    B = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_a,
    A = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_b,
    x = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_x,
    D = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_d,
    C = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1,
    E = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P2,
    F = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1P2;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    d = this.m_velocityConstraints[a];
    f = d.indexA;
    g = d.indexB;
    h = d.invMassA;
    j = d.invIA;
    i = d.invMassB;
    k = d.invIB;
    l = d.pointCount;
    m = this.m_velocities[f].v;
    n = this.m_velocities[f].w;
    o = this.m_velocities[g].v;
    r = this.m_velocities[g].w;
    p = d.normal;
    q = d.tangent;
    s = d.friction;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(1 == l || 2 == l);
    c = 0;
    for (e = l; c < e; ++c) l = d.points[c], box2d.b2SubVV(box2d.b2AddVCrossSV(o, r, l.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(m, n, l.rA, box2d.b2Vec2.s_t1), v), t = box2d.b2DotVV(v, q) - d.tangentSpeed, t = l.tangentMass * -t, y = s * l.normalImpulse, y = box2d.b2Clamp(l.tangentImpulse + t, -y, y), t = y - l.tangentImpulse, l.tangentImpulse = y, box2d.b2MulSV(t, q, w), m.SelfMulSub(h, w), n -= j * box2d.b2CrossVV(l.rA, w), o.SelfMulAdd(i, w), r += k * box2d.b2CrossVV(l.rB, w);
    if (1 == d.pointCount) l = d.points[0], box2d.b2SubVV(box2d.b2AddVCrossSV(o, r, l.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(m, n, l.rA, box2d.b2Vec2.s_t1), v), d = box2d.b2DotVV(v, p), t = -l.normalMass * (d - l.velocityBias), y = box2d.b2Max(l.normalImpulse + t, 0), t = y - l.normalImpulse, l.normalImpulse = y, box2d.b2MulSV(t, p, w), m.SelfMulSub(h, w), n -= j * box2d.b2CrossVV(l.rA, w), o.SelfMulAdd(i, w), r += k * box2d.b2CrossVV(l.rB, w);
    else {
      c = d.points[0];
      q = d.points[1];
      B.SetXY(c.normalImpulse, q.normalImpulse);
      box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <=
        B.x && 0 <= B.y);
      box2d.b2SubVV(box2d.b2AddVCrossSV(o, r, c.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(m, n, c.rA, box2d.b2Vec2.s_t1), z);
      box2d.b2SubVV(box2d.b2AddVCrossSV(o, r, q.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(m, n, q.rA, box2d.b2Vec2.s_t1), u);
      s = box2d.b2DotVV(z, p);
      l = box2d.b2DotVV(u, p);
      A.x = s - c.velocityBias;
      A.y = l - q.velocityBias;
      for (A.SelfSub(box2d.b2MulMV(d.K, B, box2d.b2Vec2.s_t0));;) {
        box2d.b2MulMV(d.normalMass, A, x).SelfNeg();
        if (0 <= x.x && 0 <= x.y) {
          box2d.b2SubVV(x, B, D);
          box2d.b2MulSV(D.x, p, C);
          box2d.b2MulSV(D.y,
            p, E);
          box2d.b2AddVV(C, E, F);
          m.SelfMulSub(h, F);
          n -= j * (box2d.b2CrossVV(c.rA, C) + box2d.b2CrossVV(q.rA, E));
          o.SelfMulAdd(i, F);
          r += k * (box2d.b2CrossVV(c.rB, C) + box2d.b2CrossVV(q.rB, E));
          c.normalImpulse = x.x;
          q.normalImpulse = x.y;
          break
        }
        x.x = -c.normalMass * A.x;
        x.y = 0;
        l = d.K.ex.y * x.x + A.y;
        if (0 <= x.x && 0 <= l) {
          box2d.b2SubVV(x, B, D);
          box2d.b2MulSV(D.x, p, C);
          box2d.b2MulSV(D.y, p, E);
          box2d.b2AddVV(C, E, F);
          m.SelfMulSub(h, F);
          n -= j * (box2d.b2CrossVV(c.rA, C) + box2d.b2CrossVV(q.rA, E));
          o.SelfMulAdd(i, F);
          r += k * (box2d.b2CrossVV(c.rB, C) + box2d.b2CrossVV(q.rB,
            E));
          c.normalImpulse = x.x;
          q.normalImpulse = x.y;
          break
        }
        x.x = 0;
        x.y = -q.normalMass * A.y;
        s = d.K.ey.x * x.y + A.x;
        if (0 <= x.y && 0 <= s) {
          box2d.b2SubVV(x, B, D);
          box2d.b2MulSV(D.x, p, C);
          box2d.b2MulSV(D.y, p, E);
          box2d.b2AddVV(C, E, F);
          m.SelfMulSub(h, F);
          n -= j * (box2d.b2CrossVV(c.rA, C) + box2d.b2CrossVV(q.rA, E));
          o.SelfMulAdd(i, F);
          r += k * (box2d.b2CrossVV(c.rB, C) + box2d.b2CrossVV(q.rB, E));
          c.normalImpulse = x.x;
          q.normalImpulse = x.y;
          break
        }
        x.x = 0;
        x.y = 0;
        s = A.x;
        l = A.y;
        if (0 <= s && 0 <= l) {
          box2d.b2SubVV(x, B, D);
          box2d.b2MulSV(D.x, p, C);
          box2d.b2MulSV(D.y, p, E);
          box2d.b2AddVV(C,
            E, F);
          m.SelfMulSub(h, F);
          n -= j * (box2d.b2CrossVV(c.rA, C) + box2d.b2CrossVV(q.rA, E));
          o.SelfMulAdd(i, F);
          r += k * (box2d.b2CrossVV(c.rB, C) + box2d.b2CrossVV(q.rB, E));
          c.normalImpulse = x.x;
          q.normalImpulse = x.y;
          break
        }
        break
      }
    }
    this.m_velocities[f].w = n;
    this.m_velocities[g].w = r
  }
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "SolveVelocityConstraints", box2d.b2ContactSolver.prototype.SolveVelocityConstraints);
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv1 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv2 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_a = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_b = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_x = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_d = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P2 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1P2 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.StoreImpulses = function() {
  var a, b, c, e, d, f;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    d = this.m_velocityConstraints[a];
    f = this.m_contacts[d.contactIndex].GetManifold();
    c = 0;
    for (e = d.pointCount; c < e; ++c) f.points[c].normalImpulse = d.points[c].normalImpulse, f.points[c].tangentImpulse = d.points[c].tangentImpulse
  }
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "StoreImpulses", box2d.b2ContactSolver.prototype.StoreImpulses);
box2d.b2PositionSolverManifold = function() {
  this.normal = new box2d.b2Vec2;
  this.point = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2PositionSolverManifold", box2d.b2PositionSolverManifold);
box2d.b2PositionSolverManifold.prototype.normal = null;
goog.exportProperty(box2d.b2PositionSolverManifold.prototype, "normal", box2d.b2PositionSolverManifold.prototype.normal);
box2d.b2PositionSolverManifold.prototype.point = null;
goog.exportProperty(box2d.b2PositionSolverManifold.prototype, "point", box2d.b2PositionSolverManifold.prototype.point);
box2d.b2PositionSolverManifold.prototype.separation = 0;
goog.exportProperty(box2d.b2PositionSolverManifold.prototype, "separation", box2d.b2PositionSolverManifold.prototype.separation);
box2d.b2PositionSolverManifold.prototype.Initialize = function(a, b, c, e) {
  var d = box2d.b2PositionSolverManifold.prototype.Initialize.s_pointA,
    f = box2d.b2PositionSolverManifold.prototype.Initialize.s_pointB,
    g = box2d.b2PositionSolverManifold.prototype.Initialize.s_planePoint,
    h = box2d.b2PositionSolverManifold.prototype.Initialize.s_clipPoint;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < a.pointCount);
  switch (a.type) {
    case box2d.b2ManifoldType.e_circles:
      box2d.b2MulXV(b, a.localPoint, d);
      box2d.b2MulXV(c, a.localPoints[0],
        f);
      box2d.b2SubVV(f, d, this.normal).SelfNormalize();
      box2d.b2MidVV(d, f, this.point);
      this.separation = box2d.b2DotVV(box2d.b2SubVV(f, d, box2d.b2Vec2.s_t0), this.normal) - a.radiusA - a.radiusB;
      break;
    case box2d.b2ManifoldType.e_faceA:
      box2d.b2MulRV(b.q, a.localNormal, this.normal);
      box2d.b2MulXV(b, a.localPoint, g);
      box2d.b2MulXV(c, a.localPoints[e], h);
      this.separation = box2d.b2DotVV(box2d.b2SubVV(h, g, box2d.b2Vec2.s_t0), this.normal) - a.radiusA - a.radiusB;
      this.point.Copy(h);
      break;
    case box2d.b2ManifoldType.e_faceB:
      box2d.b2MulRV(c.q,
        a.localNormal, this.normal), box2d.b2MulXV(c, a.localPoint, g), box2d.b2MulXV(b, a.localPoints[e], h), this.separation = box2d.b2DotVV(box2d.b2SubVV(h, g, box2d.b2Vec2.s_t0), this.normal) - a.radiusA - a.radiusB, this.point.Copy(h), this.normal.SelfNeg()
  }
};
goog.exportProperty(box2d.b2PositionSolverManifold.prototype, "Initialize", box2d.b2PositionSolverManifold.prototype.Initialize);
box2d.b2PositionSolverManifold.prototype.Initialize.s_pointA = new box2d.b2Vec2;
box2d.b2PositionSolverManifold.prototype.Initialize.s_pointB = new box2d.b2Vec2;
box2d.b2PositionSolverManifold.prototype.Initialize.s_planePoint = new box2d.b2Vec2;
box2d.b2PositionSolverManifold.prototype.Initialize.s_clipPoint = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolvePositionConstraints = function() {
  var a, b, c, e, d, f, g, h, j, i, k, l, m, n, o, r, p, q = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfA,
    s = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfB,
    v = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_psm,
    z, u, t, y = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rA,
    w = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rB,
    B, A = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_P,
    x =
    0;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    d = this.m_positionConstraints[a];
    f = d.indexA;
    g = d.indexB;
    h = d.localCenterA;
    j = d.invMassA;
    i = d.invIA;
    k = d.localCenterB;
    l = d.invMassB;
    m = d.invIB;
    e = d.pointCount;
    n = this.m_positions[f].c;
    o = this.m_positions[f].a;
    r = this.m_positions[g].c;
    p = this.m_positions[g].a;
    for (c = 0; c < e; ++c) q.q.SetAngleRadians(o), s.q.SetAngleRadians(p), box2d.b2SubVV(n, box2d.b2MulRV(q.q, h, box2d.b2Vec2.s_t0), q.p), box2d.b2SubVV(r, box2d.b2MulRV(s.q, k, box2d.b2Vec2.s_t0), s.p), v.Initialize(d, q, s, c), z = v.normal, u = v.point,
      t = v.separation, box2d.b2SubVV(u, n, y), box2d.b2SubVV(u, r, w), x = box2d.b2Min(x, t), u = box2d.b2Clamp(box2d.b2_baumgarte * (t + box2d.b2_linearSlop), -box2d.b2_maxLinearCorrection, 0), t = box2d.b2CrossVV(y, z), B = box2d.b2CrossVV(w, z), t = j + l + i * t * t + m * B * B, u = 0 < t ? -u / t : 0, box2d.b2MulSV(u, z, A), n.SelfMulSub(j, A), o -= i * box2d.b2CrossVV(y, A), r.SelfMulAdd(l, A), p += m * box2d.b2CrossVV(w, A);
    this.m_positions[f].a = o;
    this.m_positions[g].a = p
  }
  return x > -3 * box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "SolvePositionConstraints", box2d.b2ContactSolver.prototype.SolvePositionConstraints);
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfA = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfB = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_psm = new box2d.b2PositionSolverManifold;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rA = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rB = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints = function(a, b) {
  var c, e, d, f, g, h, j, i, k, l, m, n, o, r, p, q, s, v = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfA,
    z = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfB,
    u = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_psm,
    t, y, w, B = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rA,
    A = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rB,
    x, D = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_P,
    C = 0;
  c = 0;
  for (e = this.m_count; c < e; ++c) {
    g = this.m_positionConstraints[c];
    h = g.indexA;
    j = g.indexB;
    i = g.localCenterA;
    k = g.localCenterB;
    f = g.pointCount;
    m = l = 0;
    if (h == a || h == b) l = g.invMassA, m = g.invIA;
    o = n = 0;
    if (j == a || j == b) n = g.invMassB, o = g.invIB;
    r = this.m_positions[h].c;
    p = this.m_positions[h].a;
    q = this.m_positions[j].c;
    s = this.m_positions[j].a;
    for (d = 0; d < f; ++d) v.q.SetAngleRadians(p), z.q.SetAngleRadians(s), box2d.b2SubVV(r, box2d.b2MulRV(v.q, i, box2d.b2Vec2.s_t0), v.p), box2d.b2SubVV(q, box2d.b2MulRV(z.q, k, box2d.b2Vec2.s_t0), z.p),
      u.Initialize(g, v, z, d), t = u.normal, y = u.point, w = u.separation, box2d.b2SubVV(y, r, B), box2d.b2SubVV(y, q, A), C = box2d.b2Min(C, w), y = box2d.b2Clamp(box2d.b2_toiBaumgarte * (w + box2d.b2_linearSlop), -box2d.b2_maxLinearCorrection, 0), w = box2d.b2CrossVV(B, t), x = box2d.b2CrossVV(A, t), w = l + n + m * w * w + o * x * x, y = 0 < w ? -y / w : 0, box2d.b2MulSV(y, t, D), r.SelfMulSub(l, D), p -= m * box2d.b2CrossVV(B, D), q.SelfMulAdd(n, D), s += o * box2d.b2CrossVV(A, D);
    this.m_positions[h].a = p;
    this.m_positions[j].a = s
  }
  return C >= -1.5 * box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "SolveTOIPositionConstraints", box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints);
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfA = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfB = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_psm = new box2d.b2PositionSolverManifold;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rA = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rB = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2Timer = function() {
  this.m_start = (new Date).getTime()
};
goog.exportSymbol("box2d.b2Timer", box2d.b2Timer);
box2d.b2Timer.prototype.m_start = 0;
goog.exportProperty(box2d.b2Timer.prototype, "m_start", box2d.b2Timer.prototype.m_start);
box2d.b2Timer.prototype.Reset = function() {
  this.m_start = (new Date).getTime();
  return this
};
goog.exportProperty(box2d.b2Timer.prototype, "Reset", box2d.b2Timer.prototype.Reset);
box2d.b2Timer.prototype.GetMilliseconds = function() {
  return (new Date).getTime() - this.m_start
};
goog.exportProperty(box2d.b2Timer.prototype, "GetMilliseconds", box2d.b2Timer.prototype.GetMilliseconds);
box2d.b2Counter = function() {};
goog.exportSymbol("box2d.b2Counter", box2d.b2Counter);
box2d.b2Counter.prototype.m_count = 0;
goog.exportProperty(box2d.b2Counter.prototype, "m_count", box2d.b2Counter.prototype.m_count);
box2d.b2Counter.prototype.m_min_count = 0;
goog.exportProperty(box2d.b2Counter.prototype, "m_min_count", box2d.b2Counter.prototype.m_min_count);
box2d.b2Counter.prototype.m_max_count = 0;
goog.exportProperty(box2d.b2Counter.prototype, "m_max_count", box2d.b2Counter.prototype.m_max_count);
box2d.b2Counter.prototype.GetCount = function() {
  return this.m_count
};
goog.exportProperty(box2d.b2Counter.prototype, "GetCount", box2d.b2Counter.prototype.GetCount);
box2d.b2Counter.prototype.GetMinCount = function() {
  return this.m_min_count
};
goog.exportProperty(box2d.b2Counter.prototype, "GetMinCount", box2d.b2Counter.prototype.GetMinCount);
box2d.b2Counter.prototype.GetMaxCount = function() {
  return this.m_max_count
};
goog.exportProperty(box2d.b2Counter.prototype, "GetMaxCount", box2d.b2Counter.prototype.GetMaxCount);
box2d.b2Counter.prototype.ResetCount = function() {
  var a = this.m_count;
  this.m_count = 0;
  return a
};
goog.exportProperty(box2d.b2Counter.prototype, "ResetCount", box2d.b2Counter.prototype.ResetCount);
box2d.b2Counter.prototype.ResetMinCount = function() {
  this.m_min_count = 0
};
goog.exportProperty(box2d.b2Counter.prototype, "ResetMinCount", box2d.b2Counter.prototype.ResetMinCount);
box2d.b2Counter.prototype.ResetMaxCount = function() {
  this.m_max_count = 0
};
goog.exportProperty(box2d.b2Counter.prototype, "ResetMaxCount", box2d.b2Counter.prototype.ResetMaxCount);
box2d.b2Counter.prototype.Increment = function() {
  this.m_count++;
  this.m_max_count < this.m_count && (this.m_max_count = this.m_count)
};
goog.exportProperty(box2d.b2Counter.prototype, "Increment", box2d.b2Counter.prototype.Increment);
box2d.b2Counter.prototype.Decrement = function() {
  this.m_count--;
  this.m_min_count > this.m_count && (this.m_min_count = this.m_count)
};
goog.exportProperty(box2d.b2Counter.prototype, "Decrement", box2d.b2Counter.prototype.Decrement);
box2d.b2WorldCallbacks = {};
box2d.b2DestructionListener = function() {};
goog.exportSymbol("box2d.b2DestructionListener", box2d.b2DestructionListener);
box2d.b2DestructionListener.prototype.SayGoodbyeJoint = function() {};
goog.exportProperty(box2d.b2DestructionListener.prototype, "SayGoodbyeJoint", box2d.b2DestructionListener.prototype.SayGoodbyeJoint);
box2d.b2DestructionListener.prototype.SayGoodbyeFixture = function() {};
goog.exportProperty(box2d.b2DestructionListener.prototype, "SayGoodbyeFixture", box2d.b2DestructionListener.prototype.SayGoodbyeFixture);
box2d.b2ContactFilter = function() {};
goog.exportSymbol("box2d.b2ContactFilter", box2d.b2ContactFilter);
box2d.b2ContactFilter.prototype.ShouldCollide = function(a, b) {
  var c = a.GetFilterData(),
    e = b.GetFilterData();
  return c.groupIndex == e.groupIndex && 0 != c.groupIndex ? 0 < c.groupIndex : 0 != (c.maskBits & e.categoryBits) && 0 != (c.categoryBits & e.maskBits)
};
goog.exportProperty(box2d.b2ContactFilter.prototype, "ShouldCollide", box2d.b2ContactFilter.prototype.ShouldCollide);
box2d.b2ContactFilter.b2_defaultFilter = new box2d.b2ContactFilter;
box2d.b2ContactImpulse = function() {
  this.normalImpulses = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints);
  this.tangentImpulses = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints)
};
goog.exportSymbol("box2d.b2ContactImpulse", box2d.b2ContactImpulse);
box2d.b2ContactImpulse.prototype.normalImpulses = null;
box2d.b2ContactImpulse.prototype.tangentImpulses = null;
box2d.b2ContactListener = function() {};
goog.exportSymbol("box2d.b2ContactListener", box2d.b2ContactListener);
box2d.b2ContactListener.prototype.BeginContact = function() {};
goog.exportProperty(box2d.b2ContactListener.prototype, "BeginContact", box2d.b2ContactListener.prototype.BeginContact);
box2d.b2ContactListener.prototype.EndContact = function() {};
goog.exportProperty(box2d.b2ContactListener.prototype, "EndContact", box2d.b2ContactListener.prototype.EndContact);
box2d.b2ContactListener.prototype.PreSolve = function() {};
goog.exportProperty(box2d.b2ContactListener.prototype, "PreSolve", box2d.b2ContactListener.prototype.PreSolve);
box2d.b2ContactListener.prototype.PostSolve = function() {};
goog.exportProperty(box2d.b2ContactListener.prototype, "PostSolve", box2d.b2ContactListener.prototype.PostSolve);
box2d.b2ContactListener.b2_defaultListener = new box2d.b2ContactListener;
goog.exportProperty(box2d.b2ContactListener, "b2_defaultListener", box2d.b2ContactListener.b2_defaultListener);
box2d.b2QueryCallback = function() {};
goog.exportSymbol("box2d.b2QueryCallback", box2d.b2QueryCallback);
box2d.b2QueryCallback.prototype.ReportFixture = function() {
  return !0
};
goog.exportProperty(box2d.b2QueryCallback.prototype, "ReportFixture", box2d.b2QueryCallback.prototype.ReportFixture);
box2d.b2RayCastCallback = function() {};
goog.exportSymbol("box2d.b2RayCastCallback", box2d.b2RayCastCallback);
box2d.b2RayCastCallback.prototype.ReportFixture = function(a, b, c, e) {
  return e
};
goog.exportProperty(box2d.b2RayCastCallback.prototype, "ReportFixture", box2d.b2RayCastCallback.prototype.ReportFixture);
box2d.b2Island = function() {
  this.m_bodies = Array(1024);
  this.m_contacts = Array(1024);
  this.m_joints = Array(1024);
  this.m_positions = box2d.b2Position.MakeArray(1024);
  this.m_velocities = box2d.b2Velocity.MakeArray(1024)
};
goog.exportSymbol("box2d.b2Island", box2d.b2Island);
box2d.b2Island.prototype.m_allocator = null;
goog.exportProperty(box2d.b2Island.prototype, "m_allocator", box2d.b2Island.prototype.m_allocator);
box2d.b2Island.prototype.m_listener = null;
goog.exportProperty(box2d.b2Island.prototype, "m_listener", box2d.b2Island.prototype.m_listener);
box2d.b2Island.prototype.m_bodies = null;
goog.exportProperty(box2d.b2Island.prototype, "m_bodies", box2d.b2Island.prototype.m_bodies);
box2d.b2Island.prototype.m_contacts = null;
goog.exportProperty(box2d.b2Island.prototype, "m_contacts", box2d.b2Island.prototype.m_contacts);
box2d.b2Island.prototype.m_joints = null;
goog.exportProperty(box2d.b2Island.prototype, "m_joints", box2d.b2Island.prototype.m_joints);
box2d.b2Island.prototype.m_positions = null;
goog.exportProperty(box2d.b2Island.prototype, "m_positions", box2d.b2Island.prototype.m_positions);
box2d.b2Island.prototype.m_velocities = null;
goog.exportProperty(box2d.b2Island.prototype, "m_velocities", box2d.b2Island.prototype.m_velocities);
box2d.b2Island.prototype.m_bodyCount = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_bodyCount", box2d.b2Island.prototype.m_bodyCount);
box2d.b2Island.prototype.m_jointCount = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_jointCount", box2d.b2Island.prototype.m_jointCount);
box2d.b2Island.prototype.m_contactCount = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_contactCount", box2d.b2Island.prototype.m_contactCount);
box2d.b2Island.prototype.m_bodyCapacity = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_bodyCapacity", box2d.b2Island.prototype.m_bodyCapacity);
box2d.b2Island.prototype.m_contactCapacity = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_contactCapacity", box2d.b2Island.prototype.m_contactCapacity);
box2d.b2Island.prototype.m_jointCapacity = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_jointCapacity", box2d.b2Island.prototype.m_jointCapacity);
box2d.b2Island.prototype.Initialize = function(a, b, c, e, d) {
  this.m_bodyCapacity = a;
  this.m_contactCapacity = b;
  this.m_jointCapacity = c;
  this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
  this.m_allocator = e;
  for (this.m_listener = d; this.m_bodies.length < a;) this.m_bodies[this.m_bodies.length] = null;
  for (; this.m_contacts.length < b;) this.m_contacts[this.m_contacts.length] = null;
  for (; this.m_joints.length < c;) this.m_joints[this.m_joints.length] = null;
  if (this.m_positions.length < a) {
    b = box2d.b2Max(2 * this.m_positions.length,
      a);
    for (box2d.DEBUG && window.console.log("box2d.b2Island.m_positions: " + b); this.m_positions.length < b;) this.m_positions[this.m_positions.length] = new box2d.b2Position
  }
  if (this.m_velocities.length < a) {
    b = box2d.b2Max(2 * this.m_velocities.length, a);
    for (box2d.DEBUG && window.console.log("box2d.b2Island.m_velocities: " + b); this.m_velocities.length < b;) this.m_velocities[this.m_velocities.length] = new box2d.b2Velocity
  }
};
goog.exportProperty(box2d.b2Island.prototype, "Initialize", box2d.b2Island.prototype.Initialize);
box2d.b2Island.prototype.Clear = function() {
  this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0
};
goog.exportProperty(box2d.b2Island.prototype, "Clear", box2d.b2Island.prototype.Clear);
box2d.b2Island.prototype.AddBody = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_bodyCount < this.m_bodyCapacity);
  a.m_islandIndex = this.m_bodyCount;
  this.m_bodies[this.m_bodyCount++] = a
};
goog.exportProperty(box2d.b2Island.prototype, "AddBody", box2d.b2Island.prototype.AddBody);
box2d.b2Island.prototype.AddContact = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_contactCount < this.m_contactCapacity);
  this.m_contacts[this.m_contactCount++] = a
};
goog.exportProperty(box2d.b2Island.prototype, "AddContact", box2d.b2Island.prototype.AddContact);
box2d.b2Island.prototype.AddJoint = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_jointCount < this.m_jointCapacity);
  this.m_joints[this.m_jointCount++] = a
};
goog.exportProperty(box2d.b2Island.prototype, "AddJoint", box2d.b2Island.prototype.AddJoint);
box2d.b2Island.prototype.Solve = function(a, b, c, e) {
  for (var d = box2d.b2Island.s_timer.Reset(), f = b.dt, g = 0; g < this.m_bodyCount; ++g) {
    var h = this.m_bodies[g],
      j = this.m_positions[g].c.Copy(h.m_sweep.c),
      i = h.m_sweep.a,
      k = this.m_velocities[g].v.Copy(h.m_linearVelocity),
      l = h.m_angularVelocity;
    h.m_sweep.c0.Copy(h.m_sweep.c);
    h.m_sweep.a0 = h.m_sweep.a;
    h.m_type == box2d.b2BodyType.b2_dynamicBody && (k.x += f * (h.m_gravityScale * c.x + h.m_invMass * h.m_force.x), k.y += f * (h.m_gravityScale * c.y + h.m_invMass * h.m_force.y), l += f * h.m_invI * h.m_torque,
      k.SelfMul(box2d.b2Clamp(1 - f * h.m_linearDamping, 0, 1)), l *= box2d.b2Clamp(1 - f * h.m_angularDamping, 0, 1));
    this.m_positions[g].a = i;
    this.m_velocities[g].w = l
  }
  d.Reset();
  h = box2d.b2Island.s_solverData;
  h.step.Copy(b);
  h.positions = this.m_positions;
  h.velocities = this.m_velocities;
  g = box2d.b2Island.s_contactSolverDef;
  g.step.Copy(b);
  g.contacts = this.m_contacts;
  g.count = this.m_contactCount;
  g.positions = this.m_positions;
  g.velocities = this.m_velocities;
  g.allocator = this.m_allocator;
  c = box2d.b2Island.s_contactSolver.Initialize(g);
  c.InitializeVelocityConstraints();
  b.warmStarting && c.WarmStart();
  for (g = 0; g < this.m_jointCount; ++g) this.m_joints[g].InitVelocityConstraints(h);
  a.solveInit = d.GetMilliseconds();
  d.Reset();
  for (g = 0; g < b.velocityIterations; ++g) {
    for (i = 0; i < this.m_jointCount; ++i) this.m_joints[i].SolveVelocityConstraints(h);
    c.SolveVelocityConstraints()
  }
  c.StoreImpulses();
  a.solveVelocity = d.GetMilliseconds();
  for (g = 0; g < this.m_bodyCount; ++g) {
    var j = this.m_positions[g].c,
      i = this.m_positions[g].a,
      k = this.m_velocities[g].v,
      l = this.m_velocities[g].w,
      m = box2d.b2MulSV(f, k, box2d.b2Island.s_translation);
    box2d.b2DotVV(m, m) > box2d.b2_maxTranslationSquared && (m = box2d.b2_maxTranslation / m.GetLength(), k.SelfMul(m));
    m = f * l;
    m * m > box2d.b2_maxRotationSquared && (m = box2d.b2_maxRotation / box2d.b2Abs(m), l *= m);
    j.x += f * k.x;
    j.y += f * k.y;
    i += f * l;
    this.m_positions[g].a = i;
    this.m_velocities[g].w = l
  }
  d.Reset();
  j = !1;
  for (g = 0; g < b.positionIterations; ++g) {
    k = c.SolvePositionConstraints();
    l = !0;
    for (i = 0; i < this.m_jointCount; ++i) m = this.m_joints[i].SolvePositionConstraints(h), l = l && m;
    if (k && l) {
      j = !0;
      break
    }
  }
  for (g = 0; g < this.m_bodyCount; ++g) b = this.m_bodies[g], b.m_sweep.c.Copy(this.m_positions[g].c), b.m_sweep.a = this.m_positions[g].a, b.m_linearVelocity.Copy(this.m_velocities[g].v), b.m_angularVelocity = this.m_velocities[g].w, b.SynchronizeTransform();
  a.solvePosition = d.GetMilliseconds();
  this.Report(c.m_velocityConstraints);
  if (e) {
    a = box2d.b2_maxFloat;
    e = box2d.b2_linearSleepTolerance * box2d.b2_linearSleepTolerance;
    d = box2d.b2_angularSleepTolerance * box2d.b2_angularSleepTolerance;
    for (g = 0; g < this.m_bodyCount; ++g) h =
      this.m_bodies[g], h.GetType() != box2d.b2BodyType.b2_staticBody && (0 == (h.m_flags & box2d.b2BodyFlag.e_autoSleepFlag) || h.m_angularVelocity * h.m_angularVelocity > d || box2d.b2DotVV(h.m_linearVelocity, h.m_linearVelocity) > e ? a = h.m_sleepTime = 0 : (h.m_sleepTime += f, a = box2d.b2Min(a, h.m_sleepTime)));
    if (a >= box2d.b2_timeToSleep && j)
      for (g = 0; g < this.m_bodyCount; ++g) h = this.m_bodies[g], h.SetAwake(!1)
  }
};
goog.exportProperty(box2d.b2Island.prototype, "Solve", box2d.b2Island.prototype.Solve);
box2d.b2Island.prototype.SolveTOI = function(a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(b < this.m_bodyCount);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c < this.m_bodyCount);
  for (var e = 0; e < this.m_bodyCount; ++e) {
    var d = this.m_bodies[e];
    this.m_positions[e].c.Copy(d.m_sweep.c);
    this.m_positions[e].a = d.m_sweep.a;
    this.m_velocities[e].v.Copy(d.m_linearVelocity);
    this.m_velocities[e].w = d.m_angularVelocity
  }
  e = box2d.b2Island.s_contactSolverDef;
  e.contacts = this.m_contacts;
  e.count = this.m_contactCount;
  e.allocator = this.m_allocator;
  e.step.Copy(a);
  e.positions = this.m_positions;
  e.velocities = this.m_velocities;
  d = box2d.b2Island.s_contactSolver.Initialize(e);
  for (e = 0; e < a.positionIterations && !d.SolveTOIPositionConstraints(b, c); ++e);
  this.m_bodies[b].m_sweep.c0.Copy(this.m_positions[b].c);
  this.m_bodies[b].m_sweep.a0 = this.m_positions[b].a;
  this.m_bodies[c].m_sweep.c0.Copy(this.m_positions[c].c);
  this.m_bodies[c].m_sweep.a0 = this.m_positions[c].a;
  d.InitializeVelocityConstraints();
  for (e = 0; e < a.velocityIterations; ++e) d.SolveVelocityConstraints();
  a = a.dt;
  for (e = 0; e < this.m_bodyCount; ++e) {
    var b = this.m_positions[e].c,
      c = this.m_positions[e].a,
      f = this.m_velocities[e].v,
      g = this.m_velocities[e].w,
      h = box2d.b2MulSV(a, f, box2d.b2Island.s_translation);
    box2d.b2DotVV(h, h) > box2d.b2_maxTranslationSquared && (h = box2d.b2_maxTranslation / h.GetLength(), f.SelfMul(h));
    h = a * g;
    h * h > box2d.b2_maxRotationSquared && (h = box2d.b2_maxRotation / box2d.b2Abs(h), g *= h);
    b.SelfMulAdd(a, f);
    c += a * g;
    this.m_positions[e].a = c;
    this.m_velocities[e].w = g;
    h = this.m_bodies[e];
    h.m_sweep.c.Copy(b);
    h.m_sweep.a =
      c;
    h.m_linearVelocity.Copy(f);
    h.m_angularVelocity = g;
    h.SynchronizeTransform()
  }
  this.Report(d.m_velocityConstraints)
};
goog.exportProperty(box2d.b2Island.prototype, "SolveTOI", box2d.b2Island.prototype.SolveTOI);
box2d.b2Island.prototype.Report = function(a) {
  if (null != this.m_listener)
    for (var b = 0; b < this.m_contactCount; ++b) {
      var c = this.m_contacts[b];
      if (c) {
        var e = a[b],
          d = box2d.b2Island.s_impulse;
        d.count = e.pointCount;
        for (var f = 0; f < e.pointCount; ++f) d.normalImpulses[f] = e.points[f].normalImpulse, d.tangentImpulses[f] = e.points[f].tangentImpulse;
        this.m_listener.PostSolve(c, d)
      }
    }
};
goog.exportProperty(box2d.b2Island.prototype, "Report", box2d.b2Island.prototype.Report);
box2d.b2Island.s_timer = new box2d.b2Timer;
box2d.b2Island.s_solverData = new box2d.b2SolverData;
box2d.b2Island.s_contactSolverDef = new box2d.b2ContactSolverDef;
box2d.b2Island.s_contactSolver = new box2d.b2ContactSolver;
box2d.b2Island.s_translation = new box2d.b2Vec2;
box2d.b2Island.s_impulse = new box2d.b2ContactImpulse;
box2d.b2GrowableStack = function(a) {
  this.m_stack = Array(a)
};
goog.exportSymbol("box2d.b2GrowableStack", box2d.b2GrowableStack);
box2d.b2GrowableStack.prototype.m_stack = null;
goog.exportProperty(box2d.b2GrowableStack.prototype, "m_stack", box2d.b2GrowableStack.prototype.m_stack);
box2d.b2GrowableStack.prototype.m_count = 0;
goog.exportProperty(box2d.b2GrowableStack.prototype, "m_count", box2d.b2GrowableStack.prototype.m_count);
box2d.b2GrowableStack.prototype.Reset = function() {
  this.m_count = 0;
  return this
};
goog.exportProperty(box2d.b2GrowableStack.prototype, "Reset", box2d.b2GrowableStack.prototype.Reset);
box2d.b2GrowableStack.prototype.Push = function(a) {
  this.m_stack[this.m_count] = a;
  ++this.m_count
};
goog.exportProperty(box2d.b2GrowableStack.prototype, "Push", box2d.b2GrowableStack.prototype.Push);
box2d.b2GrowableStack.prototype.Pop = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_count);
  --this.m_count;
  var a = this.m_stack[this.m_count];
  this.m_stack[this.m_count] = null;
  return a
};
goog.exportProperty(box2d.b2GrowableStack.prototype, "Pop", box2d.b2GrowableStack.prototype.Pop);
box2d.b2GrowableStack.prototype.GetCount = function() {
  return this.m_count
};
goog.exportProperty(box2d.b2GrowableStack.prototype, "GetCount", box2d.b2GrowableStack.prototype.GetCount);
box2d.b2TreeNode = function(a) {
  this.m_id = a || 0;
  this.aabb = new box2d.b2AABB
};
goog.exportSymbol("box2d.b2TreeNode", box2d.b2TreeNode);
box2d.b2TreeNode.prototype.m_id = 0;
goog.exportProperty(box2d.b2TreeNode.prototype, "m_id", box2d.b2TreeNode.prototype.m_id);
box2d.b2TreeNode.prototype.aabb = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "aabb", box2d.b2TreeNode.prototype.aabb);
box2d.b2TreeNode.prototype.userData = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "userData", box2d.b2TreeNode.prototype.userData);
box2d.b2TreeNode.prototype.parent = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "parent", box2d.b2TreeNode.prototype.parent);
box2d.b2TreeNode.prototype.child1 = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "child1", box2d.b2TreeNode.prototype.child1);
box2d.b2TreeNode.prototype.child2 = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "child2", box2d.b2TreeNode.prototype.child2);
box2d.b2TreeNode.prototype.height = 0;
goog.exportProperty(box2d.b2TreeNode.prototype, "height", box2d.b2TreeNode.prototype.height);
box2d.b2TreeNode.prototype.IsLeaf = function() {
  return null == this.child1
};
goog.exportProperty(box2d.b2TreeNode.prototype, "IsLeaf", box2d.b2TreeNode.prototype.IsLeaf);
box2d.b2DynamicTree = function() {};
goog.exportSymbol("box2d.b2DynamicTree", box2d.b2DynamicTree);
box2d.b2DynamicTree.prototype.m_root = null;
goog.exportProperty(box2d.b2DynamicTree.prototype, "m_root", box2d.b2DynamicTree.prototype.m_root);
box2d.b2DynamicTree.prototype.m_freeList = null;
goog.exportProperty(box2d.b2DynamicTree.prototype, "m_freeList", box2d.b2DynamicTree.prototype.m_freeList);
box2d.b2DynamicTree.prototype.m_path = 0;
goog.exportProperty(box2d.b2DynamicTree.prototype, "m_path", box2d.b2DynamicTree.prototype.m_path);
box2d.b2DynamicTree.prototype.m_insertionCount = 0;
goog.exportProperty(box2d.b2DynamicTree.prototype, "m_insertionCount", box2d.b2DynamicTree.prototype.m_insertionCount);
box2d.b2DynamicTree.s_stack = new box2d.b2GrowableStack(256);
box2d.b2DynamicTree.s_r = new box2d.b2Vec2;
box2d.b2DynamicTree.s_v = new box2d.b2Vec2;
box2d.b2DynamicTree.s_abs_v = new box2d.b2Vec2;
box2d.b2DynamicTree.s_segmentAABB = new box2d.b2AABB;
box2d.b2DynamicTree.s_subInput = new box2d.b2RayCastInput;
box2d.b2DynamicTree.s_combinedAABB = new box2d.b2AABB;
box2d.b2DynamicTree.s_aabb = new box2d.b2AABB;
box2d.b2DynamicTree.prototype.GetUserData = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null != a);
  return a.userData
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetUserData", box2d.b2DynamicTree.prototype.GetUserData);
box2d.b2DynamicTree.prototype.GetFatAABB = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null != a);
  return a.aabb
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetFatAABB", box2d.b2DynamicTree.prototype.GetFatAABB);
box2d.b2DynamicTree.prototype.Query = function(a, b) {
  if (null != this.m_root) {
    var c = box2d.b2DynamicTree.s_stack.Reset();
    for (c.Push(this.m_root); 0 < c.GetCount();) {
      var e = c.Pop();
      if (null != e && e.aabb.TestOverlap(b))
        if (e.IsLeaf()) {
          if (!1 == a(e)) break
        } else c.Push(e.child1), c.Push(e.child2)
    }
  }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "Query", box2d.b2DynamicTree.prototype.Query);
box2d.b2DynamicTree.prototype.RayCast = function(a, b) {
  if (null != this.m_root) {
    var c = b.p1,
      e = b.p2,
      d = box2d.b2SubVV(e, c, box2d.b2DynamicTree.s_r);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < d.GetLengthSquared());
    d.Normalize();
    var d = box2d.b2CrossOneV(d, box2d.b2DynamicTree.s_v),
      f = box2d.b2AbsV(d, box2d.b2DynamicTree.s_abs_v),
      g = b.maxFraction,
      h = box2d.b2DynamicTree.s_segmentAABB,
      j = c.x + g * (e.x - c.x),
      i = c.y + g * (e.y - c.y);
    h.lowerBound.x = box2d.b2Min(c.x, j);
    h.lowerBound.y = box2d.b2Min(c.y, i);
    h.upperBound.x = box2d.b2Max(c.x, j);
    h.upperBound.y =
      box2d.b2Max(c.y, i);
    var k = box2d.b2DynamicTree.s_stack.Reset();
    for (k.Push(this.m_root); 0 < k.GetCount();)
      if (j = k.Pop(), null != j && !1 != box2d.b2TestOverlapAABB(j.aabb, h)) {
        var i = j.aabb.GetCenter(),
          l = j.aabb.GetExtents();
        if (!(0 < box2d.b2Abs(box2d.b2DotVV(d, box2d.b2SubVV(c, i, box2d.b2Vec2.s_t0))) - box2d.b2DotVV(f, l)))
          if (j.IsLeaf()) {
            i = box2d.b2DynamicTree.s_subInput;
            i.p1.Copy(b.p1);
            i.p2.Copy(b.p2);
            i.maxFraction = g;
            j = a(i, j);
            if (0 == j) break;
            0 < j && (g = j, j = c.x + g * (e.x - c.x), i = c.y + g * (e.y - c.y), h.lowerBound.x = box2d.b2Min(c.x, j),
              h.lowerBound.y = box2d.b2Min(c.y, i), h.upperBound.x = box2d.b2Max(c.x, j), h.upperBound.y = box2d.b2Max(c.y, i))
          } else k.Push(j.child1), k.Push(j.child2)
      }
  }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "RayCast", box2d.b2DynamicTree.prototype.RayCast);
box2d.b2DynamicTree.prototype.AllocateNode = function() {
  if (this.m_freeList) {
    var a = this.m_freeList;
    this.m_freeList = a.parent;
    a.parent = null;
    a.child1 = null;
    a.child2 = null;
    a.height = 0;
    a.userData = null;
    return a
  }
  return new box2d.b2TreeNode(box2d.b2DynamicTree.prototype.s_node_id++)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "AllocateNode", box2d.b2DynamicTree.prototype.AllocateNode);
box2d.b2DynamicTree.prototype.s_node_id = 0;
box2d.b2DynamicTree.prototype.FreeNode = function(a) {
  a.parent = this.m_freeList;
  a.height = -1;
  this.m_freeList = a
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "FreeNode", box2d.b2DynamicTree.prototype.FreeNode);
box2d.b2DynamicTree.prototype.CreateProxy = function(a, b) {
  var c = this.AllocateNode(),
    e = box2d.b2_aabbExtension,
    d = box2d.b2_aabbExtension;
  c.aabb.lowerBound.x = a.lowerBound.x - e;
  c.aabb.lowerBound.y = a.lowerBound.y - d;
  c.aabb.upperBound.x = a.upperBound.x + e;
  c.aabb.upperBound.y = a.upperBound.y + d;
  c.userData = b;
  c.height = 0;
  this.InsertLeaf(c);
  return c
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "CreateProxy", box2d.b2DynamicTree.prototype.CreateProxy);
box2d.b2DynamicTree.prototype.DestroyProxy = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.IsLeaf());
  this.RemoveLeaf(a);
  this.FreeNode(a)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "DestroyProxy", box2d.b2DynamicTree.prototype.DestroyProxy);
box2d.b2DynamicTree.prototype.MoveProxy = function(a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.IsLeaf());
  if (a.aabb.Contains(b)) return !1;
  this.RemoveLeaf(a);
  var e = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (0 < c.x ? c.x : -c.x),
    c = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (0 < c.y ? c.y : -c.y);
  a.aabb.lowerBound.x = b.lowerBound.x - e;
  a.aabb.lowerBound.y = b.lowerBound.y - c;
  a.aabb.upperBound.x = b.upperBound.x + e;
  a.aabb.upperBound.y = b.upperBound.y + c;
  this.InsertLeaf(a);
  return !0
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "MoveProxy", box2d.b2DynamicTree.prototype.MoveProxy);
box2d.b2DynamicTree.prototype.InsertLeaf = function(a) {
  ++this.m_insertionCount;
  if (null == this.m_root) this.m_root = a, this.m_root.parent = null;
  else {
    var b = a.aabb;
    b.GetCenter();
    for (var c = this.m_root, e, d; !1 == c.IsLeaf();) {
      e = c.child1;
      d = c.child2;
      var f = c.aabb.GetPerimeter(),
        g = box2d.b2DynamicTree.s_combinedAABB;
      g.Combine2(c.aabb, b);
      var h = g.GetPerimeter(),
        g = 2 * h,
        h = 2 * (h - f),
        j = box2d.b2DynamicTree.s_aabb,
        i, k;
      e.IsLeaf() ? (j.Combine2(b, e.aabb), f = j.GetPerimeter() + h) : (j.Combine2(b, e.aabb), i = e.aabb.GetPerimeter(), k = j.GetPerimeter(),
        f = k - i + h);
      d.IsLeaf() ? (j.Combine2(b, d.aabb), h = j.GetPerimeter() + h) : (j.Combine2(b, d.aabb), i = d.aabb.GetPerimeter(), k = j.GetPerimeter(), h = k - i + h);
      if (g < f && g < h) break;
      c = f < h ? e : d
    }
    e = c.parent;
    d = this.AllocateNode();
    d.parent = e;
    d.userData = null;
    d.aabb.Combine2(b, c.aabb);
    d.height = c.height + 1;
    e ? (e.child1 == c ? e.child1 = d : e.child2 = d, d.child1 = c, d.child2 = a, c.parent = d, a.parent = d) : (d.child1 = c, d.child2 = a, c.parent = d, this.m_root = a.parent = d);
    for (c = a.parent; null != c;) c = this.Balance(c), e = c.child1, d = c.child2, box2d.ENABLE_ASSERTS && box2d.b2Assert(null !=
      e), box2d.ENABLE_ASSERTS && box2d.b2Assert(null != d), c.height = 1 + box2d.b2Max(e.height, d.height), c.aabb.Combine2(e.aabb, d.aabb), c = c.parent
  }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "InsertLeaf", box2d.b2DynamicTree.prototype.InsertLeaf);
box2d.b2DynamicTree.prototype.RemoveLeaf = function(a) {
  if (a == this.m_root) this.m_root = null;
  else {
    var b = a.parent,
      c = b.parent,
      a = b.child1 == a ? b.child2 : b.child1;
    if (c) {
      c.child1 == b ? c.child1 = a : c.child2 = a;
      a.parent = c;
      this.FreeNode(b);
      for (b = c; b;) b = this.Balance(b), c = b.child1, a = b.child2, b.aabb.Combine2(c.aabb, a.aabb), b.height = 1 + box2d.b2Max(c.height, a.height), b = b.parent
    } else this.m_root = a, a.parent = null, this.FreeNode(b)
  }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "RemoveLeaf", box2d.b2DynamicTree.prototype.RemoveLeaf);
box2d.b2DynamicTree.prototype.Balance = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null != a);
  if (a.IsLeaf() || 2 > a.height) return a;
  var b = a.child1,
    c = a.child2,
    e = c.height - b.height;
  if (1 < e) {
    var e = c.child1,
      d = c.child2;
    c.child1 = a;
    c.parent = a.parent;
    a.parent = c;
    null != c.parent ? c.parent.child1 == a ? c.parent.child1 = c : (box2d.ENABLE_ASSERTS && box2d.b2Assert(c.parent.child2 == a), c.parent.child2 = c) : this.m_root = c;
    e.height > d.height ? (c.child2 = e, a.child2 = d, d.parent = a, a.aabb.Combine2(b.aabb, d.aabb), c.aabb.Combine2(a.aabb, e.aabb),
      a.height = 1 + box2d.b2Max(b.height, d.height), c.height = 1 + box2d.b2Max(a.height, e.height)) : (c.child2 = d, a.child2 = e, e.parent = a, a.aabb.Combine2(b.aabb, e.aabb), c.aabb.Combine2(a.aabb, d.aabb), a.height = 1 + box2d.b2Max(b.height, e.height), c.height = 1 + box2d.b2Max(a.height, d.height));
    return c
  }
  return -1 > e ? (e = b.child1, d = b.child2, b.child1 = a, b.parent = a.parent, a.parent = b, null != b.parent ? b.parent.child1 == a ? b.parent.child1 = b : (box2d.ENABLE_ASSERTS && box2d.b2Assert(b.parent.child2 == a), b.parent.child2 = b) : this.m_root = b, e.height >
    d.height ? (b.child2 = e, a.child1 = d, d.parent = a, a.aabb.Combine2(c.aabb, d.aabb), b.aabb.Combine2(a.aabb, e.aabb), a.height = 1 + box2d.b2Max(c.height, d.height), b.height = 1 + box2d.b2Max(a.height, e.height)) : (b.child2 = d, a.child1 = e, e.parent = a, a.aabb.Combine2(c.aabb, e.aabb), b.aabb.Combine2(a.aabb, d.aabb), a.height = 1 + box2d.b2Max(c.height, e.height), b.height = 1 + box2d.b2Max(a.height, d.height)), b) : a
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "Balance", box2d.b2DynamicTree.prototype.Balance);
box2d.b2DynamicTree.prototype.GetHeight = function() {
  return null == this.m_root ? 0 : this.m_root.height
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetHeight", box2d.b2DynamicTree.prototype.GetHeight);
box2d.b2DynamicTree.prototype.GetAreaRatio = function() {
  if (null == this.m_root) return 0;
  var a = this.m_root.aabb.GetPerimeter(),
    b = function(a) {
      if (null == a || a.IsLeaf()) return 0;
      var e = a.aabb.GetPerimeter(),
        e = e + b(a.child1);
      return e += b(a.child2)
    };
  return b(this.m_root) / a
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetAreaRatio", box2d.b2DynamicTree.prototype.GetAreaRatio);
box2d.b2DynamicTree.prototype.ComputeHeightNode = function(a) {
  if (a.IsLeaf()) return 0;
  var b = this.ComputeHeightNode(a.child1),
    a = this.ComputeHeightNode(a.child2);
  return 1 + box2d.b2Max(b, a)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ComputeHeightNode", box2d.b2DynamicTree.prototype.ComputeHeightNode);
box2d.b2DynamicTree.prototype.ComputeHeight = function() {
  return this.ComputeHeightNode(this.m_root)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ComputeHeight", box2d.b2DynamicTree.prototype.ComputeHeight);
box2d.b2DynamicTree.prototype.ValidateStructure = function(a) {
  if (null != a) {
    a == this.m_root && box2d.ENABLE_ASSERTS && box2d.b2Assert(null == a.parent);
    var b = a.child1,
      c = a.child2;
    a.IsLeaf() ? (box2d.ENABLE_ASSERTS && box2d.b2Assert(null == b), box2d.ENABLE_ASSERTS && box2d.b2Assert(null == c), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 == a.height)) : (box2d.ENABLE_ASSERTS && box2d.b2Assert(b.parent == a), box2d.ENABLE_ASSERTS && box2d.b2Assert(c.parent == a), this.ValidateStructure(b), this.ValidateStructure(c))
  }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ValidateStructure", box2d.b2DynamicTree.prototype.ValidateStructure);
box2d.b2DynamicTree.prototype.ValidateMetrics = function(a) {
  if (null != a) {
    var b = a.child1,
      c = a.child2;
    if (a.IsLeaf()) box2d.ENABLE_ASSERTS && box2d.b2Assert(null == b), box2d.ENABLE_ASSERTS && box2d.b2Assert(null == c), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 == a.height);
    else {
      var e;
      e = 1 + box2d.b2Max(b.height, c.height);
      box2d.ENABLE_ASSERTS && box2d.b2Assert(a.height == e);
      e = box2d.b2DynamicTree.s_aabb;
      e.Combine2(b.aabb, c.aabb);
      box2d.ENABLE_ASSERTS && box2d.b2Assert(e.lowerBound == a.aabb.lowerBound);
      box2d.ENABLE_ASSERTS && box2d.b2Assert(e.upperBound ==
        a.aabb.upperBound);
      this.ValidateMetrics(b);
      this.ValidateMetrics(c)
    }
  }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ValidateMetrics", box2d.b2DynamicTree.prototype.ValidateMetrics);
box2d.b2DynamicTree.prototype.Validate = function() {
  this.ValidateStructure(this.m_root);
  this.ValidateMetrics(this.m_root);
  for (var a = 0, b = this.m_freeList; null != b;) b = b.parent, ++a;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.GetHeight() == this.ComputeHeight())
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "Validate", box2d.b2DynamicTree.prototype.Validate);
box2d.b2DynamicTree.prototype.GetMaxBalance = function() {
  var a;
  a = this.m_root;
  null == a ? a = 0 : 1 >= a.height ? a = 0 : (box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == a.IsLeaf()), a = box2d.b2Abs(a.child2.height - a.child1.height), a = box2d.b2Max(0, a));
  return a
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetMaxBalance", box2d.b2DynamicTree.prototype.GetMaxBalance);
box2d.b2DynamicTree.prototype.RebuildBottomUp = function() {
  this.Validate()
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "RebuildBottomUp", box2d.b2DynamicTree.prototype.RebuildBottomUp);
box2d.b2DynamicTree.prototype.ShiftOrigin = function(a) {
  var b = function(a, e) {
    if (null != a && !(1 >= a.height)) {
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == a.IsLeaf());
      var d = a.child2;
      b(a.child1, e);
      b(d, e);
      a.aabb.lowerBound.SelfSub(e);
      a.aabb.upperBound.SelfSub(e)
    }
  };
  b(this.m_root, a)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ShiftOrigin", box2d.b2DynamicTree.prototype.ShiftOrigin);
box2d.b2Pair = function() {};
goog.exportSymbol("box2d.b2Pair", box2d.b2Pair);
box2d.b2Pair.prototype.proxyA = null;
goog.exportProperty(box2d.b2Pair.prototype, "proxyA", box2d.b2Pair.prototype.proxyA);
box2d.b2Pair.prototype.proxyB = null;
goog.exportProperty(box2d.b2Pair.prototype, "proxyB", box2d.b2Pair.prototype.proxyB);
box2d.b2BroadPhase = function() {
  this.m_tree = new box2d.b2DynamicTree;
  this.m_moveBuffer = [];
  this.m_pairBuffer = []
};
goog.exportSymbol("box2d.b2BroadPhase", box2d.b2BroadPhase);
box2d.b2BroadPhase.prototype.m_tree = null;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_tree", box2d.b2BroadPhase.prototype.m_tree);
box2d.b2BroadPhase.prototype.m_proxyCount = 0;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_proxyCount", box2d.b2BroadPhase.prototype.m_proxyCount);
box2d.b2BroadPhase.prototype.m_moveCount = 0;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_moveCount", box2d.b2BroadPhase.prototype.m_moveCount);
box2d.b2BroadPhase.prototype.m_moveBuffer = null;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_moveBuffer", box2d.b2BroadPhase.prototype.m_moveBuffer);
box2d.b2BroadPhase.prototype.m_pairCount = 0;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_pairCount", box2d.b2BroadPhase.prototype.m_pairCount);
box2d.b2BroadPhase.prototype.m_pairBuffer = null;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_pairBuffer", box2d.b2BroadPhase.prototype.m_pairBuffer);
box2d.b2BroadPhase.prototype.CreateProxy = function(a, b) {
  var c = this.m_tree.CreateProxy(a, b);
  ++this.m_proxyCount;
  this.BufferMove(c);
  return c
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "CreateProxy", box2d.b2BroadPhase.prototype.CreateProxy);
box2d.b2BroadPhase.prototype.DestroyProxy = function(a) {
  this.UnBufferMove(a);
  --this.m_proxyCount;
  this.m_tree.DestroyProxy(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "DestroyProxy", box2d.b2BroadPhase.prototype.DestroyProxy);
box2d.b2BroadPhase.prototype.MoveProxy = function(a, b, c) {
  this.m_tree.MoveProxy(a, b, c) && this.BufferMove(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "MoveProxy", box2d.b2BroadPhase.prototype.MoveProxy);
box2d.b2BroadPhase.prototype.TouchProxy = function(a) {
  this.BufferMove(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "TouchProxy", box2d.b2BroadPhase.prototype.TouchProxy);
box2d.b2BroadPhase.prototype.GetFatAABB = function(a) {
  return this.m_tree.GetFatAABB(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetFatAABB", box2d.b2BroadPhase.prototype.GetFatAABB);
box2d.b2BroadPhase.prototype.GetUserData = function(a) {
  return this.m_tree.GetUserData(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetUserData", box2d.b2BroadPhase.prototype.GetUserData);
box2d.b2BroadPhase.prototype.TestOverlap = function(a, b) {
  var c = this.m_tree.GetFatAABB(a),
    e = this.m_tree.GetFatAABB(b);
  return box2d.b2TestOverlapAABB(c, e)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "TestOverlap", box2d.b2BroadPhase.prototype.TestOverlap);
box2d.b2BroadPhase.prototype.GetProxyCount = function() {
  return this.m_proxyCount
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetProxyCount", box2d.b2BroadPhase.prototype.GetProxyCount);
box2d.b2BroadPhase.prototype.GetTreeHeight = function() {
  return this.m_tree.GetHeight()
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetTreeHeight", box2d.b2BroadPhase.prototype.GetTreeHeight);
box2d.b2BroadPhase.prototype.GetTreeBalance = function() {
  return this.m_tree.GetMaxBalance()
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetTreeBalance", box2d.b2BroadPhase.prototype.GetTreeBalance);
box2d.b2BroadPhase.prototype.GetTreeQuality = function() {
  return this.m_tree.GetAreaRatio()
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetTreeQuality", box2d.b2BroadPhase.prototype.GetTreeQuality);
box2d.b2BroadPhase.prototype.ShiftOrigin = function(a) {
  this.m_tree.ShiftOrigin(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "ShiftOrigin", box2d.b2BroadPhase.prototype.ShiftOrigin);
box2d.b2BroadPhase.prototype.UpdatePairs = function(a) {
  for (var b = this.m_pairCount = 0; b < this.m_moveCount; ++b) {
    var c = this.m_moveBuffer[b];
    if (null != c) {
      var e = this,
        d = this.m_tree.GetFatAABB(c);
      this.m_tree.Query(function(a) {
        if (a.m_id == c.m_id) return !0;
        e.m_pairCount == e.m_pairBuffer.length && (e.m_pairBuffer[e.m_pairCount] = new box2d.b2Pair);
        var b = e.m_pairBuffer[e.m_pairCount];
        a.m_id < c.m_id ? (b.proxyA = a, b.proxyB = c) : (b.proxyA = c, b.proxyB = a);
        ++e.m_pairCount;
        return !0
      }, d)
    }
  }
  this.m_moveCount = 0;
  this.m_pairBuffer.length = this.m_pairCount;
  this.m_pairBuffer.sort(box2d.b2PairLessThan);
  for (b = 0; b < this.m_pairCount;) {
    var d = this.m_pairBuffer[b],
      f = this.m_tree.GetUserData(d.proxyA),
      g = this.m_tree.GetUserData(d.proxyB);
    a.AddPair(f, g);
    for (++b; b < this.m_pairCount;) {
      f = this.m_pairBuffer[b];
      if (f.proxyA.m_id != d.proxyA.m_id || f.proxyB.m_id != d.proxyB.m_id) break;
      ++b
    }
  }
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "UpdatePairs", box2d.b2BroadPhase.prototype.UpdatePairs);
box2d.b2BroadPhase.prototype.Query = function(a, b) {
  this.m_tree.Query(a, b)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "Query", box2d.b2BroadPhase.prototype.Query);
box2d.b2BroadPhase.prototype.RayCast = function(a, b) {
  this.m_tree.RayCast(a, b)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "RayCast", box2d.b2BroadPhase.prototype.RayCast);
box2d.b2BroadPhase.prototype.BufferMove = function(a) {
  this.m_moveBuffer[this.m_moveCount] = a;
  ++this.m_moveCount
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "BufferMove", box2d.b2BroadPhase.prototype.BufferMove);
box2d.b2BroadPhase.prototype.UnBufferMove = function(a) {
  a = this.m_moveBuffer.indexOf(a);
  this.m_moveBuffer[a] = null
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "UnBufferMove", box2d.b2BroadPhase.prototype.UnBufferMove);
box2d.b2PairLessThan = function(a, b) {
  return a.proxyA.m_id == b.proxyA.m_id ? a.proxyB.m_id - b.proxyB.m_id : a.proxyA.m_id - b.proxyA.m_id
};
box2d.b2ContactManager = function() {
  this.m_broadPhase = new box2d.b2BroadPhase;
  this.m_contactFactory = new box2d.b2ContactFactory(this.m_allocator)
};
box2d.b2ContactManager.prototype.m_broadPhase = null;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_broadPhase", box2d.b2ContactManager.prototype.m_broadPhase);
box2d.b2ContactManager.prototype.m_contactList = null;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactList", box2d.b2ContactManager.prototype.m_contactList);
box2d.b2ContactManager.prototype.m_contactCount = 0;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactCount", box2d.b2ContactManager.prototype.m_contactCount);
box2d.b2ContactManager.prototype.m_contactFilter = box2d.b2ContactFilter.b2_defaultFilter;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactFilter", box2d.b2ContactManager.prototype.m_contactFilter);
box2d.b2ContactManager.prototype.m_contactListener = box2d.b2ContactListener.b2_defaultListener;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactListener", box2d.b2ContactManager.prototype.m_contactListener);
box2d.b2ContactManager.prototype.m_allocator = null;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_allocator", box2d.b2ContactManager.prototype.m_allocator);
box2d.b2ContactManager.prototype.m_contactFactory = null;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactFactory", box2d.b2ContactManager.prototype.m_contactFactory);
box2d.b2ContactManager.prototype.Destroy = function(a) {
  var b = a.GetFixtureA(),
    c = a.GetFixtureB(),
    b = b.GetBody(),
    c = c.GetBody();
  this.m_contactListener && a.IsTouching() && this.m_contactListener.EndContact(a);
  a.m_prev && (a.m_prev.m_next = a.m_next);
  a.m_next && (a.m_next.m_prev = a.m_prev);
  a == this.m_contactList && (this.m_contactList = a.m_next);
  a.m_nodeA.prev && (a.m_nodeA.prev.next = a.m_nodeA.next);
  a.m_nodeA.next && (a.m_nodeA.next.prev = a.m_nodeA.prev);
  a.m_nodeA == b.m_contactList && (b.m_contactList = a.m_nodeA.next);
  a.m_nodeB.prev &&
    (a.m_nodeB.prev.next = a.m_nodeB.next);
  a.m_nodeB.next && (a.m_nodeB.next.prev = a.m_nodeB.prev);
  a.m_nodeB == c.m_contactList && (c.m_contactList = a.m_nodeB.next);
  this.m_contactFactory.Destroy(a);
  --this.m_contactCount
};
goog.exportSymbol("box2d.b2ContactManager.prototype.Destroy", box2d.b2ContactManager.prototype.Destroy);
box2d.b2ContactManager.prototype.Collide = function() {
  for (var a = this.m_contactList; a;) {
    var b = a.GetFixtureA(),
      c = a.GetFixtureB(),
      e = a.GetChildIndexA(),
      d = a.GetChildIndexB(),
      f = b.GetBody(),
      g = c.GetBody();
    if (a.m_flags & box2d.b2ContactFlag.e_filterFlag) {
      if (!1 == g.ShouldCollide(f)) {
        b = a;
        a = b.m_next;
        this.Destroy(b);
        continue
      }
      if (this.m_contactFilter && !1 == this.m_contactFilter.ShouldCollide(b, c)) {
        b = a;
        a = b.m_next;
        this.Destroy(b);
        continue
      }
      a.m_flags &= ~box2d.b2ContactFlag.e_filterFlag
    }
    f = f.IsAwake() && f.m_type != box2d.b2BodyType.b2_staticBody;
    g = g.IsAwake() && g.m_type != box2d.b2BodyType.b2_staticBody;
    !1 == f && !1 == g ? a = a.m_next : !1 == this.m_broadPhase.TestOverlap(b.m_proxies[e].proxy, c.m_proxies[d].proxy) ? (b = a, a = b.m_next, this.Destroy(b)) : (a.Update(this.m_contactListener), a = a.m_next)
  }
};
goog.exportSymbol("box2d.b2ContactManager.prototype.Collide", box2d.b2ContactManager.prototype.Collide);
box2d.b2ContactManager.prototype.FindNewContacts = function() {
  this.m_broadPhase.UpdatePairs(this)
};
goog.exportSymbol("box2d.b2ContactManager.prototype.FindNewContacts", box2d.b2ContactManager.prototype.FindNewContacts);
box2d.b2ContactManager.prototype.AddPair = function(a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2FixtureProxy);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(b instanceof box2d.b2FixtureProxy);
  var c = a.fixture,
    e = b.fixture,
    d = a.childIndex,
    f = b.childIndex,
    g = c.GetBody(),
    h = e.GetBody();
  if (g != h) {
    for (var j = h.GetContactList(); j;) {
      if (j.other == g) {
        var i = j.contact.GetFixtureA(),
          k = j.contact.GetFixtureB(),
          l = j.contact.GetChildIndexA(),
          m = j.contact.GetChildIndexB();
        if (i == c && k == e && l == d && m == f || i == e && k == c && l == f &&
          m == d) return
      }
      j = j.next
    }
    if (!1 != h.ShouldCollide(g) && !(this.m_contactFilter && !1 == this.m_contactFilter.ShouldCollide(c, e)) && (d = this.m_contactFactory.Create(c, d, e, f), null != d)) c = d.GetFixtureA(), e = d.GetFixtureB(), d.GetChildIndexA(), d.GetChildIndexB(), g = c.m_body, h = e.m_body, d.m_prev = null, d.m_next = this.m_contactList, null !== this.m_contactList && (this.m_contactList.m_prev = d), this.m_contactList = d, d.m_nodeA.contact = d, d.m_nodeA.other = h, d.m_nodeA.prev = null, d.m_nodeA.next = g.m_contactList, null != g.m_contactList && (g.m_contactList.prev =
      d.m_nodeA), g.m_contactList = d.m_nodeA, d.m_nodeB.contact = d, d.m_nodeB.other = g, d.m_nodeB.prev = null, d.m_nodeB.next = h.m_contactList, null != h.m_contactList && (h.m_contactList.prev = d.m_nodeB), h.m_contactList = d.m_nodeB, !1 == c.IsSensor() && !1 == e.IsSensor() && (g.SetAwake(!0), h.SetAwake(!0)), ++this.m_contactCount
  }
};
goog.exportSymbol("box2d.b2ContactManager.prototype.AddPair", box2d.b2ContactManager.prototype.AddPair);
box2d.b2Color = function(a, b, c) {
  this._r = box2d.b2Clamp(Math.round(255 * a), 0, 255);
  this._g = box2d.b2Clamp(Math.round(255 * b), 0, 255);
  this._b = box2d.b2Clamp(Math.round(255 * c), 0, 255)
};
goog.exportSymbol("box2d.b2Color", box2d.b2Color);
box2d.b2Color.prototype._r = 127;
goog.exportProperty(box2d.b2Color.prototype, "_r", box2d.b2Color.prototype._r);
box2d.b2Color.prototype._g = 127;
goog.exportProperty(box2d.b2Color.prototype, "_g", box2d.b2Color.prototype._g);
box2d.b2Color.prototype._b = 127;
goog.exportProperty(box2d.b2Color.prototype, "_b", box2d.b2Color.prototype._b);
box2d.b2Color.prototype.SetRGB = function(a, b, c) {
  this._r = box2d.b2Clamp(Math.round(255 * a), 0, 255);
  this._g = box2d.b2Clamp(Math.round(255 * b), 0, 255);
  this._b = box2d.b2Clamp(Math.round(255 * c), 0, 255);
  return this
};
goog.exportProperty(box2d.b2Color.prototype, "SetRGB", box2d.b2Color.prototype.SetRGB);
box2d.b2Color.prototype.MakeStyleString = function(a) {
  return box2d.b2Color.MakeStyleString(this._r, this._g, this._b, a || 1)
};
goog.exportProperty(box2d.b2Color.prototype, "MakeStyleString", box2d.b2Color.prototype.MakeStyleString);
box2d.b2Color.MakeStyleString = function(a, b, c, e) {
  return 1 > e ? "rgba(" + a + "," + b + "," + c + "," + e + ")" : "rgb(" + a + "," + b + "," + c + ")"
};
goog.exportProperty(box2d.b2Color, "MakeStyleString", box2d.b2Color.MakeStyleString);
box2d.b2Color.RED = new box2d.b2Color(1, 0, 0);
goog.exportProperty(box2d.b2Color, "RED", box2d.b2Color.RED);
box2d.b2Color.GREEN = new box2d.b2Color(0, 1, 0);
goog.exportProperty(box2d.b2Color, "GREEN", box2d.b2Color.GREEN);
box2d.b2Color.BLUE = new box2d.b2Color(0, 0, 1);
goog.exportProperty(box2d.b2Color, "BLUE", box2d.b2Color.BLUE);
box2d.b2DrawFlags = {
  e_none: 0,
  e_shapeBit: 1,
  e_jointBit: 2,
  e_aabbBit: 4,
  e_pairBit: 8,
  e_centerOfMassBit: 16,
  e_controllerBit: 32,
  e_all: 63
};
goog.exportSymbol("box2d.b2DrawFlags", box2d.b2DrawFlags);
goog.exportProperty(box2d.b2DrawFlags, "e_none", box2d.b2DrawFlags.e_none);
goog.exportProperty(box2d.b2DrawFlags, "e_shapeBit", box2d.b2DrawFlags.e_shapeBit);
goog.exportProperty(box2d.b2DrawFlags, "e_jointBit", box2d.b2DrawFlags.e_jointBit);
goog.exportProperty(box2d.b2DrawFlags, "e_aabbBit", box2d.b2DrawFlags.e_aabbBit);
goog.exportProperty(box2d.b2DrawFlags, "e_pairBit", box2d.b2DrawFlags.e_pairBit);
goog.exportProperty(box2d.b2DrawFlags, "e_centerOfMassBit", box2d.b2DrawFlags.e_centerOfMassBit);
goog.exportProperty(box2d.b2DrawFlags, "e_controllerBit", box2d.b2DrawFlags.e_controllerBit);
goog.exportProperty(box2d.b2DrawFlags, "e_all", box2d.b2DrawFlags.e_all);
box2d.b2Draw = function() {};
goog.exportSymbol("box2d.b2Draw", box2d.b2Draw);
box2d.b2Draw.prototype.m_drawFlags = box2d.b2DrawFlags.e_none;
goog.exportProperty(box2d.b2Draw.prototype, "m_drawFlags", box2d.b2Draw.prototype.m_drawFlags);
box2d.b2Draw.prototype.SetFlags = function(a) {
  this.m_drawFlags = a
};
goog.exportProperty(box2d.b2Draw.prototype, "SetFlags", box2d.b2Draw.prototype.SetFlags);
box2d.b2Draw.prototype.GetFlags = function() {
  return this.m_drawFlags
};
goog.exportProperty(box2d.b2Draw.prototype, "GetFlags", box2d.b2Draw.prototype.GetFlags);
box2d.b2Draw.prototype.AppendFlags = function(a) {
  this.m_drawFlags |= a
};
goog.exportProperty(box2d.b2Draw.prototype, "AppendFlags", box2d.b2Draw.prototype.AppendFlags);
box2d.b2Draw.prototype.ClearFlags = function(a) {
  this.m_drawFlags &= ~a
};
goog.exportProperty(box2d.b2Draw.prototype, "ClearFlags", box2d.b2Draw.prototype.ClearFlags);
box2d.b2Draw.prototype.PushTransform = function() {};
goog.exportProperty(box2d.b2Draw.prototype, "PushTransform", box2d.b2Draw.prototype.PushTransform);
box2d.b2Draw.prototype.PopTransform = function() {};
goog.exportProperty(box2d.b2Draw.prototype, "PopTransform", box2d.b2Draw.prototype.PopTransform);
box2d.b2Draw.prototype.DrawPolygon = function() {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawPolygon", box2d.b2Draw.prototype.DrawPolygon);
box2d.b2Draw.prototype.DrawSolidPolygon = function() {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawSolidPolygon", box2d.b2Draw.prototype.DrawSolidPolygon);
box2d.b2Draw.prototype.DrawCircle = function() {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawCircle", box2d.b2Draw.prototype.DrawCircle);
box2d.b2Draw.prototype.DrawSolidCircle = function() {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawSolidCircle", box2d.b2Draw.prototype.DrawSolidCircle);
box2d.b2Draw.prototype.DrawSegment = function() {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawSegment", box2d.b2Draw.prototype.DrawSegment);
box2d.b2Draw.prototype.DrawTransform = function() {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawTransform", box2d.b2Draw.prototype.DrawTransform);
box2d.b2Filter = function() {};
goog.exportSymbol("box2d.b2Filter", box2d.b2Filter);
box2d.b2Filter.prototype.categoryBits = 1;
goog.exportProperty(box2d.b2Filter.prototype, "categoryBits", box2d.b2Filter.prototype.categoryBits);
box2d.b2Filter.prototype.maskBits = 65535;
goog.exportProperty(box2d.b2Filter.prototype, "maskBits", box2d.b2Filter.prototype.maskBits);
box2d.b2Filter.prototype.groupIndex = 0;
goog.exportProperty(box2d.b2Filter.prototype, "groupIndex", box2d.b2Filter.prototype.groupIndex);
box2d.b2Filter.prototype.Clone = function() {
  return (new box2d.b2Filter).Copy(this)
};
goog.exportProperty(box2d.b2Filter.prototype, "Clone", box2d.b2Filter.prototype.Clone);
box2d.b2Filter.prototype.Copy = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this !== a);
  this.categoryBits = a.categoryBits;
  this.maskBits = a.maskBits;
  this.groupIndex = a.groupIndex;
  return this
};
goog.exportProperty(box2d.b2Filter.prototype, "Copy", box2d.b2Filter.prototype.Copy);

box2d.b2FixtureDef = function() {
  this.filter = new box2d.b2Filter
};
goog.exportSymbol("box2d.b2FixtureDef", box2d.b2FixtureDef);
box2d.b2FixtureDef.prototype.shape = null;
goog.exportProperty(box2d.b2FixtureDef.prototype, "shape", box2d.b2FixtureDef.prototype.shape);
box2d.b2FixtureDef.prototype.userData = null;
goog.exportProperty(box2d.b2FixtureDef.prototype, "userData", box2d.b2FixtureDef.prototype.userData);
box2d.b2FixtureDef.prototype.friction = 0.2;
goog.exportProperty(box2d.b2FixtureDef.prototype, "friction", box2d.b2FixtureDef.prototype.friction);
box2d.b2FixtureDef.prototype.restitution = 0;
goog.exportProperty(box2d.b2FixtureDef.prototype, "restitution", box2d.b2FixtureDef.prototype.restitution);
box2d.b2FixtureDef.prototype.density = 0;
goog.exportProperty(box2d.b2FixtureDef.prototype, "density", box2d.b2FixtureDef.prototype.density);
box2d.b2FixtureDef.prototype.isSensor = !1;
goog.exportProperty(box2d.b2FixtureDef.prototype, "isSensor", box2d.b2FixtureDef.prototype.isSensor);
box2d.b2FixtureDef.prototype.filter = null;
goog.exportProperty(box2d.b2FixtureDef.prototype, "filter", box2d.b2FixtureDef.prototype.filter);



box2d.b2FixtureProxy = function() {
  this.aabb = new box2d.b2AABB
};
goog.exportSymbol("box2d.b2FixtureProxy", box2d.b2FixtureProxy);
box2d.b2FixtureProxy.prototype.aabb = null;
goog.exportProperty(box2d.b2FixtureProxy.prototype, "aabb", box2d.b2FixtureProxy.prototype.aabb);
box2d.b2FixtureProxy.prototype.fixture = null;
goog.exportProperty(box2d.b2FixtureProxy.prototype, "fixture", box2d.b2FixtureProxy.prototype.fixture);
box2d.b2FixtureProxy.prototype.childIndex = 0;
goog.exportProperty(box2d.b2FixtureProxy.prototype, "childIndex", box2d.b2FixtureProxy.prototype.childIndex);
box2d.b2FixtureProxy.prototype.proxy = null;
goog.exportProperty(box2d.b2FixtureProxy.prototype, "proxy", box2d.b2FixtureProxy.prototype.proxy);
box2d.b2FixtureProxy.MakeArray = function(a) {
  return box2d.b2MakeArray(a, function() {
    return new box2d.b2FixtureProxy
  })
};
goog.exportProperty(box2d.b2FixtureProxy, "MakeArray", box2d.b2FixtureProxy.MakeArray);
box2d.b2Fixture = function() {
  this.m_proxies = [];
  this.m_proxyCount = 0;
  this.m_filter = new box2d.b2Filter
};
goog.exportSymbol("box2d.b2Fixture", box2d.b2Fixture);
box2d.b2Fixture.prototype.m_density = 0;
goog.exportProperty(box2d.b2Fixture.prototype, "m_density", box2d.b2Fixture.prototype.m_density);
box2d.b2Fixture.prototype.m_next = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_next", box2d.b2Fixture.prototype.m_next);
box2d.b2Fixture.prototype.m_body = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_body", box2d.b2Fixture.prototype.m_body);
box2d.b2Fixture.prototype.m_shape = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_shape", box2d.b2Fixture.prototype.m_shape);
box2d.b2Fixture.prototype.m_friction = 0;
goog.exportProperty(box2d.b2Fixture.prototype, "m_friction", box2d.b2Fixture.prototype.m_friction);
box2d.b2Fixture.prototype.m_restitution = 0;
goog.exportProperty(box2d.b2Fixture.prototype, "m_restitution", box2d.b2Fixture.prototype.m_restitution);
box2d.b2Fixture.prototype.m_proxies = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_proxies", box2d.b2Fixture.prototype.m_proxies);
box2d.b2Fixture.prototype.m_proxyCount = 0;
goog.exportProperty(box2d.b2Fixture.prototype, "m_proxyCount", box2d.b2Fixture.prototype.m_proxyCount);
box2d.b2Fixture.prototype.m_filter = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_filter", box2d.b2Fixture.prototype.m_filter);
box2d.b2Fixture.prototype.m_isSensor = !1;
goog.exportProperty(box2d.b2Fixture.prototype, "m_isSensor", box2d.b2Fixture.prototype.m_isSensor);
box2d.b2Fixture.prototype.m_userData = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_userData", box2d.b2Fixture.prototype.m_userData);
box2d.b2Fixture.prototype.GetType = function() {
  return this.m_shape.GetType()
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetType", box2d.b2Fixture.prototype.GetType);
box2d.b2Fixture.prototype.GetShape = function() {
  return this.m_shape
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetShape", box2d.b2Fixture.prototype.GetShape);
box2d.b2Fixture.prototype.IsSensor = function() {
  return this.m_isSensor
};
goog.exportProperty(box2d.b2Fixture.prototype, "IsSensor", box2d.b2Fixture.prototype.IsSensor);
box2d.b2Fixture.prototype.GetFilterData = function() {
  return this.m_filter
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetFilterData", box2d.b2Fixture.prototype.GetFilterData);
box2d.b2Fixture.prototype.GetUserData = function() {
  return this.m_userData
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetUserData", box2d.b2Fixture.prototype.GetUserData);
box2d.b2Fixture.prototype.SetUserData = function(a) {
  this.m_userData = a
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetUserData", box2d.b2Fixture.prototype.SetUserData);
box2d.b2Fixture.prototype.GetBody = function() {
  return this.m_body
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetBody", box2d.b2Fixture.prototype.GetBody);
box2d.b2Fixture.prototype.GetNext = function() {
  return this.m_next
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetNext", box2d.b2Fixture.prototype.GetNext);
box2d.b2Fixture.prototype.SetDensity = function(a) {
  this.m_density = a
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetDensity", box2d.b2Fixture.prototype.SetDensity);
box2d.b2Fixture.prototype.GetDensity = function() {
  return this.m_density
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetDensity", box2d.b2Fixture.prototype.GetDensity);
box2d.b2Fixture.prototype.GetFriction = function() {
  return this.m_friction
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetFriction", box2d.b2Fixture.prototype.GetFriction);
box2d.b2Fixture.prototype.SetFriction = function(a) {
  this.m_friction = a
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetFriction", box2d.b2Fixture.prototype.SetFriction);
box2d.b2Fixture.prototype.GetRestitution = function() {
  return this.m_restitution
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetRestitution", box2d.b2Fixture.prototype.GetRestitution);
box2d.b2Fixture.prototype.SetRestitution = function(a) {
  this.m_restitution = a
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetRestitution", box2d.b2Fixture.prototype.SetRestitution);
box2d.b2Fixture.prototype.TestPoint = function(a) {
  return this.m_shape.TestPoint(this.m_body.GetTransform(), a)
};
goog.exportProperty(box2d.b2Fixture.prototype, "TestPoint", box2d.b2Fixture.prototype.TestPoint);
box2d.b2Fixture.prototype.RayCast = function(a, b, c) {
  return this.m_shape.RayCast(a, b, this.m_body.GetTransform(), c)
};
goog.exportProperty(box2d.b2Fixture.prototype, "RayCast", box2d.b2Fixture.prototype.RayCast);
box2d.b2Fixture.prototype.GetMassData = function(a) {
  a = a || new box2d.b2MassData;
  this.m_shape.ComputeMass(a, this.m_density);
  return a
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetMassData", box2d.b2Fixture.prototype.GetMassData);
box2d.b2Fixture.prototype.GetAABB = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a && a < this.m_proxyCount);
  return this.m_proxies[a].aabb
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetAABB", box2d.b2Fixture.prototype.GetAABB);
box2d.b2Fixture.prototype.Create = function(a, b) {
  this.m_userData = b.userData;
  this.m_friction = b.friction;
  this.m_restitution = b.restitution;
  this.m_body = a;
  this.m_next = null;
  this.m_filter.Copy(b.filter);
  this.m_isSensor = b.isSensor;
  this.m_shape = b.shape.Clone();
  this.m_proxies = box2d.b2FixtureProxy.MakeArray(this.m_shape.GetChildCount());
  this.m_proxyCount = 0;
  this.m_density = b.density
};
goog.exportProperty(box2d.b2Fixture.prototype, "Create", box2d.b2Fixture.prototype.Create);
box2d.b2Fixture.prototype.Destroy = function() {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 == this.m_proxyCount);
  this.m_shape = null
};
goog.exportProperty(box2d.b2Fixture.prototype, "Destroy", box2d.b2Fixture.prototype.Destroy);
box2d.b2Fixture.prototype.CreateProxies = function(a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 == this.m_proxyCount);
  this.m_proxyCount = this.m_shape.GetChildCount();
  for (var c = 0; c < this.m_proxyCount; ++c) {
    var e = this.m_proxies[c];
    this.m_shape.ComputeAABB(e.aabb, b, c);
    e.proxy = a.CreateProxy(e.aabb, e);
    e.fixture = this;
    e.childIndex = c
  }
};
goog.exportProperty(box2d.b2Fixture.prototype, "CreateProxies", box2d.b2Fixture.prototype.CreateProxies);
box2d.b2Fixture.prototype.DestroyProxies = function(a) {
  for (var b = 0; b < this.m_proxyCount; ++b) {
    var c = this.m_proxies[b];
    a.DestroyProxy(c.proxy);
    c.proxy = null
  }
  this.m_proxyCount = 0
};
goog.exportProperty(box2d.b2Fixture.prototype, "DestroyProxies", box2d.b2Fixture.prototype.DestroyProxies);
box2d.b2Fixture.prototype.Synchronize = function(a, b, c) {
  if (0 != this.m_proxyCount)
    for (var e = 0; e < this.m_proxyCount; ++e) {
      var d = this.m_proxies[e],
        f = box2d.b2Fixture.prototype.Synchronize.s_aabb1,
        g = box2d.b2Fixture.prototype.Synchronize.s_aabb2;
      this.m_shape.ComputeAABB(f, b, e);
      this.m_shape.ComputeAABB(g, c, e);
      d.aabb.Combine2(f, g);
      f = box2d.b2SubVV(c.p, b.p, box2d.b2Fixture.prototype.Synchronize.s_displacement);
      a.MoveProxy(d.proxy, d.aabb, f)
    }
};
goog.exportProperty(box2d.b2Fixture.prototype, "Synchronize", box2d.b2Fixture.prototype.Synchronize);
box2d.b2Fixture.prototype.Synchronize.s_aabb1 = new box2d.b2AABB;
box2d.b2Fixture.prototype.Synchronize.s_aabb2 = new box2d.b2AABB;
box2d.b2Fixture.prototype.Synchronize.s_displacement = new box2d.b2Vec2;
box2d.b2Fixture.prototype.SetFilterData = function(a) {
  this.m_filter.Copy(a);
  this.Refilter()
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetFilterData", box2d.b2Fixture.prototype.SetFilterData);
box2d.b2Fixture.prototype.Refilter = function() {
  if (!this.m_body) {
    for (var a = this.m_body.GetContactList(); a;) {
      var b = a.contact,
        c = b.GetFixtureA(),
        e = b.GetFixtureB();
      (c == this || e == this) && b.FlagForFiltering();
      a = a.next
    }
    a = this.m_body.GetWorld();
    if (null !== a) {
      a = a.m_contactManager.m_broadPhase;
      for (b = 0; b < this.m_proxyCount; ++b) a.TouchProxy(this.m_proxies[b].proxy)
    }
  }
};
goog.exportProperty(box2d.b2Fixture.prototype, "Refilter", box2d.b2Fixture.prototype.Refilter);
box2d.b2Fixture.prototype.SetSensor = function(a) {
  a != this.m_isSensor && (this.m_body.SetAwake(!0), this.m_isSensor = a)
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetSensor", box2d.b2Fixture.prototype.SetSensor);
box2d.b2Fixture.prototype.Dump = function(a) {
  if (box2d.DEBUG) {
    box2d.b2Log("    /*box2d.b2FixtureDef*/ var fd = new box2d.b2FixtureDef();\n");
    box2d.b2Log("    fd.friction = %.15f;\n", this.m_friction);
    box2d.b2Log("    fd.restitution = %.15f;\n", this.m_restitution);
    box2d.b2Log("    fd.density = %.15f;\n", this.m_density);
    box2d.b2Log("    fd.isSensor = %s;\n", this.m_isSensor ? "true" : "false");
    box2d.b2Log("    fd.filter.categoryBits = %d;\n", this.m_filter.categoryBits);
    box2d.b2Log("    fd.filter.maskBits = %d;\n",
      this.m_filter.maskBits);
    box2d.b2Log("    fd.filter.groupIndex = %d;\n", this.m_filter.groupIndex);
    switch (this.m_shape.m_type) {
      case box2d.b2ShapeType.e_circleShape:
        var b = this.m_shape;
        box2d.b2Log("    /*box2d.b2CircleShape*/ var shape = new box2d.b2CircleShape();\n");
        box2d.b2Log("    shape.m_radius = %.15f;\n", b.m_radius);
        box2d.b2Log("    shape.m_p.SetXY(%.15f, %.15f);\n", b.m_p.x, b.m_p.y);
        break;
      case box2d.b2ShapeType.e_edgeShape:
        b = this.m_shape;
        box2d.b2Log("    /*box2d.b2EdgeShape*/ var shape = new box2d.b2EdgeShape();\n");
        box2d.b2Log("    shape.m_radius = %.15f;\n", b.m_radius);
        box2d.b2Log("    shape.m_vertex0.SetXY(%.15f, %.15f);\n", b.m_vertex0.x, b.m_vertex0.y);
        box2d.b2Log("    shape.m_vertex1.SetXY(%.15f, %.15f);\n", b.m_vertex1.x, b.m_vertex1.y);
        box2d.b2Log("    shape.m_vertex2.SetXY(%.15f, %.15f);\n", b.m_vertex2.x, b.m_vertex2.y);
        box2d.b2Log("    shape.m_vertex3.SetXY(%.15f, %.15f);\n", b.m_vertex3.x, b.m_vertex3.y);
        box2d.b2Log("    shape.m_hasVertex0 = %s;\n", b.m_hasVertex0);
        box2d.b2Log("    shape.m_hasVertex3 = %s;\n",
          b.m_hasVertex3);
        break;
      case box2d.b2ShapeType.e_polygonShape:
        b = this.m_shape;
        box2d.b2Log("    /*box2d.b2PolygonShape*/ var shape = new box2d.b2PolygonShape();\n");
        box2d.b2Log("    /*box2d.b2Vec2[]*/ var vs = box2d.b2Vec2.MakeArray(%d);\n", box2d.b2_maxPolygonVertices);
        for (var c = 0; c < b.m_count; ++c) box2d.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", c, b.m_vertices[c].x, b.m_vertices[c].y);
        box2d.b2Log("    shape.SetAsVector(vs, %d);\n", b.m_count);
        break;
      case box2d.b2ShapeType.e_chainShape:
        b = this.m_shape;
        box2d.b2Log("    /*box2d.b2ChainShape*/ var shape = new box2d.b2ChainShape();\n");
        box2d.b2Log("    /*box2d.b2Vec2[]*/ var vs = box2d.b2Vec2.MakeArray(%d);\n", box2d.b2_maxPolygonVertices);
        for (c = 0; c < b.m_count; ++c) box2d.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", c, b.m_vertices[c].x, b.m_vertices[c].y);
        box2d.b2Log("    shape.CreateChain(vs, %d);\n", b.m_count);
        box2d.b2Log("    shape.m_prevVertex.SetXY(%.15f, %.15f);\n", b.m_prevVertex.x, b.m_prevVertex.y);
        box2d.b2Log("    shape.m_nextVertex.SetXY(%.15f, %.15f);\n", b.m_nextVertex.x, b.m_nextVertex.y);
        box2d.b2Log("    shape.m_hasPrevVertex = %s;\n",
          b.m_hasPrevVertex ? "true" : "false");
        box2d.b2Log("    shape.m_hasNextVertex = %s;\n", b.m_hasNextVertex ? "true" : "false");
        break;
      default:
        return
    }
    box2d.b2Log("\n");
    box2d.b2Log("    fd.shape = shape;\n");
    box2d.b2Log("\n");
    box2d.b2Log("    bodies[%d].CreateFixture(fd);\n", a)
  }
};
goog.exportProperty(box2d.b2Fixture.prototype, "Dump", box2d.b2Fixture.prototype.Dump);
box2d.b2BodyType = {
  b2_unknown: -1,
  b2_staticBody: 0,
  b2_kinematicBody: 1,
  b2_dynamicBody: 2,
  b2_bulletBody: 3
};
goog.exportSymbol("box2d.b2BodyType", box2d.b2BodyType);
goog.exportProperty(box2d.b2BodyType, "b2_unknown", box2d.b2BodyType.b2_unknown);
goog.exportProperty(box2d.b2BodyType, "b2_staticBody", box2d.b2BodyType.b2_staticBody);
goog.exportProperty(box2d.b2BodyType, "b2_kinematicBody", box2d.b2BodyType.b2_kinematicBody);
goog.exportProperty(box2d.b2BodyType, "b2_dynamicBody", box2d.b2BodyType.b2_dynamicBody);
goog.exportProperty(box2d.b2BodyType, "b2_bulletBody", box2d.b2BodyType.b2_bulletBody);
box2d.b2BodyDef = function() {
  this.position = new box2d.b2Vec2(0, 0);
  this.linearVelocity = new box2d.b2Vec2(0, 0)
};
goog.exportSymbol("box2d.b2BodyDef", box2d.b2BodyDef);
box2d.b2BodyDef.prototype.type = box2d.b2BodyType.b2_staticBody;
goog.exportProperty(box2d.b2BodyDef.prototype, "type", box2d.b2BodyDef.prototype.type);
box2d.b2BodyDef.prototype.position = null;
goog.exportProperty(box2d.b2BodyDef.prototype, "position", box2d.b2BodyDef.prototype.position);
box2d.b2BodyDef.prototype.angle = 0;
goog.exportProperty(box2d.b2BodyDef.prototype, "angle", box2d.b2BodyDef.prototype.angle);
box2d.b2BodyDef.prototype.linearVelocity = null;
goog.exportProperty(box2d.b2BodyDef.prototype, "linearVelocity", box2d.b2BodyDef.prototype.linearVelocity);
box2d.b2BodyDef.prototype.angularVelocity = 0;
goog.exportProperty(box2d.b2BodyDef.prototype, "angularVelocity", box2d.b2BodyDef.prototype.angularVelocity);
box2d.b2BodyDef.prototype.linearDamping = 0;
goog.exportProperty(box2d.b2BodyDef.prototype, "linearDamping", box2d.b2BodyDef.prototype.linearDamping);
box2d.b2BodyDef.prototype.angularDamping = 0;
goog.exportProperty(box2d.b2BodyDef.prototype, "angularDamping", box2d.b2BodyDef.prototype.angularDamping);
box2d.b2BodyDef.prototype.allowSleep = !0;
goog.exportProperty(box2d.b2BodyDef.prototype, "allowSleep", box2d.b2BodyDef.prototype.allowSleep);
box2d.b2BodyDef.prototype.awake = !0;
goog.exportProperty(box2d.b2BodyDef.prototype, "awake", box2d.b2BodyDef.prototype.awake);
box2d.b2BodyDef.prototype.fixedRotation = !1;
goog.exportProperty(box2d.b2BodyDef.prototype, "fixedRotation", box2d.b2BodyDef.prototype.fixedRotation);
box2d.b2BodyDef.prototype.bullet = !1;
goog.exportProperty(box2d.b2BodyDef.prototype, "bullet", box2d.b2BodyDef.prototype.bullet);
box2d.b2BodyDef.prototype.active = !0;
goog.exportProperty(box2d.b2BodyDef.prototype, "active", box2d.b2BodyDef.prototype.active);
box2d.b2BodyDef.prototype.userData = null;
goog.exportProperty(box2d.b2BodyDef.prototype, "userData", box2d.b2BodyDef.prototype.userData);
box2d.b2BodyDef.prototype.gravityScale = 1;
goog.exportProperty(box2d.b2BodyDef.prototype, "gravityScale", box2d.b2BodyDef.prototype.gravityScale);
box2d.b2BodyFlag = {
  e_none: 0,
  e_islandFlag: 1,
  e_awakeFlag: 2,
  e_autoSleepFlag: 4,
  e_bulletFlag: 8,
  e_fixedRotationFlag: 16,
  e_activeFlag: 32,
  e_toiFlag: 64
};
goog.exportProperty(box2d.b2BodyFlag, "e_none", box2d.b2BodyFlag.e_none);
goog.exportProperty(box2d.b2BodyFlag, "e_islandFlag", box2d.b2BodyFlag.e_islandFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_awakeFlag", box2d.b2BodyFlag.e_awakeFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_autoSleepFlag", box2d.b2BodyFlag.e_autoSleepFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_bulletFlag", box2d.b2BodyFlag.e_bulletFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_fixedRotationFlag", box2d.b2BodyFlag.e_fixedRotationFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_activeFlag", box2d.b2BodyFlag.e_activeFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_toiFlag", box2d.b2BodyFlag.e_toiFlag);
box2d.b2Body = function(a, b) {
  this.m_xf = new box2d.b2Transform;
  this.m_sweep = new box2d.b2Sweep;
  this.m_linearVelocity = new box2d.b2Vec2;
  this.m_force = new box2d.b2Vec2;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.position.IsValid());
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.linearVelocity.IsValid());
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.angle));
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.angularVelocity));
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.gravityScale) && 0 <= a.gravityScale);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.angularDamping) && 0 <= a.angularDamping);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.linearDamping) && 0 <= a.linearDamping);
  this.m_flags = box2d.b2BodyFlag.e_none;
  a.bullet && (this.m_flags |= box2d.b2BodyFlag.e_bulletFlag);
  a.fixedRotation && (this.m_flags |= box2d.b2BodyFlag.e_fixedRotationFlag);
  a.allowSleep && (this.m_flags |= box2d.b2BodyFlag.e_autoSleepFlag);
  a.awake && (this.m_flags |= box2d.b2BodyFlag.e_awakeFlag);
  a.active && (this.m_flags |= box2d.b2BodyFlag.e_activeFlag);
  this.m_world = b;
  this.m_xf.p.Copy(a.position);
  this.m_xf.q.SetAngleRadians(a.angle);
  this.m_sweep.localCenter.SetZero();
  this.m_sweep.c0.Copy(this.m_xf.p);
  this.m_sweep.c.Copy(this.m_xf.p);
  this.m_sweep.a0 = a.angle;
  this.m_sweep.a = a.angle;
  this.m_sweep.alpha0 = 0;
  this.m_linearVelocity.Copy(a.linearVelocity);
  this.m_angularVelocity = a.angularVelocity;
  this.m_linearDamping = a.linearDamping;
  this.m_angularDamping = a.angularDamping;
  this.m_gravityScale = a.gravityScale;
  this.m_force.SetZero();
  this.m_sleepTime = this.m_torque =
    0;
  this.m_type = a.type;
  this.m_invMass = a.type == box2d.b2BodyType.b2_dynamicBody ? this.m_mass = 1 : this.m_mass = 0;
  this.m_invI = this.m_I = 0;
  this.m_userData = a.userData;
  this.m_fixtureList = null;
  this.m_fixtureCount = 0;
  this.m_controllerList = null;
  this.m_controllerCount = 0
};
goog.exportSymbol("box2d.b2Body", box2d.b2Body);
box2d.b2Body.prototype.m_flags = box2d.b2BodyFlag.e_none;
goog.exportProperty(box2d.b2Body.prototype, "m_flags", box2d.b2Body.prototype.m_flags);
box2d.b2Body.prototype.m_world = null;
goog.exportProperty(box2d.b2Body.prototype, "m_world", box2d.b2Body.prototype.m_world);
box2d.b2Body.prototype.m_xf = null;
goog.exportProperty(box2d.b2Body.prototype, "m_xf", box2d.b2Body.prototype.m_xf);
box2d.b2Body.prototype.m_sweep = null;
goog.exportProperty(box2d.b2Body.prototype, "m_sweep", box2d.b2Body.prototype.m_sweep);
box2d.b2Body.prototype.m_jointList = null;
goog.exportProperty(box2d.b2Body.prototype, "m_jointList", box2d.b2Body.prototype.m_jointList);
box2d.b2Body.prototype.m_contactList = null;
goog.exportProperty(box2d.b2Body.prototype, "m_contactList", box2d.b2Body.prototype.m_contactList);
box2d.b2Body.prototype.m_prev = null;
goog.exportProperty(box2d.b2Body.prototype, "m_prev", box2d.b2Body.prototype.m_prev);
box2d.b2Body.prototype.m_next = null;
goog.exportProperty(box2d.b2Body.prototype, "m_next", box2d.b2Body.prototype.m_next);
box2d.b2Body.prototype.m_linearVelocity = null;
goog.exportProperty(box2d.b2Body.prototype, "m_linearVelocity", box2d.b2Body.prototype.m_linearVelocity);
box2d.b2Body.prototype.m_angularVelocity = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_angularVelocity", box2d.b2Body.prototype.m_angularVelocity);
box2d.b2Body.prototype.m_linearDamping = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_linearDamping", box2d.b2Body.prototype.m_linearDamping);
box2d.b2Body.prototype.m_angularDamping = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_angularDamping", box2d.b2Body.prototype.m_angularDamping);
box2d.b2Body.prototype.m_gravityScale = 1;
goog.exportProperty(box2d.b2Body.prototype, "m_gravityScale", box2d.b2Body.prototype.m_gravityScale);
box2d.b2Body.prototype.m_force = null;
goog.exportProperty(box2d.b2Body.prototype, "m_force", box2d.b2Body.prototype.m_force);
box2d.b2Body.prototype.m_torque = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_torque", box2d.b2Body.prototype.m_torque);
box2d.b2Body.prototype.m_sleepTime = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_sleepTime", box2d.b2Body.prototype.m_sleepTime);
box2d.b2Body.prototype.m_type = box2d.b2BodyType.b2_staticBody;
goog.exportProperty(box2d.b2Body.prototype, "m_type", box2d.b2Body.prototype.m_type);
box2d.b2Body.prototype.m_mass = 1;
goog.exportProperty(box2d.b2Body.prototype, "m_mass", box2d.b2Body.prototype.m_mass);
box2d.b2Body.prototype.m_invMass = 1;
goog.exportProperty(box2d.b2Body.prototype, "m_invMass", box2d.b2Body.prototype.m_invMass);
box2d.b2Body.prototype.m_I = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_I", box2d.b2Body.prototype.m_I);
box2d.b2Body.prototype.m_invI = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_invI", box2d.b2Body.prototype.m_invI);
box2d.b2Body.prototype.m_userData = null;
goog.exportProperty(box2d.b2Body.prototype, "m_userData", box2d.b2Body.prototype.m_userData);
box2d.b2Body.prototype.m_fixtureList = null;
goog.exportProperty(box2d.b2Body.prototype, "m_fixtureList", box2d.b2Body.prototype.m_fixtureList);
box2d.b2Body.prototype.m_fixtureCount = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_fixtureCount", box2d.b2Body.prototype.m_fixtureCount);
box2d.b2Body.prototype.m_controllerList = null;
goog.exportProperty(box2d.b2Body.prototype, "m_controllerList", box2d.b2Body.prototype.m_controllerList);
box2d.b2Body.prototype.m_controllerCount = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_controllerCount", box2d.b2Body.prototype.m_controllerCount);
box2d.b2Body.prototype.CreateFixture = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.m_world.IsLocked());
  if (!0 == this.m_world.IsLocked()) return null;
  var b = new box2d.b2Fixture;
  b.Create(this, a);
  this.m_flags & box2d.b2BodyFlag.e_activeFlag && b.CreateProxies(this.m_world.m_contactManager.m_broadPhase, this.m_xf);
  b.m_next = this.m_fixtureList;
  this.m_fixtureList = b;
  ++this.m_fixtureCount;
  b.m_body = this;
  0 < b.m_density && this.ResetMassData();
  this.m_world.m_flags |= box2d.b2WorldFlag.e_newFixture;
  return b
};
goog.exportProperty(box2d.b2Body.prototype, "CreateFixture", box2d.b2Body.prototype.CreateFixture);
box2d.b2Body.prototype.CreateFixture2 = function(a, b) {
  void 0 === b && (b = 0);
  var c = box2d.b2Body.prototype.CreateFixture2.s_def;
  c.shape = a;
  c.density = b;
  return this.CreateFixture(c)
};
goog.exportProperty(box2d.b2Body.prototype, "CreateFixture2", box2d.b2Body.prototype.CreateFixture2);
box2d.b2Body.prototype.CreateFixture2.s_def = new box2d.b2FixtureDef;
box2d.b2Body.prototype.DestroyFixture = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.m_world.IsLocked());
  if (!0 != this.m_world.IsLocked()) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.m_body == this);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_fixtureCount);
    for (var b = this.m_fixtureList, c = null, e = !1; null != b;) {
      if (b == a) {
        c ? c.m_next = a.m_next : this.m_fixtureList = a.m_next;
        e = !0;
        break
      }
      c = b;
      b = b.m_next
    }
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e);
    for (b = this.m_contactList; b;) {
      var c = b.contact,
        b = b.next,
        e = c.GetFixtureA(),
        d = c.GetFixtureB();
      (a == e || a == d) && this.m_world.m_contactManager.Destroy(c)
    }
    this.m_flags & box2d.b2BodyFlag.e_activeFlag && a.DestroyProxies(this.m_world.m_contactManager.m_broadPhase);
    a.Destroy();
    a.m_body = null;
    a.m_next = null;
    --this.m_fixtureCount;
    this.ResetMassData()
  }
};
goog.exportProperty(box2d.b2Body.prototype, "DestroyFixture", box2d.b2Body.prototype.DestroyFixture);
box2d.b2Body.prototype.SetTransformVecRadians = function(a, b) {
  this.SetTransformXYRadians(a.x, a.y, b)
};
goog.exportProperty(box2d.b2Body.prototype, "SetTransformVecRadians", box2d.b2Body.prototype.SetTransformVecRadians);
box2d.b2Body.prototype.SetTransformXYRadians = function(a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.m_world.IsLocked());
  if (!0 != this.m_world.IsLocked()) {
    this.m_xf.q.SetAngleRadians(c);
    this.m_xf.p.SetXY(a, b);
    box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
    this.m_sweep.a = c;
    this.m_sweep.c0.Copy(this.m_sweep.c);
    this.m_sweep.a0 = c;
    a = this.m_world.m_contactManager.m_broadPhase;
    for (b = this.m_fixtureList; b; b = b.m_next) b.Synchronize(a, this.m_xf, this.m_xf);
    this.m_world.m_contactManager.FindNewContacts()
  }
};
goog.exportProperty(box2d.b2Body.prototype, "SetTransformXYRadians", box2d.b2Body.prototype.SetTransformXYRadians);
box2d.b2Body.prototype.SetTransform = function(a) {
  this.SetTransformVecRadians(a.p, a.GetAngleRadians())
};
goog.exportProperty(box2d.b2Body.prototype, "SetTransform", box2d.b2Body.prototype.SetTransform);
box2d.b2Body.prototype.GetTransform = function() {
  return this.m_xf
};
goog.exportProperty(box2d.b2Body.prototype, "GetTransform", box2d.b2Body.prototype.GetTransform);
box2d.b2Body.prototype.GetPosition = function() {
  return this.m_xf.p
};
goog.exportProperty(box2d.b2Body.prototype, "GetPosition", box2d.b2Body.prototype.GetPosition);
box2d.b2Body.prototype.SetPosition = function(a) {
  this.SetTransformVecRadians(a, this.GetAngleRadians())
};
goog.exportProperty(box2d.b2Body.prototype, "SetPosition", box2d.b2Body.prototype.SetPosition);
box2d.b2Body.prototype.SetPositionXY = function(a, b) {
  this.SetTransformXYRadians(a, b, this.GetAngleRadians())
};
goog.exportProperty(box2d.b2Body.prototype, "SetPositionXY", box2d.b2Body.prototype.SetPositionXY);
box2d.b2Body.prototype.GetAngleRadians = function() {
  return this.m_sweep.a
};
goog.exportProperty(box2d.b2Body.prototype, "GetAngleRadians", box2d.b2Body.prototype.GetAngleRadians);
box2d.b2Body.prototype.SetAngleRadians = function(a) {
  this.SetTransformVecRadians(this.GetPosition(), a)
};
goog.exportProperty(box2d.b2Body.prototype, "SetAngleRadians", box2d.b2Body.prototype.SetAngleRadians);
box2d.b2Body.prototype.GetWorldCenter = function() {
  return this.m_sweep.c
};
goog.exportProperty(box2d.b2Body.prototype, "GetWorldCenter", box2d.b2Body.prototype.GetWorldCenter);
box2d.b2Body.prototype.GetLocalCenter = function() {
  return this.m_sweep.localCenter
};
goog.exportProperty(box2d.b2Body.prototype, "GetLocalCenter", box2d.b2Body.prototype.GetLocalCenter);
box2d.b2Body.prototype.SetLinearVelocity = function(a) {
  this.m_type != box2d.b2BodyType.b2_staticBody && (0 < box2d.b2DotVV(a, a) && this.SetAwake(!0), this.m_linearVelocity.Copy(a))
};
goog.exportProperty(box2d.b2Body.prototype, "SetLinearVelocity", box2d.b2Body.prototype.SetLinearVelocity);
box2d.b2Body.prototype.GetLinearVelocity = function() {
  return this.m_linearVelocity
};
goog.exportProperty(box2d.b2Body.prototype, "GetLinearVelocity", box2d.b2Body.prototype.GetLinearVelocity);
box2d.b2Body.prototype.SetAngularVelocity = function(a) {
  this.m_type != box2d.b2BodyType.b2_staticBody && (0 < a * a && this.SetAwake(!0), this.m_angularVelocity = a)
};
goog.exportProperty(box2d.b2Body.prototype, "SetAngularVelocity", box2d.b2Body.prototype.SetAngularVelocity);
box2d.b2Body.prototype.GetAngularVelocity = function() {
  return this.m_angularVelocity
};
goog.exportProperty(box2d.b2Body.prototype, "GetAngularVelocity", box2d.b2Body.prototype.GetAngularVelocity);
box2d.b2Body.prototype.GetDefinition = function(a) {
  a.type = this.GetType();
  a.allowSleep = (this.m_flags & box2d.b2BodyFlag.e_autoSleepFlag) == box2d.b2BodyFlag.e_autoSleepFlag;
  a.angle = this.GetAngleRadians();
  a.angularDamping = this.m_angularDamping;
  a.gravityScale = this.m_gravityScale;
  a.angularVelocity = this.m_angularVelocity;
  a.fixedRotation = (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) == box2d.b2BodyFlag.e_fixedRotationFlag;
  a.bullet = (this.m_flags & box2d.b2BodyFlag.e_bulletFlag) == box2d.b2BodyFlag.e_bulletFlag;
  a.awake = (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) == box2d.b2BodyFlag.e_awakeFlag;
  a.linearDamping = this.m_linearDamping;
  a.linearVelocity.Copy(this.GetLinearVelocity());
  a.position.Copy(this.GetPosition());
  a.userData = this.GetUserData();
  return a
};
goog.exportProperty(box2d.b2Body.prototype, "GetDefinition", box2d.b2Body.prototype.GetDefinition);
box2d.b2Body.prototype.ApplyForce = function(a, b, c) {
  this.m_type == box2d.b2BodyType.b2_dynamicBody && (0 == (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_force.x += a.x, this.m_force.y += a.y, this.m_torque += (b.x - this.m_sweep.c.x) * a.y - (b.y - this.m_sweep.c.y) * a.x))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyForce", box2d.b2Body.prototype.ApplyForce);
box2d.b2Body.prototype.ApplyForceToCenter = function(a, b) {
  this.m_type == box2d.b2BodyType.b2_dynamicBody && (0 == (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_force.x += a.x, this.m_force.y += a.y))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyForceToCenter", box2d.b2Body.prototype.ApplyForceToCenter);
box2d.b2Body.prototype.ApplyTorque = function(a, b) {
  this.m_type == box2d.b2BodyType.b2_dynamicBody && (0 == (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_torque += a))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyTorque", box2d.b2Body.prototype.ApplyTorque);
box2d.b2Body.prototype.ApplyLinearImpulse = function(a, b, c) {
  this.m_type == box2d.b2BodyType.b2_dynamicBody && (0 == (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_linearVelocity.x += this.m_invMass * a.x, this.m_linearVelocity.y += this.m_invMass * a.y, this.m_angularVelocity += this.m_invI * ((b.x - this.m_sweep.c.x) * a.y - (b.y - this.m_sweep.c.y) * a.x)))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyLinearImpulse", box2d.b2Body.prototype.ApplyLinearImpulse);
box2d.b2Body.prototype.ApplyAngularImpulse = function(a, b) {
  this.m_type == box2d.b2BodyType.b2_dynamicBody && (0 == (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_angularVelocity += this.m_invI * a))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyAngularImpulse", box2d.b2Body.prototype.ApplyAngularImpulse);
box2d.b2Body.prototype.GetMass = function() {
  return this.m_mass
};
goog.exportProperty(box2d.b2Body.prototype, "GetMass", box2d.b2Body.prototype.GetMass);
box2d.b2Body.prototype.GetInertia = function() {
  return this.m_I + this.m_mass * box2d.b2DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter)
};
goog.exportProperty(box2d.b2Body.prototype, "GetInertia", box2d.b2Body.prototype.GetInertia);
box2d.b2Body.prototype.GetMassData = function(a) {
  a.mass = this.m_mass;
  a.I = this.m_I + this.m_mass * box2d.b2DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
  a.center.Copy(this.m_sweep.localCenter);
  return a
};
goog.exportProperty(box2d.b2Body.prototype, "GetMassData", box2d.b2Body.prototype.GetMassData);
box2d.b2Body.prototype.SetMassData = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.m_world.IsLocked());
  if (!0 != this.m_world.IsLocked() && this.m_type == box2d.b2BodyType.b2_dynamicBody) {
    this.m_invI = this.m_I = this.m_invMass = 0;
    this.m_mass = a.mass;
    0 >= this.m_mass && (this.m_mass = 1);
    this.m_invMass = 1 / this.m_mass;
    0 < a.I && 0 == (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) && (this.m_I = a.I - this.m_mass * box2d.b2DotVV(a.center, a.center), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_I), this.m_invI = 1 / this.m_I);
    var b = box2d.b2Body.prototype.SetMassData.s_oldCenter.Copy(this.m_sweep.c);
    this.m_sweep.localCenter.Copy(a.center);
    box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
    this.m_sweep.c0.Copy(this.m_sweep.c);
    box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(this.m_sweep.c, b, box2d.b2Vec2.s_t0), this.m_linearVelocity)
  }
};
goog.exportProperty(box2d.b2Body.prototype, "SetMassData", box2d.b2Body.prototype.SetMassData);
box2d.b2Body.prototype.SetMassData.s_oldCenter = new box2d.b2Vec2;
box2d.b2Body.prototype.ResetMassData = function() {
  this.m_invI = this.m_I = this.m_invMass = this.m_mass = 0;
  this.m_sweep.localCenter.SetZero();
  if (this.m_type == box2d.b2BodyType.b2_staticBody || this.m_type == box2d.b2BodyType.b2_kinematicBody) this.m_sweep.c0.Copy(this.m_xf.p), this.m_sweep.c.Copy(this.m_xf.p), this.m_sweep.a0 = this.m_sweep.a;
  else {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_type == box2d.b2BodyType.b2_dynamicBody);
    for (var a = box2d.b2Body.prototype.ResetMassData.s_localCenter.SetZero(), b = this.m_fixtureList; b; b =
      b.m_next)
      if (0 != b.m_density) {
        var c = b.GetMassData(box2d.b2Body.prototype.ResetMassData.s_massData);
        this.m_mass += c.mass;
        a.x += c.center.x * c.mass;
        a.y += c.center.y * c.mass;
        this.m_I += c.I
      }
    0 < this.m_mass ? (this.m_invMass = 1 / this.m_mass, a.x *= this.m_invMass, a.y *= this.m_invMass) : this.m_invMass = this.m_mass = 1;
    0 < this.m_I && 0 == (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) ? (this.m_I -= this.m_mass * box2d.b2DotVV(a, a), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_I), this.m_invI = 1 / this.m_I) : this.m_invI = this.m_I = 0;
    b = box2d.b2Body.prototype.ResetMassData.s_oldCenter.Copy(this.m_sweep.c);
    this.m_sweep.localCenter.Copy(a);
    box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
    this.m_sweep.c0.Copy(this.m_sweep.c);
    box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(this.m_sweep.c, b, box2d.b2Vec2.s_t0), this.m_linearVelocity)
  }
};
goog.exportProperty(box2d.b2Body.prototype, "ResetMassData", box2d.b2Body.prototype.ResetMassData);
box2d.b2Body.prototype.ResetMassData.s_localCenter = new box2d.b2Vec2;
box2d.b2Body.prototype.ResetMassData.s_oldCenter = new box2d.b2Vec2;
box2d.b2Body.prototype.ResetMassData.s_massData = new box2d.b2MassData;
box2d.b2Body.prototype.GetWorldPoint = function(a, b) {
  return box2d.b2MulXV(this.m_xf, a, b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetWorldPoint", box2d.b2Body.prototype.GetWorldPoint);
box2d.b2Body.prototype.GetWorldVector = function(a, b) {
  return box2d.b2MulRV(this.m_xf.q, a, b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetWorldVector", box2d.b2Body.prototype.GetWorldVector);
box2d.b2Body.prototype.GetLocalPoint = function(a, b) {
  return box2d.b2MulTXV(this.m_xf, a, b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLocalPoint", box2d.b2Body.prototype.GetLocalPoint);
box2d.b2Body.prototype.GetLocalVector = function(a, b) {
  return box2d.b2MulTRV(this.m_xf.q, a, b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLocalVector", box2d.b2Body.prototype.GetLocalVector);
box2d.b2Body.prototype.GetLinearVelocityFromWorldPoint = function(a, b) {
  return box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(a, this.m_sweep.c, box2d.b2Vec2.s_t0), b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLinearVelocityFromWorldPoint", box2d.b2Body.prototype.GetLinearVelocityFromWorldPoint);
box2d.b2Body.prototype.GetLinearVelocityFromLocalPoint = function(a, b) {
  return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(a, b), b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLinearVelocityFromLocalPoint", box2d.b2Body.prototype.GetLinearVelocityFromLocalPoint);
box2d.b2Body.prototype.GetLinearDamping = function() {
  return this.m_linearDamping
};
goog.exportProperty(box2d.b2Body.prototype, "GetLinearDamping", box2d.b2Body.prototype.GetLinearDamping);
box2d.b2Body.prototype.SetLinearDamping = function(a) {
  this.m_linearDamping = a
};
goog.exportProperty(box2d.b2Body.prototype, "SetLinearDamping", box2d.b2Body.prototype.SetLinearDamping);
box2d.b2Body.prototype.GetAngularDamping = function() {
  return this.m_angularDamping
};
goog.exportProperty(box2d.b2Body.prototype, "GetAngularDamping", box2d.b2Body.prototype.GetAngularDamping);
box2d.b2Body.prototype.SetAngularDamping = function(a) {
  this.m_angularDamping = a
};
goog.exportProperty(box2d.b2Body.prototype, "SetAngularDamping", box2d.b2Body.prototype.SetAngularDamping);
box2d.b2Body.prototype.GetGravityScale = function() {
  return this.m_gravityScale
};
goog.exportProperty(box2d.b2Body.prototype, "GetGravityScale", box2d.b2Body.prototype.GetGravityScale);
box2d.b2Body.prototype.SetGravityScale = function(a) {
  this.m_gravityScale = a
};
goog.exportProperty(box2d.b2Body.prototype, "SetGravityScale", box2d.b2Body.prototype.SetGravityScale);
box2d.b2Body.prototype.SetType = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.m_world.IsLocked());
  if (!0 != this.m_world.IsLocked() && this.m_type != a) {
    this.m_type = a;
    this.ResetMassData();
    this.m_type == box2d.b2BodyType.b2_staticBody && (this.m_linearVelocity.SetZero(), this.m_angularVelocity = 0, this.m_sweep.a0 = this.m_sweep.a, this.m_sweep.c0.Copy(this.m_sweep.c), this.SynchronizeFixtures());
    this.SetAwake(!0);
    this.m_force.SetZero();
    this.m_torque = 0;
    for (a = this.m_contactList; a;) {
      var b = a,
        a = a.next;
      this.m_world.m_contactManager.Destroy(b.contact)
    }
    this.m_contactList =
      null;
    a = this.m_world.m_contactManager.m_broadPhase;
    for (b = this.m_fixtureList; b; b = b.m_next)
      for (var c = b.m_proxyCount, e = 0; e < c; ++e) a.TouchProxy(b.m_proxies[e].proxy)
  }
};
goog.exportProperty(box2d.b2Body.prototype, "SetType", box2d.b2Body.prototype.SetType);
box2d.b2Body.prototype.GetType = function() {
  return this.m_type
};
goog.exportProperty(box2d.b2Body.prototype, "GetType", box2d.b2Body.prototype.GetType);
box2d.b2Body.prototype.SetBullet = function(a) {
  this.m_flags = a ? this.m_flags | box2d.b2BodyFlag.e_bulletFlag : this.m_flags & ~box2d.b2BodyFlag.e_bulletFlag
};
goog.exportProperty(box2d.b2Body.prototype, "SetBullet", box2d.b2Body.prototype.SetBullet);
box2d.b2Body.prototype.IsBullet = function() {
  return (this.m_flags & box2d.b2BodyFlag.e_bulletFlag) == box2d.b2BodyFlag.e_bulletFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsBullet", box2d.b2Body.prototype.IsBullet);
box2d.b2Body.prototype.SetSleepingAllowed = function(a) {
  a ? this.m_flags |= box2d.b2BodyFlag.e_autoSleepFlag : (this.m_flags &= ~box2d.b2BodyFlag.e_autoSleepFlag, this.SetAwake(!0))
};
goog.exportProperty(box2d.b2Body.prototype, "SetSleepingAllowed", box2d.b2Body.prototype.SetSleepingAllowed);
box2d.b2Body.prototype.IsSleepingAllowed = function() {
  return (this.m_flags & box2d.b2BodyFlag.e_autoSleepFlag) == box2d.b2BodyFlag.e_autoSleepFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsSleepingAllowed", box2d.b2Body.prototype.IsSleepingAllowed);
box2d.b2Body.prototype.SetAwake = function(a) {
  a ? 0 == (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && (this.m_flags |= box2d.b2BodyFlag.e_awakeFlag, this.m_sleepTime = 0) : (this.m_flags &= ~box2d.b2BodyFlag.e_awakeFlag, this.m_sleepTime = 0, this.m_linearVelocity.SetZero(), this.m_angularVelocity = 0, this.m_force.SetZero(), this.m_torque = 0)
};
goog.exportProperty(box2d.b2Body.prototype, "SetAwake", box2d.b2Body.prototype.SetAwake);
box2d.b2Body.prototype.IsAwake = function() {
  return (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) == box2d.b2BodyFlag.e_awakeFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsAwake", box2d.b2Body.prototype.IsAwake);
box2d.b2Body.prototype.SetActive = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.m_world.IsLocked());
  if (a != this.IsActive())
    if (a) {
      this.m_flags |= box2d.b2BodyFlag.e_activeFlag;
      for (var a = this.m_world.m_contactManager.m_broadPhase, b = this.m_fixtureList; b; b = b.m_next) b.CreateProxies(a, this.m_xf)
    } else {
      this.m_flags &= ~box2d.b2BodyFlag.e_activeFlag;
      a = this.m_world.m_contactManager.m_broadPhase;
      for (b = this.m_fixtureList; b; b = b.m_next) b.DestroyProxies(a);
      for (a = this.m_contactList; a;) b = a, a = a.next, this.m_world.m_contactManager.Destroy(b.contact);
      this.m_contactList = null
    }
};
goog.exportProperty(box2d.b2Body.prototype, "SetActive", box2d.b2Body.prototype.SetActive);
box2d.b2Body.prototype.IsActive = function() {
  return (this.m_flags & box2d.b2BodyFlag.e_activeFlag) == box2d.b2BodyFlag.e_activeFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsActive", box2d.b2Body.prototype.IsActive);
box2d.b2Body.prototype.SetFixedRotation = function(a) {
  (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) == box2d.b2BodyFlag.e_fixedRotationFlag != a && (this.m_flags = a ? this.m_flags | box2d.b2BodyFlag.e_fixedRotationFlag : this.m_flags & ~box2d.b2BodyFlag.e_fixedRotationFlag, this.m_angularVelocity = 0, this.ResetMassData())
};
goog.exportProperty(box2d.b2Body.prototype, "SetFixedRotation", box2d.b2Body.prototype.SetFixedRotation);
box2d.b2Body.prototype.IsFixedRotation = function() {
  return (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) == box2d.b2BodyFlag.e_fixedRotationFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsFixedRotation", box2d.b2Body.prototype.IsFixedRotation);
box2d.b2Body.prototype.GetFixtureList = function() {
  return this.m_fixtureList
};
goog.exportProperty(box2d.b2Body.prototype, "GetFixtureList", box2d.b2Body.prototype.GetFixtureList);
box2d.b2Body.prototype.GetJointList = function() {
  return this.m_jointList
};
goog.exportProperty(box2d.b2Body.prototype, "GetJointList", box2d.b2Body.prototype.GetJointList);
box2d.b2Body.prototype.GetContactList = function() {
  return this.m_contactList
};
goog.exportProperty(box2d.b2Body.prototype, "GetContactList", box2d.b2Body.prototype.GetContactList);
box2d.b2Body.prototype.GetNext = function() {
  return this.m_next
};
goog.exportProperty(box2d.b2Body.prototype, "GetNext", box2d.b2Body.prototype.GetNext);
box2d.b2Body.prototype.GetUserData = function() {
  return this.m_userData
};
goog.exportProperty(box2d.b2Body.prototype, "GetUserData", box2d.b2Body.prototype.GetUserData);
box2d.b2Body.prototype.SetUserData = function(a) {
  this.m_userData = a
};
goog.exportProperty(box2d.b2Body.prototype, "SetUserData", box2d.b2Body.prototype.SetUserData);
box2d.b2Body.prototype.GetWorld = function() {
  return this.m_world
};
goog.exportProperty(box2d.b2Body.prototype, "GetWorld", box2d.b2Body.prototype.GetWorld);
box2d.b2Body.prototype.SynchronizeFixtures = function() {
  var a = box2d.b2Body.prototype.SynchronizeFixtures.s_xf1;
  a.q.SetAngleRadians(this.m_sweep.a0);
  box2d.b2MulRV(a.q, this.m_sweep.localCenter, a.p);
  box2d.b2SubVV(this.m_sweep.c0, a.p, a.p);
  for (var b = this.m_world.m_contactManager.m_broadPhase, c = this.m_fixtureList; c; c = c.m_next) c.Synchronize(b, a, this.m_xf)
};
goog.exportProperty(box2d.b2Body.prototype, "SynchronizeFixtures", box2d.b2Body.prototype.SynchronizeFixtures);
box2d.b2Body.prototype.SynchronizeFixtures.s_xf1 = new box2d.b2Transform;
box2d.b2Body.prototype.SynchronizeTransform = function() {
  this.m_xf.q.SetAngleRadians(this.m_sweep.a);
  box2d.b2MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
  box2d.b2SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p)
};
goog.exportProperty(box2d.b2Body.prototype, "SynchronizeTransform", box2d.b2Body.prototype.SynchronizeTransform);
box2d.b2Body.prototype.ShouldCollide = function(a) {
  if (this.m_type != box2d.b2BodyType.b2_dynamicBody && a.m_type != box2d.b2BodyType.b2_dynamicBody) return !1;
  for (var b = this.m_jointList; b; b = b.next)
    if (b.other == a && !1 == b.joint.m_collideConnected) return !1;
  return !0
};
goog.exportProperty(box2d.b2Body.prototype, "ShouldCollide", box2d.b2Body.prototype.ShouldCollide);
box2d.b2Body.prototype.Advance = function(a) {
  this.m_sweep.Advance(a);
  this.m_sweep.c.Copy(this.m_sweep.c0);
  this.m_sweep.a = this.m_sweep.a0;
  this.m_xf.q.SetAngleRadians(this.m_sweep.a);
  box2d.b2MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
  box2d.b2SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p)
};
goog.exportProperty(box2d.b2Body.prototype, "Advance", box2d.b2Body.prototype.Advance);
box2d.b2Body.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_islandIndex;
    box2d.b2Log("if (true)\n");
    box2d.b2Log("{\n");
    box2d.b2Log("  /*box2d.b2BodyDef*/ var bd = new box2d.b2BodyDef();\n");
    var b = "";
    switch (this.m_type) {
      case box2d.b2BodyType.b2_staticBody:
        b = "box2d.b2BodyType.b2_staticBody";
        break;
      case box2d.b2BodyType.b2_kinematicBody:
        b = "box2d.b2BodyType.b2_kinematicBody";
        break;
      case box2d.b2BodyType.b2_dynamicBody:
        b = "box2d.b2BodyType.b2_dynamicBody";
        break;
      default:
        box2d.ENABLE_ASSERTS && box2d.b2Assert(!1)
    }
    box2d.b2Log("  bd.type = %s;\n",
      b);
    box2d.b2Log("  bd.position.SetXY(%.15f, %.15f);\n", this.m_xf.p.x, this.m_xf.p.y);
    box2d.b2Log("  bd.angle = %.15f;\n", this.m_sweep.a);
    box2d.b2Log("  bd.linearVelocity.SetXY(%.15f, %.15f);\n", this.m_linearVelocity.x, this.m_linearVelocity.y);
    box2d.b2Log("  bd.angularVelocity = %.15f;\n", this.m_angularVelocity);
    box2d.b2Log("  bd.linearDamping = %.15f;\n", this.m_linearDamping);
    box2d.b2Log("  bd.angularDamping = %.15f;\n", this.m_angularDamping);
    box2d.b2Log("  bd.allowSleep = %s;\n", this.m_flags & box2d.b2BodyFlag.e_autoSleepFlag ?
      "true" : "false");
    box2d.b2Log("  bd.awake = %s;\n", this.m_flags & box2d.b2BodyFlag.e_awakeFlag ? "true" : "false");
    box2d.b2Log("  bd.fixedRotation = %s;\n", this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag ? "true" : "false");
    box2d.b2Log("  bd.bullet = %s;\n", this.m_flags & box2d.b2BodyFlag.e_bulletFlag ? "true" : "false");
    box2d.b2Log("  bd.active = %s;\n", this.m_flags & box2d.b2BodyFlag.e_activeFlag ? "true" : "false");
    box2d.b2Log("  bd.gravityScale = %.15f;\n", this.m_gravityScale);
    box2d.b2Log("\n");
    box2d.b2Log("  bodies[%d] = this.m_world.CreateBody(bd);\n",
      this.m_islandIndex);
    box2d.b2Log("\n");
    for (b = this.m_fixtureList; b; b = b.m_next) box2d.b2Log("  if (true)\n"), box2d.b2Log("  {\n"), b.Dump(a), box2d.b2Log("  }\n");
    box2d.b2Log("}\n")
  }
};
goog.exportProperty(box2d.b2Body.prototype, "Dump", box2d.b2Body.prototype.Dump);
box2d.b2Body.prototype.GetControllerList = function() {
  return this.m_controllerList
};
goog.exportProperty(box2d.b2Body.prototype, "GetControllerList", box2d.b2Body.prototype.GetControllerList);
box2d.b2Body.prototype.GetControllerCount = function() {
  return this.m_controllerCount
};
goog.exportProperty(box2d.b2Body.prototype, "GetControllerCount", box2d.b2Body.prototype.GetControllerCount);
box2d.b2WorldFlag = {
  e_none: 0,
  e_newFixture: 1,
  e_locked: 2,
  e_clearForces: 4
};
goog.exportSymbol("box2d.b2WorldFlag", box2d.b2WorldFlag);
goog.exportProperty(box2d.b2WorldFlag, "e_none", box2d.b2WorldFlag.e_none);
goog.exportProperty(box2d.b2WorldFlag, "e_newFixture", box2d.b2WorldFlag.e_newFixture);
goog.exportProperty(box2d.b2WorldFlag, "e_locked", box2d.b2WorldFlag.e_locked);
goog.exportProperty(box2d.b2WorldFlag, "e_clearForces", box2d.b2WorldFlag.e_clearForces);


box2d.b2World = function(a) {
  this.m_flags = box2d.b2WorldFlag.e_clearForces;
  this.m_contactManager = new box2d.b2ContactManager;
  this.m_gravity = a.Clone();
  this.m_allowSleep = !0;
  this.m_debugDraw = this.m_destructionListener = null;
  this.m_continuousPhysics = this.m_warmStarting = !0;
  this.m_subStepping = !1;
  this.m_stepComplete = !0;
  this.m_profile = new box2d.b2Profile;
  this.m_island = new box2d.b2Island;
  this.s_stack = []
};
goog.exportSymbol("box2d.b2World", box2d.b2World);
box2d.b2World.prototype.m_flags = box2d.b2WorldFlag.e_none;
goog.exportProperty(box2d.b2World.prototype, "m_flags", box2d.b2World.prototype.m_flags);
box2d.b2World.prototype.m_contactManager = null;
goog.exportProperty(box2d.b2World.prototype, "m_contactManager", box2d.b2World.prototype.m_contactManager);
box2d.b2World.prototype.m_bodyList = null;
goog.exportProperty(box2d.b2World.prototype, "m_bodyList", box2d.b2World.prototype.m_bodyList);
box2d.b2World.prototype.m_jointList = null;
goog.exportProperty(box2d.b2World.prototype, "m_jointList", box2d.b2World.prototype.m_jointList);
box2d.b2World.prototype.m_bodyCount = 0;
goog.exportProperty(box2d.b2World.prototype, "m_bodyCount", box2d.b2World.prototype.m_bodyCount);
box2d.b2World.prototype.m_jointCount = 0;
goog.exportProperty(box2d.b2World.prototype, "m_jointCount", box2d.b2World.prototype.m_jointCount);
box2d.b2World.prototype.m_gravity = null;
goog.exportProperty(box2d.b2World.prototype, "m_gravity", box2d.b2World.prototype.m_gravity);
box2d.b2World.prototype.m_allowSleep = !0;
goog.exportProperty(box2d.b2World.prototype, "m_allowSleep", box2d.b2World.prototype.m_allowSleep);
box2d.b2World.prototype.m_destructionListener = null;
goog.exportProperty(box2d.b2World.prototype, "m_destructionListener", box2d.b2World.prototype.m_destructionListener);
box2d.b2World.prototype.m_debugDraw = null;
goog.exportProperty(box2d.b2World.prototype, "m_debugDraw", box2d.b2World.prototype.m_debugDraw);
box2d.b2World.prototype.m_inv_dt0 = 0;
goog.exportProperty(box2d.b2World.prototype, "m_inv_dt0", box2d.b2World.prototype.m_inv_dt0);
box2d.b2World.prototype.m_warmStarting = !0;
goog.exportProperty(box2d.b2World.prototype, "m_warmStarting", box2d.b2World.prototype.m_warmStarting);
box2d.b2World.prototype.m_continuousPhysics = !0;
goog.exportProperty(box2d.b2World.prototype, "m_continuousPhysics", box2d.b2World.prototype.m_continuousPhysics);
box2d.b2World.prototype.m_subStepping = !1;
goog.exportProperty(box2d.b2World.prototype, "m_subStepping", box2d.b2World.prototype.m_subStepping);
box2d.b2World.prototype.m_stepComplete = !0;
goog.exportProperty(box2d.b2World.prototype, "m_stepComplete", box2d.b2World.prototype.m_stepComplete);
box2d.b2World.prototype.m_profile = null;
goog.exportProperty(box2d.b2World.prototype, "m_profile", box2d.b2World.prototype.m_profile);
box2d.b2World.prototype.m_island = null;
goog.exportProperty(box2d.b2World.prototype, "m_island", box2d.b2World.prototype.m_island);
box2d.b2World.prototype.s_stack = null;
goog.exportProperty(box2d.b2World.prototype, "s_stack", box2d.b2World.prototype.s_stack);
box2d.b2World.prototype.m_controllerList = null;
goog.exportProperty(box2d.b2World.prototype, "m_controllerList", box2d.b2World.prototype.m_controllerList);
box2d.b2World.prototype.m_controllerCount = 0;
goog.exportProperty(box2d.b2World.prototype, "m_controllerCount", box2d.b2World.prototype.m_controllerCount);
box2d.b2World.prototype.SetAllowSleeping = function(a) {
  if (a != this.m_allowSleep && (this.m_allowSleep = a, !1 == this.m_allowSleep))
    for (a = this.m_bodyList; a; a = a.m_next) a.SetAwake(!0)
};
goog.exportProperty(box2d.b2World.prototype, "SetAllowSleeping", box2d.b2World.prototype.SetAllowSleeping);
box2d.b2World.prototype.GetAllowSleeping = function() {
  return this.m_allowSleep
};
goog.exportProperty(box2d.b2World.prototype, "GetAllowSleeping", box2d.b2World.prototype.GetAllowSleeping);
box2d.b2World.prototype.SetWarmStarting = function(a) {
  this.m_warmStarting = a
};
goog.exportProperty(box2d.b2World.prototype, "SetWarmStarting", box2d.b2World.prototype.SetWarmStarting);
box2d.b2World.prototype.GetWarmStarting = function() {
  return this.m_warmStarting
};
goog.exportProperty(box2d.b2World.prototype, "GetWarmStarting", box2d.b2World.prototype.GetWarmStarting);
box2d.b2World.prototype.SetContinuousPhysics = function(a) {
  this.m_continuousPhysics = a
};
goog.exportProperty(box2d.b2World.prototype, "SetContinuousPhysics", box2d.b2World.prototype.SetContinuousPhysics);
box2d.b2World.prototype.GetContinuousPhysics = function() {
  return this.m_continuousPhysics
};
goog.exportProperty(box2d.b2World.prototype, "GetContinuousPhysics", box2d.b2World.prototype.GetContinuousPhysics);
box2d.b2World.prototype.SetSubStepping = function(a) {
  this.m_subStepping = a
};
goog.exportProperty(box2d.b2World.prototype, "SetSubStepping", box2d.b2World.prototype.SetSubStepping);
box2d.b2World.prototype.GetSubStepping = function() {
  return this.m_subStepping
};
goog.exportProperty(box2d.b2World.prototype, "GetSubStepping", box2d.b2World.prototype.GetSubStepping);
box2d.b2World.prototype.GetBodyList = function() {
  return this.m_bodyList
};
goog.exportProperty(box2d.b2World.prototype, "GetBodyList", box2d.b2World.prototype.GetBodyList);
box2d.b2World.prototype.GetJointList = function() {
  return this.m_jointList
};
goog.exportProperty(box2d.b2World.prototype, "GetJointList", box2d.b2World.prototype.GetJointList);
box2d.b2World.prototype.GetContactList = function() {
  return this.m_contactManager.m_contactList
};
goog.exportProperty(box2d.b2World.prototype, "GetContactList", box2d.b2World.prototype.GetContactList);
box2d.b2World.prototype.GetBodyCount = function() {
  return this.m_bodyCount
};
goog.exportProperty(box2d.b2World.prototype, "GetBodyCount", box2d.b2World.prototype.GetBodyCount);
box2d.b2World.prototype.GetJointCount = function() {
  return this.m_jointCount
};
goog.exportProperty(box2d.b2World.prototype, "GetJointCount", box2d.b2World.prototype.GetJointCount);
box2d.b2World.prototype.GetContactCount = function() {
  return this.m_contactManager.m_contactCount
};
goog.exportProperty(box2d.b2World.prototype, "GetContactCount", box2d.b2World.prototype.GetContactCount);
box2d.b2World.prototype.SetGravity = function(a) {
  this.m_gravity.Copy(a)
};
goog.exportProperty(box2d.b2World.prototype, "SetGravity", box2d.b2World.prototype.SetGravity);
box2d.b2World.prototype.GetGravity = function() {
  return this.m_gravity
};
goog.exportProperty(box2d.b2World.prototype, "GetGravity", box2d.b2World.prototype.GetGravity);
box2d.b2World.prototype.IsLocked = function() {
  return 0 < (this.m_flags & box2d.b2WorldFlag.e_locked)
};
goog.exportProperty(box2d.b2World.prototype, "IsLocked", box2d.b2World.prototype.IsLocked);
box2d.b2World.prototype.SetAutoClearForces = function(a) {
  this.m_flags = a ? this.m_flags | box2d.b2WorldFlag.e_clearForces : this.m_flags & ~box2d.b2WorldFlag.e_clearForces
};
goog.exportProperty(box2d.b2World.prototype, "SetAutoClearForces", box2d.b2World.prototype.SetAutoClearForces);
box2d.b2World.prototype.GetAutoClearForces = function() {
  return (this.m_flags & box2d.b2WorldFlag.e_clearForces) == box2d.b2WorldFlag.e_clearForces
};
goog.exportProperty(box2d.b2World.prototype, "GetAutoClearForces", box2d.b2World.prototype.GetAutoClearForces);
box2d.b2World.prototype.GetContactManager = function() {
  return this.m_contactManager
};
goog.exportProperty(box2d.b2World.prototype, "GetContactManager", box2d.b2World.prototype.GetContactManager);
box2d.b2World.prototype.GetProfile = function() {
  return this.m_profile
};
goog.exportProperty(box2d.b2World.prototype, "GetProfile", box2d.b2World.prototype.GetProfile);
box2d.b2World.prototype.SetDestructionListener = function(a) {
  this.m_destructionListener = a
};
goog.exportProperty(box2d.b2World.prototype, "SetDestructionListener", box2d.b2World.prototype.SetDestructionListener);
box2d.b2World.prototype.SetContactFilter = function(a) {
  this.m_contactManager.m_contactFilter = a
};
goog.exportProperty(box2d.b2World.prototype, "SetContactFilter", box2d.b2World.prototype.SetContactFilter);
box2d.b2World.prototype.SetContactListener = function(a) {
  this.m_contactManager.m_contactListener = a
};
goog.exportProperty(box2d.b2World.prototype, "SetContactListener", box2d.b2World.prototype.SetContactListener);
box2d.b2World.prototype.SetDebugDraw = function(a) {
  this.m_debugDraw = a
};
goog.exportProperty(box2d.b2World.prototype, "SetDebugDraw", box2d.b2World.prototype.SetDebugDraw);
box2d.b2World.prototype.CreateBody = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.IsLocked());
  if (this.IsLocked()) return null;
  a = new box2d.b2Body(a, this);
  a.m_prev = null;
  if (a.m_next = this.m_bodyList) this.m_bodyList.m_prev = a;
  this.m_bodyList = a;
  ++this.m_bodyCount;
  return a
};
goog.exportProperty(box2d.b2World.prototype, "CreateBody", box2d.b2World.prototype.CreateBody);
box2d.b2World.prototype.DestroyBody = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_bodyCount);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.IsLocked());
  if (!this.IsLocked()) {
    for (var b = a.m_jointList; b;) {
      var c = b,
        b = b.next;
      this.m_destructionListener && this.m_destructionListener.SayGoodbyeJoint(c.joint);
      this.DestroyJoint(c.joint);
      a.m_jointList = b
    }
    a.m_jointList = null;
    for (b = a.m_controllerList; b;) c = b, b = b.nextController, c.controller.RemoveBody(a);
    for (b = a.m_contactList; b;) c = b, b = b.next, this.m_contactManager.Destroy(c.contact);
    a.m_contactList = null;
    for (b = a.m_fixtureList; b;) c = b, b = b.m_next, this.m_destructionListener && this.m_destructionListener.SayGoodbyeFixture(c), c.DestroyProxies(this.m_contactManager.m_broadPhase), c.Destroy(), a.m_fixtureList = b, a.m_fixtureCount -= 1;
    a.m_fixtureList = null;
    a.m_fixtureCount = 0;
    a.m_prev && (a.m_prev.m_next = a.m_next);
    a.m_next && (a.m_next.m_prev = a.m_prev);
    a == this.m_bodyList && (this.m_bodyList = a.m_next);
    --this.m_bodyCount
  }
};
goog.exportProperty(box2d.b2World.prototype, "DestroyBody", box2d.b2World.prototype.DestroyBody);
box2d.b2World.prototype.CreateJoint = function(a) {

  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.IsLocked());
  if (this.IsLocked()) return null;

  var b = box2d.b2Joint.Create(a, null);

  b.m_prev = null;
  if (b.m_next = this.m_jointList) this.m_jointList.m_prev = b;
  this.m_jointList = b;
  ++this.m_jointCount;

  b.m_edgeA.joint = b;
  b.m_edgeA.other = b.m_bodyB;
  b.m_edgeA.prev = null;

  if (b.m_edgeA.next = b.m_bodyA.m_jointList) b.m_bodyA.m_jointList.prev = b.m_edgeA;
  b.m_bodyA.m_jointList = b.m_edgeA;
  b.m_edgeB.joint = b;
  b.m_edgeB.other = b.m_bodyA;
  b.m_edgeB.prev = null;

  if (b.m_edgeB.next = b.m_bodyB.m_jointList) b.m_bodyB.m_jointList.prev = b.m_edgeB;
  b.m_bodyB.m_jointList = b.m_edgeB;
  var c = a.bodyA,
    e = a.bodyB;

  if (!1 == a.collideConnected)
    for (a = e.GetContactList(); a;)
      a.other == c && a.contact.FlagForFiltering(), a = a.next;
  return b
};
goog.exportProperty(box2d.b2World.prototype, "CreateJoint", box2d.b2World.prototype.CreateJoint);
box2d.b2World.prototype.DestroyJoint = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.IsLocked());
  if (!this.IsLocked()) {
    var b = a.m_collideConnected;
    a.m_prev && (a.m_prev.m_next = a.m_next);
    a.m_next && (a.m_next.m_prev = a.m_prev);
    a == this.m_jointList && (this.m_jointList = a.m_next);
    var c = a.m_bodyA,
      e = a.m_bodyB;
    c.SetAwake(!0);
    e.SetAwake(!0);
    a.m_edgeA.prev && (a.m_edgeA.prev.next = a.m_edgeA.next);
    a.m_edgeA.next && (a.m_edgeA.next.prev = a.m_edgeA.prev);
    a.m_edgeA == c.m_jointList && (c.m_jointList = a.m_edgeA.next);
    a.m_edgeA.prev =
      null;
    a.m_edgeA.next = null;
    a.m_edgeB.prev && (a.m_edgeB.prev.next = a.m_edgeB.next);
    a.m_edgeB.next && (a.m_edgeB.next.prev = a.m_edgeB.prev);
    a.m_edgeB == e.m_jointList && (e.m_jointList = a.m_edgeB.next);
    a.m_edgeB.prev = null;
    a.m_edgeB.next = null;
    box2d.b2Joint.Destroy(a, null);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_jointCount);
    --this.m_jointCount;
    if (!1 == b)
      for (a = e.GetContactList(); a;) a.other == c && a.contact.FlagForFiltering(), a = a.next
  }
};
goog.exportProperty(box2d.b2World.prototype, "DestroyJoint", box2d.b2World.prototype.DestroyJoint);
box2d.b2World.prototype.Solve = function(a) {
  for (var b = this.m_controllerList; b; b = b.m_next) b.Step(a);
  this.m_profile.solveInit = 0;
  this.m_profile.solveVelocity = 0;
  this.m_profile.solvePosition = 0;
  b = this.m_island;
  b.Initialize(this.m_bodyCount, this.m_contactManager.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener);
  for (var c = this.m_bodyList; c; c = c.m_next) c.m_flags &= ~box2d.b2BodyFlag.e_islandFlag;
  for (var e = this.m_contactManager.m_contactList; e; e = e.m_next) e.m_flags &= ~box2d.b2ContactFlag.e_islandFlag;
  for (e = this.m_jointList; e; e = e.m_next) e.m_islandFlag = !1;
  for (var e = this.m_bodyCount, d = this.s_stack, f = this.m_bodyList; f; f = f.m_next)
    if (!(f.m_flags & box2d.b2BodyFlag.e_islandFlag) && !(!1 == f.IsAwake() || !1 == f.IsActive()) && f.GetType() != box2d.b2BodyType.b2_staticBody) {
      b.Clear();
      var g = 0;
      d[g++] = f;
      for (f.m_flags |= box2d.b2BodyFlag.e_islandFlag; 0 < g;)
        if (c = d[--g], box2d.ENABLE_ASSERTS && box2d.b2Assert(!0 == c.IsActive()), b.AddBody(c), c.SetAwake(!0), c.GetType() != box2d.b2BodyType.b2_staticBody) {
          for (var h = c.m_contactList; h; h =
            h.next) {
            var j = h.contact;
            if (!(j.m_flags & box2d.b2ContactFlag.e_islandFlag) && !(!1 == j.IsEnabled() || !1 == j.IsTouching())) {
              var i = j.m_fixtureB.m_isSensor;
              !j.m_fixtureA.m_isSensor && !i && (b.AddContact(j), j.m_flags |= box2d.b2ContactFlag.e_islandFlag, j = h.other, j.m_flags & box2d.b2BodyFlag.e_islandFlag || (box2d.ENABLE_ASSERTS && box2d.b2Assert(g < e), d[g++] = j, j.m_flags |= box2d.b2BodyFlag.e_islandFlag))
            }
          }
          for (c = c.m_jointList; c; c = c.next) !0 != c.joint.m_islandFlag && (j = c.other, !1 != j.IsActive() && (b.AddJoint(c.joint), c.joint.m_islandFlag = !0, j.m_flags & box2d.b2BodyFlag.e_islandFlag || (box2d.ENABLE_ASSERTS && box2d.b2Assert(g < e), d[g++] = j, j.m_flags |= box2d.b2BodyFlag.e_islandFlag)))
        }
      c = new box2d.b2Profile;
      b.Solve(c, a, this.m_gravity, this.m_allowSleep);
      this.m_profile.solveInit += c.solveInit;
      this.m_profile.solveVelocity += c.solveVelocity;
      this.m_profile.solvePosition += c.solvePosition;
      for (g = 0; g < b.m_bodyCount; ++g) c = b.m_bodies[g], c.GetType() == box2d.b2BodyType.b2_staticBody && (c.m_flags &= ~box2d.b2BodyFlag.e_islandFlag)
    }
  for (g = 0; g < d.length && d[g]; ++g) d[g] =
    null;
  a = new box2d.b2Timer;
  for (c = this.m_bodyList; c; c = c.m_next) 0 != (c.m_flags & box2d.b2BodyFlag.e_islandFlag) && c.GetType() != box2d.b2BodyType.b2_staticBody && c.SynchronizeFixtures();
  this.m_contactManager.FindNewContacts();
  this.m_profile.broadphase = a.GetMilliseconds()
};
goog.exportProperty(box2d.b2World.prototype, "Solve", box2d.b2World.prototype.Solve);
box2d.b2World.prototype.SolveTOI = function(a) {
  var b = this.m_island;
  b.Initialize(2 * box2d.b2_maxTOIContacts, box2d.b2_maxTOIContacts, 0, null, this.m_contactManager.m_contactListener);
  if (this.m_stepComplete) {
    for (var c = this.m_bodyList; c; c = c.m_next) c.m_flags &= ~box2d.b2BodyFlag.e_islandFlag, c.m_sweep.alpha0 = 0;
    for (var e = this.m_contactManager.m_contactList; e; e = e.m_next) e.m_flags &= ~(box2d.b2ContactFlag.e_toiFlag | box2d.b2ContactFlag.e_islandFlag), e.m_toiCount = 0, e.m_toi = 1
  }
  for (;;) {
    for (var d = null, c = 1, e = this.m_contactManager.m_contactList; e; e =
      e.m_next)
      if (!1 != e.IsEnabled() && !(e.m_toiCount > box2d.b2_maxSubSteps)) {
        var f = 1;
        if (e.m_flags & box2d.b2ContactFlag.e_toiFlag) f = e.m_toi;
        else {
          var g = e.GetFixtureA(),
            h = e.GetFixtureB();
          if (g.IsSensor() || h.IsSensor()) continue;
          var f = g.GetBody(),
            j = h.GetBody(),
            i = f.m_type,
            k = j.m_type;
          box2d.ENABLE_ASSERTS && box2d.b2Assert(i == box2d.b2BodyType.b2_dynamicBody || k == box2d.b2BodyType.b2_dynamicBody);
          var l = f.IsAwake() && i != box2d.b2BodyType.b2_staticBody,
            m = j.IsAwake() && k != box2d.b2BodyType.b2_staticBody;
          if (!1 == l && !1 == m) continue;
          i = f.IsBullet() || i != box2d.b2BodyType.b2_dynamicBody;
          k = j.IsBullet() || k != box2d.b2BodyType.b2_dynamicBody;
          if (!1 == i && !1 == k) continue;
          k = f.m_sweep.alpha0;
          f.m_sweep.alpha0 < j.m_sweep.alpha0 ? (k = j.m_sweep.alpha0, f.m_sweep.Advance(k)) : j.m_sweep.alpha0 < f.m_sweep.alpha0 && (k = f.m_sweep.alpha0, j.m_sweep.Advance(k));
          box2d.ENABLE_ASSERTS && box2d.b2Assert(1 > k);
          l = e.GetChildIndexA();
          m = e.GetChildIndexB();
          i = box2d.b2World.prototype.SolveTOI.s_toi_input;
          i.proxyA.SetShape(g.GetShape(), l);
          i.proxyB.SetShape(h.GetShape(), m);
          i.sweepA.Copy(f.m_sweep);
          i.sweepB.Copy(j.m_sweep);
          i.tMax = 1;
          f = box2d.b2World.prototype.SolveTOI.s_toi_output;
          box2d.b2TimeOfImpact(f, i);
          j = f.t;
          f = f.state == box2d.b2TOIOutputState.e_touching ? box2d.b2Min(k + (1 - k) * j, 1) : 1;
          e.m_toi = f;
          e.m_flags |= box2d.b2ContactFlag.e_toiFlag
        }
        f < c && (d = e, c = f)
      }
    if (null == d || 1 - 10 * box2d.b2_epsilon < c) {
      this.m_stepComplete = !0;
      break
    }
    g = d.GetFixtureA();
    h = d.GetFixtureB();
    f = g.GetBody();
    j = h.GetBody();
    e = box2d.b2World.prototype.SolveTOI.s_backup1.Copy(f.m_sweep);
    g = box2d.b2World.prototype.SolveTOI.s_backup2.Copy(j.m_sweep);
    f.Advance(c);
    j.Advance(c);
    d.Update(this.m_contactManager.m_contactListener);
    d.m_flags &= ~box2d.b2ContactFlag.e_toiFlag;
    ++d.m_toiCount;
    if (!1 == d.IsEnabled() || !1 == d.IsTouching()) d.SetEnabled(!1), f.m_sweep.Copy(e), j.m_sweep.Copy(g), f.SynchronizeTransform(), j.SynchronizeTransform();
    else {
      f.SetAwake(!0);
      j.SetAwake(!0);
      b.Clear();
      b.AddBody(f);
      b.AddBody(j);
      b.AddContact(d);
      f.m_flags |= box2d.b2BodyFlag.e_islandFlag;
      j.m_flags |= box2d.b2BodyFlag.e_islandFlag;
      d.m_flags |= box2d.b2ContactFlag.e_islandFlag;
      for (d = 0; 2 > d; ++d)
        if (e =
          0 == d ? f : j, e.m_type == box2d.b2BodyType.b2_dynamicBody)
          for (g = e.m_contactList; g && b.m_bodyCount != b.m_bodyCapacity && b.m_contactCount != b.m_contactCapacity; g = g.next) h = g.contact, h.m_flags & box2d.b2ContactFlag.e_islandFlag || (k = g.other, k.m_type == box2d.b2BodyType.b2_dynamicBody && !1 == e.IsBullet() && !1 == k.IsBullet() || (i = h.m_fixtureB.m_isSensor, !h.m_fixtureA.m_isSensor && !i && (i = box2d.b2World.prototype.SolveTOI.s_backup.Copy(k.m_sweep), 0 == (k.m_flags & box2d.b2BodyFlag.e_islandFlag) && k.Advance(c), h.Update(this.m_contactManager.m_contactListener), !1 == h.IsEnabled() ? (k.m_sweep.Copy(i), k.SynchronizeTransform()) : !1 == h.IsTouching() ? (k.m_sweep.Copy(i), k.SynchronizeTransform()) : (h.m_flags |= box2d.b2ContactFlag.e_islandFlag, b.AddContact(h), k.m_flags & box2d.b2BodyFlag.e_islandFlag || (k.m_flags |= box2d.b2BodyFlag.e_islandFlag, k.m_type != box2d.b2BodyType.b2_staticBody && k.SetAwake(!0), b.AddBody(k))))));
      d = box2d.b2World.prototype.SolveTOI.s_subStep;
      d.dt = (1 - c) * a.dt;
      d.inv_dt = 1 / d.dt;
      d.dtRatio = 1;
      d.positionIterations = 20;
      d.velocityIterations = a.velocityIterations;
      d.warmStarting = !1;
      b.SolveTOI(d, f.m_islandIndex, j.m_islandIndex);
      for (d = 0; d < b.m_bodyCount; ++d)
        if (e = b.m_bodies[d], e.m_flags &= ~box2d.b2BodyFlag.e_islandFlag, e.m_type == box2d.b2BodyType.b2_dynamicBody) {
          e.SynchronizeFixtures();
          for (g = e.m_contactList; g; g = g.next) g.contact.m_flags &= ~(box2d.b2ContactFlag.e_toiFlag | box2d.b2ContactFlag.e_islandFlag)
        }
      this.m_contactManager.FindNewContacts();
      if (this.m_subStepping) {
        this.m_stepComplete = !1;
        break
      }
    }
  }
};
goog.exportProperty(box2d.b2World.prototype, "SolveTOI", box2d.b2World.prototype.SolveTOI);
box2d.b2World.prototype.SolveTOI.s_subStep = new box2d.b2TimeStep;
box2d.b2World.prototype.SolveTOI.s_backup = new box2d.b2Sweep;
box2d.b2World.prototype.SolveTOI.s_backup1 = new box2d.b2Sweep;
box2d.b2World.prototype.SolveTOI.s_backup2 = new box2d.b2Sweep;
box2d.b2World.prototype.SolveTOI.s_toi_input = new box2d.b2TOIInput;
box2d.b2World.prototype.SolveTOI.s_toi_output = new box2d.b2TOIOutput;
box2d.b2World.prototype.Step = function(a, b, c) {
  var e = new box2d.b2Timer;
  this.m_flags & box2d.b2WorldFlag.e_newFixture && (this.m_contactManager.FindNewContacts(), this.m_flags &= ~box2d.b2WorldFlag.e_newFixture);
  this.m_flags |= box2d.b2WorldFlag.e_locked;
  var d = box2d.b2World.prototype.Step.s_step;
  d.dt = a;
  d.velocityIterations = b;
  d.positionIterations = c;
  d.inv_dt = 0 < a ? 1 / a : 0;
  d.dtRatio = this.m_inv_dt0 * a;
  d.warmStarting = this.m_warmStarting;
  a = new box2d.b2Timer;
  this.m_contactManager.Collide();
  this.m_profile.collide = a.GetMilliseconds();
  this.m_stepComplete && 0 < d.dt && (a = new box2d.b2Timer, this.Solve(d), this.m_profile.solve = a.GetMilliseconds());
  this.m_continuousPhysics && 0 < d.dt && (a = new box2d.b2Timer, this.SolveTOI(d), this.m_profile.solveTOI = a.GetMilliseconds());
  0 < d.dt && (this.m_inv_dt0 = d.inv_dt);
  this.m_flags & box2d.b2WorldFlag.e_clearForces && this.ClearForces();
  this.m_flags &= ~box2d.b2WorldFlag.e_locked;
  this.m_profile.step = e.GetMilliseconds()
};
goog.exportProperty(box2d.b2World.prototype, "Step", box2d.b2World.prototype.Step);
box2d.b2World.prototype.Step.s_step = new box2d.b2TimeStep;
box2d.b2World.prototype.ClearForces = function() {
  for (var a = this.m_bodyList; a; a = a.m_next) a.m_force.SetZero(), a.m_torque = 0
};
goog.exportProperty(box2d.b2World.prototype, "ClearForces", box2d.b2World.prototype.ClearForces);
box2d.b2World.prototype.QueryAABB = function(a, b) {
  var c = this.m_contactManager.m_broadPhase;
  c.Query(function(b) {
    b = c.GetUserData(b);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(b instanceof box2d.b2FixtureProxy);
    b = b.fixture;
    return a instanceof box2d.b2QueryCallback ? a.ReportFixture(b) : a(b)
  }, b)
};
goog.exportProperty(box2d.b2World.prototype, "QueryAABB", box2d.b2World.prototype.QueryAABB);
box2d.b2World.prototype.QueryShape = function(a, b, c) {
  var e = this.m_contactManager.m_broadPhase,
    d = box2d.b2World.prototype.QueryShape.s_aabb;
  b.ComputeAABB(d, c, 0);
  e.Query(function(d) {
    d = e.GetUserData(d);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2FixtureProxy);
    d = d.fixture;
    return box2d.b2TestOverlapShape(b, 0, d.GetShape(), 0, c, d.GetBody().GetTransform()) ? a instanceof box2d.b2QueryCallback ? a.ReportFixture(d) : a(d) : !0
  }, d)
};
goog.exportProperty(box2d.b2World.prototype, "QueryShape", box2d.b2World.prototype.QueryShape);
box2d.b2World.prototype.QueryShape.s_aabb = new box2d.b2AABB;
box2d.b2World.prototype.QueryPoint = function(a, b) {
  var c = this.m_contactManager.m_broadPhase,
    e = box2d.b2World.prototype.QueryPoint.s_aabb;
  e.lowerBound.SetXY(b.x - box2d.b2_linearSlop, b.y - box2d.b2_linearSlop);
  e.upperBound.SetXY(b.x + box2d.b2_linearSlop, b.y + box2d.b2_linearSlop);
  c.Query(function(d) {
    d = c.GetUserData(d);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2FixtureProxy);
    d = d.fixture;
    return d.TestPoint(b) ? a instanceof box2d.b2QueryCallback ? a.ReportFixture(d) : a(d) : !0
  }, e)
};
goog.exportProperty(box2d.b2World.prototype, "QueryPoint", box2d.b2World.prototype.QueryPoint);
box2d.b2World.prototype.QueryPoint.s_aabb = new box2d.b2AABB;
box2d.b2World.prototype.RayCast = function(a, b, c) {
  var e = this.m_contactManager.m_broadPhase,
    d = box2d.b2World.prototype.RayCast.s_input;
  d.maxFraction = 1;
  d.p1.Copy(b);
  d.p2.Copy(c);
  e.RayCast(function(d, g) {
    var h = e.GetUserData(g);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(h instanceof box2d.b2FixtureProxy);
    var j = h.fixture,
      i = box2d.b2World.prototype.RayCast.s_output;
    if (j.RayCast(i, d, h.childIndex)) {
      var h = i.fraction,
        k = box2d.b2World.prototype.RayCast.s_point;
      k.SetXY((1 - h) * b.x + h * c.x, (1 - h) * b.y + h * c.y);
      return a instanceof
      box2d.b2RayCastCallback ? a.ReportFixture(j, k, i.normal, h) : a(j, k, i.normal, h)
    }
    return d.maxFraction
  }, d)
};
goog.exportProperty(box2d.b2World.prototype, "RayCast", box2d.b2World.prototype.RayCast);
box2d.b2World.prototype.RayCast.s_input = new box2d.b2RayCastInput;
box2d.b2World.prototype.RayCast.s_output = new box2d.b2RayCastOutput;
box2d.b2World.prototype.RayCast.s_point = new box2d.b2Vec2;
box2d.b2World.prototype.RayCastOne = function(a, b) {
  var c = null,
    e = 1;
  this.RayCast(function(a, b, g, h) {
    h < e && (e = h, c = a);
    return e
  }, a, b);
  return c
};
goog.exportProperty(box2d.b2World.prototype, "RayCastOne", box2d.b2World.prototype.RayCastOne);
box2d.b2World.prototype.RayCastAll = function(a, b, c) {
  c.length = 0;
  this.RayCast(function(a) {
    c.push(a);
    return 1
  }, a, b);
  return c
};
goog.exportProperty(box2d.b2World.prototype, "RayCastAll", box2d.b2World.prototype.RayCastAll);
box2d.b2World.prototype.DrawShape = function(a, b) {
  var c = a.GetShape();
  switch (c.m_type) {
    case box2d.b2ShapeType.e_circleShape:
      c = c instanceof box2d.b2CircleShape ? c : null;
      this.m_debugDraw.DrawSolidCircle(c.m_p, c.m_radius, box2d.b2Vec2.UNITX, b);
      break;
    case box2d.b2ShapeType.e_edgeShape:
      var e = c instanceof box2d.b2EdgeShape ? c : null,
        c = e.m_vertex1,
        d = e.m_vertex2;
      this.m_debugDraw.DrawSegment(c, d, b);
      break;
    case box2d.b2ShapeType.e_chainShape:
      var c = c instanceof box2d.b2ChainShape ? c : null,
        e = c.m_count,
        f = c.m_vertices,
        c = f[0];
      this.m_debugDraw.DrawCircle(c, 0.05, b);
      for (var g = 1; g < e; ++g) d = f[g], this.m_debugDraw.DrawSegment(c, d, b), this.m_debugDraw.DrawCircle(d, 0.05, b), c = d;
      break;
    case box2d.b2ShapeType.e_polygonShape:
      e = c instanceof box2d.b2PolygonShape ? c : null, c = e.m_count, f = e.m_vertices, this.m_debugDraw.DrawSolidPolygon(f, c, b)
  }
};
goog.exportProperty(box2d.b2World.prototype, "DrawShape", box2d.b2World.prototype.DrawShape);
box2d.b2World.prototype.DrawJoint = function(a) {
  var b = a.GetBodyA(),
    c = a.GetBodyB(),
    e = b.m_xf.p,
    d = c.m_xf.p,
    c = a.GetAnchorA(box2d.b2World.prototype.DrawJoint.s_p1),
    b = a.GetAnchorB(box2d.b2World.prototype.DrawJoint.s_p2),
    f = box2d.b2World.prototype.DrawJoint.s_color.SetRGB(0.5, 0.8, 0.8);
  switch (a.m_type) {
    case box2d.b2JointType.e_distanceJoint:
      this.m_debugDraw.DrawSegment(c, b, f);
      break;
    case box2d.b2JointType.e_pulleyJoint:
      e = a instanceof box2d.b2PulleyJoint ? a : null;
      a = e.GetGroundAnchorA();
      e = e.GetGroundAnchorB();
      this.m_debugDraw.DrawSegment(a,
        c, f);
      this.m_debugDraw.DrawSegment(e, b, f);
      this.m_debugDraw.DrawSegment(a, e, f);
      break;
    case box2d.b2JointType.e_mouseJoint:
      this.m_debugDraw.DrawSegment(c, b, f);
      break;
    default:
      this.m_debugDraw.DrawSegment(e, c, f), this.m_debugDraw.DrawSegment(c, b, f), this.m_debugDraw.DrawSegment(d, b, f)
  }
};
goog.exportProperty(box2d.b2World.prototype, "DrawJoint", box2d.b2World.prototype.DrawJoint);
box2d.b2World.prototype.DrawJoint.s_p1 = new box2d.b2Vec2;
box2d.b2World.prototype.DrawJoint.s_p2 = new box2d.b2Vec2;
box2d.b2World.prototype.DrawJoint.s_color = new box2d.b2Color(0.5, 0.8, 0.8);
box2d.b2World.prototype.DrawDebugData = function() {
  if (null != this.m_debugDraw) {
    var a = this.m_debugDraw.GetFlags(),
      b = box2d.b2World.prototype.DrawDebugData.s_color.SetRGB(0, 0, 0);
    if (a & box2d.b2DrawFlags.e_shapeBit)
      for (var c = this.m_bodyList; c; c = c.m_next) {
        var e = c.m_xf;
        this.m_debugDraw.PushTransform(e);
        for (var d = c.GetFixtureList(); d; d = d.m_next) !1 == c.IsActive() ? b.SetRGB(0.5, 0.5, 0.3) : c.GetType() == box2d.b2BodyType.b2_staticBody ? b.SetRGB(0.5, 0.9, 0.5) : c.GetType() == box2d.b2BodyType.b2_kinematicBody ? b.SetRGB(0.5, 0.5,
          0.9) : !1 == c.IsAwake() ? b.SetRGB(0.6, 0.6, 0.6) : b.SetRGB(0.9, 0.7, 0.7), this.DrawShape(d, b);
        this.m_debugDraw.PopTransform(e)
      }
    if (a & box2d.b2DrawFlags.e_jointBit)
      for (c = this.m_jointList; c; c = c.m_next) this.DrawJoint(c);
    if (a & box2d.b2DrawFlags.e_aabbBit) {
      b.SetRGB(0.9, 0.3, 0.9);
      for (var e = this.m_contactManager.m_broadPhase, f = box2d.b2World.prototype.DrawDebugData.s_vs, c = this.m_bodyList; c; c = c.m_next)
        if (!1 != c.IsActive())
          for (d = c.GetFixtureList(); d; d = d.m_next)
            for (var g = 0; g < d.m_proxyCount; ++g) {
              var h = e.GetFatAABB(d.m_proxies[g]);
              f[0].SetXY(h.lowerBound.x, h.lowerBound.y);
              f[1].SetXY(h.upperBound.x, h.lowerBound.y);
              f[2].SetXY(h.upperBound.x, h.upperBound.y);
              f[3].SetXY(h.lowerBound.x, h.upperBound.y);
              this.m_debugDraw.DrawPolygon(f, 4, b)
            }
    }
    if (a & box2d.b2DrawFlags.e_centerOfMassBit)
      for (c = this.m_bodyList; c; c = c.m_next) e = box2d.b2World.prototype.DrawDebugData.s_xf, e.q.Copy(c.m_xf.q), e.p.Copy(c.GetWorldCenter()), this.m_debugDraw.DrawTransform(e);
    if (a & box2d.b2DrawFlags.e_controllerBit)
      for (a = this.m_controllerList; a; a = a.m_next) a.Draw(this.m_debugDraw)
  }
};
goog.exportProperty(box2d.b2World.prototype, "DrawDebugData", box2d.b2World.prototype.DrawDebugData);
box2d.b2World.prototype.DrawDebugData.s_color = new box2d.b2Color(0, 0, 0);
box2d.b2World.prototype.DrawDebugData.s_vs = box2d.b2Vec2.MakeArray(4);
box2d.b2World.prototype.DrawDebugData.s_xf = new box2d.b2Transform;
box2d.b2World.prototype.SetBroadPhase = function(a) {
  var b = this.m_contactManager.m_broadPhase;
  this.m_contactManager.m_broadPhase = a;
  for (var c = this.m_bodyList; c; c = c.m_next)
    for (var e = c.m_fixtureList; e; e = e.m_next) e.m_proxy = a.CreateProxy(b.GetFatAABB(e.m_proxy), e)
};
goog.exportProperty(box2d.b2World.prototype, "SetBroadPhase", box2d.b2World.prototype.SetBroadPhase);
box2d.b2World.prototype.GetProxyCount = function() {
  return this.m_contactManager.m_broadPhase.GetProxyCount()
};
goog.exportProperty(box2d.b2World.prototype, "GetProxyCount", box2d.b2World.prototype.GetProxyCount);
box2d.b2World.prototype.GetTreeHeight = function() {
  return this.m_contactManager.m_broadPhase.GetTreeHeight()
};
goog.exportProperty(box2d.b2World.prototype, "GetTreeHeight", box2d.b2World.prototype.GetTreeHeight);
box2d.b2World.prototype.GetTreeBalance = function() {
  return this.m_contactManager.m_broadPhase.GetTreeBalance()
};
goog.exportProperty(box2d.b2World.prototype, "GetTreeBalance", box2d.b2World.prototype.GetTreeBalance);
box2d.b2World.prototype.GetTreeQuality = function() {
  return this.m_contactManager.m_broadPhase.GetTreeQuality()
};
goog.exportProperty(box2d.b2World.prototype, "GetTreeQuality", box2d.b2World.prototype.GetTreeQuality);
box2d.b2World.prototype.ShiftOrigin = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 == this.IsLocked());
  if (!this.IsLocked()) {
    for (var b = this.m_bodyList; b; b = b.m_next) b.m_xf.p.SelfSub(a), b.m_sweep.c0.SelfSub(a), b.m_sweep.c.SelfSub(a);
    for (b = this.m_jointList; b; b = b.m_next) b.ShiftOrigin(a);
    this.m_contactManager.m_broadPhase.ShiftOrigin(a)
  }
};
goog.exportProperty(box2d.b2World.prototype, "ShiftOrigin", box2d.b2World.prototype.ShiftOrigin);
box2d.b2World.prototype.Dump = function() {
  if (box2d.DEBUG && (this.m_flags & box2d.b2WorldFlag.e_locked) != box2d.b2WorldFlag.e_locked) {
    box2d.b2Log("/** @type {box2d.b2Vec2} */ var g = new box2d.b2Vec2(%.15f, %.15f);\n", this.m_gravity.x, this.m_gravity.y);
    box2d.b2Log("this.m_world.SetGravity(g);\n");
    box2d.b2Log("/** @type {Array.<box2d.b2Body>} */ var bodies = new Array(%d);\n", this.m_bodyCount);
    box2d.b2Log("/** @typ3 {Array.<box2d.b2Joint>} */ var joints = new Array(%d);\n", this.m_jointCount);
    for (var a = 0,
        b = this.m_bodyList; b; b = b.m_next) b.m_islandIndex = a, b.Dump(), ++a;
    a = 0;
    for (b = this.m_jointList; b; b = b.m_next) b.m_index = a, ++a;
    for (b = this.m_jointList; b; b = b.m_next) b.m_type != box2d.b2JointType.e_gearJoint && (box2d.b2Log("if (true)\n"), box2d.b2Log("{\n"), b.Dump(), box2d.b2Log("}\n"));
    for (b = this.m_jointList; b; b = b.m_next) b.m_type == box2d.b2JointType.e_gearJoint && (box2d.b2Log("if (true)\n"), box2d.b2Log("{\n"), b.Dump(), box2d.b2Log("}\n"))
  }
};
goog.exportProperty(box2d.b2World.prototype, "Dump", box2d.b2World.prototype.Dump);
box2d.b2World.prototype.AddController = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null === a.m_world, "Controller can only be a member of one world");
  a.m_world = this;
  a.m_next = this.m_controllerList;
  a.m_prev = null;
  this.m_controllerList && (this.m_controllerList.m_prev = a);
  this.m_controllerList = a;
  ++this.m_controllerCount;
  return a
};
goog.exportProperty(box2d.b2World.prototype, "AddController", box2d.b2World.prototype.AddController);
box2d.b2World.prototype.RemoveController = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.m_world === this, "Controller is not a member of this world");
  a.m_prev && (a.m_prev.m_next = a.m_next);
  a.m_next && (a.m_next.m_prev = a.m_prev);
  this.m_controllerList == a && (this.m_controllerList = a.m_next);
  --this.m_controllerCount;
  a.m_prev = null;
  a.m_next = null;
  a.m_world = null
};
goog.exportProperty(box2d.b2World.prototype, "RemoveController", box2d.b2World.prototype.RemoveController);
box2d.b2AreaJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_areaJoint);
  this.bodies = []
};
goog.inherits(box2d.b2AreaJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2AreaJointDef", box2d.b2AreaJointDef);
box2d.b2AreaJointDef.prototype.world = null;
goog.exportProperty(box2d.b2AreaJointDef.prototype, "world", box2d.b2AreaJointDef.prototype.world);
box2d.b2AreaJointDef.prototype.bodies = null;
goog.exportProperty(box2d.b2AreaJointDef.prototype, "bodies", box2d.b2AreaJointDef.prototype.bodies);
box2d.b2AreaJointDef.prototype.frequencyHz = 0;
goog.exportProperty(box2d.b2AreaJointDef.prototype, "frequencyHz", box2d.b2AreaJointDef.prototype.frequencyHz);
box2d.b2AreaJointDef.prototype.dampingRatio = 0;
goog.exportProperty(box2d.b2AreaJointDef.prototype, "dampingRatio", box2d.b2AreaJointDef.prototype.dampingRatio);
box2d.b2AreaJointDef.prototype.AddBody = function(a) {
  this.bodies.push(a);
  1 == this.bodies.length ? this.bodyA = a : 2 == this.bodies.length && (this.bodyB = a)
};
goog.exportProperty(box2d.b2AreaJointDef.prototype, "AddBody", box2d.b2AreaJointDef.prototype.AddBody);
box2d.b2AreaJoint = function(a) {
  box2d.b2Joint.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= a.bodies.length, "You cannot create an area joint with less than three bodies.");
  this.m_bodies = a.bodies;
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_targetLengths = box2d.b2MakeNumberArray(a.bodies.length);
  this.m_normals = box2d.b2Vec2.MakeArray(a.bodies.length);
  this.m_joints = Array(a.bodies.length);
  this.m_deltas = box2d.b2Vec2.MakeArray(a.bodies.length);
  this.m_delta = new box2d.b2Vec2;
  var b = new box2d.b2DistanceJointDef;
  b.frequencyHz = a.frequencyHz;
  b.dampingRatio = a.dampingRatio;
  for (var c = this.m_targetArea = 0, e = this.m_bodies.length; c < e; ++c) {
    var d = this.m_bodies[c],
      f = this.m_bodies[(c + 1) % e],
      g = d.GetWorldCenter(),
      h = f.GetWorldCenter();
    this.m_targetLengths[c] = box2d.b2DistanceVV(g, h);
    this.m_targetArea += box2d.b2CrossVV(g, h);
    b.Initialize(d, f, g, h);
    this.m_joints[c] = a.world.CreateJoint(b)
  }
  this.m_targetArea *= 0.5
};
goog.inherits(box2d.b2AreaJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2AreaJoint", box2d.b2AreaJoint);
box2d.b2AreaJoint.prototype.m_bodies = null;
goog.exportProperty(box2d.b2AreaJoint.prototype, "m_bodies", box2d.b2AreaJoint.prototype.m_bodies);
box2d.b2AreaJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2AreaJoint.prototype, "m_frequencyHz", box2d.b2AreaJoint.prototype.m_frequencyHz);
box2d.b2AreaJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2AreaJoint.prototype, "m_dampingRatio", box2d.b2AreaJoint.prototype.m_dampingRatio);
box2d.b2AreaJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2AreaJoint.prototype, "m_impulse", box2d.b2AreaJoint.prototype.m_impulse);
box2d.b2AreaJoint.prototype.m_targetLengths = null;
box2d.b2AreaJoint.prototype.m_targetArea = 0;
box2d.b2AreaJoint.prototype.m_normals = null;
box2d.b2AreaJoint.prototype.m_joints = null;
box2d.b2AreaJoint.prototype.m_deltas = null;
box2d.b2AreaJoint.prototype.m_delta = null;
box2d.b2AreaJoint.prototype.GetAnchorA = function(a) {
  return a.SetZero()
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetAnchorA", box2d.b2AreaJoint.prototype.GetAnchorA);
box2d.b2AreaJoint.prototype.GetAnchorB = function(a) {
  return a.SetZero()
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetAnchorB", box2d.b2AreaJoint.prototype.GetAnchorB);
box2d.b2AreaJoint.prototype.GetReactionForce = function(a, b) {
  return b.SetZero()
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetReactionForce", box2d.b2AreaJoint.prototype.GetReactionForce);
box2d.b2AreaJoint.prototype.GetReactionTorque = function() {
  return 0
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetReactionTorque", box2d.b2AreaJoint.prototype.GetReactionTorque);
box2d.b2AreaJoint.prototype.SetFrequency = function(a) {
  this.m_frequencyHz = a;
  for (var b = 0, c = this.m_joints.length; b < c; ++b) this.m_joints[b].SetFrequency(a)
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "SetFrequency", box2d.b2AreaJoint.prototype.SetFrequency);
box2d.b2AreaJoint.prototype.GetFrequency = function() {
  return this.m_frequencyHz
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetFrequency", box2d.b2AreaJoint.prototype.GetFrequency);
box2d.b2AreaJoint.prototype.SetDampingRatio = function(a) {
  this.m_dampingRatio = a;
  for (var b = 0, c = this.m_joints.length; b < c; ++b) this.m_joints[b].SetDampingRatio(a)
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "SetDampingRatio", box2d.b2AreaJoint.prototype.SetDampingRatio);
box2d.b2AreaJoint.prototype.GetDampingRatio = function() {
  return this.m_dampingRatio
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetDampingRatio", box2d.b2AreaJoint.prototype.GetDampingRatio);
box2d.b2AreaJoint.prototype.Dump = function() {
  box2d.DEBUG && box2d.b2Log("Area joint dumping is not supported.\n")
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "Dump", box2d.b2AreaJoint.prototype.Dump);
box2d.b2AreaJoint.prototype.InitVelocityConstraints = function(a) {
  for (var b = 0, c = this.m_bodies.length; b < c; ++b) {
    var e = this.m_deltas[b];
    box2d.b2SubVV(a.positions[this.m_bodies[(b + 1) % c].m_islandIndex].c, a.positions[this.m_bodies[(b + c - 1) % c].m_islandIndex].c, e)
  }
  if (a.step.warmStarting) {
    this.m_impulse *= a.step.dtRatio;
    b = 0;
    for (c = this.m_bodies.length; b < c; ++b) {
      var d = this.m_bodies[b],
        f = a.velocities[d.m_islandIndex].v,
        e = this.m_deltas[b];
      f.x += 0.5 * (d.m_invMass * e.y) * this.m_impulse;
      f.y += 0.5 * (d.m_invMass * -e.x) * this.m_impulse
    }
  } else this.m_impulse =
    0
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "InitVelocityConstraints", box2d.b2AreaJoint.prototype.InitVelocityConstraints);
box2d.b2AreaJoint.prototype.SolveVelocityConstraints = function(a) {
  for (var b = 0, c = 0, e = 0, d = this.m_bodies.length; e < d; ++e) var f = this.m_bodies[e],
    g = a.velocities[f.m_islandIndex].v,
    h = this.m_deltas[e],
    b = b + h.GetLengthSquared() / f.GetMass(),
    c = c + box2d.b2CrossVV(g, h);
  b = -2 * c / b;
  this.m_impulse += b;
  e = 0;
  for (d = this.m_bodies.length; e < d; ++e) f = this.m_bodies[e], g = a.velocities[f.m_islandIndex].v, h = this.m_deltas[e], g.x += 0.5 * (f.m_invMass * h.y) * b, g.y += 0.5 * (f.m_invMass * -h.x) * b
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "SolveVelocityConstraints", box2d.b2AreaJoint.prototype.SolveVelocityConstraints);
box2d.b2AreaJoint.prototype.SolvePositionConstraints = function(a) {
  for (var b = 0, c = 0, e = 0, d = this.m_bodies.length; e < d; ++e) {
    var f = this.m_bodies[e],
      f = a.positions[f.m_islandIndex].c,
      g = a.positions[this.m_bodies[(e + 1) % d].m_islandIndex].c,
      h = box2d.b2SubVV(g, f, this.m_delta),
      j = h.GetLength();
    j < box2d.b2_epsilon && (j = 1);
    this.m_normals[e].x = h.y / j;
    this.m_normals[e].y = -h.x / j;
    b += j;
    c += box2d.b2CrossVV(f, g)
  }
  b = 0.5 * (this.m_targetArea - 0.5 * c) / b;
  c = !0;
  e = 0;
  for (d = this.m_bodies.length; e < d; ++e) f = this.m_bodies[e], f = a.positions[f.m_islandIndex].c,
    h = box2d.b2AddVV(this.m_normals[e], this.m_normals[(e + 1) % d], this.m_delta), h.SelfMul(b), g = h.GetLengthSquared(), g > box2d.b2Sq(box2d.b2_maxLinearCorrection) && h.SelfMul(box2d.b2_maxLinearCorrection / box2d.b2Sqrt(g)), g > box2d.b2Sq(box2d.b2_linearSlop) && (c = !1), f.x += h.x, f.y += h.y;
  return c
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "SolvePositionConstraints", box2d.b2AreaJoint.prototype.SolvePositionConstraints);
box2d.b2BuoyancyController = function() {
  box2d.b2Controller.call(this);
  this.normal = new box2d.b2Vec2(0, 1);
  this.velocity = new box2d.b2Vec2(0, 0);
  this.gravity = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2BuoyancyController, box2d.b2Controller);
goog.exportSymbol("box2d.b2BuoyancyController", box2d.b2BuoyancyController);
box2d.b2BuoyancyController.prototype.normal = null;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "normal", box2d.b2BuoyancyController.prototype.normal);
box2d.b2BuoyancyController.prototype.offset = 0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "offset", box2d.b2BuoyancyController.prototype.offset);
box2d.b2BuoyancyController.prototype.density = 0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "density", box2d.b2BuoyancyController.prototype.density);
box2d.b2BuoyancyController.prototype.velocity = null;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "velocity", box2d.b2BuoyancyController.prototype.velocity);
box2d.b2BuoyancyController.prototype.linearDrag = 0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "linearDrag", box2d.b2BuoyancyController.prototype.linearDrag);
box2d.b2BuoyancyController.prototype.angularDrag = 0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "angularDrag", box2d.b2BuoyancyController.prototype.angularDrag);
box2d.b2BuoyancyController.prototype.useDensity = !1;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "useDensity", box2d.b2BuoyancyController.prototype.useDensity);
box2d.b2BuoyancyController.prototype.useWorldGravity = !0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "useWorldGravity", box2d.b2BuoyancyController.prototype.useWorldGravity);
box2d.b2BuoyancyController.prototype.gravity = null;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "gravity", box2d.b2BuoyancyController.prototype.gravity);
box2d.b2BuoyancyController.prototype.Step = function() {
  if (this.m_bodyList) {
    this.useWorldGravity && this.gravity.Copy(this.GetWorld().GetGravity());
    for (var a = this.m_bodyList; a; a = a.nextBody) {
      var b = a.body;
      if (!1 != b.IsAwake()) {
        for (var c = new box2d.b2Vec2, e = new box2d.b2Vec2, d = 0, f = 0, g = b.GetFixtureList(); g; g = g.m_next) {
          var h = new box2d.b2Vec2,
            j = g.GetShape().ComputeSubmergedArea(this.normal, this.offset, b.GetTransform(), h),
            d = d + j;
          c.x += j * h.x;
          c.y += j * h.y;
          var i = 0,
            i = this.useDensity ? g.GetDensity() : 1,
            f = f + j * i;
          e.x += j * h.x * i;
          e.y += j * h.y * i
        }
        c.x /= d;
        c.y /= d;
        e.x /= f;
        e.y /= f;
        d < box2d.b2_epsilon || (f = box2d.b2NegV(this.gravity, new box2d.b2Vec2), f.SelfMul(this.density * d), b.ApplyForce(f, e), e = b.GetLinearVelocityFromWorldPoint(c, new box2d.b2Vec2), e.SelfSub(this.velocity), e.SelfMul(-this.linearDrag * d), b.ApplyForce(e, c), b.ApplyTorque(-b.GetInertia() / b.GetMass() * d * b.GetAngularVelocity() * this.angularDrag))
      }
    }
  }
};
goog.exportProperty(box2d.b2BuoyancyController.prototype, "Step", box2d.b2BuoyancyController.prototype.Step);
box2d.b2BuoyancyController.prototype.Draw = function(a) {
  var b = new box2d.b2Vec2,
    c = new box2d.b2Vec2;
  b.x = this.normal.x * this.offset + 100 * this.normal.y;
  b.y = this.normal.y * this.offset - 100 * this.normal.x;
  c.x = this.normal.x * this.offset - 100 * this.normal.y;
  c.y = this.normal.y * this.offset + 100 * this.normal.x;
  var e = new box2d.b2Color(0, 0, 0.8);
  a.DrawSegment(b, c, e)
};
goog.exportProperty(box2d.b2BuoyancyController.prototype, "Draw", box2d.b2BuoyancyController.prototype.Draw);
box2d.b2TensorDampingController = function() {
  box2d.b2Controller.call(this);
  this.T = new box2d.b2Mat22;
  this.maxTimestep = 0
};
goog.inherits(box2d.b2TensorDampingController, box2d.b2Controller);
goog.exportSymbol("box2d.b2TensorDampingController", box2d.b2TensorDampingController);
box2d.b2TensorDampingController.prototype.T = new box2d.b2Mat22;
goog.exportProperty(box2d.b2TensorDampingController.prototype, "T", box2d.b2TensorDampingController.prototype.T);
box2d.b2TensorDampingController.prototype.maxTimestep = 0;
goog.exportProperty(box2d.b2TensorDampingController.prototype, "maxTimestep", box2d.b2TensorDampingController.prototype.maxTimestep);
box2d.b2TensorDampingController.prototype.Step = function(a) {
  a = a.dt;
  if (!(a <= box2d.b2_epsilon)) {
    a > this.maxTimestep && 0 < this.maxTimestep && (a = this.maxTimestep);
    for (var b = this.m_bodyList; b; b = b.nextBody) {
      var c = b.body;
      if (c.IsAwake()) {
        var e = c.GetWorldVector(box2d.b2MulMV(this.T, c.GetLocalVector(c.GetLinearVelocity(), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t1), box2d.b2TensorDampingController.prototype.Step.s_damping);
        c.SetLinearVelocity(box2d.b2AddVV(c.GetLinearVelocity(), box2d.b2MulSV(a, e, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t1))
      }
    }
  }
};
box2d.b2TensorDampingController.prototype.Step.s_damping = new box2d.b2Vec2;
box2d.b2TensorDampingController.prototype.SetAxisAligned = function(a, b) {
  this.T.ex.x = -a;
  this.T.ex.y = 0;
  this.T.ey.x = 0;
  this.T.ey.y = -b;
  this.maxTimestep = 0 < a || 0 < b ? 1 / box2d.b2Max(a, b) : 0
};
box2d.b2DistanceJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_distanceJoint);
  this.localAnchorA = new box2d.b2Vec2;
  this.localAnchorB = new box2d.b2Vec2
};
goog.inherits(box2d.b2DistanceJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2DistanceJointDef", box2d.b2DistanceJointDef);
box2d.b2DistanceJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "localAnchorA", box2d.b2DistanceJointDef.prototype.localAnchorA);
box2d.b2DistanceJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "localAnchorB", box2d.b2DistanceJointDef.prototype.localAnchorB);
box2d.b2DistanceJointDef.prototype.length = 1;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "length", box2d.b2DistanceJointDef.prototype.length);
box2d.b2DistanceJointDef.prototype.frequencyHz = 0;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "frequencyHz", box2d.b2DistanceJointDef.prototype.frequencyHz);
box2d.b2DistanceJointDef.prototype.dampingRatio = 0;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "dampingRatio", box2d.b2DistanceJointDef.prototype.dampingRatio);
box2d.b2DistanceJointDef.prototype.Initialize = function(a, b, c, e) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(e, this.localAnchorB);
  this.length = box2d.b2DistanceVV(c, e);
  this.dampingRatio = this.frequencyHz = 0
};
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "Initialize", box2d.b2DistanceJointDef.prototype.Initialize);
box2d.b2DistanceJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_u = new box2d.b2Vec2;
  this.m_rA = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2;
  this.m_localCenterA = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_qA = new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcA = new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_length = a.length
};
goog.inherits(box2d.b2DistanceJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2DistanceJoint", box2d.b2DistanceJoint);
box2d.b2DistanceJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_frequencyHz", box2d.b2DistanceJoint.prototype.m_frequencyHz);
box2d.b2DistanceJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_dampingRatio", box2d.b2DistanceJoint.prototype.m_dampingRatio);
box2d.b2DistanceJoint.prototype.m_bias = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_bias", box2d.b2DistanceJoint.prototype.m_bias);
box2d.b2DistanceJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_localAnchorA", box2d.b2DistanceJoint.prototype.m_localAnchorA);
box2d.b2DistanceJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_localAnchorB", box2d.b2DistanceJoint.prototype.m_localAnchorB);
box2d.b2DistanceJoint.prototype.m_gamma = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_gamma", box2d.b2DistanceJoint.prototype.m_gamma);
box2d.b2DistanceJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_impulse", box2d.b2DistanceJoint.prototype.m_impulse);
box2d.b2DistanceJoint.prototype.m_length = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_length", box2d.b2DistanceJoint.prototype.m_length);
box2d.b2DistanceJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_indexA", box2d.b2DistanceJoint.prototype.m_indexA);
box2d.b2DistanceJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_indexB", box2d.b2DistanceJoint.prototype.m_indexB);
box2d.b2DistanceJoint.prototype.m_u = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_u", box2d.b2DistanceJoint.prototype.m_u);
box2d.b2DistanceJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_rA", box2d.b2DistanceJoint.prototype.m_rA);
box2d.b2DistanceJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_rB", box2d.b2DistanceJoint.prototype.m_rB);
box2d.b2DistanceJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_localCenterA", box2d.b2DistanceJoint.prototype.m_localCenterA);
box2d.b2DistanceJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_localCenterB", box2d.b2DistanceJoint.prototype.m_localCenterB);
box2d.b2DistanceJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_invMassA", box2d.b2DistanceJoint.prototype.m_invMassA);
box2d.b2DistanceJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_invMassB", box2d.b2DistanceJoint.prototype.m_invMassB);
box2d.b2DistanceJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_invIA", box2d.b2DistanceJoint.prototype.m_invIA);
box2d.b2DistanceJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_invIB", box2d.b2DistanceJoint.prototype.m_invIB);
box2d.b2DistanceJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_mass", box2d.b2DistanceJoint.prototype.m_mass);
box2d.b2DistanceJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_qA", box2d.b2DistanceJoint.prototype.m_qA);
box2d.b2DistanceJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_qB", box2d.b2DistanceJoint.prototype.m_qB);
box2d.b2DistanceJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_lalcA", box2d.b2DistanceJoint.prototype.m_lalcA);
box2d.b2DistanceJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_lalcB", box2d.b2DistanceJoint.prototype.m_lalcB);
box2d.b2DistanceJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetAnchorA", box2d.b2DistanceJoint.prototype.GetAnchorA);
box2d.b2DistanceJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetAnchorB", box2d.b2DistanceJoint.prototype.GetAnchorB);
box2d.b2DistanceJoint.prototype.GetReactionForce = function(a, b) {
  return b.SetXY(a * this.m_impulse * this.m_u.x, a * this.m_impulse * this.m_u.y)
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetReactionForce", box2d.b2DistanceJoint.prototype.GetReactionForce);
box2d.b2DistanceJoint.prototype.GetReactionTorque = function() {
  return 0
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetReactionTorque", box2d.b2DistanceJoint.prototype.GetReactionTorque);
box2d.b2DistanceJoint.prototype.GetLocalAnchorA = function() {
  return this.m_localAnchorA
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetLocalAnchorA", box2d.b2DistanceJoint.prototype.GetLocalAnchorA);
box2d.b2DistanceJoint.prototype.GetLocalAnchorB = function() {
  return this.m_localAnchorB
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetLocalAnchorB", box2d.b2DistanceJoint.prototype.GetLocalAnchorB);
box2d.b2DistanceJoint.prototype.SetLength = function(a) {
  this.m_length = a
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SetLength", box2d.b2DistanceJoint.prototype.SetLength);
box2d.b2DistanceJoint.prototype.GetLength = function() {
  return this.m_length
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetLength", box2d.b2DistanceJoint.prototype.GetLength);
box2d.b2DistanceJoint.prototype.SetFrequency = function(a) {
  this.m_frequencyHz = a
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SetFrequency", box2d.b2DistanceJoint.prototype.SetFrequency);
box2d.b2DistanceJoint.prototype.GetFrequency = function() {
  return this.m_frequencyHz
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetFrequency", box2d.b2DistanceJoint.prototype.GetFrequency);
box2d.b2DistanceJoint.prototype.SetDampingRatio = function(a) {
  this.m_dampingRatio = a
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SetDampingRatio", box2d.b2DistanceJoint.prototype.SetDampingRatio);
box2d.b2DistanceJoint.prototype.GetDampingRatio = function() {
  return this.m_dampingRatio
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetDampingRatio", box2d.b2DistanceJoint.prototype.GetDampingRatio);
box2d.b2DistanceJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2DistanceJointDef*/ var jd = new box2d.b2DistanceJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
    box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
      this.m_localAnchorB.x, this.m_localAnchorB.y);
    box2d.b2Log("  jd.length = %.15f;\n", this.m_length);
    box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
    box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "Dump", box2d.b2DistanceJoint.prototype.Dump);
box2d.b2DistanceJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.velocities[this.m_indexA].v,
    e = a.velocities[this.m_indexA].w,
    d = a.positions[this.m_indexB].c,
    f = a.positions[this.m_indexB].a,
    g = a.velocities[this.m_indexB].v,
    h = a.velocities[this.m_indexB].w,
    j = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
    f = this.m_qB.SetAngleRadians(f);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2MulRV(j, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2MulRV(f, this.m_lalcB, this.m_rB);
  this.m_u.x = d.x + this.m_rB.x - b.x - this.m_rA.x;
  this.m_u.y = d.y + this.m_rB.y -
    b.y - this.m_rA.y;
  d = this.m_u.GetLength();
  d > box2d.b2_linearSlop ? this.m_u.SelfMul(1 / d) : this.m_u.SetZero();
  b = box2d.b2CrossVV(this.m_rA, this.m_u);
  j = box2d.b2CrossVV(this.m_rB, this.m_u);
  b = this.m_invMassA + this.m_invIA * b * b + this.m_invMassB + this.m_invIB * j * j;
  this.m_mass = 0 != b ? 1 / b : 0;
  if (0 < this.m_frequencyHz) {
    var d = d - this.m_length,
      j = 2 * box2d.b2_pi * this.m_frequencyHz,
      f = this.m_mass * j * j,
      i = a.step.dt;
    this.m_gamma = i * (2 * this.m_mass * this.m_dampingRatio * j + i * f);
    this.m_gamma = 0 != this.m_gamma ? 1 / this.m_gamma : 0;
    this.m_bias = d * i * f *
      this.m_gamma;
    b += this.m_gamma;
    this.m_mass = 0 != b ? 1 / b : 0
  } else this.m_bias = this.m_gamma = 0;
  a.step.warmStarting ? (this.m_impulse *= a.step.dtRatio, b = box2d.b2MulSV(this.m_impulse, this.m_u, box2d.b2DistanceJoint.prototype.InitVelocityConstraints.s_P), c.SelfMulSub(this.m_invMassA, b), e -= this.m_invIA * box2d.b2CrossVV(this.m_rA, b), g.SelfMulAdd(this.m_invMassB, b), h += this.m_invIB * box2d.b2CrossVV(this.m_rB, b)) : this.m_impulse = 0;
  a.velocities[this.m_indexA].w = e;
  a.velocities[this.m_indexB].w = h
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "InitVelocityConstraints", box2d.b2DistanceJoint.prototype.InitVelocityConstraints);
box2d.b2DistanceJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpA),
    g = box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpB),
    f = box2d.b2DotVV(this.m_u, box2d.b2SubVV(g, f, box2d.b2Vec2.s_t0)),
    f = -this.m_mass * (f + this.m_bias + this.m_gamma *
      this.m_impulse);
  this.m_impulse += f;
  f = box2d.b2MulSV(f, this.m_u, box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_P);
  b.SelfMulSub(this.m_invMassA, f);
  c -= this.m_invIA * box2d.b2CrossVV(this.m_rA, f);
  e.SelfMulAdd(this.m_invMassB, f);
  d += this.m_invIB * box2d.b2CrossVV(this.m_rB, f);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SolveVelocityConstraints", box2d.b2DistanceJoint.prototype.SolveVelocityConstraints);
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2;
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2;
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2DistanceJoint.prototype.SolvePositionConstraints = function(a) {
  if (0 < this.m_frequencyHz) return !0;
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.positions[this.m_indexB].c,
    d = a.positions[this.m_indexB].a;
  this.m_qA.SetAngleRadians(c);
  this.m_qB.SetAngleRadians(d);
  var f = box2d.b2MulRV(this.m_qA, this.m_lalcA, this.m_rA),
    g = box2d.b2MulRV(this.m_qB, this.m_lalcB, this.m_rB),
    h = this.m_u;
  h.x = e.x + g.x - b.x - f.x;
  h.y = e.y + g.y - b.y - f.y;
  var j = this.m_u.Normalize() - this.m_length,
    j = box2d.b2Clamp(j, -box2d.b2_maxLinearCorrection, box2d.b2_maxLinearCorrection),
    h = box2d.b2MulSV(-this.m_mass * j, h, box2d.b2DistanceJoint.prototype.SolvePositionConstraints.s_P);
  b.SelfMulSub(this.m_invMassA, h);
  c -= this.m_invIA * box2d.b2CrossVV(f, h);
  e.SelfMulAdd(this.m_invMassB, h);
  d += this.m_invIB * box2d.b2CrossVV(g, h);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = d;
  return box2d.b2Abs(j) < box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SolvePositionConstraints", box2d.b2DistanceJoint.prototype.SolvePositionConstraints);
box2d.b2DistanceJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2FrictionJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_frictionJoint);
  this.localAnchorA = new box2d.b2Vec2;
  this.localAnchorB = new box2d.b2Vec2
};
goog.inherits(box2d.b2FrictionJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2FrictionJointDef", box2d.b2FrictionJointDef);
box2d.b2FrictionJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "localAnchorA", box2d.b2FrictionJointDef.prototype.localAnchorA);
box2d.b2FrictionJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "localAnchorB", box2d.b2FrictionJointDef.prototype.localAnchorB);
box2d.b2FrictionJointDef.prototype.maxForce = 0;
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "maxForce", box2d.b2FrictionJointDef.prototype.maxForce);
box2d.b2FrictionJointDef.prototype.maxTorque = 0;
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "maxTorque", box2d.b2FrictionJointDef.prototype.maxTorque);
box2d.b2FrictionJointDef.prototype.Initialize = function(a, b, c) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB)
};
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "Initialize", box2d.b2FrictionJointDef.prototype.Initialize);
box2d.b2FrictionJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_linearImpulse = (new box2d.b2Vec2).SetZero();
  this.m_maxForce = a.maxForce;
  this.m_maxTorque = a.maxTorque;
  this.m_rA = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2;
  this.m_localCenterA = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_linearMass = (new box2d.b2Mat22).SetZero();
  this.m_qA = new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcA = new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_K = new box2d.b2Mat22
};
goog.inherits(box2d.b2FrictionJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2FrictionJoint", box2d.b2FrictionJoint);
box2d.b2FrictionJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_localAnchorA", box2d.b2FrictionJoint.prototype.m_localAnchorA);
box2d.b2FrictionJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_localAnchorB", box2d.b2FrictionJoint.prototype.m_localAnchorB);
box2d.b2FrictionJoint.prototype.m_linearImpulse = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_linearImpulse", box2d.b2FrictionJoint.prototype.m_linearImpulse);
box2d.b2FrictionJoint.prototype.m_angularImpulse = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_angularImpulse", box2d.b2FrictionJoint.prototype.m_angularImpulse);
box2d.b2FrictionJoint.prototype.m_maxForce = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_maxForce", box2d.b2FrictionJoint.prototype.m_maxForce);
box2d.b2FrictionJoint.prototype.m_maxTorque = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_maxTorque", box2d.b2FrictionJoint.prototype.m_maxTorque);
box2d.b2FrictionJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_indexA", box2d.b2FrictionJoint.prototype.m_indexA);
box2d.b2FrictionJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_indexB", box2d.b2FrictionJoint.prototype.m_indexB);
box2d.b2FrictionJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_rA", box2d.b2FrictionJoint.prototype.m_rA);
box2d.b2FrictionJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_rB", box2d.b2FrictionJoint.prototype.m_rB);
box2d.b2FrictionJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_localCenterA", box2d.b2FrictionJoint.prototype.m_localCenterA);
box2d.b2FrictionJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_localCenterB", box2d.b2FrictionJoint.prototype.m_localCenterB);
box2d.b2FrictionJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_invMassA", box2d.b2FrictionJoint.prototype.m_invMassA);
box2d.b2FrictionJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_invMassB", box2d.b2FrictionJoint.prototype.m_invMassB);
box2d.b2FrictionJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_invIA", box2d.b2FrictionJoint.prototype.m_invIA);
box2d.b2FrictionJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_invIB", box2d.b2FrictionJoint.prototype.m_invIB);
box2d.b2FrictionJoint.prototype.m_linearMass = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_linearMass", box2d.b2FrictionJoint.prototype.m_linearMass);
box2d.b2FrictionJoint.prototype.m_angularMass = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_angularMass", box2d.b2FrictionJoint.prototype.m_angularMass);
box2d.b2FrictionJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_qA", box2d.b2FrictionJoint.prototype.m_qA);
box2d.b2FrictionJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_qB", box2d.b2FrictionJoint.prototype.m_qB);
box2d.b2FrictionJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_lalcA", box2d.b2FrictionJoint.prototype.m_lalcA);
box2d.b2FrictionJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_lalcB", box2d.b2FrictionJoint.prototype.m_lalcB);
box2d.b2FrictionJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_K", box2d.b2FrictionJoint.prototype.m_K);
box2d.b2FrictionJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.positions[this.m_indexB].a,
    d = a.velocities[this.m_indexB].v,
    f = a.velocities[this.m_indexB].w,
    g = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
    e = this.m_qB.SetAngleRadians(e);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  g = box2d.b2MulRV(g, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var h = box2d.b2MulRV(e, this.m_lalcB, this.m_rB),
    e = this.m_invMassA,
    j = this.m_invMassB,
    i = this.m_invIA,
    k = this.m_invIB,
    l = this.m_K;
  l.ex.x = e + j + i * g.y * g.y + k * h.y * h.y;
  l.ex.y = -i * g.x * g.y -
    k * h.x * h.y;
  l.ey.x = l.ex.y;
  l.ey.y = e + j + i * g.x * g.x + k * h.x * h.x;
  l.GetInverse(this.m_linearMass);
  this.m_angularMass = i + k;
  0 < this.m_angularMass && (this.m_angularMass = 1 / this.m_angularMass);
  a.step.warmStarting ? (this.m_linearImpulse.SelfMul(a.step.dtRatio), this.m_angularImpulse *= a.step.dtRatio, g = this.m_linearImpulse, b.SelfMulSub(e, g), c -= i * (box2d.b2CrossVV(this.m_rA, g) + this.m_angularImpulse), d.SelfMulAdd(j, g), f += k * (box2d.b2CrossVV(this.m_rB, g) + this.m_angularImpulse)) : (this.m_linearImpulse.SetZero(), this.m_angularImpulse =
    0);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = f
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "InitVelocityConstraints", box2d.b2FrictionJoint.prototype.InitVelocityConstraints);
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    j = this.m_invIB,
    i = a.step.dt,
    k, l = -this.m_angularMass * (d - c),
    m = this.m_angularImpulse;
  k = i * this.m_maxTorque;
  this.m_angularImpulse = box2d.b2Clamp(this.m_angularImpulse + l, -k, k);
  l = this.m_angularImpulse - m;
  c -= h * l;
  d += j * l;
  k = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB,
    box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1), box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_Cdot);
  l = box2d.b2MulMV(this.m_linearMass, k, box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_impulseV).SelfNeg();
  m = box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_oldImpulseV.Copy(this.m_linearImpulse);
  this.m_linearImpulse.SelfAdd(l);
  k = i * this.m_maxForce;
  this.m_linearImpulse.GetLengthSquared() > k * k && (this.m_linearImpulse.Normalize(), this.m_linearImpulse.SelfMul(k));
  box2d.b2SubVV(this.m_linearImpulse, m, l);
  b.SelfMulSub(f, l);
  c -= h * box2d.b2CrossVV(this.m_rA, l);
  e.SelfMulAdd(g, l);
  d += j * box2d.b2CrossVV(this.m_rB, l);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "SolveVelocityConstraints", box2d.b2FrictionJoint.prototype.SolveVelocityConstraints);
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2;
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_impulseV = new box2d.b2Vec2;
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_oldImpulseV = new box2d.b2Vec2;
box2d.b2FrictionJoint.prototype.SolvePositionConstraints = function() {
  return !0
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "SolvePositionConstraints", box2d.b2FrictionJoint.prototype.SolvePositionConstraints);
box2d.b2FrictionJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetAnchorA", box2d.b2FrictionJoint.prototype.GetAnchorA);
box2d.b2FrictionJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetAnchorB", box2d.b2FrictionJoint.prototype.GetAnchorB);
box2d.b2FrictionJoint.prototype.GetReactionForce = function(a, b) {
  return b.SetXY(a * this.m_linearImpulse.x, a * this.m_linearImpulse.y)
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetReactionForce", box2d.b2FrictionJoint.prototype.GetReactionForce);
box2d.b2FrictionJoint.prototype.GetReactionTorque = function(a) {
  return a * this.m_angularImpulse
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetReactionTorque", box2d.b2FrictionJoint.prototype.GetReactionTorque);
box2d.b2FrictionJoint.prototype.GetLocalAnchorA = function() {
  return this.m_localAnchorA
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetLocalAnchorA", box2d.b2FrictionJoint.prototype.GetLocalAnchorA);
box2d.b2FrictionJoint.prototype.GetLocalAnchorB = function() {
  return this.m_localAnchorB
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetLocalAnchorB", box2d.b2FrictionJoint.prototype.GetLocalAnchorB);
box2d.b2FrictionJoint.prototype.SetMaxForce = function(a) {
  this.m_maxForce = a
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "SetMaxForce", box2d.b2FrictionJoint.prototype.SetMaxForce);
box2d.b2FrictionJoint.prototype.GetMaxForce = function() {
  return this.m_maxForce
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetMaxForce", box2d.b2FrictionJoint.prototype.GetMaxForce);
box2d.b2FrictionJoint.prototype.SetMaxTorque = function(a) {
  this.m_maxTorque = a
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "SetMaxTorque", box2d.b2FrictionJoint.prototype.SetMaxTorque);
box2d.b2FrictionJoint.prototype.GetMaxTorque = function() {
  return this.m_maxTorque
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetMaxTorque", box2d.b2FrictionJoint.prototype.GetMaxTorque);
box2d.b2FrictionJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2FrictionJointDef*/ var jd = new box2d.b2FrictionJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
    box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
      this.m_localAnchorB.x, this.m_localAnchorB.y);
    box2d.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
    box2d.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "Dump", box2d.b2FrictionJoint.prototype.Dump);









box2d.b2MouseJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_mouseJoint);
  this.target = new box2d.b2Vec2
};
goog.inherits(box2d.b2MouseJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2MouseJointDef", box2d.b2MouseJointDef);

box2d.b2MouseJointDef.prototype.target = null;
goog.exportProperty(box2d.b2MouseJointDef.prototype, "target", box2d.b2MouseJointDef.prototype.target);
box2d.b2MouseJointDef.prototype.maxForce = 0;
goog.exportProperty(box2d.b2MouseJointDef.prototype, "maxForce", box2d.b2MouseJointDef.prototype.maxForce);
box2d.b2MouseJointDef.prototype.frequencyHz = 5;
goog.exportProperty(box2d.b2MouseJointDef.prototype, "frequencyHz", box2d.b2MouseJointDef.prototype.frequencyHz);
box2d.b2MouseJointDef.prototype.dampingRatio = 0.7;
goog.exportProperty(box2d.b2MouseJointDef.prototype, "dampingRatio", box2d.b2MouseJointDef.prototype.dampingRatio);

box2d.b2MouseJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorB = new box2d.b2Vec2;
  this.m_targetA = new box2d.b2Vec2;
  this.m_impulse = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_mass = new box2d.b2Mat22;
  this.m_C = new box2d.b2Vec2;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_K = new box2d.b2Mat22;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.target.IsValid());
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.maxForce) && 0 <= a.maxForce);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.frequencyHz) && 0 <= a.frequencyHz);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.dampingRatio) && 0 <= a.dampingRatio);
  this.m_targetA.Copy(a.target);
  box2d.b2MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
  this.m_maxForce = a.maxForce;
  this.m_impulse.SetZero();
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_gamma = this.m_beta = 0
};
goog.inherits(box2d.b2MouseJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2MouseJoint", box2d.b2MouseJoint);
box2d.b2MouseJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_localAnchorB", box2d.b2MouseJoint.prototype.m_localAnchorB);
box2d.b2MouseJoint.prototype.m_targetA = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_targetA", box2d.b2MouseJoint.prototype.m_targetA);
box2d.b2MouseJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_frequencyHz", box2d.b2MouseJoint.prototype.m_frequencyHz);
box2d.b2MouseJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_dampingRatio", box2d.b2MouseJoint.prototype.m_dampingRatio);
box2d.b2MouseJoint.prototype.m_beta = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_beta", box2d.b2MouseJoint.prototype.m_beta);
box2d.b2MouseJoint.prototype.m_impulse = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_impulse", box2d.b2MouseJoint.prototype.m_impulse);
box2d.b2MouseJoint.prototype.m_maxForce = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_maxForce", box2d.b2MouseJoint.prototype.m_maxForce);
box2d.b2MouseJoint.prototype.m_gamma = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_gamma", box2d.b2MouseJoint.prototype.m_gamma);
box2d.b2MouseJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_indexA", box2d.b2MouseJoint.prototype.m_indexA);
box2d.b2MouseJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_indexB", box2d.b2MouseJoint.prototype.m_indexB);
box2d.b2MouseJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_rB", box2d.b2MouseJoint.prototype.m_rB);
box2d.b2MouseJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_localCenterB", box2d.b2MouseJoint.prototype.m_localCenterB);
box2d.b2MouseJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_invMassB", box2d.b2MouseJoint.prototype.m_invMassB);
box2d.b2MouseJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_invIB", box2d.b2MouseJoint.prototype.m_invIB);
box2d.b2MouseJoint.prototype.m_mass = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_mass", box2d.b2MouseJoint.prototype.m_mass);
box2d.b2MouseJoint.prototype.m_C = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_C", box2d.b2MouseJoint.prototype.m_C);
box2d.b2MouseJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_qB", box2d.b2MouseJoint.prototype.m_qB);
box2d.b2MouseJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_lalcB", box2d.b2MouseJoint.prototype.m_lalcB);
box2d.b2MouseJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_K", box2d.b2MouseJoint.prototype.m_K);
box2d.b2MouseJoint.prototype.SetTarget = function(a) {
  !1 == this.m_bodyB.IsAwake() && this.m_bodyB.SetAwake(!0);
  this.m_targetA.Copy(a)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SetTarget", box2d.b2MouseJoint.prototype.SetTarget);
box2d.b2MouseJoint.prototype.GetTarget = function() {
  return this.m_targetA
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetTarget", box2d.b2MouseJoint.prototype.GetTarget);
box2d.b2MouseJoint.prototype.SetMaxForce = function(a) {
  this.m_maxForce = a
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SetMaxForce", box2d.b2MouseJoint.prototype.SetMaxForce);
box2d.b2MouseJoint.prototype.GetMaxForce = function() {
  return this.m_maxForce
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetMaxForce", box2d.b2MouseJoint.prototype.GetMaxForce);
box2d.b2MouseJoint.prototype.SetFrequency = function(a) {
  this.m_frequencyHz = a
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SetFrequency", box2d.b2MouseJoint.prototype.SetFrequency);
box2d.b2MouseJoint.prototype.GetFrequency = function() {
  return this.m_frequencyHz
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetFrequency", box2d.b2MouseJoint.prototype.GetFrequency);
box2d.b2MouseJoint.prototype.SetDampingRatio = function(a) {
  this.m_dampingRatio = a
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SetDampingRatio", box2d.b2MouseJoint.prototype.SetDampingRatio);
box2d.b2MouseJoint.prototype.GetDampingRatio = function() {
  return this.m_dampingRatio
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetDampingRatio", box2d.b2MouseJoint.prototype.GetDampingRatio);
box2d.b2MouseJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexB].c,
    c = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    d = this.m_qB.SetAngleRadians(a.positions[this.m_indexB].a),
    f = this.m_bodyB.GetMass(),
    g = 2 * box2d.b2_pi * this.m_frequencyHz,
    h = 2 * f * this.m_dampingRatio * g,
    f = f * g * g,
    g = a.step.dt;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(h + g * f > box2d.b2_epsilon);
  this.m_gamma = g * (h + g * f);
  0 != this.m_gamma && (this.m_gamma = 1 / this.m_gamma);
  this.m_beta = g * f * this.m_gamma;
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2MulRV(d, this.m_lalcB, this.m_rB);
  d = this.m_K;
  d.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma;
  d.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
  d.ey.x = d.ex.y;
  d.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma;
  d.GetInverse(this.m_mass);
  this.m_C.x = b.x + this.m_rB.x - this.m_targetA.x;
  this.m_C.y = b.y + this.m_rB.y - this.m_targetA.y;
  this.m_C.SelfMul(this.m_beta);
  e *= 0.98;
  a.step.warmStarting ? (this.m_impulse.SelfMul(a.step.dtRatio), c.x += this.m_invMassB * this.m_impulse.x, c.y += this.m_invMassB * this.m_impulse.y, e += this.m_invIB * box2d.b2CrossVV(this.m_rB, this.m_impulse)) : this.m_impulse.SetZero();
  a.velocities[this.m_indexB].w = e
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "InitVelocityConstraints", box2d.b2MouseJoint.prototype.InitVelocityConstraints);
box2d.b2MouseJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexB].v,
    c = a.velocities[this.m_indexB].w,
    e = box2d.b2AddVCrossSV(b, c, this.m_rB, box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_Cdot),
    e = box2d.b2MulMV(this.m_mass, box2d.b2AddVV(e, box2d.b2AddVV(this.m_C, box2d.b2MulSV(this.m_gamma, this.m_impulse, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0).SelfNeg(), box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_impulse),
    d = box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_oldImpulse.Copy(this.m_impulse);
  this.m_impulse.SelfAdd(e);
  var f = a.step.dt * this.m_maxForce;
  this.m_impulse.GetLengthSquared() > f * f && this.m_impulse.SelfMul(f / this.m_impulse.GetLength());
  box2d.b2SubVV(this.m_impulse, d, e);
  b.SelfMulAdd(this.m_invMassB, e);
  c += this.m_invIB * box2d.b2CrossVV(this.m_rB, e);
  a.velocities[this.m_indexB].w = c
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SolveVelocityConstraints", box2d.b2MouseJoint.prototype.SolveVelocityConstraints);
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2;
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec2;
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_oldImpulse = new box2d.b2Vec2;
box2d.b2MouseJoint.prototype.SolvePositionConstraints = function() {
  return !0
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SolvePositionConstraints", box2d.b2MouseJoint.prototype.SolvePositionConstraints);
box2d.b2MouseJoint.prototype.GetAnchorA = function(a) {
  return a.Copy(this.m_targetA)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetAnchorA", box2d.b2MouseJoint.prototype.GetAnchorA);
box2d.b2MouseJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetAnchorB", box2d.b2MouseJoint.prototype.GetAnchorB);
box2d.b2MouseJoint.prototype.GetReactionForce = function(a, b) {
  return box2d.b2MulSV(a, this.m_impulse, b)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetReactionForce", box2d.b2MouseJoint.prototype.GetReactionForce);
box2d.b2MouseJoint.prototype.GetReactionTorque = function() {
  return 0
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetReactionTorque", box2d.b2MouseJoint.prototype.GetReactionTorque);
box2d.b2MouseJoint.prototype.Dump = function() {
  box2d.DEBUG && box2d.b2Log("Mouse joint dumping is not supported.\n")
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "Dump", box2d.b2MouseJoint.prototype.Dump);
box2d.b2MouseJoint.prototype.ShiftOrigin = function(a) {
  this.m_targetA.SelfSub(a)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "ShiftOrigin", box2d.b2MouseJoint.prototype.ShiftOrigin);















box2d.b2ConstantForceController = function() {
  box2d.b2Controller.call(this);
  this.F = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2ConstantForceController, box2d.b2Controller);
goog.exportSymbol("box2d.b2ConstantForceController", box2d.b2ConstantForceController);
box2d.b2ConstantAccelController.prototype.F = null;
goog.exportProperty(box2d.b2ConstantAccelController.prototype, "F", box2d.b2ConstantAccelController.prototype.F);
box2d.b2ConstantForceController.prototype.Step = function() {
  for (var a = this.m_bodyList; a; a = a.nextBody) {
    var b = a.body;
    b.IsAwake() && b.ApplyForce(this.F, b.GetWorldCenter())
  }
};
goog.exportProperty(box2d.b2ConstantForceController.prototype, "Step", box2d.b2ConstantForceController.prototype.Step);
box2d.b2_minPulleyLength = 2;
goog.exportSymbol("box2d.b2_minPulleyLength", box2d.b2_minPulleyLength);
box2d.b2PulleyJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_pulleyJoint);
  this.collideConnected = !0;
  this.groundAnchorA = new box2d.b2Vec2(-1, 1);
  this.groundAnchorB = new box2d.b2Vec2(1, 1);
  this.localAnchorA = new box2d.b2Vec2(-1, 0);
  this.localAnchorB = new box2d.b2Vec2(1, 0)
};
goog.inherits(box2d.b2PulleyJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2PulleyJointDef", box2d.b2PulleyJointDef);
box2d.b2PulleyJointDef.prototype.groundAnchorA = null;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "groundAnchorA", box2d.b2PulleyJointDef.prototype.groundAnchorA);
box2d.b2PulleyJointDef.prototype.groundAnchorB = null;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "groundAnchorB", box2d.b2PulleyJointDef.prototype.groundAnchorB);
box2d.b2PulleyJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "localAnchorA", box2d.b2PulleyJointDef.prototype.localAnchorA);
box2d.b2PulleyJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "localAnchorB", box2d.b2PulleyJointDef.prototype.localAnchorB);
box2d.b2PulleyJointDef.prototype.lengthA = 0;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "lengthA", box2d.b2PulleyJointDef.prototype.lengthA);
box2d.b2PulleyJointDef.prototype.lengthB = 0;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "lengthB", box2d.b2PulleyJointDef.prototype.lengthB);
box2d.b2PulleyJointDef.prototype.ratio = 1;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "ratio", box2d.b2PulleyJointDef.prototype.ratio);
box2d.b2PulleyJointDef.prototype.Initialize = function(a, b, c, e, d, f, g) {
  this.bodyA = a;
  this.bodyB = b;
  this.groundAnchorA.Copy(c);
  this.groundAnchorB.Copy(e);
  this.bodyA.GetLocalPoint(d, this.localAnchorA);
  this.bodyB.GetLocalPoint(f, this.localAnchorB);
  this.lengthA = box2d.b2DistanceVV(d, c);
  this.lengthB = box2d.b2DistanceVV(f, e);
  this.ratio = g;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.ratio > box2d.b2_epsilon)
};
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "Initialize", box2d.b2PulleyJointDef.prototype.Initialize);
box2d.b2PulleyJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_groundAnchorA = new box2d.b2Vec2;
  this.m_groundAnchorB = new box2d.b2Vec2;
  this.m_localAnchorA = new box2d.b2Vec2;
  this.m_localAnchorB = new box2d.b2Vec2;
  this.m_uA = new box2d.b2Vec2;
  this.m_uB = new box2d.b2Vec2;
  this.m_rA = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2;
  this.m_localCenterA = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_qA = new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcA = new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_groundAnchorA.Copy(a.groundAnchorA);
  this.m_groundAnchorB.Copy(a.groundAnchorB);
  this.m_localAnchorA.Copy(a.localAnchorA);
  this.m_localAnchorB.Copy(a.localAnchorB);
  this.m_lengthA = a.lengthA;
  this.m_lengthB = a.lengthB;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 != a.ratio);
  this.m_ratio = a.ratio;
  this.m_constant = a.lengthA + this.m_ratio * a.lengthB;
  this.m_impulse = 0
};
goog.inherits(box2d.b2PulleyJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2PulleyJoint", box2d.b2PulleyJoint);
box2d.b2PulleyJoint.prototype.m_groundAnchorA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_groundAnchorA", box2d.b2PulleyJoint.prototype.m_groundAnchorA);
box2d.b2PulleyJoint.prototype.m_groundAnchorB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_groundAnchorB", box2d.b2PulleyJoint.prototype.m_groundAnchorB);
box2d.b2PulleyJoint.prototype.m_lengthA = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_lengthA", box2d.b2PulleyJoint.prototype.m_lengthA);
box2d.b2PulleyJoint.prototype.m_lengthB = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_lengthB", box2d.b2PulleyJoint.prototype.m_lengthB);
box2d.b2PulleyJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_localAnchorA", box2d.b2PulleyJoint.prototype.m_localAnchorA);
box2d.b2PulleyJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_localAnchorB", box2d.b2PulleyJoint.prototype.m_localAnchorB);
box2d.b2PulleyJoint.prototype.m_constant = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_constant", box2d.b2PulleyJoint.prototype.m_constant);
box2d.b2PulleyJoint.prototype.m_ratio = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_ratio", box2d.b2PulleyJoint.prototype.m_ratio);
box2d.b2PulleyJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_impulse", box2d.b2PulleyJoint.prototype.m_impulse);
box2d.b2PulleyJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_indexA", box2d.b2PulleyJoint.prototype.m_indexA);
box2d.b2PulleyJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_indexB", box2d.b2PulleyJoint.prototype.m_indexB);
box2d.b2PulleyJoint.prototype.m_uA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_uA", box2d.b2PulleyJoint.prototype.m_uA);
box2d.b2PulleyJoint.prototype.m_uB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_uB", box2d.b2PulleyJoint.prototype.m_uB);
box2d.b2PulleyJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_rA", box2d.b2PulleyJoint.prototype.m_rA);
box2d.b2PulleyJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_rB", box2d.b2PulleyJoint.prototype.m_rB);
box2d.b2PulleyJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_localCenterA", box2d.b2PulleyJoint.prototype.m_localCenterA);
box2d.b2PulleyJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_localCenterB", box2d.b2PulleyJoint.prototype.m_localCenterB);
box2d.b2PulleyJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_invMassA", box2d.b2PulleyJoint.prototype.m_invMassA);
box2d.b2PulleyJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_invMassB", box2d.b2PulleyJoint.prototype.m_invMassB);
box2d.b2PulleyJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_invIA", box2d.b2PulleyJoint.prototype.m_invIA);
box2d.b2PulleyJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_invIB", box2d.b2PulleyJoint.prototype.m_invIB);
box2d.b2PulleyJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_mass", box2d.b2PulleyJoint.prototype.m_mass);
box2d.b2PulleyJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_qA", box2d.b2PulleyJoint.prototype.m_qA);
box2d.b2PulleyJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_qB", box2d.b2PulleyJoint.prototype.m_qB);
box2d.b2PulleyJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_lalcA", box2d.b2PulleyJoint.prototype.m_lalcA);
box2d.b2PulleyJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_lalcB", box2d.b2PulleyJoint.prototype.m_lalcB);
box2d.b2PulleyJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.velocities[this.m_indexA].v,
    e = a.velocities[this.m_indexA].w,
    d = a.positions[this.m_indexB].c,
    f = a.positions[this.m_indexB].a,
    g = a.velocities[this.m_indexB].v,
    h = a.velocities[this.m_indexB].w,
    j = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
    f = this.m_qB.SetAngleRadians(f);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2MulRV(j, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2MulRV(f, this.m_lalcB, this.m_rB);
  this.m_uA.Copy(b).SelfAdd(this.m_rA).SelfSub(this.m_groundAnchorA);
  this.m_uB.Copy(d).SelfAdd(this.m_rB).SelfSub(this.m_groundAnchorB);
  b = this.m_uA.GetLength();
  d = this.m_uB.GetLength();
  b > 10 * box2d.b2_linearSlop ? this.m_uA.SelfMul(1 / b) : this.m_uA.SetZero();
  d > 10 * box2d.b2_linearSlop ? this.m_uB.SelfMul(1 / d) : this.m_uB.SetZero();
  b = box2d.b2CrossVV(this.m_rA, this.m_uA);
  d = box2d.b2CrossVV(this.m_rB, this.m_uB);
  this.m_mass = this.m_invMassA + this.m_invIA * b * b + this.m_ratio * this.m_ratio * (this.m_invMassB + this.m_invIB * d * d);
  0 < this.m_mass && (this.m_mass = 1 / this.m_mass);
  a.step.warmStarting ? (this.m_impulse *= a.step.dtRatio, b = box2d.b2MulSV(-this.m_impulse, this.m_uA,
    box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PA), d = box2d.b2MulSV(-this.m_ratio * this.m_impulse, this.m_uB, box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PB), c.SelfMulAdd(this.m_invMassA, b), e += this.m_invIA * box2d.b2CrossVV(this.m_rA, b), g.SelfMulAdd(this.m_invMassB, d), h += this.m_invIB * box2d.b2CrossVV(this.m_rB, d)) : this.m_impulse = 0;
  a.velocities[this.m_indexA].w = e;
  a.velocities[this.m_indexB].w = h
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "InitVelocityConstraints", box2d.b2PulleyJoint.prototype.InitVelocityConstraints);
box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PA = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PB = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpA),
    g = box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpB),
    f = -box2d.b2DotVV(this.m_uA, f) - this.m_ratio * box2d.b2DotVV(this.m_uB, g),
    g = -this.m_mass * f;
  this.m_impulse += g;
  f =
    box2d.b2MulSV(-g, this.m_uA, box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PA);
  g = box2d.b2MulSV(-this.m_ratio * g, this.m_uB, box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PB);
  b.SelfMulAdd(this.m_invMassA, f);
  c += this.m_invIA * box2d.b2CrossVV(this.m_rA, f);
  e.SelfMulAdd(this.m_invMassB, g);
  d += this.m_invIB * box2d.b2CrossVV(this.m_rB, g);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "SolveVelocityConstraints", box2d.b2PulleyJoint.prototype.SolveVelocityConstraints);
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PA = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PB = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolvePositionConstraints = function(a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.positions[this.m_indexB].c,
    d = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngleRadians(c),
    g = this.m_qB.SetAngleRadians(d);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  f = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var g = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
    h = this.m_uA.Copy(b).SelfAdd(f).SelfSub(this.m_groundAnchorA),
    j = this.m_uB.Copy(e).SelfAdd(g).SelfSub(this.m_groundAnchorB),
    i = h.GetLength(),
    k = j.GetLength();
  i > 10 * box2d.b2_linearSlop ? h.SelfMul(1 / i) : h.SetZero();
  k > 10 * box2d.b2_linearSlop ? j.SelfMul(1 / k) : j.SetZero();
  var l = box2d.b2CrossVV(f, h),
    m = box2d.b2CrossVV(g, j),
    l = this.m_invMassA + this.m_invIA * l * l + this.m_ratio * this.m_ratio * (this.m_invMassB + this.m_invIB * m * m);
  0 < l && (l = 1 / l);
  k = this.m_constant - i - this.m_ratio * k;
  i = box2d.b2Abs(k);
  k *= -l;
  h = box2d.b2MulSV(-k, h, box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PA);
  j = box2d.b2MulSV(-this.m_ratio *
    k, j, box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PB);
  b.SelfMulAdd(this.m_invMassA, h);
  c += this.m_invIA * box2d.b2CrossVV(f, h);
  e.SelfMulAdd(this.m_invMassB, j);
  d += this.m_invIB * box2d.b2CrossVV(g, j);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = d;
  return i < box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "SolvePositionConstraints", box2d.b2PulleyJoint.prototype.SolvePositionConstraints);
box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PA = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PB = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetAnchorA", box2d.b2PulleyJoint.prototype.GetAnchorA);
box2d.b2PulleyJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetAnchorB", box2d.b2PulleyJoint.prototype.GetAnchorB);
box2d.b2PulleyJoint.prototype.GetReactionForce = function(a, b) {
  return b.SetXY(a * this.m_impulse * this.m_uB.x, a * this.m_impulse * this.m_uB.y)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetReactionForce", box2d.b2PulleyJoint.prototype.GetReactionForce);
box2d.b2PulleyJoint.prototype.GetReactionTorque = function() {
  return 0
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetReactionTorque", box2d.b2PulleyJoint.prototype.GetReactionTorque);
box2d.b2PulleyJoint.prototype.GetGroundAnchorA = function() {
  return this.m_groundAnchorA
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetGroundAnchorA", box2d.b2PulleyJoint.prototype.GetGroundAnchorA);
box2d.b2PulleyJoint.prototype.GetGroundAnchorB = function() {
  return this.m_groundAnchorB
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetGroundAnchorB", box2d.b2PulleyJoint.prototype.GetGroundAnchorB);
box2d.b2PulleyJoint.prototype.GetLengthA = function() {
  return this.m_lengthA
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetLengthA", box2d.b2PulleyJoint.prototype.GetLengthA);
box2d.b2PulleyJoint.prototype.GetLengthB = function() {
  return this.m_lengthB
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetLengthB", box2d.b2PulleyJoint.prototype.GetLengthB);
box2d.b2PulleyJoint.prototype.GetRatio = function() {
  return this.m_ratio
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetRatio", box2d.b2PulleyJoint.prototype.GetRatio);
box2d.b2PulleyJoint.prototype.GetCurrentLengthA = function() {
  var a = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, box2d.b2PulleyJoint.prototype.GetCurrentLengthA.s_p);
  return box2d.b2DistanceVV(a, this.m_groundAnchorA)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetCurrentLengthA", box2d.b2PulleyJoint.prototype.GetCurrentLengthA);
box2d.b2PulleyJoint.prototype.GetCurrentLengthA.s_p = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.GetCurrentLengthB = function() {
  var a = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, box2d.b2PulleyJoint.prototype.GetCurrentLengthB.s_p);
  return box2d.b2DistanceVV(a, this.m_groundAnchorB)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetCurrentLengthB", box2d.b2PulleyJoint.prototype.GetCurrentLengthB);
box2d.b2PulleyJoint.prototype.GetCurrentLengthB.s_p = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2PulleyJointDef*/ var jd = new box2d.b2PulleyJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.groundAnchorA.SetXY(%.15f, %.15f);\n", this.m_groundAnchorA.x, this.m_groundAnchorA.y);
    box2d.b2Log("  jd.groundAnchorB.SetXY(%.15f, %.15f);\n",
      this.m_groundAnchorB.x, this.m_groundAnchorB.y);
    box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
    box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
    box2d.b2Log("  jd.lengthA = %.15f;\n", this.m_lengthA);
    box2d.b2Log("  jd.lengthB = %.15f;\n", this.m_lengthB);
    box2d.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "Dump", box2d.b2PulleyJoint.prototype.Dump);
box2d.b2PulleyJoint.prototype.ShiftOrigin = function(a) {
  this.m_groundAnchorA.SelfSub(a);
  this.m_groundAnchorB.SelfSub(a)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "ShiftOrigin", box2d.b2PulleyJoint.prototype.ShiftOrigin);
box2d.b2CircleShape = function(a) {
  box2d.b2Shape.call(this, box2d.b2ShapeType.e_circleShape, a || 0);
  this.m_p = new box2d.b2Vec2
};
goog.inherits(box2d.b2CircleShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2CircleShape", box2d.b2CircleShape);
box2d.b2CircleShape.prototype.m_p = null;
goog.exportProperty(box2d.b2CircleShape.prototype, "m_p", box2d.b2CircleShape.prototype.m_p);
box2d.b2CircleShape.prototype.Clone = function() {
  return (new box2d.b2CircleShape).Copy(this)
};
goog.exportProperty(box2d.b2CircleShape.prototype, "Clone", box2d.b2CircleShape.prototype.Clone);
box2d.b2CircleShape.prototype.Copy = function(a) {
  box2d.b2CircleShape.superClass_.Copy.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2CircleShape);
  this.m_p.Copy(a.m_p);
  return this
};
goog.exportProperty(box2d.b2CircleShape.prototype, "Copy", box2d.b2CircleShape.prototype.Copy);
box2d.b2CircleShape.prototype.GetChildCount = function() {
  return 1
};
goog.exportProperty(box2d.b2CircleShape.prototype, "GetChildCount", box2d.b2CircleShape.prototype.GetChildCount);
box2d.b2CircleShape.prototype.TestPoint = function(a, b) {
  var c = box2d.b2MulXV(a, this.m_p, box2d.b2CircleShape.prototype.TestPoint.s_center),
    c = box2d.b2SubVV(b, c, box2d.b2CircleShape.prototype.TestPoint.s_d);
  return box2d.b2DotVV(c, c) <= box2d.b2Sq(this.m_radius)
};
goog.exportProperty(box2d.b2CircleShape.prototype, "TestPoint", box2d.b2CircleShape.prototype.TestPoint);
box2d.b2CircleShape.prototype.TestPoint.s_center = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.TestPoint.s_d = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.RayCast = function(a, b, c) {
  var c = box2d.b2MulXV(c, this.m_p, box2d.b2CircleShape.prototype.RayCast.s_position),
    c = box2d.b2SubVV(b.p1, c, box2d.b2CircleShape.prototype.RayCast.s_s),
    e = box2d.b2DotVV(c, c) - box2d.b2Sq(this.m_radius),
    d = box2d.b2SubVV(b.p2, b.p1, box2d.b2CircleShape.prototype.RayCast.s_r),
    f = box2d.b2DotVV(c, d),
    g = box2d.b2DotVV(d, d),
    e = f * f - g * e;
  if (0 > e || g < box2d.b2_epsilon) return !1;
  f = -(f + box2d.b2Sqrt(e));
  return 0 <= f && f <= b.maxFraction * g ? (f /= g, a.fraction = f, box2d.b2AddVMulSV(c, f,
    d, a.normal).SelfNormalize(), !0) : !1
};
goog.exportProperty(box2d.b2CircleShape.prototype, "RayCast", box2d.b2CircleShape.prototype.RayCast);
box2d.b2CircleShape.prototype.RayCast.s_position = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.RayCast.s_s = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.RayCast.s_r = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.ComputeAABB = function(a, b) {
  var c = box2d.b2MulXV(b, this.m_p, box2d.b2CircleShape.prototype.ComputeAABB.s_p);
  a.lowerBound.SetXY(c.x - this.m_radius, c.y - this.m_radius);
  a.upperBound.SetXY(c.x + this.m_radius, c.y + this.m_radius)
};
goog.exportProperty(box2d.b2CircleShape.prototype, "ComputeAABB", box2d.b2CircleShape.prototype.ComputeAABB);
box2d.b2CircleShape.prototype.ComputeAABB.s_p = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.ComputeMass = function(a, b) {
  var c = box2d.b2Sq(this.m_radius);
  a.mass = b * box2d.b2_pi * c;
  a.center.Copy(this.m_p);
  a.I = a.mass * (0.5 * c + box2d.b2DotVV(this.m_p, this.m_p))
};
goog.exportProperty(box2d.b2CircleShape.prototype, "ComputeMass", box2d.b2CircleShape.prototype.ComputeMass);
box2d.b2CircleShape.prototype.ComputeSubmergedArea = function(a, b, c, e) {
  var c = box2d.b2MulXV(c, this.m_p, new box2d.b2Vec2),
    d = -(box2d.b2DotVV(a, c) - b);
  if (d < -this.m_radius + box2d.b2_epsilon) return 0;
  if (d > this.m_radius) return e.Copy(c), box2d.b2_pi * this.m_radius * this.m_radius;
  var b = this.m_radius * this.m_radius,
    f = d * d,
    d = b * (box2d.b2Asin(d / this.m_radius) + box2d.b2_pi / 2) + d * box2d.b2Sqrt(b - f),
    b = -2 / 3 * box2d.b2Pow(b - f, 1.5) / d;
  e.x = c.x + a.x * b;
  e.y = c.y + a.y * b;
  return d
};
goog.exportProperty(box2d.b2CircleShape.prototype, "ComputeSubmergedArea", box2d.b2CircleShape.prototype.ComputeSubmergedArea);
box2d.b2CircleShape.Make = function(a) {
  return new box2d.b2CircleShape(a)
};
goog.exportProperty(box2d.b2CircleShape, "Make", box2d.b2CircleShape.Make);
box2d.b2RopeDef = function() {
  this.vertices = [];
  this.masses = [];
  this.gravity = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2RopeDef", box2d.b2RopeDef);
box2d.b2RopeDef.prototype.vertices = null;
box2d.b2RopeDef.prototype.count = 0;
box2d.b2RopeDef.prototype.masses = null;
box2d.b2RopeDef.prototype.gravity = null;
box2d.b2RopeDef.prototype.damping = 0.1;
box2d.b2RopeDef.prototype.k2 = 0.9;
box2d.b2RopeDef.prototype.k3 = 0.1;
box2d.b2Rope = function() {
  this.m_gravity = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Rope", box2d.b2Rope);
box2d.b2Rope.prototype.m_count = 0;
box2d.b2Rope.prototype.m_ps = null;
box2d.b2Rope.prototype.m_p0s = null;
box2d.b2Rope.prototype.m_vs = null;
box2d.b2Rope.prototype.m_ims = null;
box2d.b2Rope.prototype.m_Ls = null;
box2d.b2Rope.prototype.m_as = null;
box2d.b2Rope.prototype.m_gravity = null;
box2d.b2Rope.prototype.m_damping = 0;
box2d.b2Rope.prototype.m_k2 = 1;
box2d.b2Rope.prototype.m_k3 = 0.1;
box2d.b2Rope.prototype.GetVertexCount = function() {
  return this.m_count
};
goog.exportProperty(box2d.b2Rope.prototype, "GetVertexCount", box2d.b2Rope.prototype.GetVertexCount);
box2d.b2Rope.prototype.GetVertices = function() {
  return this.m_ps
};
goog.exportProperty(box2d.b2Rope.prototype, "GetVertices", box2d.b2Rope.prototype.GetVertices);
box2d.b2Rope.prototype.Initialize = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= a.count);
  this.m_count = a.count;
  this.m_ps = box2d.b2Vec2.MakeArray(this.m_count);
  this.m_p0s = box2d.b2Vec2.MakeArray(this.m_count);
  this.m_vs = box2d.b2Vec2.MakeArray(this.m_count);
  this.m_ims = box2d.b2MakeNumberArray(this.m_count);
  for (var b = 0; b < this.m_count; ++b) {
    this.m_ps[b].Copy(a.vertices[b]);
    this.m_p0s[b].Copy(a.vertices[b]);
    this.m_vs[b].SetZero();
    var c = a.masses[b];
    this.m_ims[b] = 0 < c ? 1 / c : 0
  }
  var e = this.m_count - 1,
    c = this.m_count -
    2;
  this.m_Ls = box2d.b2MakeNumberArray(e);
  this.m_as = box2d.b2MakeNumberArray(c);
  for (b = 0; b < e; ++b) {
    var d = this.m_ps[b],
      f = this.m_ps[b + 1];
    this.m_Ls[b] = box2d.b2DistanceVV(d, f)
  }
  for (b = 0; b < c; ++b) d = this.m_ps[b], f = this.m_ps[b + 1], e = this.m_ps[b + 2], d = box2d.b2SubVV(f, d, box2d.b2Vec2.s_t0), e = box2d.b2SubVV(e, f, box2d.b2Vec2.s_t1), f = box2d.b2CrossVV(d, e), d = box2d.b2DotVV(d, e), this.m_as[b] = box2d.b2Atan2(f, d);
  this.m_gravity.Copy(a.gravity);
  this.m_damping = a.damping;
  this.m_k2 = a.k2;
  this.m_k3 = a.k3
};
goog.exportProperty(box2d.b2Rope.prototype, "Initialize", box2d.b2Rope.prototype.Initialize);
box2d.b2Rope.prototype.Step = function(a, b) {
  if (0 != a) {
    for (var c = Math.exp(-a * this.m_damping), e = 0; e < this.m_count; ++e) this.m_p0s[e].Copy(this.m_ps[e]), 0 < this.m_ims[e] && this.m_vs[e].SelfMulAdd(a, this.m_gravity), this.m_vs[e].SelfMul(c), this.m_ps[e].SelfMulAdd(a, this.m_vs[e]);
    for (e = 0; e < b; ++e) this.SolveC2(), this.SolveC3(), this.SolveC2();
    c = 1 / a;
    for (e = 0; e < this.m_count; ++e) box2d.b2MulSV(c, box2d.b2SubVV(this.m_ps[e], this.m_p0s[e], box2d.b2Vec2.s_t0), this.m_vs[e])
  }
};
goog.exportProperty(box2d.b2Rope.prototype, "Step", box2d.b2Rope.prototype.Step);
box2d.b2Rope.prototype.SolveC2 = function() {
  for (var a = this.m_count - 1, b = 0; b < a; ++b) {
    var c = this.m_ps[b],
      e = this.m_ps[b + 1],
      d = box2d.b2SubVV(e, c, box2d.b2Rope.s_d),
      f = d.Normalize(),
      g = this.m_ims[b],
      h = this.m_ims[b + 1];
    if (0 != g + h) {
      var j = h / (g + h);
      c.SelfMulSub(this.m_k2 * (g / (g + h)) * (this.m_Ls[b] - f), d);
      e.SelfMulAdd(this.m_k2 * j * (this.m_Ls[b] - f), d)
    }
  }
};
goog.exportProperty(box2d.b2Rope.prototype, "SolveC2", box2d.b2Rope.prototype.SolveC2);
box2d.b2Rope.s_d = new box2d.b2Vec2;
box2d.b2Rope.prototype.SetAngleRadians = function(a) {
  for (var b = this.m_count - 2, c = 0; c < b; ++c) this.m_as[c] = a
};
goog.exportProperty(box2d.b2Rope.prototype, "SetAngleRadians", box2d.b2Rope.prototype.SetAngleRadians);
box2d.b2Rope.prototype.SolveC3 = function() {
  for (var a = this.m_count - 2, b = 0; b < a; ++b) {
    var c = this.m_ps[b],
      e = this.m_ps[b + 1],
      d = this.m_ps[b + 2],
      f = this.m_ims[b],
      g = this.m_ims[b + 1],
      h = this.m_ims[b + 2],
      j = box2d.b2SubVV(e, c, box2d.b2Rope.s_d1),
      i = box2d.b2SubVV(d, e, box2d.b2Rope.s_d2),
      k = j.GetLengthSquared(),
      l = i.GetLengthSquared();
    if (0 != k * l) {
      var m = box2d.b2CrossVV(j, i),
        n = box2d.b2DotVV(j, i),
        m = box2d.b2Atan2(m, n),
        j = box2d.b2MulSV(-1 / k, j.SelfSkew(), box2d.b2Rope.s_Jd1),
        k = box2d.b2MulSV(1 / l, i.SelfSkew(), box2d.b2Rope.s_Jd2),
        i = box2d.b2NegV(j,
          box2d.b2Rope.s_J1),
        l = box2d.b2SubVV(j, k, box2d.b2Rope.s_J2),
        j = k,
        k = f * box2d.b2DotVV(i, i) + g * box2d.b2DotVV(l, l) + h * box2d.b2DotVV(j, j);
      if (0 != k) {
        k = 1 / k;
        for (n = m - this.m_as[b]; n > box2d.b2_pi;) m -= 2 * box2d.b2_pi, n = m - this.m_as[b];
        for (; n < -box2d.b2_pi;) m += 2 * box2d.b2_pi, n = m - this.m_as[b];
        m = -this.m_k3 * k * n;
        c.SelfMulAdd(f * m, i);
        e.SelfMulAdd(g * m, l);
        d.SelfMulAdd(h * m, j)
      }
    }
  }
};
goog.exportProperty(box2d.b2Rope.prototype, "SolveC3", box2d.b2Rope.prototype.SolveC3);
box2d.b2Rope.s_d1 = new box2d.b2Vec2;
box2d.b2Rope.s_d2 = new box2d.b2Vec2;
box2d.b2Rope.s_Jd1 = new box2d.b2Vec2;
box2d.b2Rope.s_Jd2 = new box2d.b2Vec2;
box2d.b2Rope.s_J1 = new box2d.b2Vec2;
box2d.b2Rope.s_J2 = new box2d.b2Vec2;
box2d.b2Rope.prototype.Draw = function(a) {
  for (var b = new box2d.b2Color(0.4, 0.5, 0.7), c = 0; c < this.m_count - 1; ++c) a.DrawSegment(this.m_ps[c], this.m_ps[c + 1], b)
};
goog.exportProperty(box2d.b2Rope.prototype, "Draw", box2d.b2Rope.prototype.Draw);
box2d.b2WheelJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_wheelJoint);
  this.localAnchorA = new box2d.b2Vec2(0, 0);
  this.localAnchorB = new box2d.b2Vec2(0, 0);
  this.localAxisA = new box2d.b2Vec2(1, 0)
};
goog.inherits(box2d.b2WheelJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2WheelJointDef", box2d.b2WheelJointDef);
box2d.b2WheelJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "localAnchorA", box2d.b2WheelJointDef.prototype.localAnchorA);
box2d.b2WheelJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "localAnchorB", box2d.b2WheelJointDef.prototype.localAnchorB);
box2d.b2WheelJointDef.prototype.localAxisA = null;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "localAxisA", box2d.b2WheelJointDef.prototype.localAxisA);
box2d.b2WheelJointDef.prototype.enableMotor = !1;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "enableMotor", box2d.b2WheelJointDef.prototype.enableMotor);
box2d.b2WheelJointDef.prototype.maxMotorTorque = 0;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "maxMotorTorque", box2d.b2WheelJointDef.prototype.maxMotorTorque);
box2d.b2WheelJointDef.prototype.motorSpeed = 0;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "motorSpeed", box2d.b2WheelJointDef.prototype.motorSpeed);
box2d.b2WheelJointDef.prototype.frequencyHz = 2;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "frequencyHz", box2d.b2WheelJointDef.prototype.frequencyHz);
box2d.b2WheelJointDef.prototype.dampingRatio = 0.7;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "dampingRatio", box2d.b2WheelJointDef.prototype.dampingRatio);
box2d.b2WheelJointDef.prototype.Initialize = function(a, b, c, e) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
  this.bodyA.GetLocalVector(e, this.localAxisA)
};
goog.exportProperty(box2d.b2WheelJointDef.prototype, "Initialize", box2d.b2WheelJointDef.prototype.Initialize);
box2d.b2WheelJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_localXAxisA = a.localAxisA.Clone();
  this.m_localYAxisA = box2d.b2CrossOneV(this.m_localXAxisA, new box2d.b2Vec2);
  this.m_maxMotorTorque = a.maxMotorTorque;
  this.m_motorSpeed = a.motorSpeed;
  this.m_enableMotor = a.enableMotor;
  this.m_localCenterA = new box2d.b2Vec2;
  this.m_localCenterB = new box2d.b2Vec2;
  this.m_ax = new box2d.b2Vec2;
  this.m_ay = new box2d.b2Vec2;
  this.m_qA = new box2d.b2Rot;
  this.m_qB = new box2d.b2Rot;
  this.m_lalcA = new box2d.b2Vec2;
  this.m_lalcB = new box2d.b2Vec2;
  this.m_rA = new box2d.b2Vec2;
  this.m_rB = new box2d.b2Vec2;
  this.m_ax.SetZero();
  this.m_ay.SetZero()
};
goog.inherits(box2d.b2WheelJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2WheelJoint", box2d.b2WheelJoint);
box2d.b2WheelJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_frequencyHz", box2d.b2WheelJoint.prototype.m_frequencyHz);
box2d.b2WheelJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_dampingRatio", box2d.b2WheelJoint.prototype.m_dampingRatio);
box2d.b2WheelJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localAnchorA", box2d.b2WheelJoint.prototype.m_localAnchorA);
box2d.b2WheelJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localAnchorB", box2d.b2WheelJoint.prototype.m_localAnchorB);
box2d.b2WheelJoint.prototype.m_localXAxisA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localXAxisA", box2d.b2WheelJoint.prototype.m_localXAxisA);
box2d.b2WheelJoint.prototype.m_localYAxisA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localYAxisA", box2d.b2WheelJoint.prototype.m_localYAxisA);
box2d.b2WheelJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_impulse", box2d.b2WheelJoint.prototype.m_impulse);
box2d.b2WheelJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_motorImpulse", box2d.b2WheelJoint.prototype.m_motorImpulse);
box2d.b2WheelJoint.prototype.m_springImpulse = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_springImpulse", box2d.b2WheelJoint.prototype.m_springImpulse);
box2d.b2WheelJoint.prototype.m_maxMotorTorque = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_maxMotorTorque", box2d.b2WheelJoint.prototype.m_maxMotorTorque);
box2d.b2WheelJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_motorSpeed", box2d.b2WheelJoint.prototype.m_motorSpeed);
box2d.b2WheelJoint.prototype.m_enableMotor = !1;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_enableMotor", box2d.b2WheelJoint.prototype.m_enableMotor);
box2d.b2WheelJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_indexA", box2d.b2WheelJoint.prototype.m_indexA);
box2d.b2WheelJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_indexB", box2d.b2WheelJoint.prototype.m_indexB);
box2d.b2WheelJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localCenterA", box2d.b2WheelJoint.prototype.m_localCenterA);
box2d.b2WheelJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localCenterB", box2d.b2WheelJoint.prototype.m_localCenterB);
box2d.b2WheelJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_invMassA", box2d.b2WheelJoint.prototype.m_invMassA);
box2d.b2WheelJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_invMassB", box2d.b2WheelJoint.prototype.m_invMassB);
box2d.b2WheelJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_invIA", box2d.b2WheelJoint.prototype.m_invIA);
box2d.b2WheelJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_invIB", box2d.b2WheelJoint.prototype.m_invIB);
box2d.b2WheelJoint.prototype.m_ax = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_ax", box2d.b2WheelJoint.prototype.m_ax);
box2d.b2WheelJoint.prototype.m_ay = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_ay", box2d.b2WheelJoint.prototype.m_ay);
box2d.b2WheelJoint.prototype.m_sAx = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_sAx", box2d.b2WheelJoint.prototype.m_sAx);
box2d.b2WheelJoint.prototype.m_sBx = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_sBx", box2d.b2WheelJoint.prototype.m_sBx);
box2d.b2WheelJoint.prototype.m_sAy = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_sAy", box2d.b2WheelJoint.prototype.m_sAy);
box2d.b2WheelJoint.prototype.m_sBy = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_sBy", box2d.b2WheelJoint.prototype.m_sBy);
box2d.b2WheelJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_mass", box2d.b2WheelJoint.prototype.m_mass);
box2d.b2WheelJoint.prototype.m_motorMass = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_motorMass", box2d.b2WheelJoint.prototype.m_motorMass);
box2d.b2WheelJoint.prototype.m_springMass = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_springMass", box2d.b2WheelJoint.prototype.m_springMass);
box2d.b2WheelJoint.prototype.m_bias = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_bias", box2d.b2WheelJoint.prototype.m_bias);
box2d.b2WheelJoint.prototype.m_gamma = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_gamma", box2d.b2WheelJoint.prototype.m_gamma);
box2d.b2WheelJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_qA", box2d.b2WheelJoint.prototype.m_qA);
box2d.b2WheelJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_qB", box2d.b2WheelJoint.prototype.m_qB);
box2d.b2WheelJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_lalcA", box2d.b2WheelJoint.prototype.m_lalcA);
box2d.b2WheelJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_lalcB", box2d.b2WheelJoint.prototype.m_lalcB);
box2d.b2WheelJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_rA", box2d.b2WheelJoint.prototype.m_rA);
box2d.b2WheelJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_rB", box2d.b2WheelJoint.prototype.m_rB);
box2d.b2WheelJoint.prototype.GetMotorSpeed = function() {
  return this.m_motorSpeed
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetMotorSpeed", box2d.b2WheelJoint.prototype.GetMotorSpeed);
box2d.b2WheelJoint.prototype.GetMaxMotorTorque = function() {
  return this.m_maxMotorTorque
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetMaxMotorTorque", box2d.b2WheelJoint.prototype.GetMaxMotorTorque);
box2d.b2WheelJoint.prototype.SetSpringFrequencyHz = function(a) {
  this.m_frequencyHz = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SetSpringFrequencyHz", box2d.b2WheelJoint.prototype.SetSpringFrequencyHz);
box2d.b2WheelJoint.prototype.GetSpringFrequencyHz = function() {
  return this.m_frequencyHz
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetSpringFrequencyHz", box2d.b2WheelJoint.prototype.GetSpringFrequencyHz);
box2d.b2WheelJoint.prototype.SetSpringDampingRatio = function(a) {
  this.m_dampingRatio = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SetSpringDampingRatio", box2d.b2WheelJoint.prototype.SetSpringDampingRatio);
box2d.b2WheelJoint.prototype.GetSpringDampingRatio = function() {
  return this.m_dampingRatio
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetSpringDampingRatio", box2d.b2WheelJoint.prototype.GetSpringDampingRatio);
box2d.b2WheelJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = this.m_invMassA,
    c = this.m_invMassB,
    e = this.m_invIA,
    d = this.m_invIB,
    f = a.positions[this.m_indexA].c,
    g = a.velocities[this.m_indexA].v,
    h = a.velocities[this.m_indexA].w,
    j = a.positions[this.m_indexB].c,
    i = a.positions[this.m_indexB].a,
    k = a.velocities[this.m_indexB].v,
    l = a.velocities[this.m_indexB].w,
    m = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
    n = this.m_qB.SetAngleRadians(i);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  i = box2d.b2MulRV(m, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  n = box2d.b2MulRV(n, this.m_lalcB, this.m_rB);
  f =
    box2d.b2SubVV(box2d.b2AddVV(j, n, box2d.b2Vec2.s_t0), box2d.b2AddVV(f, i, box2d.b2Vec2.s_t1), box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_d);
  box2d.b2MulRV(m, this.m_localYAxisA, this.m_ay);
  this.m_sAy = box2d.b2CrossVV(box2d.b2AddVV(f, i, box2d.b2Vec2.s_t0), this.m_ay);
  this.m_sBy = box2d.b2CrossVV(n, this.m_ay);
  this.m_mass = b + c + e * this.m_sAy * this.m_sAy + d * this.m_sBy * this.m_sBy;
  0 < this.m_mass && (this.m_mass = 1 / this.m_mass);
  this.m_gamma = this.m_bias = this.m_springMass = 0;
  if (0 < this.m_frequencyHz) {
    if (box2d.b2MulRV(m,
        this.m_localXAxisA, this.m_ax), this.m_sAx = box2d.b2CrossVV(box2d.b2AddVV(f, i, box2d.b2Vec2.s_t0), this.m_ax), this.m_sBx = box2d.b2CrossVV(n, this.m_ax), b = b + c + e * this.m_sAx * this.m_sAx + d * this.m_sBx * this.m_sBx, 0 < b && (this.m_springMass = 1 / b, c = box2d.b2DotVV(f, this.m_ax), m = 2 * box2d.b2_pi * this.m_frequencyHz, f = this.m_springMass * m * m, j = a.step.dt, this.m_gamma = j * (2 * this.m_springMass * this.m_dampingRatio * m + j * f), 0 < this.m_gamma && (this.m_gamma = 1 / this.m_gamma), this.m_bias = c * j * f * this.m_gamma, this.m_springMass = b + this.m_gamma, 0 <
        this.m_springMass)) this.m_springMass = 1 / this.m_springMass
  } else this.m_springImpulse = 0;
  this.m_enableMotor ? (this.m_motorMass = e + d, 0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass)) : this.m_motorImpulse = this.m_motorMass = 0;
  a.step.warmStarting ? (this.m_impulse *= a.step.dtRatio, this.m_springImpulse *= a.step.dtRatio, this.m_motorImpulse *= a.step.dtRatio, e = box2d.b2AddVV(box2d.b2MulSV(this.m_impulse, this.m_ay, box2d.b2Vec2.s_t0), box2d.b2MulSV(this.m_springImpulse, this.m_ax, box2d.b2Vec2.s_t1), box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_P),
    d = this.m_impulse * this.m_sAy + this.m_springImpulse * this.m_sAx + this.m_motorImpulse, b = this.m_impulse * this.m_sBy + this.m_springImpulse * this.m_sBx + this.m_motorImpulse, g.SelfMulSub(this.m_invMassA, e), h -= this.m_invIA * d, k.SelfMulAdd(this.m_invMassB, e), l += this.m_invIB * b) : this.m_motorImpulse = this.m_springImpulse = this.m_impulse = 0;
  a.velocities[this.m_indexA].w = h;
  a.velocities[this.m_indexB].w = l
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "InitVelocityConstraints", box2d.b2WheelJoint.prototype.InitVelocityConstraints);
box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_d = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = this.m_invMassA,
    c = this.m_invMassB,
    e = this.m_invIA,
    d = this.m_invIB,
    f = a.velocities[this.m_indexA].v,
    g = a.velocities[this.m_indexA].w,
    h = a.velocities[this.m_indexB].v,
    j = a.velocities[this.m_indexB].w,
    i = box2d.b2DotVV(this.m_ax, box2d.b2SubVV(h, f, box2d.b2Vec2.s_t0)) + this.m_sBx * j - this.m_sAx * g,
    i = -this.m_springMass * (i + this.m_bias + this.m_gamma * this.m_springImpulse);
  this.m_springImpulse += i;
  var k = box2d.b2MulSV(i, this.m_ax, box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P),
    l = i * this.m_sAx,
    i = i * this.m_sBx;
  f.SelfMulSub(b, k);
  g -= e * l;
  h.SelfMulAdd(c, k);
  j += d * i;
  i = j - g - this.m_motorSpeed;
  i *= -this.m_motorMass;
  k = this.m_motorImpulse;
  l = a.step.dt * this.m_maxMotorTorque;
  this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + i, -l, l);
  i = this.m_motorImpulse - k;
  g -= e * i;
  j += d * i;
  i = box2d.b2DotVV(this.m_ay, box2d.b2SubVV(h, f, box2d.b2Vec2.s_t0)) + this.m_sBy * j - this.m_sAy * g;
  i *= -this.m_mass;
  this.m_impulse += i;
  k = box2d.b2MulSV(i, this.m_ay, box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P);
  l = i * this.m_sAy;
  i *= this.m_sBy;
  f.SelfMulSub(b, k);
  g -= e * l;
  h.SelfMulAdd(c, k);
  a.velocities[this.m_indexA].w = g;
  a.velocities[this.m_indexB].w = j + d * i
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SolveVelocityConstraints", box2d.b2WheelJoint.prototype.SolveVelocityConstraints);
box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.SolvePositionConstraints = function(a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.positions[this.m_indexB].c,
    d = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngleRadians(c),
    g = this.m_qB.SetAngleRadians(d);
  box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  var h = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
  box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var g = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
    j = box2d.b2AddVV(box2d.b2SubVV(e,
      b, box2d.b2Vec2.s_t0), box2d.b2SubVV(g, h, box2d.b2Vec2.s_t1), box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_d),
    f = box2d.b2MulRV(f, this.m_localYAxisA, this.m_ay),
    h = box2d.b2CrossVV(box2d.b2AddVV(j, h, box2d.b2Vec2.s_t0), f),
    g = box2d.b2CrossVV(g, f),
    j = box2d.b2DotVV(j, this.m_ay),
    i = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy,
    i = 0 != i ? -j / i : 0,
    f = box2d.b2MulSV(i, f, box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_P),
    h = i * h,
    g = i * g;
  b.SelfMulSub(this.m_invMassA,
    f);
  c -= this.m_invIA * h;
  e.SelfMulAdd(this.m_invMassB, f);
  d += this.m_invIB * g;
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = d;
  return box2d.b2Abs(j) <= box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SolvePositionConstraints", box2d.b2WheelJoint.prototype.SolvePositionConstraints);
box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_d = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.GetDefinition = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
  return a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetDefinition", box2d.b2WheelJoint.prototype.GetDefinition);
box2d.b2WheelJoint.prototype.GetAnchorA = function(a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetAnchorA", box2d.b2WheelJoint.prototype.GetAnchorA);
box2d.b2WheelJoint.prototype.GetAnchorB = function(a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetAnchorB", box2d.b2WheelJoint.prototype.GetAnchorB);
box2d.b2WheelJoint.prototype.GetReactionForce = function(a, b) {
  b.x = a * (this.m_impulse * this.m_ay.x + this.m_springImpulse * this.m_ax.x);
  b.y = a * (this.m_impulse * this.m_ay.y + this.m_springImpulse * this.m_ax.y);
  return b
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetReactionForce", box2d.b2WheelJoint.prototype.GetReactionForce);
box2d.b2WheelJoint.prototype.GetReactionTorque = function(a) {
  return a * this.m_motorImpulse
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetReactionTorque", box2d.b2WheelJoint.prototype.GetReactionTorque);
box2d.b2WheelJoint.prototype.GetLocalAnchorA = function() {
  return this.m_localAnchorA
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetLocalAnchorA", box2d.b2WheelJoint.prototype.GetLocalAnchorA);
box2d.b2WheelJoint.prototype.GetLocalAnchorB = function() {
  return this.m_localAnchorB
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetLocalAnchorB", box2d.b2WheelJoint.prototype.GetLocalAnchorB);
box2d.b2WheelJoint.prototype.GetLocalAxisA = function() {
  return this.m_localXAxisA
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetLocalAxisA", box2d.b2WheelJoint.prototype.GetLocalAxisA);
box2d.b2WheelJoint.prototype.GetJointTranslation = function() {
  var a = this.m_bodyA,
    b = this.m_bodyB,
    c = a.GetWorldPoint(this.m_localAnchorA, new box2d.b2Vec2),
    b = b.GetWorldPoint(this.m_localAnchorB, new box2d.b2Vec2),
    c = box2d.b2SubVV(b, c, new box2d.b2Vec2),
    a = a.GetWorldVector(this.m_localXAxisA, new box2d.b2Vec2);
  return box2d.b2DotVV(c, a)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetJointTranslation", box2d.b2WheelJoint.prototype.GetJointTranslation);
box2d.b2WheelJoint.prototype.GetJointSpeed = function() {
  return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetJointSpeed", box2d.b2WheelJoint.prototype.GetJointSpeed);
box2d.b2WheelJoint.prototype.IsMotorEnabled = function() {
  return this.m_enableMotor
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "IsMotorEnabled", box2d.b2WheelJoint.prototype.IsMotorEnabled);
box2d.b2WheelJoint.prototype.EnableMotor = function(a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_enableMotor = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "EnableMotor", box2d.b2WheelJoint.prototype.EnableMotor);
box2d.b2WheelJoint.prototype.SetMotorSpeed = function(a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_motorSpeed = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SetMotorSpeed", box2d.b2WheelJoint.prototype.SetMotorSpeed);
box2d.b2WheelJoint.prototype.SetMaxMotorTorque = function(a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_maxMotorTorque = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SetMaxMotorTorque", box2d.b2WheelJoint.prototype.SetMaxMotorTorque);
box2d.b2WheelJoint.prototype.GetMotorTorque = function(a) {
  return a * this.m_motorImpulse
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetMotorTorque", box2d.b2WheelJoint.prototype.GetMotorTorque);
box2d.b2WheelJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2WheelJointDef*/ var jd = new box2d.b2WheelJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
    box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
      this.m_localAnchorB.x, this.m_localAnchorB.y);
    box2d.b2Log("  jd.localAxisA.Set(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
    box2d.b2Log("  jd.enableMotor = %s;\n", this.m_enableMotor ? "true" : "false");
    box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
    box2d.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
    box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
    box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n",
      this.m_index)
  }
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "Dump", box2d.b2WheelJoint.prototype.Dump);
box2d.b2MotorJointDef = function() {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_motorJoint);
  this.linearOffset = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2MotorJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2MotorJointDef", box2d.b2MotorJointDef);
box2d.b2MotorJointDef.prototype.linearOffset = null;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "linearOffset", box2d.b2MotorJointDef.prototype.linearOffset);
box2d.b2MotorJointDef.prototype.angularOffset = 0;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "angularOffset", box2d.b2MotorJointDef.prototype.angularOffset);
box2d.b2MotorJointDef.prototype.maxForce = 1;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "maxForce", box2d.b2MotorJointDef.prototype.maxForce);
box2d.b2MotorJointDef.prototype.maxTorque = 1;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "maxTorque", box2d.b2MotorJointDef.prototype.maxTorque);
box2d.b2MotorJointDef.prototype.correctionFactor = 0.3;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "correctionFactor", box2d.b2MotorJointDef.prototype.correctionFactor);
box2d.b2MotorJointDef.prototype.Initialize = function(a, b) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(this.bodyB.GetPosition(), this.linearOffset);
  var c = this.bodyA.GetAngleRadians();
  this.angularOffset = this.bodyB.GetAngleRadians() - c
};
goog.exportProperty(box2d.b2MotorJointDef.prototype, "Initialize", box2d.b2MotorJointDef.prototype.Initialize);
box2d.b2MotorJoint = function(a) {
  box2d.b2Joint.call(this, a);
  this.m_linearOffset = a.linearOffset.Clone();
  this.m_linearImpulse = new box2d.b2Vec2(0, 0);
  this.m_maxForce = a.maxForce;
  this.m_maxTorque = a.maxTorque;
  this.m_correctionFactor = a.correctionFactor;
  this.m_rA = new box2d.b2Vec2(0, 0);
  this.m_rB = new box2d.b2Vec2(0, 0);
  this.m_localCenterA = new box2d.b2Vec2(0, 0);
  this.m_localCenterB = new box2d.b2Vec2(0, 0);
  this.m_linearError = new box2d.b2Vec2(0, 0);
  this.m_linearMass = new box2d.b2Mat22;
  this.m_qA = new box2d.b2Rot;
  this.m_qB =
    new box2d.b2Rot;
  this.m_K = new box2d.b2Mat22
};
goog.inherits(box2d.b2MotorJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2MotorJoint", box2d.b2MotorJoint);
box2d.b2MotorJoint.prototype.m_linearOffset = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_linearOffset", box2d.b2MotorJoint.prototype.m_linearOffset);
box2d.b2MotorJoint.prototype.m_angularOffset = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_angularOffset", box2d.b2MotorJoint.prototype.m_angularOffset);
box2d.b2MotorJoint.prototype.m_linearImpulse = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_linearImpulse", box2d.b2MotorJoint.prototype.m_linearImpulse);
box2d.b2MotorJoint.prototype.m_angularImpulse = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_angularImpulse", box2d.b2MotorJoint.prototype.m_angularImpulse);
box2d.b2MotorJoint.prototype.m_maxForce = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_maxForce", box2d.b2MotorJoint.prototype.m_maxForce);
box2d.b2MotorJoint.prototype.m_maxTorque = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_maxTorque", box2d.b2MotorJoint.prototype.m_maxTorque);
box2d.b2MotorJoint.prototype.m_correctionFactor = 0.3;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_correctionFactor", box2d.b2MotorJoint.prototype.m_correctionFactor);
box2d.b2MotorJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_indexA", box2d.b2MotorJoint.prototype.m_indexA);
box2d.b2MotorJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_indexB", box2d.b2MotorJoint.prototype.m_indexB);
box2d.b2MotorJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_rA", box2d.b2MotorJoint.prototype.m_rA);
box2d.b2MotorJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_rB", box2d.b2MotorJoint.prototype.m_rB);
box2d.b2MotorJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_localCenterA", box2d.b2MotorJoint.prototype.m_localCenterA);
box2d.b2MotorJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_localCenterB", box2d.b2MotorJoint.prototype.m_localCenterB);
box2d.b2MotorJoint.prototype.m_linearError = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_linearError", box2d.b2MotorJoint.prototype.m_linearError);
box2d.b2MotorJoint.prototype.m_angularError = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_angularError", box2d.b2MotorJoint.prototype.m_angularError);
box2d.b2MotorJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_invMassA", box2d.b2MotorJoint.prototype.m_invMassA);
box2d.b2MotorJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_invMassB", box2d.b2MotorJoint.prototype.m_invMassB);
box2d.b2MotorJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_invIA", box2d.b2MotorJoint.prototype.m_invIA);
box2d.b2MotorJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_invIB", box2d.b2MotorJoint.prototype.m_invIB);
box2d.b2MotorJoint.prototype.m_linearMass = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_linearMass", box2d.b2MotorJoint.prototype.m_linearMass);
box2d.b2MotorJoint.prototype.m_angularMass = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_angularMass", box2d.b2MotorJoint.prototype.m_angularMass);
box2d.b2MotorJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_qA", box2d.b2MotorJoint.prototype.m_qA);
box2d.b2MotorJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_qB", box2d.b2MotorJoint.prototype.m_qB);
box2d.b2MotorJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_K", box2d.b2MotorJoint.prototype.m_K);
box2d.b2MotorJoint.prototype.GetAnchorA = function() {
  return this.m_bodyA.GetPosition()
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetAnchorA", box2d.b2MotorJoint.prototype.GetAnchorA);
box2d.b2MotorJoint.prototype.GetAnchorB = function() {
  return this.m_bodyB.GetPosition()
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetAnchorB", box2d.b2MotorJoint.prototype.GetAnchorB);
box2d.b2MotorJoint.prototype.GetReactionForce = function(a, b) {
  return box2d.b2MulSV(a, this.m_linearImpulse, b)
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetReactionForce", box2d.b2MotorJoint.prototype.GetReactionForce);
box2d.b2MotorJoint.prototype.GetReactionTorque = function(a) {
  return a * this.m_angularImpulse
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetReactionTorque", box2d.b2MotorJoint.prototype.GetReactionTorque);
box2d.b2MotorJoint.prototype.SetLinearOffset = function(a) {
  box2d.b2IsEqualToV(a, this.m_linearOffset) || (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_linearOffset.Copy(a))
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SetLinearOffset", box2d.b2MotorJoint.prototype.SetLinearOffset);
box2d.b2MotorJoint.prototype.GetLinearOffset = function() {
  return this.m_linearOffset
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetLinearOffset", box2d.b2MotorJoint.prototype.GetLinearOffset);
box2d.b2MotorJoint.prototype.SetAngularOffset = function(a) {
  a != this.m_angularOffset && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_angularOffset = a)
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SetAngularOffset", box2d.b2MotorJoint.prototype.SetAngularOffset);
box2d.b2MotorJoint.prototype.GetAngularOffset = function() {
  return this.m_angularOffset
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetAngularOffset", box2d.b2MotorJoint.prototype.GetAngularOffset);
box2d.b2MotorJoint.prototype.SetMaxForce = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a) && 0 <= a);
  this.m_maxForce = a
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SetMaxForce", box2d.b2MotorJoint.prototype.SetMaxForce);
box2d.b2MotorJoint.prototype.GetMaxForce = function() {
  return this.m_maxForce
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetMaxForce", box2d.b2MotorJoint.prototype.GetMaxForce);
box2d.b2MotorJoint.prototype.SetMaxTorque = function(a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a) && 0 <= a);
  this.m_maxTorque = a
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SetMaxTorque", box2d.b2MotorJoint.prototype.SetMaxTorque);
box2d.b2MotorJoint.prototype.GetMaxTorque = function() {
  return this.m_maxTorque
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetMaxTorque", box2d.b2MotorJoint.prototype.GetMaxTorque);
box2d.b2MotorJoint.prototype.InitVelocityConstraints = function(a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    e = a.velocities[this.m_indexA].v,
    d = a.velocities[this.m_indexA].w,
    f = a.positions[this.m_indexB].c,
    g = a.positions[this.m_indexB].a,
    h = a.velocities[this.m_indexB].v,
    j = a.velocities[this.m_indexB].w,
    i = this.m_qA.SetAngleRadians(c),
    k = this.m_qB.SetAngleRadians(g),
    l = box2d.b2MulRV(i, box2d.b2NegV(this.m_localCenterA, box2d.b2Vec2.s_t0), this.m_rA),
    k = box2d.b2MulRV(k, box2d.b2NegV(this.m_localCenterB, box2d.b2Vec2.s_t0), this.m_rB),
    m = this.m_invMassA,
    n = this.m_invMassB,
    o = this.m_invIA,
    r = this.m_invIB,
    p = this.m_K;
  p.ex.x = m + n + o * l.y * l.y + r * k.y * k.y;
  p.ex.y = -o * l.x *
    l.y - r * k.x * k.y;
  p.ey.x = p.ex.y;
  p.ey.y = m + n + o * l.x * l.x + r * k.x * k.x;
  p.GetInverse(this.m_linearMass);
  this.m_angularMass = o + r;
  0 < this.m_angularMass && (this.m_angularMass = 1 / this.m_angularMass);
  box2d.b2SubVV(box2d.b2SubVV(box2d.b2AddVV(f, k, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, l, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t2), box2d.b2MulRV(i, this.m_linearOffset, box2d.b2Vec2.s_t3), this.m_linearError);
  this.m_angularError = g - c - this.m_angularOffset;
  a.step.warmStarting ? (this.m_linearImpulse.SelfMul(a.step.dtRatio), this.m_angularImpulse *=
    a.step.dtRatio, b = this.m_linearImpulse, e.SelfMulSub(m, b), d -= o * (box2d.b2CrossVV(l, b) + this.m_angularImpulse), h.SelfMulAdd(n, b), j += r * (box2d.b2CrossVV(k, b) + this.m_angularImpulse)) : (this.m_linearImpulse.SetZero(), this.m_angularImpulse = 0);
  a.velocities[this.m_indexA].w = d;
  a.velocities[this.m_indexB].w = j
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "InitVelocityConstraints", box2d.b2MotorJoint.prototype.InitVelocityConstraints);
box2d.b2MotorJoint.prototype.SolveVelocityConstraints = function(a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    e = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    j = this.m_invIB,
    i = a.step.dt,
    k = a.step.inv_dt,
    l = d - c + k * this.m_correctionFactor * this.m_angularError,
    l = -this.m_angularMass * l,
    m = this.m_angularImpulse,
    n = i * this.m_maxTorque;
  this.m_angularImpulse = box2d.b2Clamp(this.m_angularImpulse + l, -n, n);
  var l = this.m_angularImpulse -
    m,
    c = c - h * l,
    d = d + j * l,
    o = this.m_rA,
    r = this.m_rB,
    l = box2d.b2AddVV(box2d.b2SubVV(box2d.b2AddVV(e, box2d.b2CrossSV(d, r, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2AddVV(b, box2d.b2CrossSV(c, o, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t2), box2d.b2MulSV(k * this.m_correctionFactor, this.m_linearError, box2d.b2Vec2.s_t3), box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_Cdot),
    l = box2d.b2MulMV(this.m_linearMass, l, box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_impulse).SelfNeg(),
    m = box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_oldImpulse.Copy(this.m_linearImpulse);
  this.m_linearImpulse.SelfAdd(l);
  n = i * this.m_maxForce;
  this.m_linearImpulse.GetLengthSquared() > n * n && (this.m_linearImpulse.Normalize(), this.m_linearImpulse.SelfMul(n));
  box2d.b2SubVV(this.m_linearImpulse, m, l);
  b.SelfMulSub(f, l);
  c -= h * box2d.b2CrossVV(o, l);
  e.SelfMulAdd(g, l);
  d += j * box2d.b2CrossVV(r, l);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SolveVelocityConstraints", box2d.b2MotorJoint.prototype.SolveVelocityConstraints);
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2;
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec2;
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_oldImpulse = new box2d.b2Vec2;
box2d.b2MotorJoint.prototype.SolvePositionConstraints = function() {
  return !0
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SolvePositionConstraints", box2d.b2MotorJoint.prototype.SolvePositionConstraints);
box2d.b2MotorJoint.prototype.Dump = function() {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log("  /*box2d.b2MotorJointDef*/ var jd = new box2d.b2MotorJointDef();\n");
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
    box2d.b2Log("  jd.linearOffset.SetXY(%.15f, %.15f);\n", this.m_linearOffset.x, this.m_linearOffset.y);
    box2d.b2Log("  jd.angularOffset = %.15f;\n",
      this.m_angularOffset);
    box2d.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
    box2d.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
    box2d.b2Log("  jd.correctionFactor = %.15f;\n", this.m_correctionFactor);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
  }
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "Dump", box2d.b2MotorJoint.prototype.Dump);