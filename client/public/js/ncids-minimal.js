!(function () {
  var e = {
      9669: function (e, t, n) {
        e.exports = n(1609);
      },
      5448: function (e, t, n) {
        "use strict";
        var i = n(4867),
          s = n(6026),
          o = n(4372),
          r = n(5327),
          a = n(4097),
          l = n(4109),
          c = n(7985),
          u = n(5061),
          d = n(5655),
          h = n(5263);
        e.exports = function (e) {
          return new Promise(function (t, n) {
            var m,
              p = e.data,
              v = e.headers,
              f = e.responseType;
            function g() {
              e.cancelToken && e.cancelToken.unsubscribe(m), e.signal && e.signal.removeEventListener("abort", m);
            }
            i.isFormData(p) && delete v["Content-Type"];
            var b = new XMLHttpRequest();
            if (e.auth) {
              var E = e.auth.username || "",
                L = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
              v.Authorization = "Basic " + btoa(E + ":" + L);
            }
            var y = a(e.baseURL, e.url);
            function C() {
              if (b) {
                var i = "getAllResponseHeaders" in b ? l(b.getAllResponseHeaders()) : null,
                  o = {
                    data: f && "text" !== f && "json" !== f ? b.response : b.responseText,
                    status: b.status,
                    statusText: b.statusText,
                    headers: i,
                    config: e,
                    request: b,
                  };
                s(
                  function (e) {
                    t(e), g();
                  },
                  function (e) {
                    n(e), g();
                  },
                  o
                ),
                  (b = null);
              }
            }
            if (
              (b.open(e.method.toUpperCase(), r(y, e.params, e.paramsSerializer), !0),
              (b.timeout = e.timeout),
              "onloadend" in b
                ? (b.onloadend = C)
                : (b.onreadystatechange = function () {
                    b &&
                      4 === b.readyState &&
                      (0 !== b.status || (b.responseURL && 0 === b.responseURL.indexOf("file:"))) &&
                      setTimeout(C);
                  }),
              (b.onabort = function () {
                b && (n(u("Request aborted", e, "ECONNABORTED", b)), (b = null));
              }),
              (b.onerror = function () {
                n(u("Network Error", e, null, b)), (b = null);
              }),
              (b.ontimeout = function () {
                var t = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded",
                  i = e.transitional || d.transitional;
                e.timeoutErrorMessage && (t = e.timeoutErrorMessage),
                  n(u(t, e, i.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", b)),
                  (b = null);
              }),
              i.isStandardBrowserEnv())
            ) {
              var k = (e.withCredentials || c(y)) && e.xsrfCookieName ? o.read(e.xsrfCookieName) : void 0;
              k && (v[e.xsrfHeaderName] = k);
            }
            "setRequestHeader" in b &&
              i.forEach(v, function (e, t) {
                void 0 === p && "content-type" === t.toLowerCase() ? delete v[t] : b.setRequestHeader(t, e);
              }),
              i.isUndefined(e.withCredentials) || (b.withCredentials = !!e.withCredentials),
              f && "json" !== f && (b.responseType = e.responseType),
              "function" == typeof e.onDownloadProgress && b.addEventListener("progress", e.onDownloadProgress),
              "function" == typeof e.onUploadProgress &&
                b.upload &&
                b.upload.addEventListener("progress", e.onUploadProgress),
              (e.cancelToken || e.signal) &&
                ((m = function (e) {
                  b && (n(!e || (e && e.type) ? new h("canceled") : e), b.abort(), (b = null));
                }),
                e.cancelToken && e.cancelToken.subscribe(m),
                e.signal && (e.signal.aborted ? m() : e.signal.addEventListener("abort", m))),
              p || (p = null),
              b.send(p);
          });
        };
      },
      1609: function (e, t, n) {
        "use strict";
        var i = n(4867),
          s = n(1849),
          o = n(321),
          r = n(7185),
          a = (function e(t) {
            var n = new o(t),
              a = s(o.prototype.request, n);
            return (
              i.extend(a, o.prototype, n),
              i.extend(a, n),
              (a.create = function (n) {
                return e(r(t, n));
              }),
              a
            );
          })(n(5655));
        (a.Axios = o),
          (a.Cancel = n(5263)),
          (a.CancelToken = n(4972)),
          (a.isCancel = n(6502)),
          (a.VERSION = n(7288).version),
          (a.all = function (e) {
            return Promise.all(e);
          }),
          (a.spread = n(8713)),
          (a.isAxiosError = n(6268)),
          (e.exports = a),
          (e.exports.default = a);
      },
      5263: function (e) {
        "use strict";
        function t(e) {
          this.message = e;
        }
        (t.prototype.toString = function () {
          return "Cancel" + (this.message ? ": " + this.message : "");
        }),
          (t.prototype.__CANCEL__ = !0),
          (e.exports = t);
      },
      4972: function (e, t, n) {
        "use strict";
        var i = n(5263);
        function s(e) {
          if ("function" != typeof e) throw new TypeError("executor must be a function.");
          var t;
          this.promise = new Promise(function (e) {
            t = e;
          });
          var n = this;
          this.promise.then(function (e) {
            if (n._listeners) {
              var t,
                i = n._listeners.length;
              for (t = 0; t < i; t++) n._listeners[t](e);
              n._listeners = null;
            }
          }),
            (this.promise.then = function (e) {
              var t,
                i = new Promise(function (e) {
                  n.subscribe(e), (t = e);
                }).then(e);
              return (
                (i.cancel = function () {
                  n.unsubscribe(t);
                }),
                i
              );
            }),
            e(function (e) {
              n.reason || ((n.reason = new i(e)), t(n.reason));
            });
        }
        (s.prototype.throwIfRequested = function () {
          if (this.reason) throw this.reason;
        }),
          (s.prototype.subscribe = function (e) {
            this.reason ? e(this.reason) : this._listeners ? this._listeners.push(e) : (this._listeners = [e]);
          }),
          (s.prototype.unsubscribe = function (e) {
            if (this._listeners) {
              var t = this._listeners.indexOf(e);
              -1 !== t && this._listeners.splice(t, 1);
            }
          }),
          (s.source = function () {
            var e;
            return {
              token: new s(function (t) {
                e = t;
              }),
              cancel: e,
            };
          }),
          (e.exports = s);
      },
      6502: function (e) {
        "use strict";
        e.exports = function (e) {
          return !(!e || !e.__CANCEL__);
        };
      },
      321: function (e, t, n) {
        "use strict";
        var i = n(4867),
          s = n(5327),
          o = n(782),
          r = n(3572),
          a = n(7185),
          l = n(4875),
          c = l.validators;
        function u(e) {
          (this.defaults = e), (this.interceptors = { request: new o(), response: new o() });
        }
        (u.prototype.request = function (e, t) {
          if (("string" == typeof e ? ((t = t || {}).url = e) : (t = e || {}), !t.url))
            throw new Error("Provided config url is not valid");
          (t = a(this.defaults, t)).method
            ? (t.method = t.method.toLowerCase())
            : this.defaults.method
            ? (t.method = this.defaults.method.toLowerCase())
            : (t.method = "get");
          var n = t.transitional;
          void 0 !== n &&
            l.assertOptions(
              n,
              {
                silentJSONParsing: c.transitional(c.boolean),
                forcedJSONParsing: c.transitional(c.boolean),
                clarifyTimeoutError: c.transitional(c.boolean),
              },
              !1
            );
          var i = [],
            s = !0;
          this.interceptors.request.forEach(function (e) {
            ("function" == typeof e.runWhen && !1 === e.runWhen(t)) ||
              ((s = s && e.synchronous), i.unshift(e.fulfilled, e.rejected));
          });
          var o,
            u = [];
          if (
            (this.interceptors.response.forEach(function (e) {
              u.push(e.fulfilled, e.rejected);
            }),
            !s)
          ) {
            var d = [r, void 0];
            for (Array.prototype.unshift.apply(d, i), d = d.concat(u), o = Promise.resolve(t); d.length; )
              o = o.then(d.shift(), d.shift());
            return o;
          }
          for (var h = t; i.length; ) {
            var m = i.shift(),
              p = i.shift();
            try {
              h = m(h);
            } catch (e) {
              p(e);
              break;
            }
          }
          try {
            o = r(h);
          } catch (e) {
            return Promise.reject(e);
          }
          for (; u.length; ) o = o.then(u.shift(), u.shift());
          return o;
        }),
          (u.prototype.getUri = function (e) {
            if (!e.url) throw new Error("Provided config url is not valid");
            return (e = a(this.defaults, e)), s(e.url, e.params, e.paramsSerializer).replace(/^\?/, "");
          }),
          i.forEach(["delete", "get", "head", "options"], function (e) {
            u.prototype[e] = function (t, n) {
              return this.request(a(n || {}, { method: e, url: t, data: (n || {}).data }));
            };
          }),
          i.forEach(["post", "put", "patch"], function (e) {
            u.prototype[e] = function (t, n, i) {
              return this.request(a(i || {}, { method: e, url: t, data: n }));
            };
          }),
          (e.exports = u);
      },
      782: function (e, t, n) {
        "use strict";
        var i = n(4867);
        function s() {
          this.handlers = [];
        }
        (s.prototype.use = function (e, t, n) {
          return (
            this.handlers.push({
              fulfilled: e,
              rejected: t,
              synchronous: !!n && n.synchronous,
              runWhen: n ? n.runWhen : null,
            }),
            this.handlers.length - 1
          );
        }),
          (s.prototype.eject = function (e) {
            this.handlers[e] && (this.handlers[e] = null);
          }),
          (s.prototype.forEach = function (e) {
            i.forEach(this.handlers, function (t) {
              null !== t && e(t);
            });
          }),
          (e.exports = s);
      },
      4097: function (e, t, n) {
        "use strict";
        var i = n(1793),
          s = n(7303);
        e.exports = function (e, t) {
          return e && !i(t) ? s(e, t) : t;
        };
      },
      5061: function (e, t, n) {
        "use strict";
        var i = n(481);
        e.exports = function (e, t, n, s, o) {
          var r = new Error(e);
          return i(r, t, n, s, o);
        };
      },
      3572: function (e, t, n) {
        "use strict";
        var i = n(4867),
          s = n(8527),
          o = n(6502),
          r = n(5655),
          a = n(5263);
        function l(e) {
          if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted))
            throw new a("canceled");
        }
        e.exports = function (e) {
          return (
            l(e),
            (e.headers = e.headers || {}),
            (e.data = s.call(e, e.data, e.headers, e.transformRequest)),
            (e.headers = i.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers)),
            i.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function (t) {
              delete e.headers[t];
            }),
            (e.adapter || r.adapter)(e).then(
              function (t) {
                return l(e), (t.data = s.call(e, t.data, t.headers, e.transformResponse)), t;
              },
              function (t) {
                return (
                  o(t) ||
                    (l(e),
                    t &&
                      t.response &&
                      (t.response.data = s.call(e, t.response.data, t.response.headers, e.transformResponse))),
                  Promise.reject(t)
                );
              }
            )
          );
        };
      },
      481: function (e) {
        "use strict";
        e.exports = function (e, t, n, i, s) {
          return (
            (e.config = t),
            n && (e.code = n),
            (e.request = i),
            (e.response = s),
            (e.isAxiosError = !0),
            (e.toJSON = function () {
              return {
                message: this.message,
                name: this.name,
                description: this.description,
                number: this.number,
                fileName: this.fileName,
                lineNumber: this.lineNumber,
                columnNumber: this.columnNumber,
                stack: this.stack,
                config: this.config,
                code: this.code,
                status: this.response && this.response.status ? this.response.status : null,
              };
            }),
            e
          );
        };
      },
      7185: function (e, t, n) {
        "use strict";
        var i = n(4867);
        e.exports = function (e, t) {
          t = t || {};
          var n = {};
          function s(e, t) {
            return i.isPlainObject(e) && i.isPlainObject(t)
              ? i.merge(e, t)
              : i.isPlainObject(t)
              ? i.merge({}, t)
              : i.isArray(t)
              ? t.slice()
              : t;
          }
          function o(n) {
            return i.isUndefined(t[n]) ? (i.isUndefined(e[n]) ? void 0 : s(void 0, e[n])) : s(e[n], t[n]);
          }
          function r(e) {
            if (!i.isUndefined(t[e])) return s(void 0, t[e]);
          }
          function a(n) {
            return i.isUndefined(t[n]) ? (i.isUndefined(e[n]) ? void 0 : s(void 0, e[n])) : s(void 0, t[n]);
          }
          function l(n) {
            return n in t ? s(e[n], t[n]) : n in e ? s(void 0, e[n]) : void 0;
          }
          var c = {
            url: r,
            method: r,
            data: r,
            baseURL: a,
            transformRequest: a,
            transformResponse: a,
            paramsSerializer: a,
            timeout: a,
            timeoutMessage: a,
            withCredentials: a,
            adapter: a,
            responseType: a,
            xsrfCookieName: a,
            xsrfHeaderName: a,
            onUploadProgress: a,
            onDownloadProgress: a,
            decompress: a,
            maxContentLength: a,
            maxBodyLength: a,
            transport: a,
            httpAgent: a,
            httpsAgent: a,
            cancelToken: a,
            socketPath: a,
            responseEncoding: a,
            validateStatus: l,
          };
          return (
            i.forEach(Object.keys(e).concat(Object.keys(t)), function (e) {
              var t = c[e] || o,
                s = t(e);
              (i.isUndefined(s) && t !== l) || (n[e] = s);
            }),
            n
          );
        };
      },
      6026: function (e, t, n) {
        "use strict";
        var i = n(5061);
        e.exports = function (e, t, n) {
          var s = n.config.validateStatus;
          n.status && s && !s(n.status)
            ? t(i("Request failed with status code " + n.status, n.config, null, n.request, n))
            : e(n);
        };
      },
      8527: function (e, t, n) {
        "use strict";
        var i = n(4867),
          s = n(5655);
        e.exports = function (e, t, n) {
          var o = this || s;
          return (
            i.forEach(n, function (n) {
              e = n.call(o, e, t);
            }),
            e
          );
        };
      },
      5655: function (e, t, n) {
        "use strict";
        var i = n(4867),
          s = n(6016),
          o = n(481),
          r = { "Content-Type": "application/x-www-form-urlencoded" };
        function a(e, t) {
          !i.isUndefined(e) && i.isUndefined(e["Content-Type"]) && (e["Content-Type"] = t);
        }
        var l,
          c = {
            transitional: { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 },
            adapter:
              (("undefined" != typeof XMLHttpRequest ||
                ("undefined" != typeof process && "[object process]" === Object.prototype.toString.call(process))) &&
                (l = n(5448)),
              l),
            transformRequest: [
              function (e, t) {
                return (
                  s(t, "Accept"),
                  s(t, "Content-Type"),
                  i.isFormData(e) || i.isArrayBuffer(e) || i.isBuffer(e) || i.isStream(e) || i.isFile(e) || i.isBlob(e)
                    ? e
                    : i.isArrayBufferView(e)
                    ? e.buffer
                    : i.isURLSearchParams(e)
                    ? (a(t, "application/x-www-form-urlencoded;charset=utf-8"), e.toString())
                    : i.isObject(e) || (t && "application/json" === t["Content-Type"])
                    ? (a(t, "application/json"),
                      (function (e, t, n) {
                        if (i.isString(e))
                          try {
                            return (0, JSON.parse)(e), i.trim(e);
                          } catch (e) {
                            if ("SyntaxError" !== e.name) throw e;
                          }
                        return (0, JSON.stringify)(e);
                      })(e))
                    : e
                );
              },
            ],
            transformResponse: [
              function (e) {
                var t = this.transitional || c.transitional,
                  n = t && t.silentJSONParsing,
                  s = t && t.forcedJSONParsing,
                  r = !n && "json" === this.responseType;
                if (r || (s && i.isString(e) && e.length))
                  try {
                    return JSON.parse(e);
                  } catch (e) {
                    if (r) {
                      if ("SyntaxError" === e.name) throw o(e, this, "E_JSON_PARSE");
                      throw e;
                    }
                  }
                return e;
              },
            ],
            timeout: 0,
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
            maxContentLength: -1,
            maxBodyLength: -1,
            validateStatus: function (e) {
              return e >= 200 && e < 300;
            },
            headers: { common: { Accept: "application/json, text/plain, */*" } },
          };
        i.forEach(["delete", "get", "head"], function (e) {
          c.headers[e] = {};
        }),
          i.forEach(["post", "put", "patch"], function (e) {
            c.headers[e] = i.merge(r);
          }),
          (e.exports = c);
      },
      7288: function (e) {
        e.exports = { version: "0.25.0" };
      },
      1849: function (e) {
        "use strict";
        e.exports = function (e, t) {
          return function () {
            for (var n = new Array(arguments.length), i = 0; i < n.length; i++) n[i] = arguments[i];
            return e.apply(t, n);
          };
        };
      },
      5327: function (e, t, n) {
        "use strict";
        var i = n(4867);
        function s(e) {
          return encodeURIComponent(e)
            .replace(/%3A/gi, ":")
            .replace(/%24/g, "$")
            .replace(/%2C/gi, ",")
            .replace(/%20/g, "+")
            .replace(/%5B/gi, "[")
            .replace(/%5D/gi, "]");
        }
        e.exports = function (e, t, n) {
          if (!t) return e;
          var o;
          if (n) o = n(t);
          else if (i.isURLSearchParams(t)) o = t.toString();
          else {
            var r = [];
            i.forEach(t, function (e, t) {
              null != e &&
                (i.isArray(e) ? (t += "[]") : (e = [e]),
                i.forEach(e, function (e) {
                  i.isDate(e) ? (e = e.toISOString()) : i.isObject(e) && (e = JSON.stringify(e)),
                    r.push(s(t) + "=" + s(e));
                }));
            }),
              (o = r.join("&"));
          }
          if (o) {
            var a = e.indexOf("#");
            -1 !== a && (e = e.slice(0, a)), (e += (-1 === e.indexOf("?") ? "?" : "&") + o);
          }
          return e;
        };
      },
      7303: function (e) {
        "use strict";
        e.exports = function (e, t) {
          return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
        };
      },
      4372: function (e, t, n) {
        "use strict";
        var i = n(4867);
        e.exports = i.isStandardBrowserEnv()
          ? {
              write: function (e, t, n, s, o, r) {
                var a = [];
                a.push(e + "=" + encodeURIComponent(t)),
                  i.isNumber(n) && a.push("expires=" + new Date(n).toGMTString()),
                  i.isString(s) && a.push("path=" + s),
                  i.isString(o) && a.push("domain=" + o),
                  !0 === r && a.push("secure"),
                  (document.cookie = a.join("; "));
              },
              read: function (e) {
                var t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
                return t ? decodeURIComponent(t[3]) : null;
              },
              remove: function (e) {
                this.write(e, "", Date.now() - 864e5);
              },
            }
          : {
              write: function () {},
              read: function () {
                return null;
              },
              remove: function () {},
            };
      },
      1793: function (e) {
        "use strict";
        e.exports = function (e) {
          return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
        };
      },
      6268: function (e, t, n) {
        "use strict";
        var i = n(4867);
        e.exports = function (e) {
          return i.isObject(e) && !0 === e.isAxiosError;
        };
      },
      7985: function (e, t, n) {
        "use strict";
        var i = n(4867);
        e.exports = i.isStandardBrowserEnv()
          ? (function () {
              var e,
                t = /(msie|trident)/i.test(navigator.userAgent),
                n = document.createElement("a");
              function s(e) {
                var i = e;
                return (
                  t && (n.setAttribute("href", i), (i = n.href)),
                  n.setAttribute("href", i),
                  {
                    href: n.href,
                    protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
                    host: n.host,
                    search: n.search ? n.search.replace(/^\?/, "") : "",
                    hash: n.hash ? n.hash.replace(/^#/, "") : "",
                    hostname: n.hostname,
                    port: n.port,
                    pathname: "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname,
                  }
                );
              }
              return (
                (e = s(window.location.href)),
                function (t) {
                  var n = i.isString(t) ? s(t) : t;
                  return n.protocol === e.protocol && n.host === e.host;
                }
              );
            })()
          : function () {
              return !0;
            };
      },
      6016: function (e, t, n) {
        "use strict";
        var i = n(4867);
        e.exports = function (e, t) {
          i.forEach(e, function (n, i) {
            i !== t && i.toUpperCase() === t.toUpperCase() && ((e[t] = n), delete e[i]);
          });
        };
      },
      4109: function (e, t, n) {
        "use strict";
        var i = n(4867),
          s = [
            "age",
            "authorization",
            "content-length",
            "content-type",
            "etag",
            "expires",
            "from",
            "host",
            "if-modified-since",
            "if-unmodified-since",
            "last-modified",
            "location",
            "max-forwards",
            "proxy-authorization",
            "referer",
            "retry-after",
            "user-agent",
          ];
        e.exports = function (e) {
          var t,
            n,
            o,
            r = {};
          return e
            ? (i.forEach(e.split("\n"), function (e) {
                if (
                  ((o = e.indexOf(":")), (t = i.trim(e.substr(0, o)).toLowerCase()), (n = i.trim(e.substr(o + 1))), t)
                ) {
                  if (r[t] && s.indexOf(t) >= 0) return;
                  r[t] = "set-cookie" === t ? (r[t] ? r[t] : []).concat([n]) : r[t] ? r[t] + ", " + n : n;
                }
              }),
              r)
            : r;
        };
      },
      8713: function (e) {
        "use strict";
        e.exports = function (e) {
          return function (t) {
            return e.apply(null, t);
          };
        };
      },
      4875: function (e, t, n) {
        "use strict";
        var i = n(7288).version,
          s = {};
        ["object", "boolean", "number", "function", "string", "symbol"].forEach(function (e, t) {
          s[e] = function (n) {
            return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
          };
        });
        var o = {};
        (s.transitional = function (e, t, n) {
          function s(e, t) {
            return "[Axios v" + i + "] Transitional option '" + e + "'" + t + (n ? ". " + n : "");
          }
          return function (n, i, r) {
            if (!1 === e) throw new Error(s(i, " has been removed" + (t ? " in " + t : "")));
            return (
              t &&
                !o[i] &&
                ((o[i] = !0),
                console.warn(s(i, " has been deprecated since v" + t + " and will be removed in the near future"))),
              !e || e(n, i, r)
            );
          };
        }),
          (e.exports = {
            assertOptions: function (e, t, n) {
              if ("object" != typeof e) throw new TypeError("options must be an object");
              for (var i = Object.keys(e), s = i.length; s-- > 0; ) {
                var o = i[s],
                  r = t[o];
                if (r) {
                  var a = e[o],
                    l = void 0 === a || r(a, o, e);
                  if (!0 !== l) throw new TypeError("option " + o + " must be " + l);
                } else if (!0 !== n) throw Error("Unknown option " + o);
              }
            },
            validators: s,
          });
      },
      4867: function (e, t, n) {
        "use strict";
        var i = n(1849),
          s = Object.prototype.toString;
        function o(e) {
          return Array.isArray(e);
        }
        function r(e) {
          return void 0 === e;
        }
        function a(e) {
          return "[object ArrayBuffer]" === s.call(e);
        }
        function l(e) {
          return null !== e && "object" == typeof e;
        }
        function c(e) {
          if ("[object Object]" !== s.call(e)) return !1;
          var t = Object.getPrototypeOf(e);
          return null === t || t === Object.prototype;
        }
        function u(e) {
          return "[object Function]" === s.call(e);
        }
        function d(e, t) {
          if (null != e)
            if (("object" != typeof e && (e = [e]), o(e)))
              for (var n = 0, i = e.length; n < i; n++) t.call(null, e[n], n, e);
            else for (var s in e) Object.prototype.hasOwnProperty.call(e, s) && t.call(null, e[s], s, e);
        }
        e.exports = {
          isArray: o,
          isArrayBuffer: a,
          isBuffer: function (e) {
            return (
              null !== e &&
              !r(e) &&
              null !== e.constructor &&
              !r(e.constructor) &&
              "function" == typeof e.constructor.isBuffer &&
              e.constructor.isBuffer(e)
            );
          },
          isFormData: function (e) {
            return "[object FormData]" === s.call(e);
          },
          isArrayBufferView: function (e) {
            return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
              ? ArrayBuffer.isView(e)
              : e && e.buffer && a(e.buffer);
          },
          isString: function (e) {
            return "string" == typeof e;
          },
          isNumber: function (e) {
            return "number" == typeof e;
          },
          isObject: l,
          isPlainObject: c,
          isUndefined: r,
          isDate: function (e) {
            return "[object Date]" === s.call(e);
          },
          isFile: function (e) {
            return "[object File]" === s.call(e);
          },
          isBlob: function (e) {
            return "[object Blob]" === s.call(e);
          },
          isFunction: u,
          isStream: function (e) {
            return l(e) && u(e.pipe);
          },
          isURLSearchParams: function (e) {
            return "[object URLSearchParams]" === s.call(e);
          },
          isStandardBrowserEnv: function () {
            return (
              ("undefined" == typeof navigator ||
                ("ReactNative" !== navigator.product &&
                  "NativeScript" !== navigator.product &&
                  "NS" !== navigator.product)) &&
              "undefined" != typeof window &&
              "undefined" != typeof document
            );
          },
          forEach: d,
          merge: function e() {
            var t = {};
            function n(n, i) {
              c(t[i]) && c(n) ? (t[i] = e(t[i], n)) : c(n) ? (t[i] = e({}, n)) : o(n) ? (t[i] = n.slice()) : (t[i] = n);
            }
            for (var i = 0, s = arguments.length; i < s; i++) d(arguments[i], n);
            return t;
          },
          extend: function (e, t, n) {
            return (
              d(t, function (t, s) {
                e[s] = n && "function" == typeof t ? i(t, n) : t;
              }),
              e
            );
          },
          trim: function (e) {
            return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
          },
          stripBOM: function (e) {
            return 65279 === e.charCodeAt(0) && (e = e.slice(1)), e;
          },
        };
      },
    },
    t = {};
  function n(i) {
    var s = t[i];
    if (void 0 !== s) return s.exports;
    var o = (t[i] = { exports: {} });
    return e[i](o, o.exports, n), o.exports;
  }
  (n.n = function (e) {
    var t =
      e && e.__esModule
        ? function () {
            return e.default;
          }
        : function () {
            return e;
          };
    return n.d(t, { a: t }), t;
  }),
    (n.d = function (e, t) {
      for (var i in t) n.o(t, i) && !n.o(e, i) && Object.defineProperty(e, i, { enumerable: !0, get: t[i] });
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (function () {
      "use strict";
      var e;
      !(function (e) {
        (e.PageLoad = "PageLoad"), (e.Other = "Other");
      })(e || (e = {}));
      const t = (t, n, i) => {
        var s;
        (s = { type: e.Other, event: t, linkName: n, data: i }),
          (window.NCIDataLayer = window.NCIDataLayer || []),
          window.NCIDataLayer.push(s);
      };
      var i;
      !(function (e) {
        (e.English = "Spanish to English"), (e.Spanish = "English to Spanish");
      })(i || (i = {}));
      const s = (e) => {
          t("PreHeader:LinkClick", "PreHeader:LinkClick", {
            linkText: e,
            location: "PreHeader",
            action: "Link Click",
            preHeaderElement: "Language",
          });
        },
        o = (e) => {
          switch (e.target.getAttribute("hreflang")) {
            case "es":
              s(i.Spanish);
              break;
            case "en":
              s(i.English);
          }
        };
      class r {
        constructor(e, t) {
          if (
            ((this.optionsListNumber = null),
            (this.optionClickEventListener = (e) => this.handleOptionClick(e)),
            (this.inputEventListener = () => this.handleInput()),
            (this.keyPressEventListener = (e) => this.handleKeypress(e)),
            (this.submissionEventListener = () => this.handleFormSubmission()),
            (this.outsideClickListener = (e) => this.handleOutsideClick(e)),
            (this.autocompleteInput = e),
            (this.autocompleteInputId = this.autocompleteInput.id),
            (this.options = Object.assign(Object.assign({ autocompleteSource: void 0 }, r.optionDefaults), t)),
            !this.options.autocompleteSource)
          )
            throw "option autocompleteSource is undefined";
          for (
            this.optionsListDisplayed = !1,
              this.selectedOptionInfo = {
                inputtedTextWhenSelected: "",
                selectedOptionIndex: null,
                selectedOptionValue: null,
              },
              this.adaptor = this.options.autocompleteSource,
              this.acForm = this.autocompleteInput.closest("form"),
              this.acInputParent = this.autocompleteInput.parentElement,
              this.autocompleteContainer = document.createElement("div"),
              this.autocompleteContainer.classList.add("nci-autocomplete");
            this.acInputParent.firstChild;

          ) {
            const e = this.acInputParent.firstChild;
            this.acInputParent.removeChild(this.acInputParent.firstChild), this.autocompleteContainer.appendChild(e);
          }
          this.acInputParent.append(this.autocompleteContainer),
            (this.listboxWrapper = document.createElement("div")),
            (this.listbox = document.createElement("div")),
            (this.announcer = document.createElement("div")),
            this.initialize();
        }
        static create(e, t) {
          if (!(e instanceof HTMLInputElement)) throw "Must be an input element to be an autocomplete";
          return new this(e, t);
        }
        initialize() {
          this.updateDom();
        }
        updateDom() {
          this.listboxWrapper.setAttribute("id", this.autocompleteInputId + "-termswrapper"),
            this.listboxWrapper.classList.add("nci-autocomplete__listbox"),
            "" !== this.options.listboxClasses && this.listboxWrapper.classList.add(this.options.listboxClasses),
            this.listbox.setAttribute("id", this.autocompleteInputId + "-terms"),
            this.listbox.setAttribute("tabindex", "-1"),
            this.listbox.setAttribute("role", "listbox"),
            this.listboxWrapper.append(this.listbox),
            this.autocompleteContainer.append(this.listboxWrapper),
            this.announcer.classList.add("nci-autocomplete__status"),
            this.announcer.setAttribute("aria-live", "assertive"),
            this.autocompleteContainer.prepend(this.announcer),
            this.autocompleteInput.setAttribute("role", "combobox"),
            this.autocompleteInput.setAttribute("aria-autocomplete", "list"),
            this.autocompleteInput.setAttribute("aria-haspopup", "listbox"),
            this.autocompleteInput.setAttribute("aria-expanded", "false"),
            this.autocompleteInput.setAttribute("aria-owns", this.autocompleteInputId + "-terms"),
            this.autocompleteInput.setAttribute("aria-activedescendant", ""),
            this.addEventListeners();
        }
        addEventListeners() {
          this.autocompleteInput.addEventListener("input", this.inputEventListener, !0),
            this.autocompleteInput.addEventListener("keydown", this.keyPressEventListener, !0),
            this.acForm.addEventListener("submit", this.submissionEventListener, !0),
            window.addEventListener("click", this.outsideClickListener, !0);
        }
        closeListbox() {
          this.autocompleteInput.removeAttribute("aria-activedescendant"),
            this.autocompleteInput.setAttribute("aria-expanded", "false"),
            (this.announcer.innerHTML = ""),
            (this.listbox.innerHTML = ""),
            this.listboxWrapper.classList.remove("active");
        }
        handleFormSubmission() {
          const e = Object.assign(
            {
              searchText: this.autocompleteInput.value,
              optionsPresented: this.optionsListDisplayed,
              optionSetSize: this.optionsListNumber,
            },
            this.selectedOptionInfo
          );
          this.autocompleteInput.dispatchEvent(
            new CustomEvent("nci-autocomplete:formSubmission", { bubbles: !0, detail: e })
          ),
            (this.selectedOptionInfo = {
              inputtedTextWhenSelected: "",
              selectedOptionIndex: null,
              selectedOptionValue: null,
            });
        }
        handleInput() {
          return (
            (e = this),
            (t = void 0),
            (i = function* () {
              if (this.autocompleteInput.value.length >= this.options.minCharCount) {
                const e = yield this.adaptor.getAutocompleteSuggestions(this.autocompleteInput.value);
                this.buildTermsList(e);
              } else
                this.options.minPlaceholderMsg &&
                this.autocompleteInput.value.length < this.options.minCharCount &&
                this.autocompleteInput.value.length > 0
                  ? ((this.optionsListDisplayed = !1),
                    (this.listbox.innerHTML = `<div class="nci-autocomplete__option"><span class="min-placeholder-message">${this.options.minPlaceholderMsg}</span></div>`),
                    this.listboxWrapper.classList.add("active"))
                  : ((this.optionsListDisplayed = !1), this.closeListbox());
            }),
            new ((n = void 0) || (n = Promise))(function (s, o) {
              function r(e) {
                try {
                  l(i.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function a(e) {
                try {
                  l(i.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function l(e) {
                var t;
                e.done
                  ? s(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(r, a);
              }
              l((i = i.apply(e, t || [])).next());
            })
          );
          var e, t, n, i;
        }
        handleOutsideClick(e) {
          this.listboxWrapper.classList.contains("active") &&
            (e.target.matches("nci-autocomplete__option") || this.closeListbox());
        }
        handleKeypress(e) {
          var t;
          const n = e,
            i = (null === (t = this.listbox.querySelectorAll(".highlight")) || void 0 === t ? void 0 : t.length) > 0;
          switch (n.key) {
            case "Escape":
            case "Tab":
              this.closeListbox();
              break;
            case "Enter":
              return i ? (e.preventDefault(), e.stopPropagation(), this.selectOption(i)) : void 0;
            case "ArrowRight":
              return this.selectOption(i);
            case "ArrowUp":
              return e.preventDefault(), e.stopPropagation(), this.moveUp(i);
            case "ArrowDown":
              return e.preventDefault(), e.stopPropagation(), this.moveDown(i);
            default:
              return;
          }
        }
        moveUp(e) {
          if (e) {
            const e = this.listbox.querySelector(".highlight");
            e.setAttribute("aria-selected", "false"), e.classList.remove("highlight");
            const t = e.previousSibling;
            t.setAttribute("aria-selected", "true"),
              t.classList.add("highlight"),
              this.autocompleteInput.setAttribute("aria-activedescendant", t.id);
          } else {
            const e = this.listbox.querySelectorAll(".nci-autocomplete__option"),
              t = e[e.length - 1];
            null != t &&
              (t.classList.add("highlight"),
              t.setAttribute("aria-selected", "true"),
              this.autocompleteInput.setAttribute("aria-activedescendant", t.id));
          }
        }
        moveDown(e) {
          if (e) {
            const e = this.listbox.querySelector(".highlight");
            e.setAttribute("aria-selected", "false"), e.classList.remove("highlight");
            const t = e.nextSibling;
            t.setAttribute("aria-selected", "true"),
              t.classList.add("highlight"),
              this.autocompleteInput.setAttribute("aria-activedescendant", t.id);
          } else {
            const e = this.listbox.querySelectorAll(".nci-autocomplete__option")[0];
            e.classList.add("highlight"),
              e.setAttribute("aria-selected", "true"),
              this.autocompleteInput.setAttribute("aria-activedescendant", e.id);
          }
        }
        selectOption(e) {
          if (e && this.autocompleteInput) {
            const e = this.listbox.querySelector(".highlight"),
              t = null == e ? void 0 : e.querySelector("span");
            (this.selectedOptionInfo = {
              inputtedTextWhenSelected: this.autocompleteInput.value,
              selectedOptionValue: t.getAttribute("aria-label") || "",
              selectedOptionIndex: Number(e.getAttribute("aria-posinset") || "") || 0,
            }),
              this.autocompleteInput.dispatchEvent(
                new CustomEvent("nci-autocomplete:optionSelected", { detail: this.selectedOptionInfo })
              ),
              this.autocompleteInput.removeAttribute("aria-activedescendant"),
              (this.autocompleteInput.value = t.getAttribute("aria-label") || ""),
              this.autocompleteInput.focus(),
              this.closeListbox();
          }
        }
        markInputMatch(e) {
          return e.replace(new RegExp(this.autocompleteInput.value, "gi"), (e) => `<mark>${e}</mark>`);
        }
        buildTermsList(e) {
          if ((this.updateAnnouncer(e.length), e.length < 1))
            (this.optionsListDisplayed = !1),
              (this.listbox.innerHTML = ""),
              this.listboxWrapper.classList.remove("active"),
              (this.optionsListNumber = 0),
              this.closeListbox();
          else {
            const t = e.map(
              (t, n) => (
                (this.optionsListNumber = e.length),
                n < this.options.maxOptionsCount
                  ? `<div \n            class="nci-autocomplete__option" \n            tabindex="-1" \n            role="option" \n            aria-posinset="${n}" \n            aria-setsize="${
                      e.length
                    }" \n            id="term-${n}">\n              <span aria-label="${t}">${
                      this.options.highlightMatchingText ? this.markInputMatch(t) : t
                    }</span>\n            </div>`
                  : ""
              )
            );
            (this.listbox.innerHTML = t.join("")),
              this.listboxWrapper.classList.add("active"),
              this.autocompleteInput.setAttribute("aria-expanded", "true"),
              (this.optionsListDisplayed = !0),
              document.querySelectorAll(`#${this.autocompleteInputId}-terms .nci-autocomplete__option`).forEach((e) => {
                e.addEventListener("click", this.optionClickEventListener, !0);
              });
          }
        }
        handleOptionClick(e) {
          const t = e.currentTarget,
            n = t.querySelector("span").getAttribute("aria-label") || "";
          (this.selectedOptionInfo = {
            inputtedTextWhenSelected: this.autocompleteInput.value,
            selectedOptionValue: n,
            selectedOptionIndex: Number(t.getAttribute("aria-posinset")),
          }),
            this.autocompleteInput.dispatchEvent(
              new CustomEvent("nci-autocomplete:optionSelected", { detail: this.selectedOptionInfo })
            ),
            (this.autocompleteInput.value = n),
            this.autocompleteInput.focus(),
            this.closeListbox();
        }
        updateAnnouncer(e) {
          this.announcer.innerHTML =
            e >= 1
              ? "es" === document.documentElement.lang
                ? `${e.toString()} sugerencias automáticas. Use flecha arriba o flecha abajo para escuchar las opciones.`
                : `${e.toString()} suggestions found, use up and down arrows to review`
              : "";
        }
      }
      r.optionDefaults = {
        highlightMatchingText: !0,
        maxOptionsCount: 10,
        minCharCount: 3,
        minPlaceholderMsg: "",
        listboxClasses: "",
        optionSetSize: null,
      };
      class a {
        constructor(e, t) {
          (this.customEvents = {}),
            (this.clickEventListener = () => this.handleClick()),
            (this.element = e),
            (this.options = t),
            (this.collapseHeader = document.createElement("button")),
            (this.heading = this.element.querySelector(`.${this.options.collapseButtonClass}`)),
            (this.list = this.element.querySelector(".usa-list--unstyled")),
            (this.listHeader = document.createElement("span")),
            this.initialize();
        }
        unregister() {
          this.element.classList.remove("hidden"), this.toggleCollapseA11y(!1);
          const e = this.collapseHeader.innerHTML;
          this.collapseHeader.remove(),
            this.listHeader.remove(),
            this.list.removeAttribute("id"),
            this.list.removeAttribute("aria-label"),
            this.heading.classList.add(this.options.collapseButtonClass),
            (this.heading.innerHTML = e),
            this.removeEventListeners();
        }
        initialize() {
          this.createCustomEvents(), this.addEventListeners(), this.updateDom(), this.toggleCollapse(!0);
        }
        updateDom() {
          const e = this.heading.innerHTML,
            t = e.replace(/ /g, "-").toLowerCase();
          this.heading.classList.remove(this.options.collapseButtonClass),
            (this.heading.innerHTML = ""),
            this.listHeader.classList.add(this.options.collapseButtonClass, "usa-footer__nci-list-header"),
            (this.listHeader.innerHTML = e),
            this.collapseHeader.classList.add(this.options.collapseButtonClass, "usa-footer__nci-collapse-header"),
            this.collapseHeader.setAttribute("aria-controls", t),
            this.collapseHeader.setAttribute("aria-expanded", "false"),
            (this.collapseHeader.innerHTML = e),
            this.list.setAttribute("id", t),
            this.list.setAttribute("aria-label", e),
            this.heading.append(this.listHeader),
            this.heading.append(this.collapseHeader);
        }
        toggleCollapse(e) {
          this.element.querySelector(".usa-list").classList.toggle("hidden", e), this.toggleCollapseA11y(e);
          const t = e ? "collapse" : "expand";
          this.element.dispatchEvent(this.customEvents[t]);
        }
        toggleCollapseA11y(e) {
          this.collapseHeader.setAttribute("aria-expanded", String(!e)),
            this.list.setAttribute("aria-hidden", String(e)),
            (this.list.hidden = e),
            (this.list.hidden = e);
        }
        addEventListeners() {
          this.collapseHeader.addEventListener("click", this.clickEventListener);
        }
        removeEventListeners() {
          this.collapseHeader.removeEventListener("click", this.clickEventListener);
        }
        handleClick() {
          this.element.querySelector(".usa-list").classList.contains("hidden")
            ? this.toggleCollapse(!1)
            : this.toggleCollapse(!0);
        }
        createCustomEvents() {
          ["collapse", "expand"].forEach((e) => {
            this.customEvents[e] = new CustomEvent(`${this.options.collapseEventListenerLabel}:${e}`, {
              bubbles: !0,
              detail: this.element,
            });
          });
        }
      }
      class l {
        constructor(e) {
          (this.scrollListener = () => this.handleScroll()), (this.element = e), this.initialize();
        }
        handleScroll() {
          window.scrollY > 0
            ? (this.element.classList.remove("hide"), this.element.classList.add("show"))
            : (this.element.classList.remove("show"), this.element.classList.add("hide"));
        }
        unregister() {
          this.element.classList.remove("show", "hide", "usa-footer__nci-return-to-top"),
            this.element.classList.add("grid-container", "usa-footer__return-to-top");
        }
        initialize() {
          this.element.classList.remove("grid-container", "usa-footer__return-to-top"),
            this.element.classList.add("usa-footer__nci-return-to-top", "hide"),
            window.addEventListener("scroll", this.scrollListener, !1);
        }
      }
      class c {
        constructor(e, t) {
          (this.customEvents = {}),
            (this.submitEventListener = (e) => this.handleSubmit(e)),
            (this.form = e),
            (this.options = t),
            (this.invalidEmailAlert = this.createInvalidEmailAlert());
          const n = c._components.get(this.form);
          n && n.unregister(), c._components.set(this.form, this), this.initialize();
        }
        static create(e, t) {
          if (!(e instanceof HTMLElement)) throw "Element is not an HTMLElement";
          return this._components.get(e) || new this(e, t);
        }
        unregister() {
          this.removeEventListeners(),
            this.toggleFormErrors(!0),
            this.invalidEmailAlert.remove(),
            c._components.delete(this.form);
        }
        initialize() {
          this.addEventListeners(), this.createCustomEvents(), this.addMessage();
        }
        addEventListeners() {
          this.form.addEventListener("submit", this.submitEventListener);
        }
        removeEventListeners() {
          this.form.removeEventListener("submit", this.submitEventListener);
        }
        handleSubmit(e) {
          e.preventDefault();
          const t = this.form,
            n = t.elements.namedItem("email");
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(n.value)
            ? (this.toggleFormErrors(!0), this.form.dispatchEvent(this.customEvents.submit), t.submit())
            : (this.toggleFormErrors(!1), this.form.dispatchEvent(this.customEvents.error), n.focus());
        }
        createInvalidEmailAlert() {
          const e = document.createElement("span");
          return (
            e.classList.add("usa-error-message", "hidden"),
            (e.id = "email-error-message"),
            (e.innerHTML = this.options.subscribeInvalidEmailAlert),
            e.setAttribute("aria-hidden", String(!0)),
            e.setAttribute("role", "alert"),
            e
          );
        }
        addMessage() {
          const e = this.form.querySelector(".usa-input");
          e.setAttribute("aria-describedby", this.invalidEmailAlert.id), e.before(this.invalidEmailAlert);
        }
        toggleFormErrors(e) {
          const t = this.form.querySelector(".usa-form-group");
          e ? t.classList.remove("usa-form-group--error") : t.classList.add("usa-form-group--error");
          const n = this.form.querySelector(".usa-label");
          e ? n.classList.remove("usa-label--error") : n.classList.add("usa-label--error");
          const i = this.form.querySelector(".usa-input");
          e ? i.classList.remove("usa-input--error") : i.classList.add("usa-input--error");
          const s = this.form.querySelector(".usa-error-message");
          e ? s.classList.add("hidden") : s.classList.remove("hidden"), s.setAttribute("aria-hidden", String(e));
        }
        createCustomEvents() {
          ["submit", "error"].forEach((e) => {
            this.customEvents[e] = new CustomEvent(`${this.options.subscribeEventListenerLabel}:${e}`, {
              detail: this.form,
            });
          });
        }
      }
      c._components = new Map();
      class u {
        constructor(e, t) {
          (this.collapses = []),
            (this.resizeEventListener = (e) => this.handleResize(e)),
            (this.element = e),
            (this.options = Object.assign(Object.assign({}, u.optionDefaults), t)),
            (this.collapseMediaQuery = matchMedia(`(min-width: ${this.options.collapseWidth}px)`));
          const n = u._components.get(this.element);
          n && n.unregister(), u._components.set(this.element, this), this.initialize();
        }
        static create(e, t) {
          if (!(e instanceof HTMLElement)) throw "Element is not an HTMLElement";
          return this._components.get(e) || new this(e, t);
        }
        static autoInit() {
          document.addEventListener("DOMContentLoaded", () => {
            Array.from(document.getElementsByClassName("usa-footer")).forEach((e) => {
              this.create(e);
            });
          });
        }
        unregister() {
          this.form && (this.form.unregister(), (this.form = void 0)),
            this.backToTop && (this.backToTop.unregister(), (this.backToTop = void 0)),
            this.unregisterCollapses(),
            this.removeEventListeners(),
            u._components.delete(this.element);
        }
        unregisterCollapses() {
          this.collapses.forEach((e) => {
            e.unregister();
          }),
            (this.collapses = []);
        }
        initialize() {
          this.createSubscribe(),
            this.addEventListeners(),
            this.createBackToTop(),
            window.innerWidth < this.options.collapseWidth && this.createCollapsibleSections();
        }
        handleResize(e) {
          e.matches ? this.unregisterCollapses() : this.createCollapsibleSections();
        }
        createCollapsibleSections() {
          this.queryCollapsibleSections().forEach((e, t) => {
            this.collapses[t] = new a(e, this.options);
          });
        }
        queryCollapsibleSections() {
          return Array.from(this.element.querySelectorAll(".usa-footer__primary-content--collapsible"));
        }
        createSubscribe() {
          const e = this.element.querySelector("form");
          e && (this.form = c.create(e, this.options));
        }
        createBackToTop() {
          const e = this.element.getElementsByClassName("usa-footer__return-to-top")[0];
          e && (this.backToTop = new l(e));
        }
        addEventListeners() {
          this.collapseMediaQuery.addEventListener("change", this.resizeEventListener);
        }
        removeEventListeners() {
          this.collapseMediaQuery.removeEventListener("change", this.resizeEventListener);
        }
      }
      (u.optionDefaults = {
        collapseButtonClass: "usa-footer__primary-link",
        collapseClass: "usa-footer__primary-content--collapsible",
        collapseWidth: 480,
        collapseEventListenerLabel: "usa-footer:nav-links",
        subscribeInvalidEmailAlert: "Enter a valid email address",
        subscribeEventListenerLabel: "usa-footer:sign-up",
      }),
        (u._components = new Map());
      class d {
        constructor(e, t) {
          (this.customEvents = {}),
            (this.eventListener = () => this.handleClose()),
            (this.element = e),
            (this.options = t),
            (this.button = this.createButton()),
            this.initialize();
        }
        unregister() {
          this.removeEventListeners(), (this.element.style.display = ""), this.button.remove();
        }
        initialize() {
          this.hideSiteAlert(), this.createCustomEvents(), this.addButton(), this.addEventListeners();
        }
        createButton() {
          const e = document.createElement("button");
          return (
            e.classList.add("usa-alert__nci-button", this.options.closeButtonClass),
            e.setAttribute("aria-label", this.options.closeAriaLabel),
            (e.innerHTML +=
              '<svg class="usa-icon" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M0 13.0332964L13.0332964 0M13.0332964 13.0332964L0 0" transform="translate(1 1)"/></svg>'),
            e
          );
        }
        hideSiteAlert() {
          var e;
          "hidden" ===
            (null === (e = document.cookie.match(`(^|;)\\s*NCISiteAlert${this.element.id}\\s*=\\s*([^;]+)`)) ||
            void 0 === e
              ? void 0
              : e.pop()) && (this.element.style.display = "none");
        }
        addButton() {
          this.element.querySelector(".usa-alert").append(this.button);
        }
        addEventListeners() {
          this.button.addEventListener("click", this.eventListener);
        }
        removeEventListeners() {
          this.button.removeEventListener("click", this.eventListener);
        }
        handleClose() {
          (document.cookie = `NCISiteAlert${this.element.id}=hidden; Path=${this.options.closeCookiePath}`),
            this.hideSiteAlert(),
            this.element.dispatchEvent(this.customEvents.close);
        }
        createCustomEvents() {
          this.customEvents.close = new CustomEvent(`${this.options.closeEventListenerLabel}:close`, {
            detail: this.element,
          });
        }
      }
      class h {
        constructor(e, t) {
          (this.customEvents = {}),
            (this.eventListener = () => this.handleClick()),
            (this.element = e),
            (this.options = t),
            (this.collapsibleContent = this.element.querySelector(".usa-alert__nci-content")),
            this.collapsibleContent.setAttribute("id", `${this.element.id}-content`),
            (this.button = this.createButton()),
            this.initialize();
        }
        unregister() {
          this.collapsibleContent.classList.remove("hidden"),
            this.toggleCollapseA11y(),
            this.button.remove(),
            this.removeEventListeners();
        }
        initialize() {
          var e;
          this.createCustomEvents(), this.addButton(), this.addEventListeners();
          const t =
            null === (e = document.cookie.match(`(^|;)\\s*NCISiteAlert${this.element.id}\\s*=\\s*([^;]+)`)) ||
            void 0 === e
              ? void 0
              : e.pop();
          t ? this.setFromCookie(t) : this.toggleCollapse();
        }
        createButton() {
          const e = document.createElement("button");
          return (
            e.classList.add("usa-alert__nci-button", this.options.collapseButtonClass),
            e.setAttribute("aria-controls", this.collapsibleContent.id),
            e.setAttribute("aria-expanded", "false"),
            e.setAttribute("aria-label", this.options.collapseAriaLabel),
            (e.innerHTML =
              '<svg class="usa-icon" role="img" aria-hidden="true" viewBox="0 0 64 39"><path fill="currentColor" d="M.655 34.187c-.427-.437-.64-.937-.64-1.503 0-.566.213-1.067.64-1.502L30.542.756c.427-.436.918-.653 1.474-.653.555 0 1.048.218 1.474.653l29.884 30.426c.428.435.642.936.642 1.502s-.213 1.066-.642 1.501l-3.206 3.265c-.427.436-.919.653-1.475.653-.555 0-1.047-.217-1.475-.653L32.016 11.79 6.81 37.45c-.427.436-.919.653-1.474.653-.556 0-1.048-.217-1.475-.653L.655 34.187z"></path></svg>'),
            e
          );
        }
        addButton() {
          this.element.querySelector(".usa-alert__nci-header").append(this.button);
        }
        toggleCollapse() {
          this.collapsibleContent.classList.toggle("hidden"), this.toggleCollapseA11y();
          const e = this.collapsibleContent.classList.contains("hidden") ? "collapse" : "expand";
          this.element.dispatchEvent(this.customEvents[e]),
            (document.cookie = `NCISiteAlert${this.element.id}=${e}; Path=${this.options.collapseCookiePath}`);
        }
        toggleCollapseA11y() {
          const e = this.collapsibleContent.classList.contains("hidden");
          this.button.setAttribute("aria-expanded", String(!e));
          const t = this.button.getAttribute("aria-controls");
          this.element.querySelector(`#${t}`).setAttribute("aria-hidden", String(e));
        }
        setFromCookie(e) {
          "collapse" === e
            ? this.collapsibleContent.classList.add("hidden")
            : "expand" === e && this.collapsibleContent.classList.remove("hidden"),
            this.toggleCollapseA11y();
        }
        addEventListeners() {
          this.button.addEventListener("click", this.eventListener);
        }
        removeEventListeners() {
          this.button.removeEventListener("click", this.eventListener);
        }
        handleClick() {
          this.toggleCollapse();
        }
        createCustomEvents() {
          ["collapse", "expand"].forEach((e) => {
            this.customEvents[e] = new CustomEvent(`${this.options.collapseEventListenerLabel}:${e}`, {
              detail: this.element,
            });
          });
        }
      }
      class m {
        constructor(e, t) {
          (this.element = e), (this.options = Object.assign(Object.assign({}, m.optionDefaults), t));
          const n = m._components.get(this.element);
          n && n.unregister(), m._components.set(this.element, this), this.initialize();
        }
        static create(e, t) {
          if (!(e instanceof HTMLElement)) throw "Element is not an HTMLElement";
          return this._components.get(e) || new this(e, t);
        }
        static autoInit() {
          document.addEventListener("DOMContentLoaded", () => {
            Array.from(document.getElementsByClassName("usa-site-alert")).forEach((e) => {
              var t;
              const n = e,
                i = "true" === (null === (t = n.dataset.siteAlertClosable) || void 0 === t ? void 0 : t.toLowerCase());
              m.create(n, { closeable: i });
            });
          });
        }
        unregister() {
          this.collapse && this.collapse.unregister(),
            this.closeButton && this.closeButton.unregister(),
            m._components.delete(this.element);
        }
        initialize() {
          this.createId(), this.createCloseButton(), this.createCollapse();
        }
        createId() {
          const e = Array.from(document.querySelectorAll(".usa-site-alert"));
          this.element.id = `site-alert-${e.indexOf(this.element)}`;
        }
        createCloseButton() {
          this.options.closeable && this.element.id && (this.closeButton = new d(this.element, this.options));
        }
        createCollapse() {
          this.element.classList.contains("usa-site-alert--nci-standard") &&
            this.element.id &&
            (this.collapse = new h(this.element, this.options));
        }
      }
      (m.optionDefaults = {
        closeable: !1,
        closeAriaLabel: "Dismiss alert",
        closeButtonClass: "usa-alert__nci-button--close",
        closeEventListenerLabel: "usa-site-alert:close-button",
        closeCookiePath: "/",
        collapseAriaLabel: "Toggle alert message",
        collapseButtonClass: "usa-alert__nci-button--toggle",
        collapseCookiePath: "/",
        collapseEventListenerLabel: "usa-site-alert:content",
      }),
        (m._components = new Map());
      class p {
        constructor() {
          (this.useUrlForNavigationId = !0), console.warn("Mega menu source not specified");
        }
        getMegaMenuContent() {
          return null;
        }
      }
      var v = function (e, t, n, i) {
        return new (n || (n = Promise))(function (s, o) {
          function r(e) {
            try {
              l(i.next(e));
            } catch (e) {
              o(e);
            }
          }
          function a(e) {
            try {
              l(i.throw(e));
            } catch (e) {
              o(e);
            }
          }
          function l(e) {
            var t;
            e.done
              ? s(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(r, a);
          }
          l((i = i.apply(e, t || [])).next());
        });
      };
      class f {
        constructor() {
          (this.useUrlForNavigationId = !0),
            (this.lang = document.documentElement.lang),
            (this.primaryNavItems = Array.from(document.querySelectorAll(".nci-header-nav__primary-item a"))),
            (this.items = [{ id: 0, label: "Error", path: "/", langcode: this.lang, hasChildren: !1 }]);
        }
        getInitialMenuId() {
          return v(this, void 0, void 0, function* () {
            return 0;
          });
        }
        getNavigationLevel(e) {
          return v(this, void 0, void 0, function* () {
            return this.createDefaultMobileMenu(e);
          });
        }
        createDefaultMobileMenu(e) {
          return (
            (this.items = this.primaryNavItems.map((e, t) => {
              const n = e.href;
              return { id: t, label: e.textContent, path: n, langcode: this.lang, hasChildren: !1 };
            })),
            { id: e, label: "", path: "/", langcode: this.lang, hasChildren: !0, items: this.items, parent: null }
          );
        }
      }
      class g {
        constructor(e) {
          (this.focusableContent = []),
            (this.eventListener = (e) => this.checkTrap(e)),
            (this.element = e),
            (this.focusableElements = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        }
        toggleTrap(e, t) {
          e
            ? (this.findFocusableElements(t), t.addEventListener("keydown", this.eventListener, !0))
            : t.removeEventListener("keydown", this.eventListener, !0);
        }
        findFocusableElements(e) {
          (this.context = e),
            (this.focusableContent = Array.from(e.querySelectorAll(this.focusableElements))),
            (this.firstFocusableElement = e.querySelectorAll(this.focusableElements)[0]),
            (this.lastFocusableElement = this.focusableContent[this.focusableContent.length - 1]);
        }
        checkTrap(e) {
          const t = e;
          ("Tab" === t.key || 9 === parseInt(t.code, 10)) &&
            (t.shiftKey
              ? document.activeElement === this.firstFocusableElement &&
                (this.lastFocusableElement.focus(), t.preventDefault())
              : document.activeElement === this.lastFocusableElement &&
                (this.firstFocusableElement.focus(), t.preventDefault()));
        }
      }
      var b = function (e, t, n, i) {
        return new (n || (n = Promise))(function (s, o) {
          function r(e) {
            try {
              l(i.next(e));
            } catch (e) {
              o(e);
            }
          }
          function a(e) {
            try {
              l(i.throw(e));
            } catch (e) {
              o(e);
            }
          }
          function l(e) {
            var t;
            e.done
              ? s(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(r, a);
          }
          l((i = i.apply(e, t || [])).next());
        });
      };
      class E {
        constructor(e, t) {
          (this.activeButton = null),
            (this.activeMenu = null),
            (this.customEvents = {}),
            (this.navItems = []),
            (this.loader = document.createElement("div")),
            (this.loaderContainer = document.createElement("div")),
            (this.offsetMenuClickListener = (e) => this.handleOffsetMenuClick(e)),
            (this.offsetMenuKeyPressListener = (e) => this.handleOffsetKeypress(e)),
            (this.element = e),
            (this.adaptor = t),
            (this.focusTrap = new g(this.element)),
            (this.content = document.createElement("template")),
            this.loader.classList.add("nci-is-loading", "hidden"),
            this.loaderContainer.classList.add("nci-megamenu", "hidden"),
            (this.loaderContainer.ariaLive = "polite"),
            (this.loaderContainer.ariaBusy = "true"),
            (this.loaderContainer.ariaAtomic = "true"),
            this.loaderContainer.appendChild(this.loader),
            this.initialize();
        }
        unregister() {
          this.navItems.forEach((e) => {
            this.unregisterMenuItem(e);
          }),
            this.removeEventListeners(),
            this.loader.remove(),
            this.loaderContainer.remove();
        }
        unregisterMenuItem(e) {
          ((e) => "NavItemWithMM" === e.type)(e)
            ? (e.button.removeEventListener("click", e.buttonListener), e.button.replaceWith(e.link))
            : ((e) => "NavItemLink" === e.type)(e) && e.link.removeEventListener("click", e.linkListener);
        }
        initialize() {
          console.log(this);
          //  const e = this.element.querySelectorAll(".nci-header-nav__primary-link");
          (this.navItems = Array.from(e).map((e) => {
            const t = this.createNavButton(e);
            return null === t
              ? { type: "NavItemLink", link: e, linkListener: this.addLinkEventListeners(e) }
              : { type: "NavItemWithMM", link: e, button: t, buttonListener: this.addButtonEventListeners(t) };
          })),
            this.createCustomEvents(),
            this.addOffsetMenuListeners();
        }
        createNavButton(e) {
          var t, n;
          if ("true" === (null === (t = e.dataset.megamenuDisabled) || void 0 === t ? void 0 : t.toLowerCase()))
            return null;
          const i = e.href;
          if ((null == i || "" === i) && this.adaptor.useUrlForNavigationId) {
            const t = (null !== (n = e.textContent) && void 0 !== n ? n : "").trim();
            return (
              console.error(
                `Navigation item, ${t}, does not have a data-menu-id element and adaptor is set to use ID.`
              ),
              null
            );
          }
          const s = e.dataset.menuId;
          if (null == s && !this.adaptor.useUrlForNavigationId)
            return (
              console.error(
                `Navigation item, ${i}, does not have a data-menu-id element and adaptor is set to use ID.`
              ),
              null
            );
          const o = document.createElement("button");
          return (
            (o.innerHTML = e.innerHTML),
            o.classList.add("usa-button", "nci-header-nav__primary-button"),
            o.setAttribute("aria-expanded", "false"),
            e.classList.contains("usa-current") && o.classList.add("usa-current"),
            i &&
              (o.setAttribute("data-href", i),
              o.setAttribute("aria-controls", `menu-${i.toString().replace(/[^\w\s]/gi, "")}`)),
            s && (o.setAttribute("data-menu-id", s), o.setAttribute("aria-controls", `menu-${s}`)),
            e.replaceWith(o),
            o
          );
        }
        addButtonEventListeners(e) {
          const t = (e) =>
            b(this, void 0, void 0, function* () {
              return this.handleButtonClick(e);
            });
          return e.addEventListener("click", t), t;
        }
        handleButtonClick(e) {
          return b(this, void 0, void 0, function* () {
            const t = e.target;
            yield this.toggleMegaMenu(t);
          });
        }
        addLinkEventListeners(e) {
          const t = (e) =>
            b(this, void 0, void 0, function* () {
              return this.handleLinkClick(e);
            });
          return e.addEventListener("click", t), t;
        }
        handleLinkClick(e) {
          var t, n;
          return b(this, void 0, void 0, function* () {
            const i = e.currentTarget,
              s = (null !== (t = i.textContent) && void 0 !== t ? t : "").trim();
            this.element.dispatchEvent(
              this.customEvents.linkclick({ label: s, href: null !== (n = i.href) && void 0 !== n ? n : "", link: i })
            );
          });
        }
        handleOffsetMenuClick(e) {
          this.activeButton && this.activeMenu && (e.composedPath().includes(this.element) || this.collapseMegaMenu());
        }
        handleOffsetKeypress(e) {
          this.activeButton && this.activeMenu && "Escape" === e.key && this.collapseMegaMenu();
        }
        toggleMegaMenu(e) {
          return b(this, void 0, void 0, function* () {
            this.activeButton === e
              ? this.collapseMegaMenu()
              : (this.activeButton && this.collapseMegaMenu(), yield this.expandMegaMenu(e));
          });
        }
        collapseMegaMenu() {
          if (this.activeButton && this.activeMenu) {
            const e = this.getDetailsForExpandCollapse(this.activeButton);
            this.focusTrap.toggleTrap(!1, this.activeButton),
              this.activeButton.setAttribute("aria-expanded", "false"),
              (this.activeButton = null),
              this.activeMenu.classList.add("hidden"),
              this.activeMenu.setAttribute("aria-hidden", "true"),
              this.activeMenu.remove(),
              (this.activeMenu = null),
              this.element.dispatchEvent(this.customEvents.collapse(e));
          }
        }
        expandMegaMenu(e) {
          return b(this, void 0, void 0, function* () {
            yield this.createMenu(e),
              this.focusTrap.toggleTrap(!0, e),
              (this.activeButton = e),
              this.activeButton.setAttribute("aria-expanded", "true");
            const t = this.activeButton.getAttribute("aria-controls");
            (this.activeMenu = this.element.querySelector(`#${t}`)),
              this.activeMenu &&
                (this.activeMenu.classList.remove("hidden"),
                this.activeMenu.setAttribute("aria-hidden", "false"),
                (this.activeMenu.hidden = !1)),
              this.element.dispatchEvent(this.customEvents.expand(this.getDetailsForExpandCollapse(this.activeButton)));
          });
        }
        getDetailsForExpandCollapse(e) {
          var t;
          return {
            label: (null !== (t = e.textContent) && void 0 !== t ? t : "").trim(),
            id: this.getMenuIdForButton(e),
            button: e,
          };
        }
        createMenu(e) {
          return b(this, void 0, void 0, function* () {
            e.after(this.loaderContainer);
            const t = setTimeout(() => {
                this.loader.classList.remove("hidden"), this.loaderContainer.classList.remove("hidden");
              }, 1e3),
              n = this.getMenuIdForButton(e),
              i = yield this.adaptor.getMegaMenuContent(n);
            i && clearTimeout(t);
            const s = `menu-${n.toString().replace(/[^\w\s]/gi, "")}`;
            (this.content = i || document.createElement("div")),
              this.content.setAttribute("id", s),
              this.content.classList.add("hidden"),
              (this.content.ariaLive = "polite"),
              (this.content.ariaBusy = "false"),
              (this.content.ariaAtomic = "true"),
              this.loader.classList.add("hidden"),
              this.loaderContainer.classList.add("hidden"),
              this.loaderContainer.replaceWith(this.content),
              e.setAttribute("aria-controls", s);
          });
        }
        getMenuIdForButton(e) {
          var t;
          return null !== (t = this.adaptor.useUrlForNavigationId ? e.dataset.href : e.dataset.menuId) && void 0 !== t
            ? t
            : "";
        }
        addOffsetMenuListeners() {
          document.addEventListener("click", this.offsetMenuClickListener, !1),
            document.addEventListener("keydown", this.offsetMenuKeyPressListener, !1);
        }
        removeEventListeners() {
          document.removeEventListener("click", this.handleOffsetMenuClick, !1),
            document.removeEventListener("keydown", this.handleOffsetKeypress, !1);
        }
        createCustomEvents() {
          ["collapse", "expand"].forEach((e) => {
            this.customEvents[e] = (t) => new CustomEvent(`nci-header:mega-menu:${e}`, { bubbles: !0, detail: t });
          }),
            (this.customEvents.linkclick = (e) =>
              new CustomEvent("nci-header:primary-nav:linkclick", { bubbles: !0, detail: e }));
        }
      }
      var L = function (e, t, n, i) {
        return new (n || (n = Promise))(function (s, o) {
          function r(e) {
            try {
              l(i.next(e));
            } catch (e) {
              o(e);
            }
          }
          function a(e) {
            try {
              l(i.throw(e));
            } catch (e) {
              o(e);
            }
          }
          function l(e) {
            var t;
            e.done
              ? s(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(r, a);
          }
          l((i = i.apply(e, t || [])).next());
        });
      };
      const y = {
        close: { en: "Close Menu", es: "Cerrar menú" },
        nav: { en: "Primary navigation.", es: "Navegación primaria." },
      };
      class C {
        constructor(e, t) {
          if (
            ((this.menuData = null),
            (this.sectionParent = null),
            (this.loader = this.createDom("div", ["nci-is-loading", "hidden"])),
            (this.resizeWidth = 1024),
            (this.customEvents = {}),
            (this.linkClickListener = (e) => this.handleLinkClick(e)),
            (this.menuOpenEventListener = (e) => this.handleOpenMenu(e)),
            (this.windowResizeEventListener = (e) => {
              e.matches && this.handleCloseMenu("Close");
            }),
            (this.menuCloseEventListener = () => this.handleCloseMenu("Close")),
            (this.escapeKeyPressListener = (e) =>
              L(this, void 0, void 0, function* () {
                this.activeMenu && "Escape" === e.key && (yield this.closeMenu("Escape"));
              })),
            !t.getInitialMenuId)
          )
            throw new Error("getInitialMenuId required to return a Promise of string or number.");
          if (!t.getNavigationLevel)
            throw new Error("getNavigationLevel required to return a Promise of MobileMenuData.");
          (this.element = e),
            (this.adaptor = t),
            (this.pageUrl = window.location.pathname),
            (this.focusTrap = new g(this.element)),
            (this.activeMenu = !1),
            (this.mobileButton = this.element.querySelector(".nci-header-mobilenav__open-btn")),
            (this.resizeMediaQuery = matchMedia(`(min-width: ${this.resizeWidth}px)`)),
            (this.langCode = document.documentElement.lang),
            this.initialize();
        }
        unregister() {
          this.element.removeEventListener("click", this.linkClickListener),
            this.mobileButton.removeEventListener("click", this.menuOpenEventListener, !0),
            this.mobileClose.removeEventListener("click", this.menuCloseEventListener, !0),
            this.mobileOverlay.removeEventListener("click", this.menuCloseEventListener, !0),
            document.removeEventListener("keydown", this.escapeKeyPressListener, !1),
            this.resizeMediaQuery.removeEventListener("change", this.windowResizeEventListener),
            this.mobileOverlay.remove(),
            this.mobileClose.remove(),
            this.mobileNav.remove(),
            this.loader.remove();
        }
        initialize() {
          (this.mobileNav = this.createDom(
            "div",
            ["nci-header-mobilenav"],
            [{ tabindex: -1 }, { role: "dialog" }, { "aria-modal": !0 }, { id: "nci-header-mobilenav" }]
          )),
            (this.mobileNav.ariaLive = "polite"),
            (this.mobileNav.ariaBusy = "true"),
            (this.mobileOverlay = this.createDom("div", ["nci-header-mobilenav__overlay"], []));
          const e = y.close[this.langCode];
          (this.mobileClose = this.createDom(
            "button",
            ["nci-header-mobilenav__close-btn"],
            [{ "aria-controls": "nci-header-mobilenav" }, { "aria-label": e }]
          )),
            this.mobileClose.addEventListener(
              "click",
              (this.menuCloseEventListener = () => this.handleCloseMenu("Close")),
              !0
            ),
            this.mobileOverlay.addEventListener(
              "click",
              (this.menuCloseEventListener = () => this.handleCloseMenu("Overlay")),
              !0
            ),
            //   this.mobileButton.addEventListener("click", this.menuOpenEventListener, !0),
            //  this.mobileNav.append(this.mobileClose),
            // this.mobileNav.append(this.loader),
            // this.element.append(this.mobileNav),
            // this.element.append(this.mobileOverlay),
            document.addEventListener("keydown", this.escapeKeyPressListener, !1),
            this.resizeMediaQuery.addEventListener("change", this.windowResizeEventListener),
            this.createCustomEvents();
        }
        handleOpenMenu(e) {
          return L(this, void 0, void 0, function* () {
            const t = this.element.querySelector(".nci-header-mobilenav__list");
            t && t.remove(), (this.mobileNav.ariaBusy = "true"), this.loader.classList.remove("hidden");
            const n = (e.currentTarget.textContent || "").trim();
            yield this.openMenu(n);
          });
        }
        handleCloseMenu(e) {
          this.closeMenu(e);
        }
        openMenu(e) {
          return L(this, void 0, void 0, function* () {
            (this.activeMenu = !0),
              this.mobileNav.classList.add("active"),
              this.mobileOverlay.classList.toggle("active");
            const t = yield this.adaptor.getInitialMenuId();
            this.menuData = yield this.adaptor.getNavigationLevel(t);
            const n = this.displayNavLevel(this.menuData),
              i = this.createDom("nav", ["nci-header-mobilenav__nav"], [{ "aria-label": y.nav[this.langCode] }]);
            i.appendChild(n),
              this.mobileNav.append(i),
              this.mobileClose.focus(),
              this.focusTrap.toggleTrap(!0, this.mobileNav),
              (this.mobileNav.ariaBusy = "false"),
              this.element.dispatchEvent(this.customEvents.open({ label: e, initialMenu: this.menuData }));
          });
        }
        closeMenu(e) {
          (this.activeMenu = !1),
            this.focusTrap.toggleTrap(!1, this.mobileNav),
            this.mobileNav.classList.remove("active"),
            this.mobileOverlay.classList.remove("active");
          const t = this.menuData;
          (this.menuData = null),
            this.element.dispatchEvent(this.customEvents.close({ action: e, lastMenu: t || null }));
        }
        handleLinkClick(e, t, n) {
          return L(this, void 0, void 0, function* () {
            const i = this.element.querySelector(".nci-header-mobilenav__list");
            i && i.remove(), (this.mobileNav.ariaBusy = "true"), this.loader.classList.remove("hidden");
            const s = e.target.getAttribute("data-menu-id"),
              o = (e.currentTarget.textContent || "").trim();
            if (s) {
              this.menuData = yield this.adaptor.getNavigationLevel(s);
              const e = this.displayNavLevel(this.menuData);
              this.mobileNav.append(e), this.focusTrap.toggleTrap(!0, this.mobileNav);
            }
            this.element.dispatchEvent(
              this.customEvents.linkclick({
                action: t || null,
                data: this.menuData,
                label: o || null,
                index: n || null,
              })
            );
          });
        }
        displayNavLevel(e) {
          const t = e.items;
          this.sectionParent = e.parent;
          const n = this.createDom("ul", ["nci-header-mobilenav__list"]),
            i = t.map(
              (e, t) => (
                (t = this.sectionParent ? t + 1 : t), e.hasChildren ? this.makeMenuNode(e, t) : this.makeMenuLink(e, t)
              )
            );
          if (this.sectionParent) {
            const t = this.createDom("ul", ["nci-header-mobilenav__list"]),
              s = this.makeBackNode(this.sectionParent);
            n.append(s);
            const o = this.createDom("li", ["nci-header-mobilenav__list-holder"]);
            o.append(t);
            const r = this.makeMenuLink(e, 0);
            t.append(r), n.append(o), t.append(...i);
          } else n.append(...i);
          return (this.mobileNav.ariaBusy = "false"), this.loader.classList.add("hidden"), n;
        }
        makeBackNode(e) {
          const t = this.adaptor.useUrlForNavigationId ? e.path : e.id,
            n = this.createDom("li", ["nci-header-mobilenav__list-node", "active"], []),
            i = this.createDom(
              "button",
              ["nci-header-mobilenav__list-msg"],
              [{ "data-menu-id": t }, { "data-href": e.path }, { "data-options": 0 }, { "data-isroot": "false" }]
            );
          return (
            (i.innerHTML = e.label),
            i.addEventListener("click", (this.linkClickListener = (e) => this.handleLinkClick(e, "Back")), !0),
            n.append(i),
            n
          );
        }
        makeMenuNode(e, t) {
          const n = this.adaptor.useUrlForNavigationId ? e.path : e.id,
            i = this.createDom("li", ["nci-header-mobilenav__list-node"], []),
            s = this.createDom(
              "button",
              ["nci-header-mobilenav__list-label"],
              [{ "data-href": e.path }, { "data-menu-id": n }, { "data-options": 0 }, { "data-isroot": "false" }]
            );
          return (
            (s.innerHTML = e.label),
            i.addEventListener("click", (this.linkClickListener = (e) => this.handleLinkClick(e, "Child", t)), !0),
            i.append(s),
            i
          );
        }
        makeMenuLink(e, t) {
          const n = this.createDom("li", ["nci-header-mobilenav__list-item"], []),
            i = this.createDom("a", ["nci-header-mobilenav__list-link"], [{ href: e.path }, { "data-options": 0 }]);
          return (
            this.pageUrl === e.path && i.classList.add("current"),
            (i.innerHTML = e.label),
            n.addEventListener("click", (this.linkClickListener = (e) => this.handleLinkClick(e, "Child", t)), !0),
            n.append(i),
            n
          );
        }
        createDom(e, t, n) {
          const i = document.createElement(e);
          return (
            t &&
              [...t].forEach((e) => {
                i.classList.add(e);
              }),
            n &&
              [...n].forEach((e) => {
                const t = Object.keys(e)[0],
                  n = Object.values(e)[0];
                i.setAttribute(t, n);
              }),
            i
          );
        }
        createCustomEvents() {
          ["close", "open", "linkclick"].forEach((e) => {
            this.customEvents[e] = (t) => new CustomEvent(`nci-header:mobile-menu:${e}`, { bubbles: !0, detail: t });
          });
        }
      }
      class k {
        constructor(e, t, n) {
          (this.searchForm = e),
            (this.searchInputBlurHandler = n),
            (this.searchInputFocusHandler = t),
            (this.searchField = this.searchForm.querySelector("#nci-header-search__field")),
            this.searchField && this.initialize();
        }
        initialize() {
          this.searchField.addEventListener("focus", this.searchInputFocusHandler, !1),
            this.searchField.addEventListener("focusout", this.searchInputBlurHandler, !1);
        }
        static isSearchFormValid() {
          const e = document.querySelector("form.nci-header-search"),
            t = document.querySelector("#nci-header-search__field"),
            n = document.querySelector("button.nci-header-search__search-button");
          return !!(e && t && n);
        }
        unregister() {
          this.searchField.removeEventListener("focus", this.searchInputFocusHandler, !1),
            this.searchField.removeEventListener("focusout", this.searchInputBlurHandler, !1);
        }
      }
      class w {
        constructor(e, t) {
          (this.searchInputFocusHandler = (e) => this.handleSearchFocus(e)),
            (this.searchInputBlurHandler = (e) => this.handleSearchBlur(e)),
            (this.element = e),
            (this.options = t),
            (this.megaMenuNav = this.wireUpMegaMenu()),
            (this.mobileMenu = this.wireUpMobileMenu());
          const n = this.element.querySelector("form.nci-header-search");
          n && (this.searchForm = new k(n, this.searchInputFocusHandler, this.searchInputBlurHandler)),
            k.isSearchFormValid() && (this.searchDiv = this.element.querySelector(".nci-header-nav__secondary"));
          const i = w._components.get(this.element);
          i && i.unregister(), w._components.set(this.element, this);
        }
        static create(e, t) {
          if (!(e instanceof HTMLElement)) throw "Element is not an HTMLElement";
          return this._components.get(e) || new this(e, t);
        }
        static autoInit() {
          document.addEventListener("DOMContentLoaded", () => {
            Array.from(document.getElementsByClassName("nci-header")).forEach((e) => {
              this.create(e, { megaMenuSource: new p(), mobileMenuSource: new f() });
            });
          });
        }
        unregister() {
          this.searchForm && this.searchForm.unregister(),
            this.megaMenuNav.unregister(),
            this.mobileMenu.unregister(),
            w._components.delete(this.element);
        }
        wireUpMegaMenu() {
          const e = this.element.querySelector(".nci-header-nav__primary");
          return new E(e, this.options.megaMenuSource);
        }
        wireUpMobileMenu() {
          const e = this.element;
          return new C(e, this.options.mobileMenuSource);
        }
        handleSearchFocus(e) {
          e.preventDefault(), this.searchDiv.classList.add("search-focused");
        }
        handleSearchBlur(e) {
          e.preventDefault(),
            setTimeout(() => {
              this.searchDiv.classList.remove("search-focused");
            }, 250);
        }
      }
      w._components = new Map();
      const x = (e, n, i) => {
          t(e, e, { linkText: n, location: "Footer", section: i });
        },
        I = (e, n) => {
          t(e, e, { formType: "EmailSignUp", status: n, location: "Footer" });
        };
      let _ = !0;
      const M = (e, n, i) => {
          t("PreHeader:LinkClick", "PreHeader:LinkClick", {
            linkText: e,
            location: "PreHeader",
            action: i,
            preHeaderElement: n,
          });
        },
        S = () => {
          M("Expand", "Standard Alert", "Expand");
        },
        A = () => {
          M("Minimize", "Standard Alert", "Minimize");
        },
        N = (e) => {
          const t = e.currentTarget.classList.contains("usa-site-alert--nci-slim") ? "Slim Alert" : "Standard Alert";
          M("Dismiss", t, "Dismiss");
        },
        T = (e) => {
          const t = e.currentTarget,
            n = t.textContent.trim() || "_ERROR_",
            i = t.closest("section").classList.contains("usa-site-alert--nci-slim") ? "Slim Alert" : "Standard Alert";
          M(n, i, "Link Click");
        };
      var O = n(9669),
        P = n.n(O);
      const B = { main_menu: { en: "Main Menu", es: "Menú principal" }, back: { en: "Back", es: "Anterior" } };
      const R = (e, t) => {
          Array.isArray(t)
            ? t.forEach((t) => R(e, t))
            : e.appendChild("string" == typeof t || t instanceof String ? document.createTextNode(t) : t);
        },
        D = (e) =>
          Object.entries(e || {}).reduce(
            (e, t) => {
              let [n, i] = t;
              return n.startsWith("on") && n.toLowerCase() in window
                ? { ...e, handlers: { ...e.handlers, [n]: i } }
                : { ...e, attrs: { ...e.attrs, [n]: i } };
            },
            { handlers: {}, attrs: {} }
          );
      var F = {
          createElement: function (e, t) {
            for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), s = 2; s < n; s++) i[s - 2] = arguments[s];
            if ("function" == typeof e) return e(t, i);
            const o = D(t),
              r = Object.assign(document.createElement(e), o.attrs);
            Object.entries(o.handlers).forEach((e) => {
              let [t, n] = e;
              r.addEventListener(t.toLowerCase().substring(2), n);
            });
            for (const e of i) R(r, e);
            return r;
          },
          Fragment: function (e) {
            for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
            return n;
          },
        },
        H = F,
        q = (e) => {
          let { linkTracking: t, list: n, index: i } = e;
          const s =
            n.list_items && n.list_items.length > 0
              ? H.createElement(
                  "ul",
                  { className: "nci-megamenu__sublist" },
                  n.list_items.map((e, s) =>
                    H.createElement(
                      "li",
                      { className: "nci-megamenu__sublist-item" },
                      H.createElement(
                        "a",
                        {
                          className: "nci-megamenu__sublist-item-link",
                          href: e.url,
                          onClick: () =>
                            t({
                              linkType: "List Item",
                              heading: n.title,
                              headingUrl: n.title_url,
                              headingIndex: i,
                              label: e.label,
                              url: e.url,
                              listItemNumber: s + 1,
                            }),
                        },
                        e.label
                      )
                    )
                  )
                )
              : H.createElement(H.Fragment, null);
          return H.createElement(
            "ul",
            { className: "nci-megamenu__list" },
            H.createElement(
              "li",
              { className: "nci-megamenu__list-item" },
              H.createElement(
                "a",
                {
                  onClick: () =>
                    t({
                      linkType: "List Heading",
                      heading: n.title,
                      headingUrl: n.title_url,
                      headingIndex: i,
                      label: n.title,
                      url: n.title_url,
                      listItemNumber: 0,
                    }),
                  className: "nci-megamenu__list-item-link",
                  href: n.title_url,
                },
                n.title
              ),
              s
            )
          );
        };
      const $ = (e) => {
        let { linkTracking: t, mmData: n } = e;
        const i = n.items ?? [],
          s = Array.from({ length: Math.ceil(i.length / 3) }, (e, t) => i.slice(3 * t, 3 * t + 3)).map((e) =>
            H.createElement(
              "div",
              { className: "grid-row grid-gap" },
              e.map((e) => {
                const n = i.indexOf(e) + 1;
                return H.createElement(
                  "div",
                  { className: "grid-col-4" },
                  ((e, n) =>
                    "list" === e.type
                      ? H.createElement(q, { linkTracking: t, list: e, index: n })
                      : (console.warn(`Unknown mega menu item type ${e.type}`), H.createElement(H.Fragment, null)))(
                    e,
                    n
                  )
                );
              })
            )
          );
        return H.createElement(
          "div",
          { id: "megamenu-layer", className: "nci-megamenu" },
          H.createElement(
            "div",
            { className: "grid-container" },
            H.createElement(
              "div",
              { className: "grid-row grid-gap-1" },
              H.createElement(
                "div",
                { className: "grid-col-3 nci-megamenu__primary-pane" },
                H.createElement(
                  "a",
                  {
                    onClick: () => {
                      t({
                        linkType: "Primary Nav Label",
                        heading: n.primary_nav_label,
                        headingUrl: n.primary_nav_url,
                        headingIndex: 0,
                        label: n.primary_nav_label,
                        url: n.primary_nav_url,
                        listItemNumber: 0,
                      });
                    },
                    className: "nci-megamenu__primary-link",
                    href: n.primary_nav_url,
                  },
                  n.primary_nav_label
                )
              ),
              H.createElement("div", { className: "nci-megamenu__items-pane grid-col-9" }, s)
            )
          )
        );
      };
      const j = (e) => {
          const n = e.detail,
            i = n.menuId,
            s = document.querySelector(`button[data-menu-id="${i}"]`),
            o = s ? (s.textContent ?? "").trim() : "";
          t("PrimaryNav:LinkClick", "PrimaryNav:LinkClick", {
            location: "Primary Nav",
            linkType: n.linkType,
            listHeading: n.heading,
            listHeadingNumber: n.headingIndex,
            linkText: n.label,
            primaryNavItem: o,
            listItemNumber: n.listItemNumber,
          });
        },
        U = (e) => {
          const n = e.detail;
          t("PrimaryNav:LinkClick", "PrimaryNav:LinkClick", {
            location: "Primary Nav",
            linkType: "Primary Nav Button",
            linkText: n.label,
            listHeading: n.label,
            primaryNavItem: n.label,
            listHeadingNumber: 0,
            listItemNumber: 0,
          });
        },
        z = () => {
          t("Header:LinkClick", "Header:LinkClick", { headerLink: "Logo", location: "Header" });
        },
        W = (e) => {
          const n = e.detail,
            i = n.optionsPresented ? (n.selectedOptionValue ? "Selected" : "Offered") : "None",
            s = null === n.selectedOptionIndex ? null : n.selectedOptionIndex + 1;
          t("HeaderSearch:Submit", "HeaderSearch:Submit", {
            formType: "SitewideSearch",
            searchTerm: n.searchText,
            autoSuggestUsage: i,
            charactersTyped: n.inputtedTextWhenSelected || null,
            numCharacters: n.inputtedTextWhenSelected.length || null,
            numSuggestsSelected: s,
            suggestItems: n.optionSetSize || 0,
            location: "Header",
          });
        },
        V = () => {
          t("MobilePrimaryNav:Open", "MobilePrimaryNav:Open", { action: "Open", location: "MobilePrimaryNav" });
        },
        K = (e) => {
          const n = e.detail;
          var i;
          t("MobilePrimaryNav:Close", "MobilePrimaryNav:Close", {
            action:
              ((i = n.action), { Escape: "CloseEsc", Close: "CloseX", Overlay: "CloseClickAway" }[i] || "_ERROR_"),
            location: "MobilePrimaryNav",
          });
        },
        J = (e) => ({ Back: "Back", Child: "ChildPageMenu", Explore: "ExplorePage" }[e] || "_ERROR_"),
        Q = (e) => {
          const n = e.detail,
            i = n.label.includes("Explore") && "Back" !== n.action ? "Explore" : n.action;
          t("MobilePrimaryNav:LinkClick", "MobilePrimaryNav:LinkClick", {
            linkText: n.label,
            location: "MobilePrimaryNav",
            action: J(i),
            listNumber: "Back" === n.action ? null : n.index + 1,
          });
        };
      var X = () => {
        var e, n;
        const i = document.getElementById("nci-header");
        if (!i) return void console.error("Cannot find nci header element.");
        const s = "es" === document.documentElement.lang ? "es" : "en",
          o = i.dataset.basePath ?? "/",
          a = P().create({ baseURL: o, responseType: "json" }),
          l = new (class {
            useUrlForNavigationId = !1;
            constructor(e) {
              (this.client = e), (this.cache = {});
            }
            async fetchContent(e) {
              try {
                return (await this.client.get(`/taxonomy/term/${e}/mega-menu`)).data;
              } catch (t) {
                if (P().isAxiosError(t) && t.response)
                  throw new Error(`Megamenu unexpected status ${t.response.status} fetching ${e}`);
                throw new Error(`Could not fetch megamenu for ${e}.`);
              }
            }
            async getMegaMenuContent(e) {
              if (!this.cache[e])
                try {
                  const t = ((e, t) =>
                    H.createElement($, {
                      linkTracking: (e) => {
                        document.dispatchEvent(
                          new CustomEvent("nci-header:mega-menu:linkclick", {
                            bubbles: !0,
                            detail: { menuId: t, ...e },
                          })
                        );
                      },
                      mmData: e,
                    }))(await this.fetchContent(e), e);
                  this.cache[e] = t;
                } catch (e) {
                  return e instanceof Error && console.error(e.message), document.createElement("div");
                }
              return this.cache[e];
            }
          })(a);
        // if (!window.ncidsNavInfo) return void console.error("Mobile nav information missing on page");
        const c = new (class {
          rootParentItem = null;
          parentNavConnectionId = null;
          navTree = null;
          langcode = "en";
          constructor(e, t, n, i, s, o) {
            (this.useUrlForNavigationId = e),
              (this.client = t),
              (this.initialItemId = n),
              (this.nextMenuToFetch = i),
              (this.langcode = s),
              (this.baseURL = o);
          }
          async getInitialMenuId() {
            return this.initialItemId;
          }
          async getNavigationLevel(e) {
            let t = this.findNodeInTree(e.toString());
            if (null === t && (await this.getMoarTree(), (t = this.findNodeInTree(e.toString())), null === t))
              throw new Error(`Section ${e} cannot be found in the navigation.`);
            const n = t.children.map((e) => ({
              id: e.id,
              label: e.label,
              path: e.path,
              langcode: e.langcode,
              hasChildren: e.children.length > 0,
            }));
            return {
              id: t.id,
              label: "en" === this.langcode ? `Explore ${t.label}` : t.label,
              path: t.path,
              langcode: t.langcode,
              hasChildren: n.length > 0,
              items: n,
              parent: this.getParentMenuItem(t),
            };
          }
          getParentMenuItem(e) {
            var t;
            const n = null === e.parentId ? this.rootParentItem : this.findNodeInTree(e.parentId);
            if (null === n) return null;
            const i = this.navTree.id,
              s =
                (null === this.nextMenuToFetch && n.id === i) ||
                (this.baseURL === n.path &&
                  (null === (t = this.nextMenuToFetch) || void 0 === t ? void 0 : t.id) === n.id)
                  ? B.main_menu[this.langcode]
                  : B.back[this.langcode];
            return { id: n.id, label: s, path: n.path, langcode: n.langcode, hasChildren: n.children.length > 0 };
          }
          findNodeInTree(e) {
            return null === this.navTree ? null : this.findNodeInNode(e, this.navTree);
          }
          findNodeInNode(e, t) {
            if (e === t.id) return t;
            for (const n of t.children) {
              const t = this.findNodeInNode(e, n);
              if (null !== t) return t;
            }
            return null;
          }
          async getMoarTree() {
            if (null === this.nextMenuToFetch) return;
            const e = await this.fetchNav(this.nextMenuToFetch),
              t = this.drupalItemToAdapterItem(e.nav, null);
            null === this.navTree ? (this.navTree = t) : this.replaceNavTree(t),
              Array.isArray(e.parent_info)
                ? ((this.nextMenuToFetch = null), (this.rootParentItem = null), (this.parentNavConnectionId = null))
                : ((this.nextMenuToFetch = e.parent_info.parent_nav),
                  (this.rootParentItem = this.drupalItemToAdapterItem(e.parent_info.parent_link_item, null)),
                  (this.parentNavConnectionId = e.parent_info.closest_id_in_parent));
          }
          replaceNavTree(e) {
            if (null === this.parentNavConnectionId)
              throw new Error("mobile adapter encountered issue fetching more menus without a connection point.");
            const t = this.navTree;
            this.navTree = e;
            const n = this.findNodeInNode(this.parentNavConnectionId, e);
            if (null === n)
              throw new Error(`mobile menu adapter could not find node ${this.parentNavConnectionId} to merge menus`);
            if (this.parentNavConnectionId === t.id) {
              if (null === n.parentId)
                throw new Error(
                  `mobile adapter encountered issue fetching the parent of the connection node ${n.id}. Parent id is null.`
                );
              const i = this.findNodeInNode(n.parentId, e);
              if (null === i)
                throw new Error(`mobile menu adapter could not find (parent) node ${n.parentId} to merge menus`);
              this.addOrReplaceChildNode(i, t);
            } else this.addOrReplaceChildNode(n, t);
          }
          addOrReplaceChildNode(e, t) {
            const n = e.children.findIndex((e) => e.id === t.id);
            (t.parentId = e.id), n > -1 ? (e.children[n] = t) : e.children.push(t);
          }
          drupalItemToAdapterItem(e, t) {
            const n = e.children
              .sort((e, t) => {
                const n = isNaN(parseInt(e.weight)) ? 0 : parseInt(e.weight),
                  i = isNaN(parseInt(t.weight)) ? 0 : parseInt(t.weight);
                return n === i ? 0 : n < i ? -1 : 1;
              })
              .map((t) => this.drupalItemToAdapterItem(t, e.id));
            return { id: e.id, parentId: t, label: e.label, path: e.path, langcode: e.langcode, children: n };
          }
          async fetchNav(e) {
            try {
              return (await this.client.get(`/taxonomy/term/${e.id}/${e.menu_type}`)).data;
            } catch (t) {
              if (P().isAxiosError(t) && t.response)
                throw new Error(`Mobile menu unexpected status ${t.response.status} fetching ${e.id}/${e.menu_type}`);
              throw new Error(`Could not fetch mobile menu for ${e.id}/${e.menu_type}.`);
            }
          }
        })(
          !1,
          a,
          null === (e = window.ncidsNavInfo) || void 0 === e || null === (n = e.item_id) || void 0 === n
            ? void 0
            : n.toString(),
          //  window.ncidsNavInfo.nav,
          s,
          o
        );
        document.addEventListener("nci-header:mega-menu:linkclick", j),
          i.addEventListener(
            "nci-header:mega-menu:expand",
            (e) => {
              ((e) => {
                const n = e.detail;
                t("PrimaryNav:Open", "PrimaryNav:Open", { primaryNavItem: n.label, location: "Primary Nav" });
              })(e);
            },
            !0
          ),
          i.addEventListener("nci-header:primary-nav:linkclick", U, !0),
          i.addEventListener("nci-header:mobile-menu:open", V, !0),
          i.addEventListener("nci-header:mobile-menu:close", K, !0),
          i.addEventListener("nci-header:mobile-menu:linkclick", Q, !0),
          w.create(i, { mobileMenuSource: c, megaMenuSource: l });
        const u = document.getElementById("extended-mega-logo");
        null == u || u.addEventListener("click", z, !0),
          ((e) => {
            var t, n;
            const i = document.getElementById("nci-header-search__field"),
              s = null == i ? void 0 : i.dataset.autosuggestCollection;
            if (!s) return;
            const o =
              null === (t = window.CDEConfig) || void 0 === t || null === (n = t.sitewideSearchConfig) || void 0 === n
                ? void 0
                : n.searchApiServer;
            if (!o) return void console.error("CDEConfig searchApiServer must be provided");
            const a = P().create({ baseURL: o, responseType: "json" }),
              l = new (class {
                constructor(e, t, n) {
                  (this.client = e), (this.collection = t), (this.lang = n);
                }
                async getAutocompleteSuggestions(e) {
                  const t = `/Autosuggest/${this.collection}/${this.lang}/${e}`;
                  try {
                    return (await this.client.get(t)).data.results.map((e) => e.term);
                  } catch (e) {
                    return console.error(`Autosuggest Fetch Error: ${e}`), [];
                  }
                }
              })(a, s, e);
            let c = "Please enter 3 or more characters";
            "en" !== e && (c = "Ingrese 3 o más caracteres"),
              r.create(i, {
                autocompleteSource: l,
                maxOptionsCount: 10,
                minCharCount: 3,
                minPlaceholderMsg: c,
                listboxClasses: "listboxWidth",
              }),
              i.addEventListener("nci-autocomplete:formSubmission", W);
          })(s);
      };
      var Z = () => {
        const e = (function (e) {
          const t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document).querySelectorAll(e);
          return t ? Array.from(t) : [];
        })(".flex-video:not(.rendered)");
        e.filter(
          (e) =>
            !((e, t) => {
              let n = !1;
              for (; e && e.parentNode; ) {
                if (e.classList.contains("yt-carousel")) {
                  n = !0;
                  break;
                }
                e = e.parentNode;
              }
              return n;
            })(e)
        ).forEach((e) =>
          ((e) => {
            const { videoUrl: t } = e.dataset,
              n = () => {
                return (
                  (n = e),
                  (i = t),
                  void P()
                    .get(i)
                    .then((e) => e.data)
                    .then((e) => {
                      const t = new DOMParser().parseFromString(e, "text/html").getElementsByTagName("iframe")[0];
                      t &&
                        ((t.src += "&autoplay=1&rel=0"),
                        (t.sandbox = "allow-same-origin allow-scripts"),
                        (n.innerHTML = ""),
                        n.appendChild(t),
                        t.focus());
                    })
                );
                var n, i;
              },
              i =
                ((s = { fn: n, keys: ["Enter", " "] }),
                (e) => {
                  const { fn: t = () => {}, keys: n = [], stopProp: i = !0, prevDef: o = !0 } = s;
                  if (n.includes(e.key)) return i && e.stopPropagation(), o && e.preventDefault(), t();
                });
            var s;
            e.addEventListener("click", n, !1), e.addEventListener("keydown", i, !1), e.classList.add("rendered");
          })(e)
        );
      };
      const Y = (e) => {
        const n = e.currentTarget;
        ((e, n, i, s, o, r, a, l, c, u, d, h, m) => {
          const {
            pageRows: p,
            pageRowIndex: v,
            pageRowCols: f,
            pageRowColIndex: g,
          } = ((e) => {
            const t = Array.from(document.querySelectorAll("[data-eddl-landing-row]")),
              n = Array.from(document.querySelectorAll("[data-eddl-landing-row] [data-eddl-landing-row]")),
              i = t.filter((e) => -1 === n.indexOf(e)),
              s = e.closest("[data-eddl-landing-row-col]"),
              o = null !== s ? s.closest("[data-eddl-landing-row]") : e.closest("[data-eddl-landing-row]");
            if (null === o) return { pageRows: i.length, pageRowIndex: "_ERROR_", pageRowCols: 0, pageRowColIndex: 0 };
            const r = i.indexOf(o) + 1,
              a = Array.from(o.querySelectorAll("[data-eddl-landing-row-col]"));
            return 0 === a.length
              ? { pageRows: i.length, pageRowIndex: r, pageRowCols: 0, pageRowColIndex: 0 }
              : null === s
              ? { pageRows: i.length, pageRowIndex: r, pageRowCols: a.length, pageRowColIndex: "_ERROR_" }
              : { pageRows: i.length, pageRowIndex: r, pageRowCols: a.length, pageRowColIndex: a.indexOf(s) + 1 };
          })(e);
          t(`LP:${n}:LinkClick`, `LP:${n}:LinkClick`, {
            location: "Body",
            pageRows: p,
            pageRowIndex: v,
            pageRowCols: f,
            pageRowColIndex: g,
            containerItems: i,
            containerItemIndex: s,
            componentType: o,
            componentTheme: r,
            componentVariant: a,
            title: l.slice(0, 50),
            linkType: c,
            linkText: u.slice(0, 50),
            linkArea: d,
            totalLinks: h,
            linkPosition: m,
          });
        })(
          n,
          "InlineVideo",
          1,
          1,
          "Inline Video",
          "Not Defined",
          "Standard YouTube Video",
          n.dataset.videoTitle || "_ERROR_",
          "Video Player",
          "Play",
          "Play",
          1,
          "Play"
        );
      };
      var G = () => {
        Z(),
          document.querySelectorAll('[data-eddl-landing-item="inline_video"]').forEach((e) => {
            const t = e.querySelector(".cgdp-video");
            null == t || t.addEventListener("click", Y);
          });
      };
      document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("#usa-banner a[hreflang]").forEach((e) => {
          e.addEventListener("click", o);
        }),
          X(),
          (() => {
            const e = document.querySelector(".usa-footer");
            if (!e) return;
            "es" === document.documentElement.lang
              ? u.create(e, { subscribeInvalidEmailAlert: "Ingrese su dirección de correo electrónico" })
              : u.create(e),
              e.querySelector(".usa-footer__nci-return-to-top a").addEventListener("click", () => {
                t("RightEdge:LinkClick", "RightEdge:LinkClick", {
                  linkText: "Back To Top",
                  location: "Right Edge",
                  section: "Back To Top",
                });
              }),
              e.querySelectorAll(".usa-footer__primary-section a, .usa-footer__secondary-section a").forEach((e) => {
                e.addEventListener("click", (e) => {
                  const t = ((e) => e.currentTarget.textContent.trim() || "_ERROR_")(e),
                    n = ((e) => {
                      const t = e.currentTarget,
                        n = t.parentElement,
                        i = n.parentElement,
                        s = "_ERROR_";
                      if (n.matches("address")) return "OrganizationArea";
                      if (n.classList.contains("usa-footer__secondary-link")) {
                        const e = t.closest("section");
                        return (e.firstElementChild.firstElementChild || e.firstElementChild).textContent || s;
                      }
                      return i.classList.contains("usa-footer__contact-info")
                        ? t.closest(".usa-footer__contact-links").firstElementChild.textContent.trim() || s
                        : t.classList.contains("usa-social-link")
                        ? t.closest(".usa-footer__social-links").firstElementChild.textContent.trim() || s
                        : t.textContent.trim() || s;
                    })(e);
                  x("Footer:LinkClick", t, n);
                });
              }),
              e.addEventListener("usa-footer:nav-links:expand", (e) => {
                const t = e.detail.querySelector("button.usa-footer__primary-link").textContent || "_ERROR_";
                x("Footer:SectionExpand", "Expand", t);
              }),
              e.querySelector("input.usa-input[type=email]").addEventListener("click", () => {
                _ && ((_ = !1), I("Footer:EmailForm:Start", "Start"));
              });
            // const n = e.querySelector("form");
            // n.addEventListener("usa-footer:sign-up:submit", () => {
            //   I("Footer:EmailForm:Complete", "Complete");
            // }),
            //   n.addEventListener("usa-footer:sign-up:error", () => {
            //     I("Footer:EmailForm:Error", "Error");
            //   });
          })(),
          (() => {
            const e = document.querySelectorAll(".usa-site-alert");
            (e && 0 === e.length) ||
              (e.forEach((e) => {
                var t;
                const n = e,
                  i =
                    "true" === (null === (t = n.dataset.siteAlertClosable) || void 0 === t ? void 0 : t.toLowerCase());
                m.create(n, { closeable: i }),
                  n.addEventListener("usa-site-alert:content:expand", S),
                  n.addEventListener("usa-site-alert:content:collapse", A),
                  n.addEventListener("usa-site-alert:close-button:close", N);
              }),
              document.querySelectorAll(".usa-site-alert .usa-link").forEach((e) => {
                e.addEventListener("click", T);
              }));
          })(),
          G();
      });
    })();
})();
