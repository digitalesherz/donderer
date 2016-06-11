/*! jQuery v2.1.4 | (c) 2005, 2015 jQuery Foundation, Inc. | jquery.org/license */

//# sourceMappingURL=jquery.min.map
/**
 * A Twitter library in JavaScript
 * @package   codebird
 * @version   2.5.0
 * @author    Jublo Solutions <support@jublo.net>
 * @copyright 2010-2014 Jublo Solutions <support@jublo.net>
 * @license   http://opensource.org/licenses/GPL-3.0 GNU Public License 3.0
 * @link      https://github.com/jublonet/codebird-php
 */
/* jshint curly: true,
          eqeqeq: true,
          latedef: true,
          quotmark: double,
          undef: true,
          unused: true,
          trailing: true,
          laxbreak: true */
/* global window,
          document,
          navigator,
          console,
          Ti,
          ActiveXObject,
          module,
          define,
          require */
(function (undefined) {
"use strict";
/**
 * Array.indexOf polyfill
 */
if (! Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0); i < this.length; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}
/**
 * A Twitter library in JavaScript
 *
 * @package codebird
 * @subpackage codebird-js
 */
/* jshint -W098 */
var Codebird = function () {
/* jshint +W098 */
    /**
     * The OAuth consumer key of your registered app
     */
    var _oauth_consumer_key = null;

    /**
     * The corresponding consumer secret
     */
    var _oauth_consumer_secret = null;

    /**
     * The app-only bearer token. Used to authorize app-only requests
     */
    var _oauth_bearer_token = null;

    /**
     * The API endpoint base to use
     */
    var _endpoint_base = "https://api.twitter.com/";

    /**
     * The media API endpoint base to use
     */
    var _endpoint_base_media = "https://upload.twitter.com/";

    /**
     * The API endpoint to use
     */
    var _endpoint = _endpoint_base + "1.1/";

    /**
     * The media API endpoint to use
     */
    var _endpoint_media = _endpoint_base_media + "1.1/";

    /**
     * The API endpoint base to use
     */
    var _endpoint_oauth = _endpoint_base;

    /**
     * API proxy endpoint
     */
    var _endpoint_proxy = "https://api.jublo.net/codebird/";

    /**
     * The API endpoint to use for old requests
     */
    var _endpoint_old = _endpoint_base + "1/";

    /**
     * Use JSONP for GET requests in IE7-9
     */
    var _use_jsonp = (typeof navigator !== "undefined"
        && typeof navigator.userAgent !== "undefined"
        && (navigator.userAgent.indexOf("Trident/4") > -1
            || navigator.userAgent.indexOf("Trident/5") > -1
            || navigator.userAgent.indexOf("MSIE 7.0") > -1
        )
    );

    /**
     * Whether to access the API via a proxy that is allowed by CORS
     * Assume that CORS is only necessary in browsers
     */
    var _use_proxy = (typeof navigator !== "undefined"
        && typeof navigator.userAgent !== "undefined"
    );

    /**
     * The Request or access token. Used to sign requests
     */
    var _oauth_token = null;

    /**
     * The corresponding request or access token secret
     */
    var _oauth_token_secret = null;

    /**
     * The current Codebird version
     */
    var _version = "2.5.0";

    /**
     * Sets the OAuth consumer key and secret (App key)
     *
     * @param string key    OAuth consumer key
     * @param string secret OAuth consumer secret
     *
     * @return void
     */
    var setConsumerKey = function (key, secret) {
        _oauth_consumer_key = key;
        _oauth_consumer_secret = secret;
    };

    /**
     * Sets the OAuth2 app-only auth bearer token
     *
     * @param string token OAuth2 bearer token
     *
     * @return void
     */
    var setBearerToken = function (token) {
        _oauth_bearer_token = token;
    };

    /**
     * Gets the current Codebird version
     *
     * @return string The version number
     */
    var getVersion = function () {
        return _version;
    };

    /**
     * Sets the OAuth request or access token and secret (User key)
     *
     * @param string token  OAuth request or access token
     * @param string secret OAuth request or access token secret
     *
     * @return void
     */
    var setToken = function (token, secret) {
        _oauth_token = token;
        _oauth_token_secret = secret;
    };

    /**
     * Enables or disables CORS proxy
     *
     * @param bool use_proxy Whether to use CORS proxy or not
     *
     * @return void
     */
    var setUseProxy = function (use_proxy) {
        _use_proxy = !! use_proxy;
    };

    /**
     * Sets custom CORS proxy server
     *
     * @param string proxy Address of proxy server to use
     *
     * @return void
     */
    var setProxy = function (proxy) {
        // add trailing slash if missing
        if (! proxy.match(/\/$/)) {
            proxy += "/";
        }
        _endpoint_proxy = proxy;
    };

    /**
     * Parse URL-style parameters into object
     *
     * version: 1109.2015
     * discuss at: http://phpjs.org/functions/parse_str
     * +   original by: Cagri Ekin
     * +   improved by: Michael White (http://getsprink.com)
     * +    tweaked by: Jack
     * +   bugfixed by: Onno Marsman
     * +   reimplemented by: stag019
     * +   bugfixed by: Brett Zamir (http://brett-zamir.me)
     * +   bugfixed by: stag019
     * -    depends on: urldecode
     * +   input by: Dreamer
     * +   bugfixed by: Brett Zamir (http://brett-zamir.me)
     * %        note 1: When no argument is specified, will put variables in global scope.
     *
     * @param string str String to parse
     * @param array array to load data into
     *
     * @return object
     */
    var _parse_str = function (str, array) {
        var glue1 = "=",
            glue2 = "&",
            array2 = String(str).replace(/^&?([\s\S]*?)&?$/, "$1").split(glue2),
            i, j, chr, tmp, key, value, bracket, keys, evalStr,
            fixStr = function (str) {
                return decodeURIComponent(str).replace(/([\\"'])/g, "\\$1").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
            };
        if (! array) {
            array = this.window;
        }

        for (i = 0; i < array2.length; i++) {
            tmp = array2[i].split(glue1);
            if (tmp.length < 2) {
                tmp = [tmp, ""];
            }
            key = fixStr(tmp[0]);
            value = fixStr(tmp[1]);
            while (key.charAt(0) === " ") {
                key = key.substr(1);
            }
            if (key.indexOf("\0") !== -1) {
                key = key.substr(0, key.indexOf("\0"));
            }
            if (key && key.charAt(0) !== "[") {
                keys = [];
                bracket = 0;
                for (j = 0; j < key.length; j++) {
                    if (key.charAt(j) === "[" && !bracket) {
                        bracket = j + 1;
                    } else if (key.charAt(j) === "]") {
                        if (bracket) {
                            if (!keys.length) {
                                keys.push(key.substr(0, bracket - 1));
                            }
                            keys.push(key.substr(bracket, j - bracket));
                            bracket = 0;
                            if (key.charAt(j + 1) !== "[") {
                                break;
                            }
                        }
                    }
                }
                if (!keys.length) {
                    keys = [key];
                }
                for (j = 0; j < keys[0].length; j++) {
                    chr = keys[0].charAt(j);
                    if (chr === " " || chr === "." || chr === "[") {
                        keys[0] = keys[0].substr(0, j) + "_" + keys[0].substr(j + 1);
                    }
                    if (chr === "[") {
                        break;
                    }
                }
                /* jshint -W061 */
                evalStr = "array";
                for (j = 0; j < keys.length; j++) {
                    key = keys[j];
                    if ((key !== "" && key !== " ") || j === 0) {
                        key = "'" + key + "'";
                    } else {
                        key = eval(evalStr + ".push([]);") - 1;
                    }
                    evalStr += "[" + key + "]";
                    if (j !== keys.length - 1 && eval("typeof " + evalStr) === "undefined") {
                        eval(evalStr + " = [];");
                    }
                }
                evalStr += " = '" + value + "';\n";
                eval(evalStr);
                /* jshint +W061 */
            }
        }
    };

    /**
     * Main API handler working on any requests you issue
     *
     * @param string   fn            The member function you called
     * @param array    params        The parameters you sent along
     * @param function callback      The callback to call with the reply
     * @param bool     app_only_auth Whether to use app-only auth
     *
     * @return mixed The API reply encoded in the set return_format
     */

    var __call = function (fn, params, callback, app_only_auth) {
        if (typeof params === "undefined") {
            params = {};
        }
        if (typeof app_only_auth === "undefined") {
            app_only_auth = false;
        }
        if (typeof callback !== "function" && typeof params === "function") {
            callback = params;
            params = {};
            if (typeof callback === "boolean") {
                app_only_auth = callback;
            }
        } else if (typeof callback === "undefined") {
            callback = function () {};
        }
        switch (fn) {
        case "oauth_authenticate":
        case "oauth_authorize":
            return this[fn](params, callback);

        case "oauth2_token":
            return this[fn](callback);
        }
        // reset token when requesting a new token (causes 401 for signature error on 2nd+ requests)
        if (fn === "oauth_requestToken") {
            setToken(null, null);
        }
        // parse parameters
        var apiparams = {};
        if (typeof params === "object") {
            apiparams = params;
        } else {
            _parse_str(params, apiparams); //TODO
        }

        // map function name to API method
        var method = "";
        var param, i, j;

        // replace _ by /
        var path = fn.split("_");
        for (i = 0; i < path.length; i++) {
            if (i > 0) {
                method += "/";
            }
            method += path[i];
        }

        // undo replacement for URL parameters
        var url_parameters_with_underscore = ["screen_name", "place_id"];
        for (i = 0; i < url_parameters_with_underscore.length; i++) {
            param = url_parameters_with_underscore[i].toUpperCase();
            var replacement_was = param.split("_").join("/");
            method = method.split(replacement_was).join(param);
        }

        // replace AA by URL parameters
        var method_template = method;
        var match = method.match(/[A-Z_]{2,}/);
        if (match) {
            for (i = 0; i < match.length; i++) {
                param = match[i];
                var param_l = param.toLowerCase();
                method_template = method_template.split(param).join(":" + param_l);
                if (typeof apiparams[param_l] === "undefined") {
                    for (j = 0; j < 26; j++) {
                        method_template = method_template.split(String.fromCharCode(65 + j)).join("_" + String.fromCharCode(97 + j));
                    }
                    console.warn("To call the templated method \"" + method_template + "\", specify the parameter value for \"" + param_l + "\".");
                }
                method = method.split(param).join(apiparams[param_l]);
                delete apiparams[param_l];
            }
        }

        // replace A-Z by _a-z
        for (i = 0; i < 26; i++) {
            method = method.split(String.fromCharCode(65 + i)).join("_" + String.fromCharCode(97 + i));
            method_template = method_template.split(String.fromCharCode(65 + i)).join("_" + String.fromCharCode(97 + i));
        }

        var httpmethod = _detectMethod(method_template, apiparams);
        var multipart = _detectMultipart(method_template);
        var internal = _detectInternal(method_template);

        return _callApi(
            httpmethod,
            method,
            apiparams,
            multipart,
            app_only_auth,
            internal,
            callback
        );
    };

    /**
     * Gets the OAuth authenticate URL for the current request token
     * @return string The OAuth authenticate URL
     */
    var oauth_authenticate = function (params, callback) {
        if (typeof params.force_login === "undefined") {
            params.force_login = null;
        }
        if (typeof params.screen_name === "undefined") {
            params.screen_name = null;
        }
        if (_oauth_token === null) {
            console.warn("To get the authenticate URL, the OAuth token must be set.");
        }
        var url = _endpoint_oauth + "oauth/authenticate?oauth_token=" + _url(_oauth_token);
        if (params.force_login === true) {
            url += "?force_login=1";
            if (params.screen_name !== null) {
                url += "&screen_name=" + params.screen_name;
            }
        }
        callback(url);
        return true;
    };

    /**
     * Gets the OAuth authorize URL for the current request token
     * @return string The OAuth authorize URL
     */
    var oauth_authorize = function (params, callback) {
        if (typeof params.force_login === "undefined") {
            params.force_login = null;
        }
        if (typeof params.screen_name === "undefined") {
            params.screen_name = null;
        }
        if (_oauth_token === null) {
            console.warn("To get the authorize URL, the OAuth token must be set.");
        }
        var url = _endpoint_oauth + "oauth/authorize?oauth_token=" + _url(_oauth_token);
        if (params.force_login === true) {
            url += "?force_login=1";
            if (params.screen_name !== null) {
                url += "&screen_name=" + params.screen_name;
            }
        }
        callback(url);
        return true;
    };

    /**
     * Gets the OAuth bearer token
     * @return string The OAuth bearer token
     */

    var oauth2_token = function (callback) {
        if (_oauth_consumer_key === null) {
            console.warn("To obtain a bearer token, the consumer key must be set.");
        }

        if (typeof callback === "undefined") {
            callback = function () {};
        }

        var post_fields = "grant_type=client_credentials";
        var url = _endpoint_oauth + "oauth2/token";

        if (_use_proxy) {
            url = url.replace(
                _endpoint_base,
                _endpoint_proxy
            );
        }

        var xml = _getXmlRequestObject();
        if (xml === null) {
            return;
        }
        xml.open("POST", url, true);
        xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xml.setRequestHeader(
            (_use_proxy ? "X-" : "") + "Authorization",
            "Basic " + _base64_encode(_oauth_consumer_key + ":" + _oauth_consumer_secret)
        );

        xml.onreadystatechange = function () {
            if (xml.readyState >= 4) {
                var httpstatus = 12027;
                try {
                    httpstatus = xml.status;
                } catch (e) {}
                var response = "";
                try {
                    response = xml.responseText;
                } catch (e) {}
                var reply = _parseApiReply(response);
                reply.httpstatus = httpstatus;
                if (httpstatus === 200) {
                    setBearerToken(reply.access_token);
                }
                callback(reply);
            }
        };
        xml.send(post_fields);

    };

    /**
     * Signing helpers
     */

    /**
     * URL-encodes the given data
     * @param mixed data
     * @return mixed The encoded data
     */
    var _url = function (data) {
        if ((/boolean|number|string/).test(typeof data)) {
            return encodeURIComponent(data).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
        } else {
            return "";
        }
    };

    /**
     * Gets the base64-encoded SHA1 hash for the given data
     *
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
     * in FIPS PUB 180-1
     * Based on version 2.1 Copyright Paul Johnston 2000 - 2002.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for details.
     *
     * @param string data The data to calculate the hash from
     *
     * @return string The hash
     */
    var _sha1 = function () {
        function n(e, b) {
            e[b >> 5] |= 128 << 24 - b % 32;
            e[(b + 64 >> 9 << 4) + 15] = b;
            for (var c = new Array(80), a = 1732584193, d = -271733879, h = -1732584194,
                    k = 271733878, g = -1009589776, p = 0; p < e.length; p += 16) {
                for (var o = a, q = d, r = h, s = k, t = g, f = 0; 80 > f; f++) {
                    var m;

                    if (f < 16) {
                        m = e[p + f];
                    } else {
                        m = c[f - 3] ^ c[f - 8] ^ c[f - 14] ^ c[f - 16];
                        m = m << 1 | m >>> 31;
                    }

                    c[f] = m;
                    m = l(l(a << 5 | a >>> 27, 20 > f ? d & h | ~d & k : 40 > f ? d ^
                        h ^ k : 60 > f ? d & h | d & k | h & k : d ^ h ^ k), l(
                        l(g, c[f]), 20 > f ? 1518500249 : 40 > f ? 1859775393 :
                        60 > f ? -1894007588 : -899497514));
                    g = k;
                    k = h;
                    h = d << 30 | d >>> 2;
                    d = a;
                    a = m;
                }
                a = l(a, o);
                d = l(d, q);
                h = l(h, r);
                k = l(k, s);
                g = l(g, t);
            }
            return [a, d, h, k, g];
        }

        function l(e, b) {
            var c = (e & 65535) + (b & 65535);
            return (e >> 16) + (b >> 16) + (c >> 16) << 16 | c & 65535;
        }

        function q(e) {
            for (var b = [], c = (1 << g) - 1, a = 0; a < e.length * g; a += g) {
                b[a >> 5] |= (e.charCodeAt(a / g) & c) << 24 - a % 32;
            }
            return b;
        }
        var g = 8;
        return function (e) {
            var b = _oauth_consumer_secret + "&" + (null !== _oauth_token_secret ?
                _oauth_token_secret : "");
            if (_oauth_consumer_secret === null) {
                console.warn("To generate a hash, the consumer secret must be set.");
            }
            var c = q(b);
            if (c.length > 16) {
                c = n(c, b.length * g);
            }
            b = new Array(16);
            for (var a = new Array(16), d = 0; d < 16; d++) {
                a[d] = c[d] ^ 909522486;
                b[d] = c[d] ^ 1549556828;
            }
            c = n(a.concat(q(e)), 512 + e.length * g);
            b = n(b.concat(c), 672);
            c = "";
            for (a = 0; a < 4 * b.length; a += 3) {
                for (d = (b[a >> 2] >> 8 * (3 - a % 4) & 255) << 16 | (b[a + 1 >> 2] >>
                    8 * (3 - (a + 1) % 4) & 255) << 8 | b[a + 2 >> 2] >> 8 * (3 -
                    (a + 2) % 4) & 255, e = 0; 4 > e; e++) {
                    c = 8 * a + 6 * e > 32 * b.length ? c + "=" : c +
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
                        .charAt(d >> 6 * (3 - e) & 63);
                }
            }
            return c;
        };
    }();

    /*
     * Gets the base64 representation for the given data
     *
     * http://phpjs.org
     * +   original by: Tyler Akins (http://rumkin.com)
     * +   improved by: Bayron Guevara
     * +   improved by: Thunder.m
     * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     * +   bugfixed by: Pellentesque Malesuada
     * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     * +   improved by: RafaÃƒâ€¦Ã¢â‚¬Å¡ Kukawski (http://kukawski.pl)
     *
     * @param string data The data to calculate the base64 representation from
     *
     * @return string The base64 representation
     */
    var _base64_encode = function (a) {
        var d, e, f, b, g = 0,
            h = 0,
            i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            c = [];
        if (!a) {
            return a;
        }
        do {
            d = a.charCodeAt(g++);
            e = a.charCodeAt(g++);
            f = a.charCodeAt(g++);
            b = d << 16 | e << 8 | f;
            d = b >> 18 & 63;
            e = b >> 12 & 63;
            f = b >> 6 & 63;
            b &= 63;
            c[h++] = i.charAt(d) + i.charAt(e) + i.charAt(f) + i.charAt(b);
        } while (g < a.length);
        c = c.join("");
        a = a.length % 3;
        return (a ? c.slice(0, a - 3) : c) + "===".slice(a || 3);
    };

    /*
     * Builds a HTTP query string from the given data
     *
     * http://phpjs.org
     * +     original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     * +     improved by: Legaev Andrey
     * +     improved by: Michael White (http://getsprink.com)
     * +     improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     * +     improved by: Brett Zamir (http://brett-zamir.me)
     * +        revised by: stag019
     * +     input by: Dreamer
     * +     bugfixed by: Brett Zamir (http://brett-zamir.me)
     * +     bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
     *
     * @param string data The data to concatenate
     * @return string The HTTP query
     */
    var _http_build_query = function (e, f, b) {
        function g(c, a, d) {
            var b, e = [];
            if (a === true) {
                a = "1";
            } else if (a === false) {
                a = "0";
            }
            if (null !== a) {
                if (typeof a === "object") {
                    for (b in a) {
                        if (a[b] !== null) {
                            e.push(g(c + "[" + b + "]", a[b], d));
                        }
                    }
                    return e.join(d);
                }
                if (typeof a !== "function") {
                    return _url(c) + "=" + _url(a);
                }
                console.warn("There was an error processing for http_build_query().");
            } else {
                return "";
            }
        }
        var d, c, h = [];
        if (! b) {
            b = "&";
        }
        for (c in e) {
            d = e[c];
            if (f && ! isNaN(c)) {
                c = String(f) + c;
            }
            d = g(c, d, b);
            if (d !== "") {
                h.push(d);
            }
        }
        return h.join(b);
    };

    /**
     * Generates a (hopefully) unique random string
     * @param int optional length The length of the string to generate
     * @return string The random string
     */
    var _nonce = function (length) {
        if (typeof length === "undefined") {
            length = 8;
        }
        if (length < 1) {
            console.warn("Invalid nonce length.");
        }
        var nonce = "";
        for (var i = 0; i < length; i++) {
            var character = Math.floor(Math.random() * 61);
            nonce += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".substring(character, character + 1);
        }
        return nonce;
    };

    /**
     * Sort array elements by key
     * @param array input_arr The array to sort
     * @return array The sorted keys
     */
    var _ksort = function (input_arr) {
        var keys = [], sorter, k;

        sorter = function (a, b) {
            var a_float = parseFloat(a),
            b_float = parseFloat(b),
            a_numeric = a_float + "" === a,
            b_numeric = b_float + "" === b;
            if (a_numeric && b_numeric) {
                return a_float > b_float ? 1 : a_float < b_float ? -1 : 0;
            } else if (a_numeric && !b_numeric) {
                return 1;
            } else if (!a_numeric && b_numeric) {
                return -1;
            }
            return a > b ? 1 : a < b ? -1 : 0;
        };

        // Make a list of key names
        for (k in input_arr) {
            if (input_arr.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        keys.sort(sorter);
        return keys;
    };

    /**
     * Clone objects
     * @param object obj    The object to clone
     * @return object clone The cloned object
     */
    var _clone = function (obj) {
        var clone = {};
        for (var i in obj) {
            if (typeof(obj[i]) === "object") {
                clone[i] = _clone(obj[i]);
            } else {
                clone[i] = obj[i];
            }
        }
        return clone;
    };

    /**
     * Generates an OAuth signature
     *
     * @param string          httpmethod    Usually either 'GET' or 'POST' or 'DELETE'
     * @param string          method        The API method to call
     * @param array  optional params        The API call parameters, associative
     * @param bool   optional append_to_get Whether to append the OAuth params to GET
     * @return string Authorization HTTP header
     */
    var _sign = function (httpmethod, method, params, append_to_get) {
        if (typeof params === "undefined") {
            params = {};
        }
        if (typeof append_to_get === "undefined") {
            append_to_get = false;
        }
        if (_oauth_consumer_key === null) {
            console.warn("To generate a signature, the consumer key must be set.");
        }
        var sign_params = {
            consumer_key:     _oauth_consumer_key,
            version:          "1.0",
            timestamp:        Math.round(new Date().getTime() / 1000),
            nonce:            _nonce(),
            signature_method: "HMAC-SHA1"
        };
        var sign_base_params = {};
        var value;
        for (var key in sign_params) {
            value = sign_params[key];
            sign_base_params["oauth_" + key] = _url(value);
        }
        if (_oauth_token !== null) {
            sign_base_params.oauth_token = _url(_oauth_token);
        }
        var oauth_params = _clone(sign_base_params);
        for (key in params) {
            value = params[key];
            sign_base_params[key] = value;
        }
        var keys = _ksort(sign_base_params);
        var sign_base_string = "";
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            value = sign_base_params[key];
            sign_base_string += key + "=" + _url(value) + "&";
        }
        sign_base_string = sign_base_string.substring(0, sign_base_string.length - 1);
        var signature    = _sha1(httpmethod + "&" + _url(method) + "&" + _url(sign_base_string));

        params = append_to_get ? sign_base_params : oauth_params;
        params.oauth_signature = signature;
        keys = _ksort(params);
        var authorization = "";
        if (append_to_get) {
            for(i = 0; i < keys.length; i++) {
                key = keys[i];
                value = params[key];
                authorization += key + "=" + _url(value) + "&";
            }
            return authorization.substring(0, authorization.length - 1);
        }
        authorization = "OAuth ";
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            value = params[key];
            authorization += key + "=\"" + _url(value) + "\", ";
        }
        return authorization.substring(0, authorization.length - 2);
    };

    /**
     * Detects HTTP method to use for API call
     *
     * @param string method The API method to call
     * @param array  params The parameters to send along
     * @return string The HTTP method that should be used
     */
    var _detectMethod = function (method, params) {
        // multi-HTTP method endpoints
        switch (method) {
        case "account/settings":
        case "account/login_verification_enrollment":
        case "account/login_verification_request":
            method = params.length ? method + "__post" : method;
            break;
        }

        var httpmethods = {};
        httpmethods.GET = [
            // Timelines
            "statuses/mentions_timeline",
            "statuses/user_timeline",
            "statuses/home_timeline",
            "statuses/retweets_of_me",

            // Tweets
            "statuses/retweets/:id",
            "statuses/show/:id",
            "statuses/oembed",
            "statuses/retweeters/ids",

            // Search
            "search/tweets",

            // Direct Messages
            "direct_messages",
            "direct_messages/sent",
            "direct_messages/show",

            // Friends & Followers
            "friendships/no_retweets/ids",
            "friends/ids",
            "followers/ids",
            "friendships/lookup",
            "friendships/incoming",
            "friendships/outgoing",
            "friendships/show",
            "friends/list",
            "followers/list",
            "friendships/lookup",

            // Users
            "account/settings",
            "account/verify_credentials",
            "blocks/list",
            "blocks/ids",
            "users/lookup",
            "users/show",
            "users/search",
            "users/contributees",
            "users/contributors",
            "users/profile_banner",
            "mutes/users/ids",
            "mutes/users/list",

            // Suggested Users
            "users/suggestions/:slug",
            "users/suggestions",
            "users/suggestions/:slug/members",

            // Favorites
            "favorites/list",

            // Lists
            "lists/list",
            "lists/statuses",
            "lists/memberships",
            "lists/subscribers",
            "lists/subscribers/show",
            "lists/members/show",
            "lists/members",
            "lists/show",
            "lists/subscriptions",
            "lists/ownerships",

            // Saved searches
            "saved_searches/list",
            "saved_searches/show/:id",

            // Places & Geo
            "geo/id/:place_id",
            "geo/reverse_geocode",
            "geo/search",
            "geo/similar_places",

            // Trends
            "trends/place",
            "trends/available",
            "trends/closest",

            // OAuth
            "oauth/authenticate",
            "oauth/authorize",

            // Help
            "help/configuration",
            "help/languages",
            "help/privacy",
            "help/tos",
            "application/rate_limit_status",

            // Tweets
            "statuses/lookup",

            // Internal
            "users/recommendations",
            "account/push_destinations/device",
            "activity/about_me",
            "activity/by_friends",
            "statuses/media_timeline",
            "timeline/home",
            "help/experiments",
            "search/typeahead",
            "search/universal",
            "discover/universal",
            "conversation/show",
            "statuses/:id/activity/summary",
            "account/login_verification_enrollment",
            "account/login_verification_request",
            "prompts/suggest",

            "beta/timelines/custom/list",
            "beta/timelines/timeline",
            "beta/timelines/custom/show"
        ];
        httpmethods.POST = [
            // Tweets
            "statuses/destroy/:id",
            "statuses/update",
            "statuses/retweet/:id",
            "statuses/update_with_media",
            "media/upload",

            // Direct Messages
            "direct_messages/destroy",
            "direct_messages/new",

            // Friends & Followers
            "friendships/create",
            "friendships/destroy",
            "friendships/update",

            // Users
            "account/settings__post",
            "account/update_delivery_device",
            "account/update_profile",
            "account/update_profile_background_image",
            "account/update_profile_colors",
            "account/update_profile_image",
            "blocks/create",
            "blocks/destroy",
            "account/update_profile_banner",
            "account/remove_profile_banner",
            "mutes/users/create",
            "mutes/users/destroy",

            // Favorites
            "favorites/destroy",
            "favorites/create",

            // Lists
            "lists/members/destroy",
            "lists/subscribers/create",
            "lists/subscribers/destroy",
            "lists/members/create_all",
            "lists/members/create",
            "lists/destroy",
            "lists/update",
            "lists/create",
            "lists/members/destroy_all",

            // Saved Searches
            "saved_searches/create",
            "saved_searches/destroy/:id",

            // Spam Reporting
            "users/report_spam",

            // OAuth
            "oauth/access_token",
            "oauth/request_token",
            "oauth2/token",
            "oauth2/invalidate_token",

            // Internal
            "direct_messages/read",
            "account/login_verification_enrollment__post",
            "push_destinations/enable_login_verification",
            "account/login_verification_request__post",

            "beta/timelines/custom/create",
            "beta/timelines/custom/update",
            "beta/timelines/custom/destroy",
            "beta/timelines/custom/add",
            "beta/timelines/custom/remove"
        ];
        for (var httpmethod in httpmethods) {
            if (httpmethods[httpmethod].indexOf(method) > -1) {
                return httpmethod;
            }
        }
        console.warn("Can't find HTTP method to use for \"" + method + "\".");
    };

    /**
     * Detects if API call should use multipart/form-data
     * @param string method The API method to call
     * @return bool Whether the method should be sent as multipart
     */
    var _detectMultipart = function (method) {
        var multiparts = [
            // Tweets
            "statuses/update_with_media",

            // Users
            "account/update_profile_background_image",
            "account/update_profile_image",
            "account/update_profile_banner"
        ];
        return multiparts.indexOf(method) > -1;
    };

    /**
     * Build multipart request from upload params
     * @param string method  The API method to call
     * @param array  params  The parameters to send along
     * @return null|string The built multipart request body
     */
    var _buildMultipart = function (method, params) {
        // well, files will only work in multipart methods
        if (! _detectMultipart(method)) {
            return;
        }

        // only check specific parameters
        var possible_methods = [
            // Tweets
            "statuses/update_with_media",
            // Accounts
            "account/update_profile_background_image",
            "account/update_profile_image",
            "account/update_profile_banner"
        ];
        var possible_files = {
            // Tweets
            "statuses/update_with_media": "media[]",
            // Accounts
            "account/update_profile_background_image": "image",
            "account/update_profile_image": "image",
            "account/update_profile_banner": "banner"
        };
        // method might have files?
        if (possible_methods.indexOf(method) === -1) {
            return;
        }

        // check for filenames
        possible_files = possible_files[method].split(" ");

        var multipart_border = "--------------------" + _nonce();
        var multipart_request = "";
        for (var key in params) {
            multipart_request +=
                "--" + multipart_border + "\r\n"
                + "Content-Disposition: form-data; name=\"" + key + "\"";
            if (possible_files.indexOf(key) > -1) {
                multipart_request +=
                    "\r\nContent-Transfer-Encoding: base64";
            }
            multipart_request +=
                "\r\n\r\n" + params[key] + "\r\n";
        }
        multipart_request += "--" + multipart_border + "--";
        return multipart_request;
    };

    /**
     * Detects if API call is internal
     * @param string method The API method to call
     * @return bool Whether the method is defined in internal API
     */
    var _detectInternal = function (method) {
        var internals = [
            "users/recommendations"
        ];
        return internals.join(" ").indexOf(method) > -1;
    };

    /**
     * Detects if API call should use media endpoint
     * @param string method The API method to call
     * @return bool Whether the method is defined in media API
     */
    var _detectMedia = function (method) {
        var medias = [
            "media/upload"
        ];
        return medias.join(" ").indexOf(method) > -1;
    };

    /**
     * Detects if API call should use old endpoint
     * @param string method The API method to call
     * @return bool Whether the method is defined in old API
     */
    var _detectOld = function (method) {
        var olds = [
            "account/push_destinations/device"
        ];
        return olds.join(" ").indexOf(method) > -1;
    };

    /**
     * Builds the complete API endpoint url
     * @param string method The API method to call
     * @return string The URL to send the request to
     */
    var _getEndpoint = function (method) {
        var url;
        if (method.substring(0, 5) === "oauth") {
            url = _endpoint_oauth + method;
        } else if (_detectMedia(method)) {
            url = _endpoint_media + method + ".json";
        } else if (_detectOld(method)) {
            url = _endpoint_old + method + ".json";
        } else {
            url = _endpoint + method + ".json";
        }
        return url;
    };

    /**
     * Gets the XML HTTP Request object, trying to load it in various ways
     * @return object The XMLHttpRequest object instance
     */
    var _getXmlRequestObject = function () {
        var xml = null;
        // first, try the W3-standard object
        if (typeof window === "object"
            && window
            && typeof window.XMLHttpRequest !== "undefined"
        ) {
            xml = new window.XMLHttpRequest();
        // then, try Titanium framework object
        } else if (typeof Ti === "object"
            && Ti
            && typeof Ti.Network.createHTTPClient !== "undefined"
        ) {
            xml = Ti.Network.createHTTPClient();
        // are we in an old Internet Explorer?
        } else if (typeof ActiveXObject !== "undefined"
        ) {
            try {
                xml = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                console.error("ActiveXObject object not defined.");
            }
        // now, consider RequireJS and/or Node.js objects
        } else if (typeof require === "function"
            && require
        ) {
            // look for xmlhttprequest module
            try {
                var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                xml = new XMLHttpRequest();
            } catch (e1) {
                // or maybe the user is using xhr2
                try {
                    var XMLHttpRequest = require("xhr2");
                    xml = new XMLHttpRequest();
                } catch (e2) {
                    console.error("xhr2 object not defined, cancelling.");
                }
            }
        }
        return xml;
    };

    /**
     * Calls the API using cURL
     *
     * @param string          httpmethod    The HTTP method to use for making the request
     * @param string          method        The API method to call
     * @param array  optional params        The parameters to send along
     * @param bool   optional multipart     Whether to use multipart/form-data
     * @param bool   optional app_only_auth Whether to use app-only bearer authentication
     * @param bool   optional internal      Whether to use internal call
     * @param function        callback      The function to call with the API call result
     *
     * @return mixed The API reply, encoded in the set return_format
     */

    var _callApi = function (httpmethod, method, params, multipart, app_only_auth, internal, callback) {
        if (typeof params === "undefined") {
            params = {};
        }
        if (typeof multipart === "undefined") {
            multipart = false;
        }
        if (typeof app_only_auth === "undefined") {
            app_only_auth = false;
        }
        if (typeof callback !== "function") {
            callback = function () {};
        }
        if (internal) {
            params.adc            = "phone";
            params.application_id = 333903271;
        }

        var url           = _getEndpoint(method);
        var authorization = null;

        var xml = _getXmlRequestObject();
        if (xml === null) {
            return;
        }
        var post_fields;

        if (httpmethod === "GET") {
            var url_with_params = url;
            if (JSON.stringify(params) !== "{}") {
                url_with_params += "?" + _http_build_query(params);
            }
            if (! app_only_auth) {
                authorization = _sign(httpmethod, url, params);
            }

            // append auth params to GET url for IE7-9, to send via JSONP
            if (_use_jsonp) {
                if (JSON.stringify(params) !== "{}") {
                    url_with_params += "&";
                } else {
                    url_with_params += "?";
                }
                var callback_name = _nonce();
                window[callback_name] = function (reply) {
                    reply.httpstatus = 200;

                    var rate = null;
                    if (typeof xml.getResponseHeader !== "undefined"
                        && xml.getResponseHeader("x-rate-limit-limit") !== ""
                    ) {
                        rate = {
                            limit: xml.getResponseHeader("x-rate-limit-limit"),
                            remaining: xml.getResponseHeader("x-rate-limit-remaining"),
                            reset: xml.getResponseHeader("x-rate-limit-reset")
                        };
                    }
                    callback(reply, rate);
                };
                params.callback = callback_name;
                url_with_params = url + "?" + _sign(httpmethod, url, params, true);
                var tag = document.createElement("script");
                tag.type = "text/javascript";
                tag.src = url_with_params;
                var body = document.getElementsByTagName("body")[0];
                body.appendChild(tag);
                return;

            } else if (_use_proxy) {
                url_with_params = url_with_params.replace(
                    _endpoint_base,
                    _endpoint_proxy
                ).replace(
                    _endpoint_base_media,
                    _endpoint_proxy
                );
            }
            xml.open(httpmethod, url_with_params, true);
        } else {
            if (_use_jsonp) {
                console.warn("Sending POST requests is not supported for IE7-9.");
                return;
            }
            if (multipart) {
                if (! app_only_auth) {
                    authorization = _sign(httpmethod, url, {});
                }
                params = _buildMultipart(method, params);
            } else {
                if (! app_only_auth) {
                    authorization = _sign(httpmethod, url, params);
                }
                params = _http_build_query(params);
            }
            post_fields = params;
            if (_use_proxy || multipart) { // force proxy for multipart base64
                url = url.replace(
                    _endpoint_base,
                    _endpoint_proxy
                ).replace(
                    _endpoint_base_media,
                    _endpoint_proxy
                );
            }
            xml.open(httpmethod, url, true);
            if (multipart) {
                xml.setRequestHeader("Content-Type", "multipart/form-data; boundary="
                    + post_fields.split("\r\n")[0].substring(2));
            } else {
                xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
        }
        if (app_only_auth) {
            if (_oauth_consumer_key === null
                && _oauth_bearer_token === null
            ) {
                console.warn("To make an app-only auth API request, consumer key or bearer token must be set.");
            }
            // automatically fetch bearer token, if necessary
            if (_oauth_bearer_token === null) {
                return oauth2_token(function () {
                    _callApi(httpmethod, method, params, multipart, app_only_auth, false, callback);
                });
            }
            authorization = "Bearer " + _oauth_bearer_token;
        }
        if (authorization !== null) {
            xml.setRequestHeader((_use_proxy ? "X-" : "") + "Authorization", authorization);
        }
        xml.onreadystatechange = function () {
            if (xml.readyState >= 4) {
                var httpstatus = 12027;
                try {
                    httpstatus = xml.status;
                } catch (e) {}
                var response = "";
                try {
                    response = xml.responseText;
                } catch (e) {}
                var reply = _parseApiReply(response);
                reply.httpstatus = httpstatus;
                var rate = null;
                if (typeof xml.getResponseHeader !== "undefined"
                    && xml.getResponseHeader("x-rate-limit-limit") !== ""
                ) {
                    rate = {
                        limit: xml.getResponseHeader("x-rate-limit-limit"),
                        remaining: xml.getResponseHeader("x-rate-limit-remaining"),
                        reset: xml.getResponseHeader("x-rate-limit-reset")
                    };
                }
                callback(reply, rate);
            }
        };
        xml.send(httpmethod === "GET" ? null : post_fields);
        return true;
    };

    /**
     * Parses the API reply to encode it in the set return_format
     *
     * @param string reply  The actual reply, JSON-encoded or URL-encoded
     *
     * @return array|object The parsed reply
     */
    var _parseApiReply = function (reply) {
        if (typeof reply !== "string" || reply === "") {
            return {};
        }
        if (reply === "[]") {
            return [];
        }
        var parsed;
        try {
            parsed = JSON.parse(reply);
        } catch (e) {
            parsed = {};
            if (reply.indexOf("<" + "?xml version=\"1.0\" encoding=\"UTF-8\"?" + ">") === 0) {
                // we received XML...
                // since this only happens for errors,
                // don't perform a full decoding
                parsed.request = reply.match(/<request>(.*)<\/request>/)[1];
                parsed.error   = reply.match(/<error>(.*)<\/error>/)[1];
            } else {
                // assume query format
                var elements = reply.split("&");
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i].split("=", 2);
                    if (element.length > 1) {
                        parsed[element[0]] = decodeURIComponent(element[1]);
                    } else {
                        parsed[element[0]] = null;
                    }
                }
            }
        }
        return parsed;
    };

    return {
        setConsumerKey: setConsumerKey,
        getVersion: getVersion,
        setToken: setToken,
        setBearerToken: setBearerToken,
        setUseProxy: setUseProxy,
        setProxy: setProxy,
        __call: __call,
        oauth_authenticate: oauth_authenticate,
        oauth_authorize: oauth_authorize,
        oauth2_token: oauth2_token
    };
};

if (typeof module === "object"
    && module
    && typeof module.exports === "object"
) {
    // Expose codebird as module.exports in loaders that implement the Node
    // module pattern (including browserify). Do not create the global, since
    // the user will be storing it themselves locally, and globals are frowned
    // upon in the Node module world.
    module.exports = Codebird;
} else {
    // Otherwise expose codebird to the global object as usual
    if (typeof window === "object"
        && window) {
        window.Codebird = Codebird;
    }

    // Register as a named AMD module, since codebird can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase codebird is used because AMD module names are
    // derived from file names, and codebird is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of codebird, it will work.
    if (typeof define === "function" && define.amd) {
        define("codebird", [], function () { return Codebird; });
    }
}

})();

/* Laura Doktorova https://github.com/olado/doT */
(function(){function o(){var a={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},b=/&(?!#?\w+;)|<|>|"|'|\//g;return function(){return this?this.replace(b,function(c){return a[c]||c}):this}}function p(a,b,c){return(typeof b==="string"?b:b.toString()).replace(a.define||i,function(l,e,f,g){if(e.indexOf("def.")===0)e=e.substring(4);if(!(e in c))if(f===":"){a.defineParams&&g.replace(a.defineParams,function(n,h,d){c[e]={arg:h,text:d}});e in c||(c[e]=g)}else(new Function("def","def['"+
e+"']="+g))(c);return""}).replace(a.use||i,function(l,e){if(a.useParams)e=e.replace(a.useParams,function(g,n,h,d){if(c[h]&&c[h].arg&&d){g=(h+":"+d).replace(/'|\\/g,"_");c.__exp=c.__exp||{};c.__exp[g]=c[h].text.replace(RegExp("(^|[^\\w$])"+c[h].arg+"([^\\w$])","g"),"$1"+d+"$2");return n+"def.__exp['"+g+"']"}});var f=(new Function("def","return "+e))(c);return f?p(a,f,c):f})}function m(a){return a.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var j={version:"1.0.1",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,
interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:true,append:true,selfcontained:false},template:undefined,
compile:undefined},q;if(typeof module!=="undefined"&&module.exports)module.exports=j;else if(typeof define==="function"&&define.amd)define(function(){return j});else{q=function(){return this||(0,eval)("this")}();q.doT=j}String.prototype.encodeHTML=o();var r={append:{start:"'+(",end:")+'",endencode:"||'').toString().encodeHTML()+'"},split:{start:"';out+=(",end:");out+='",endencode:"||'').toString().encodeHTML();out+='"}},i=/$^/;j.template=function(a,b,c){b=b||j.templateSettings;var l=b.append?r.append:
r.split,e,f=0,g;a=b.use||b.define?p(b,a,c||{}):a;a=("var out='"+(b.strip?a.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):a).replace(/'|\\/g,"\\$&").replace(b.interpolate||i,function(h,d){return l.start+m(d)+l.end}).replace(b.encode||i,function(h,d){e=true;return l.start+m(d)+l.endencode}).replace(b.conditional||i,function(h,d,k){return d?k?"';}else if("+m(k)+"){out+='":"';}else{out+='":k?"';if("+m(k)+"){out+='":"';}out+='"}).replace(b.iterate||i,function(h,
d,k,s){if(!d)return"';} } out+='";f+=1;g=s||"i"+f;d=m(d);return"';var arr"+f+"="+d+";if(arr"+f+"){var "+k+","+g+"=-1,l"+f+"=arr"+f+".length-1;while("+g+"<l"+f+"){"+k+"=arr"+f+"["+g+"+=1];out+='"}).replace(b.evaluate||i,function(h,d){return"';"+m(d)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,"").replace(/(\s|;|\}|^|\{)out\+=''\+/g,"$1out+=");if(e&&b.selfcontained)a="String.prototype.encodeHTML=("+
o.toString()+"());"+a;try{return new Function(b.varname,a)}catch(n){typeof console!=="undefined"&&console.log("Could not create a template function: "+a);throw n;}};j.compile=function(a,b){return j.template(a,null,b)}})();


//! moment.js
//! version : 2.8.4
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function(a){function b(a,b,c){switch(arguments.length){case 2:return null!=a?a:b;case 3:return null!=a?a:null!=b?b:c;default:throw new Error("Implement me")}}function c(a,b){return zb.call(a,b)}function d(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function e(a){tb.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+a)}function f(a,b){var c=!0;return m(function(){return c&&(e(a),c=!1),b.apply(this,arguments)},b)}function g(a,b){qc[a]||(e(b),qc[a]=!0)}function h(a,b){return function(c){return p(a.call(this,c),b)}}function i(a,b){return function(c){return this.localeData().ordinal(a.call(this,c),b)}}function j(){}function k(a,b){b!==!1&&F(a),n(this,a),this._d=new Date(+a._d)}function l(a){var b=y(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=tb.localeData(),this._bubble()}function m(a,b){for(var d in b)c(b,d)&&(a[d]=b[d]);return c(b,"toString")&&(a.toString=b.toString),c(b,"valueOf")&&(a.valueOf=b.valueOf),a}function n(a,b){var c,d,e;if("undefined"!=typeof b._isAMomentObject&&(a._isAMomentObject=b._isAMomentObject),"undefined"!=typeof b._i&&(a._i=b._i),"undefined"!=typeof b._f&&(a._f=b._f),"undefined"!=typeof b._l&&(a._l=b._l),"undefined"!=typeof b._strict&&(a._strict=b._strict),"undefined"!=typeof b._tzm&&(a._tzm=b._tzm),"undefined"!=typeof b._isUTC&&(a._isUTC=b._isUTC),"undefined"!=typeof b._offset&&(a._offset=b._offset),"undefined"!=typeof b._pf&&(a._pf=b._pf),"undefined"!=typeof b._locale&&(a._locale=b._locale),Ib.length>0)for(c in Ib)d=Ib[c],e=b[d],"undefined"!=typeof e&&(a[d]=e);return a}function o(a){return 0>a?Math.ceil(a):Math.floor(a)}function p(a,b,c){for(var d=""+Math.abs(a),e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function q(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function r(a,b){var c;return b=K(b,a),a.isBefore(b)?c=q(a,b):(c=q(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c}function s(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(g(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=tb.duration(c,d),t(this,e,a),this}}function t(a,b,c,d){var e=b._milliseconds,f=b._days,g=b._months;d=null==d?!0:d,e&&a._d.setTime(+a._d+e*c),f&&nb(a,"Date",mb(a,"Date")+f*c),g&&lb(a,mb(a,"Month")+g*c),d&&tb.updateOffset(a,f||g)}function u(a){return"[object Array]"===Object.prototype.toString.call(a)}function v(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}function w(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&A(a[d])!==A(b[d]))&&g++;return g+f}function x(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=jc[a]||kc[b]||b}return a}function y(a){var b,d,e={};for(d in a)c(a,d)&&(b=x(d),b&&(e[b]=a[d]));return e}function z(b){var c,d;if(0===b.indexOf("week"))c=7,d="day";else{if(0!==b.indexOf("month"))return;c=12,d="month"}tb[b]=function(e,f){var g,h,i=tb._locale[b],j=[];if("number"==typeof e&&(f=e,e=a),h=function(a){var b=tb().utc().set(d,a);return i.call(tb._locale,b,e||"")},null!=f)return h(f);for(g=0;c>g;g++)j.push(h(g));return j}}function A(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function B(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function C(a,b,c){return hb(tb([a,11,31+b-c]),b,c).week}function D(a){return E(a)?366:365}function E(a){return a%4===0&&a%100!==0||a%400===0}function F(a){var b;a._a&&-2===a._pf.overflow&&(b=a._a[Bb]<0||a._a[Bb]>11?Bb:a._a[Cb]<1||a._a[Cb]>B(a._a[Ab],a._a[Bb])?Cb:a._a[Db]<0||a._a[Db]>24||24===a._a[Db]&&(0!==a._a[Eb]||0!==a._a[Fb]||0!==a._a[Gb])?Db:a._a[Eb]<0||a._a[Eb]>59?Eb:a._a[Fb]<0||a._a[Fb]>59?Fb:a._a[Gb]<0||a._a[Gb]>999?Gb:-1,a._pf._overflowDayOfYear&&(Ab>b||b>Cb)&&(b=Cb),a._pf.overflow=b)}function G(b){return null==b._isValid&&(b._isValid=!isNaN(b._d.getTime())&&b._pf.overflow<0&&!b._pf.empty&&!b._pf.invalidMonth&&!b._pf.nullInput&&!b._pf.invalidFormat&&!b._pf.userInvalidated,b._strict&&(b._isValid=b._isValid&&0===b._pf.charsLeftOver&&0===b._pf.unusedTokens.length&&b._pf.bigHour===a)),b._isValid}function H(a){return a?a.toLowerCase().replace("_","-"):a}function I(a){for(var b,c,d,e,f=0;f<a.length;){for(e=H(a[f]).split("-"),b=e.length,c=H(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=J(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&w(e,c,!0)>=b-1)break;b--}f++}return null}function J(a){var b=null;if(!Hb[a]&&Jb)try{b=tb.locale(),require("./locale/"+a),tb.locale(b)}catch(c){}return Hb[a]}function K(a,b){var c,d;return b._isUTC?(c=b.clone(),d=(tb.isMoment(a)||v(a)?+a:+tb(a))-+c,c._d.setTime(+c._d+d),tb.updateOffset(c,!1),c):tb(a).local()}function L(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function M(a){var b,c,d=a.match(Nb);for(b=0,c=d.length;c>b;b++)d[b]=pc[d[b]]?pc[d[b]]:L(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function N(a,b){return a.isValid()?(b=O(b,a.localeData()),lc[b]||(lc[b]=M(b)),lc[b](a)):a.localeData().invalidDate()}function O(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Ob.lastIndex=0;d>=0&&Ob.test(a);)a=a.replace(Ob,c),Ob.lastIndex=0,d-=1;return a}function P(a,b){var c,d=b._strict;switch(a){case"Q":return Zb;case"DDDD":return _b;case"YYYY":case"GGGG":case"gggg":return d?ac:Rb;case"Y":case"G":case"g":return cc;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return d?bc:Sb;case"S":if(d)return Zb;case"SS":if(d)return $b;case"SSS":if(d)return _b;case"DDD":return Qb;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Ub;case"a":case"A":return b._locale._meridiemParse;case"x":return Xb;case"X":return Yb;case"Z":case"ZZ":return Vb;case"T":return Wb;case"SSSS":return Tb;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return d?$b:Pb;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return Pb;case"Do":return d?b._locale._ordinalParse:b._locale._ordinalParseLenient;default:return c=new RegExp(Y(X(a.replace("\\","")),"i"))}}function Q(a){a=a||"";var b=a.match(Vb)||[],c=b[b.length-1]||[],d=(c+"").match(hc)||["-",0,0],e=+(60*d[1])+A(d[2]);return"+"===d[0]?-e:e}function R(a,b,c){var d,e=c._a;switch(a){case"Q":null!=b&&(e[Bb]=3*(A(b)-1));break;case"M":case"MM":null!=b&&(e[Bb]=A(b)-1);break;case"MMM":case"MMMM":d=c._locale.monthsParse(b,a,c._strict),null!=d?e[Bb]=d:c._pf.invalidMonth=b;break;case"D":case"DD":null!=b&&(e[Cb]=A(b));break;case"Do":null!=b&&(e[Cb]=A(parseInt(b.match(/\d{1,2}/)[0],10)));break;case"DDD":case"DDDD":null!=b&&(c._dayOfYear=A(b));break;case"YY":e[Ab]=tb.parseTwoDigitYear(b);break;case"YYYY":case"YYYYY":case"YYYYYY":e[Ab]=A(b);break;case"a":case"A":c._isPm=c._locale.isPM(b);break;case"h":case"hh":c._pf.bigHour=!0;case"H":case"HH":e[Db]=A(b);break;case"m":case"mm":e[Eb]=A(b);break;case"s":case"ss":e[Fb]=A(b);break;case"S":case"SS":case"SSS":case"SSSS":e[Gb]=A(1e3*("0."+b));break;case"x":c._d=new Date(A(b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=Q(b);break;case"dd":case"ddd":case"dddd":d=c._locale.weekdaysParse(b),null!=d?(c._w=c._w||{},c._w.d=d):c._pf.invalidWeekday=b;break;case"w":case"ww":case"W":case"WW":case"d":case"e":case"E":a=a.substr(0,1);case"gggg":case"GGGG":case"GGGGG":a=a.substr(0,2),b&&(c._w=c._w||{},c._w[a]=A(b));break;case"gg":case"GG":c._w=c._w||{},c._w[a]=tb.parseTwoDigitYear(b)}}function S(a){var c,d,e,f,g,h,i;c=a._w,null!=c.GG||null!=c.W||null!=c.E?(g=1,h=4,d=b(c.GG,a._a[Ab],hb(tb(),1,4).year),e=b(c.W,1),f=b(c.E,1)):(g=a._locale._week.dow,h=a._locale._week.doy,d=b(c.gg,a._a[Ab],hb(tb(),g,h).year),e=b(c.w,1),null!=c.d?(f=c.d,g>f&&++e):f=null!=c.e?c.e+g:g),i=ib(d,e,f,h,g),a._a[Ab]=i.year,a._dayOfYear=i.dayOfYear}function T(a){var c,d,e,f,g=[];if(!a._d){for(e=V(a),a._w&&null==a._a[Cb]&&null==a._a[Bb]&&S(a),a._dayOfYear&&(f=b(a._a[Ab],e[Ab]),a._dayOfYear>D(f)&&(a._pf._overflowDayOfYear=!0),d=db(f,0,a._dayOfYear),a._a[Bb]=d.getUTCMonth(),a._a[Cb]=d.getUTCDate()),c=0;3>c&&null==a._a[c];++c)a._a[c]=g[c]=e[c];for(;7>c;c++)a._a[c]=g[c]=null==a._a[c]?2===c?1:0:a._a[c];24===a._a[Db]&&0===a._a[Eb]&&0===a._a[Fb]&&0===a._a[Gb]&&(a._nextDay=!0,a._a[Db]=0),a._d=(a._useUTC?db:cb).apply(null,g),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()+a._tzm),a._nextDay&&(a._a[Db]=24)}}function U(a){var b;a._d||(b=y(a._i),a._a=[b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],T(a))}function V(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function W(b){if(b._f===tb.ISO_8601)return void $(b);b._a=[],b._pf.empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,j=0;for(e=O(b._f,b._locale).match(Nb)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(P(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&b._pf.unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),j+=d.length),pc[f]?(d?b._pf.empty=!1:b._pf.unusedTokens.push(f),R(f,d,b)):b._strict&&!d&&b._pf.unusedTokens.push(f);b._pf.charsLeftOver=i-j,h.length>0&&b._pf.unusedInput.push(h),b._pf.bigHour===!0&&b._a[Db]<=12&&(b._pf.bigHour=a),b._isPm&&b._a[Db]<12&&(b._a[Db]+=12),b._isPm===!1&&12===b._a[Db]&&(b._a[Db]=0),T(b),F(b)}function X(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e})}function Y(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function Z(a){var b,c,e,f,g;if(0===a._f.length)return a._pf.invalidFormat=!0,void(a._d=new Date(0/0));for(f=0;f<a._f.length;f++)g=0,b=n({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._pf=d(),b._f=a._f[f],W(b),G(b)&&(g+=b._pf.charsLeftOver,g+=10*b._pf.unusedTokens.length,b._pf.score=g,(null==e||e>g)&&(e=g,c=b));m(a,c||b)}function $(a){var b,c,d=a._i,e=dc.exec(d);if(e){for(a._pf.iso=!0,b=0,c=fc.length;c>b;b++)if(fc[b][1].exec(d)){a._f=fc[b][0]+(e[6]||" ");break}for(b=0,c=gc.length;c>b;b++)if(gc[b][1].exec(d)){a._f+=gc[b][0];break}d.match(Vb)&&(a._f+="Z"),W(a)}else a._isValid=!1}function _(a){$(a),a._isValid===!1&&(delete a._isValid,tb.createFromInputFallback(a))}function ab(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function bb(b){var c,d=b._i;d===a?b._d=new Date:v(d)?b._d=new Date(+d):null!==(c=Kb.exec(d))?b._d=new Date(+c[1]):"string"==typeof d?_(b):u(d)?(b._a=ab(d.slice(0),function(a){return parseInt(a,10)}),T(b)):"object"==typeof d?U(b):"number"==typeof d?b._d=new Date(d):tb.createFromInputFallback(b)}function cb(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function db(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function eb(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function fb(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function gb(a,b,c){var d=tb.duration(a).abs(),e=yb(d.as("s")),f=yb(d.as("m")),g=yb(d.as("h")),h=yb(d.as("d")),i=yb(d.as("M")),j=yb(d.as("y")),k=e<mc.s&&["s",e]||1===f&&["m"]||f<mc.m&&["mm",f]||1===g&&["h"]||g<mc.h&&["hh",g]||1===h&&["d"]||h<mc.d&&["dd",h]||1===i&&["M"]||i<mc.M&&["MM",i]||1===j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,fb.apply({},k)}function hb(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=tb(a).add(f,"d"),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function ib(a,b,c,d,e){var f,g,h=db(a,0,1).getUTCDay();return h=0===h?7:h,c=null!=c?c:e,f=e-h+(h>d?7:0)-(e>h?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:D(a-1)+g}}function jb(b){var c,d=b._i,e=b._f;return b._locale=b._locale||tb.localeData(b._l),null===d||e===a&&""===d?tb.invalid({nullInput:!0}):("string"==typeof d&&(b._i=d=b._locale.preparse(d)),tb.isMoment(d)?new k(d,!0):(e?u(e)?Z(b):W(b):bb(b),c=new k(b),c._nextDay&&(c.add(1,"d"),c._nextDay=a),c))}function kb(a,b){var c,d;if(1===b.length&&u(b[0])&&(b=b[0]),!b.length)return tb();for(c=b[0],d=1;d<b.length;++d)b[d][a](c)&&(c=b[d]);return c}function lb(a,b){var c;return"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),B(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a)}function mb(a,b){return a._d["get"+(a._isUTC?"UTC":"")+b]()}function nb(a,b,c){return"Month"===b?lb(a,c):a._d["set"+(a._isUTC?"UTC":"")+b](c)}function ob(a,b){return function(c){return null!=c?(nb(this,a,c),tb.updateOffset(this,b),this):mb(this,a)}}function pb(a){return 400*a/146097}function qb(a){return 146097*a/400}function rb(a){tb.duration.fn[a]=function(){return this._data[a]}}function sb(a){"undefined"==typeof ender&&(ub=xb.moment,xb.moment=a?f("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.",tb):tb)}for(var tb,ub,vb,wb="2.8.4",xb="undefined"!=typeof global?global:this,yb=Math.round,zb=Object.prototype.hasOwnProperty,Ab=0,Bb=1,Cb=2,Db=3,Eb=4,Fb=5,Gb=6,Hb={},Ib=[],Jb="undefined"!=typeof module&&module&&module.exports,Kb=/^\/?Date\((\-?\d+)/i,Lb=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Mb=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,Nb=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,Ob=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Pb=/\d\d?/,Qb=/\d{1,3}/,Rb=/\d{1,4}/,Sb=/[+\-]?\d{1,6}/,Tb=/\d+/,Ub=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Vb=/Z|[\+\-]\d\d:?\d\d/gi,Wb=/T/i,Xb=/[\+\-]?\d+/,Yb=/[\+\-]?\d+(\.\d{1,3})?/,Zb=/\d/,$b=/\d\d/,_b=/\d{3}/,ac=/\d{4}/,bc=/[+-]?\d{6}/,cc=/[+-]?\d+/,dc=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,ec="YYYY-MM-DDTHH:mm:ssZ",fc=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],gc=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],hc=/([\+\-]|\d\d)/gi,ic=("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),{Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6}),jc={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",Q:"quarter",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},kc={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},lc={},mc={s:45,m:45,h:22,d:26,M:11},nc="DDD w W M D d".split(" "),oc="M D H h m s w W".split(" "),pc={M:function(){return this.month()+1},MMM:function(a){return this.localeData().monthsShort(this,a)},MMMM:function(a){return this.localeData().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.localeData().weekdaysMin(this,a)},ddd:function(a){return this.localeData().weekdaysShort(this,a)},dddd:function(a){return this.localeData().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return p(this.year()%100,2)},YYYY:function(){return p(this.year(),4)},YYYYY:function(){return p(this.year(),5)},YYYYYY:function(){var a=this.year(),b=a>=0?"+":"-";return b+p(Math.abs(a),6)},gg:function(){return p(this.weekYear()%100,2)},gggg:function(){return p(this.weekYear(),4)},ggggg:function(){return p(this.weekYear(),5)},GG:function(){return p(this.isoWeekYear()%100,2)},GGGG:function(){return p(this.isoWeekYear(),4)},GGGGG:function(){return p(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return A(this.milliseconds()/100)},SS:function(){return p(A(this.milliseconds()/10),2)},SSS:function(){return p(this.milliseconds(),3)},SSSS:function(){return p(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+p(A(a/60),2)+":"+p(A(a)%60,2)},ZZ:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+p(A(a/60),2)+p(A(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},x:function(){return this.valueOf()},X:function(){return this.unix()},Q:function(){return this.quarter()}},qc={},rc=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];nc.length;)vb=nc.pop(),pc[vb+"o"]=i(pc[vb],vb);for(;oc.length;)vb=oc.pop(),pc[vb+vb]=h(pc[vb],2);pc.DDDD=h(pc.DDD,3),m(j.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a,b,c){var d,e,f;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){if(e=tb.utc([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=tb([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b,c){var d=this._calendar[a];return"function"==typeof d?d.apply(b,[c]):d},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",_ordinalParse:/\d{1,2}/,preparse:function(a){return a},postformat:function(a){return a},week:function(a){return hb(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),tb=function(b,c,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._i=b,g._f=c,g._l=e,g._strict=f,g._isUTC=!1,g._pf=d(),jb(g)},tb.suppressDeprecationWarnings=!1,tb.createFromInputFallback=f("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),tb.min=function(){var a=[].slice.call(arguments,0);return kb("isBefore",a)},tb.max=function(){var a=[].slice.call(arguments,0);return kb("isAfter",a)},tb.utc=function(b,c,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._useUTC=!0,g._isUTC=!0,g._l=e,g._i=b,g._f=c,g._strict=f,g._pf=d(),jb(g).utc()},tb.unix=function(a){return tb(1e3*a)},tb.duration=function(a,b){var d,e,f,g,h=a,i=null;return tb.isDuration(a)?h={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(h={},b?h[b]=a:h.milliseconds=a):(i=Lb.exec(a))?(d="-"===i[1]?-1:1,h={y:0,d:A(i[Cb])*d,h:A(i[Db])*d,m:A(i[Eb])*d,s:A(i[Fb])*d,ms:A(i[Gb])*d}):(i=Mb.exec(a))?(d="-"===i[1]?-1:1,f=function(a){var b=a&&parseFloat(a.replace(",","."));return(isNaN(b)?0:b)*d},h={y:f(i[2]),M:f(i[3]),d:f(i[4]),h:f(i[5]),m:f(i[6]),s:f(i[7]),w:f(i[8])}):"object"==typeof h&&("from"in h||"to"in h)&&(g=r(tb(h.from),tb(h.to)),h={},h.ms=g.milliseconds,h.M=g.months),e=new l(h),tb.isDuration(a)&&c(a,"_locale")&&(e._locale=a._locale),e},tb.version=wb,tb.defaultFormat=ec,tb.ISO_8601=function(){},tb.momentProperties=Ib,tb.updateOffset=function(){},tb.relativeTimeThreshold=function(b,c){return mc[b]===a?!1:c===a?mc[b]:(mc[b]=c,!0)},tb.lang=f("moment.lang is deprecated. Use moment.locale instead.",function(a,b){return tb.locale(a,b)}),tb.locale=function(a,b){var c;return a&&(c="undefined"!=typeof b?tb.defineLocale(a,b):tb.localeData(a),c&&(tb.duration._locale=tb._locale=c)),tb._locale._abbr},tb.defineLocale=function(a,b){return null!==b?(b.abbr=a,Hb[a]||(Hb[a]=new j),Hb[a].set(b),tb.locale(a),Hb[a]):(delete Hb[a],null)},tb.langData=f("moment.langData is deprecated. Use moment.localeData instead.",function(a){return tb.localeData(a)}),tb.localeData=function(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return tb._locale;if(!u(a)){if(b=J(a))return b;a=[a]}return I(a)},tb.isMoment=function(a){return a instanceof k||null!=a&&c(a,"_isAMomentObject")},tb.isDuration=function(a){return a instanceof l};for(vb=rc.length-1;vb>=0;--vb)z(rc[vb]);tb.normalizeUnits=function(a){return x(a)},tb.invalid=function(a){var b=tb.utc(0/0);return null!=a?m(b._pf,a):b._pf.userInvalidated=!0,b},tb.parseZone=function(){return tb.apply(null,arguments).parseZone()},tb.parseTwoDigitYear=function(a){return A(a)+(A(a)>68?1900:2e3)},m(tb.fn=k.prototype,{clone:function(){return tb(this)},valueOf:function(){return+this._d+6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=tb(this).utc();return 0<a.year()&&a.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():N(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):N(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return G(this)},isDSTShifted:function(){return this._a?this.isValid()&&w(this._a,(this._isUTC?tb.utc(this._a):tb(this._a)).toArray())>0:!1},parsingFlags:function(){return m({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(a){return this.zone(0,a)},local:function(a){return this._isUTC&&(this.zone(0,a),this._isUTC=!1,a&&this.add(this._dateTzOffset(),"m")),this},format:function(a){var b=N(this,a||tb.defaultFormat);return this.localeData().postformat(b)},add:s(1,"add"),subtract:s(-1,"subtract"),diff:function(a,b,c){var d,e,f,g=K(a,this),h=6e4*(this.zone()-g.zone());return b=x(b),"year"===b||"month"===b?(d=432e5*(this.daysInMonth()+g.daysInMonth()),e=12*(this.year()-g.year())+(this.month()-g.month()),f=this-tb(this).startOf("month")-(g-tb(g).startOf("month")),f-=6e4*(this.zone()-tb(this).startOf("month").zone()-(g.zone()-tb(g).startOf("month").zone())),e+=f/d,"year"===b&&(e/=12)):(d=this-g,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-h)/864e5:"week"===b?(d-h)/6048e5:d),c?e:o(e)},from:function(a,b){return tb.duration({to:this,from:a}).locale(this.locale()).humanize(!b)},fromNow:function(a){return this.from(tb(),a)},calendar:function(a){var b=a||tb(),c=K(b,this).startOf("day"),d=this.diff(c,"days",!0),e=-6>d?"sameElse":-1>d?"lastWeek":0>d?"lastDay":1>d?"sameDay":2>d?"nextDay":7>d?"nextWeek":"sameElse";return this.format(this.localeData().calendar(e,this,tb(b)))},isLeapYear:function(){return E(this.year())},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=eb(a,this.localeData()),this.add(a-b,"d")):b},month:ob("Month",!0),startOf:function(a){switch(a=x(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this},endOf:function(b){return b=x(b),b===a||"millisecond"===b?this:this.startOf(b).add(1,"isoWeek"===b?"week":b).subtract(1,"ms")},isAfter:function(a,b){var c;return b=x("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=tb.isMoment(a)?a:tb(a),+this>+a):(c=tb.isMoment(a)?+a:+tb(a),c<+this.clone().startOf(b))},isBefore:function(a,b){var c;return b=x("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=tb.isMoment(a)?a:tb(a),+a>+this):(c=tb.isMoment(a)?+a:+tb(a),+this.clone().endOf(b)<c)},isSame:function(a,b){var c;return b=x(b||"millisecond"),"millisecond"===b?(a=tb.isMoment(a)?a:tb(a),+this===+a):(c=+tb(a),+this.clone().startOf(b)<=c&&c<=+this.clone().endOf(b))},min:f("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(a){return a=tb.apply(null,arguments),this>a?this:a}),max:f("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(a){return a=tb.apply(null,arguments),a>this?this:a}),zone:function(a,b){var c,d=this._offset||0;return null==a?this._isUTC?d:this._dateTzOffset():("string"==typeof a&&(a=Q(a)),Math.abs(a)<16&&(a=60*a),!this._isUTC&&b&&(c=this._dateTzOffset()),this._offset=a,this._isUTC=!0,null!=c&&this.subtract(c,"m"),d!==a&&(!b||this._changeInProgress?t(this,tb.duration(d-a,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,tb.updateOffset(this,!0),this._changeInProgress=null)),this)},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.zone(this._tzm):"string"==typeof this._i&&this.zone(this._i),this},hasAlignedHourOffset:function(a){return a=a?tb(a).zone():0,(this.zone()-a)%60===0},daysInMonth:function(){return B(this.year(),this.month())},dayOfYear:function(a){var b=yb((tb(this).startOf("day")-tb(this).startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")},quarter:function(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)},weekYear:function(a){var b=hb(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==a?b:this.add(a-b,"y")},isoWeekYear:function(a){var b=hb(this,1,4).year;return null==a?b:this.add(a-b,"y")},week:function(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")},isoWeek:function(a){var b=hb(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")},weekday:function(a){var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},isoWeeksInYear:function(){return C(this.year(),1,4)},weeksInYear:function(){var a=this.localeData()._week;return C(this.year(),a.dow,a.doy)},get:function(a){return a=x(a),this[a]()},set:function(a,b){return a=x(a),"function"==typeof this[a]&&this[a](b),this},locale:function(b){var c;return b===a?this._locale._abbr:(c=tb.localeData(b),null!=c&&(this._locale=c),this)},lang:f("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(b){return b===a?this.localeData():this.locale(b)}),localeData:function(){return this._locale},_dateTzOffset:function(){return 15*Math.round(this._d.getTimezoneOffset()/15)}}),tb.fn.millisecond=tb.fn.milliseconds=ob("Milliseconds",!1),tb.fn.second=tb.fn.seconds=ob("Seconds",!1),tb.fn.minute=tb.fn.minutes=ob("Minutes",!1),tb.fn.hour=tb.fn.hours=ob("Hours",!0),tb.fn.date=ob("Date",!0),tb.fn.dates=f("dates accessor is deprecated. Use date instead.",ob("Date",!0)),tb.fn.year=ob("FullYear",!0),tb.fn.years=f("years accessor is deprecated. Use year instead.",ob("FullYear",!0)),tb.fn.days=tb.fn.day,tb.fn.months=tb.fn.month,tb.fn.weeks=tb.fn.week,tb.fn.isoWeeks=tb.fn.isoWeek,tb.fn.quarters=tb.fn.quarter,tb.fn.toJSON=tb.fn.toISOString,m(tb.duration.fn=l.prototype,{_bubble:function(){var a,b,c,d=this._milliseconds,e=this._days,f=this._months,g=this._data,h=0;g.milliseconds=d%1e3,a=o(d/1e3),g.seconds=a%60,b=o(a/60),g.minutes=b%60,c=o(b/60),g.hours=c%24,e+=o(c/24),h=o(pb(e)),e-=o(qb(h)),f+=o(e/30),e%=30,h+=o(f/12),f%=12,g.days=e,g.months=f,g.years=h},abs:function(){return this._milliseconds=Math.abs(this._milliseconds),this._days=Math.abs(this._days),this._months=Math.abs(this._months),this._data.milliseconds=Math.abs(this._data.milliseconds),this._data.seconds=Math.abs(this._data.seconds),this._data.minutes=Math.abs(this._data.minutes),this._data.hours=Math.abs(this._data.hours),this._data.months=Math.abs(this._data.months),this._data.years=Math.abs(this._data.years),this},weeks:function(){return o(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*A(this._months/12)},humanize:function(a){var b=gb(this,!a,this.localeData());return a&&(b=this.localeData().pastFuture(+this,b)),this.localeData().postformat(b)},add:function(a,b){var c=tb.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=tb.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=x(a),this[a.toLowerCase()+"s"]()},as:function(a){var b,c;if(a=x(a),"month"===a||"year"===a)return b=this._days+this._milliseconds/864e5,c=this._months+12*pb(b),"month"===a?c:c/12;switch(b=this._days+Math.round(qb(this._months/12)),a){case"week":return b/7+this._milliseconds/6048e5;case"day":return b+this._milliseconds/864e5;case"hour":return 24*b+this._milliseconds/36e5;case"minute":return 24*b*60+this._milliseconds/6e4;case"second":return 24*b*60*60+this._milliseconds/1e3;
case"millisecond":return Math.floor(24*b*60*60*1e3)+this._milliseconds;default:throw new Error("Unknown unit "+a)}},lang:tb.fn.lang,locale:tb.fn.locale,toIsoString:f("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",function(){return this.toISOString()}),toISOString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),f=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"},localeData:function(){return this._locale}}),tb.duration.fn.toString=tb.duration.fn.toISOString;for(vb in ic)c(ic,vb)&&rb(vb.toLowerCase());tb.duration.fn.asMilliseconds=function(){return this.as("ms")},tb.duration.fn.asSeconds=function(){return this.as("s")},tb.duration.fn.asMinutes=function(){return this.as("m")},tb.duration.fn.asHours=function(){return this.as("h")},tb.duration.fn.asDays=function(){return this.as("d")},tb.duration.fn.asWeeks=function(){return this.as("weeks")},tb.duration.fn.asMonths=function(){return this.as("M")},tb.duration.fn.asYears=function(){return this.as("y")},tb.locale("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===A(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),Jb?module.exports=tb:"function"==typeof define&&define.amd?(define("moment",function(a,b,c){return c.config&&c.config()&&c.config().noGlobal===!0&&(xb.moment=ub),tb}),sb(!0)):sb()}).call(this);


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['moment'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../moment')); // Node
    } else {
        factory((typeof global !== 'undefined' ? global : this).moment); // node or other global
    }
}(function (moment) {
    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            'm': ['eine Minute', 'einer Minute'],
            'h': ['eine Stunde', 'einer Stunde'],
            'd': ['ein Tag', 'einem Tag'],
            'dd': [number + ' Tage', number + ' Tagen'],
            'M': ['ein Monat', 'einem Monat'],
            'MM': [number + ' Monate', number + ' Monaten'],
            'y': ['ein Jahr', 'einem Jahr'],
            'yy': [number + ' Jahre', number + ' Jahren']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }

    return moment.defineLocale('de', {
        months : 'Januar_Februar_MÃƒÂ¤rz_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
        monthsShort : 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
        weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
        weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
        weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
        longDateFormat : {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY LT',
            LLLL : 'dddd, D. MMMM YYYY LT'
        },
        calendar : {
            sameDay: '[Heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[Morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[Gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]'
        },
        relativeTime : {
            future : 'in %s',
            past : 'vor %s',
            s : 'ein paar Sekunden',
            m : processRelativeTime,
            mm : '%d Minuten',
            h : processRelativeTime,
            hh : '%d Stunden',
            d : processRelativeTime,
            dd : processRelativeTime,
            M : processRelativeTime,
            MM : processRelativeTime,
            y : processRelativeTime,
            yy : processRelativeTime
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });
}));
moment.locale('de');

if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {};
        F.prototype = obj;
        return new F();
    };
};
(function($, window, document, undefined) {
    $.fn.socialfeed = function(options) {

        var defaults = {
            plugin_folder: '', // a folder in which the plugin is located (with a slash in the end)
            template: 'social-template.html', // a path to the tamplate file
            show_media: false, // show images of attachments if available
            length: 500 // maximum length of post message shown
        };
        //---------------------------------------------------------------------------------
        var options = $.extend(defaults, options),
            container = $(this),
            template,
            social_networks = ['facebook', 'instagram', 'vk', 'google', 'blogspot', 'twitter'];
        container.empty().css('display', 'inline-block');
        //---------------------------------------------------------------------------------
        // This function performs consequent data loading from all of the sources by calling corresponding functions
        function fireCallback() {
            var fire = true;
            /*$.each(Object.keys(loaded), function() {
                if (loaded[this] > 0)
                    fire = false;
            });*/
            if (fire && options.callback)
                options.callback();
        }
        var Utility = {
            request: function(url, callback) {
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    success: callback
                });
            },
            get_request: function(url, callback) {
                $.get(url, callback, 'json');
            },
            wrapLinks: function(string, social_network) {
                var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                if (social_network === 'google-plus') {
                    string = string.replace(/(@|#)([a-z0-9_]+['])/ig, Utility.wrapGoogleplusTagTemplate);
                } else {
                    string = string.replace(exp, Utility.wrapLinkTemplate);
                }
                return string;
            },
            wrapLinkTemplate: function(string) {
                return '<a target="_blank" href="' + string + '">' + string + '<\/a>';
            },
            wrapGoogleplusTagTemplate: function(string) {
                return '<a target="_blank" href="https://plus.google.com/s/' + string + '" >' + string + '<\/a>';
            },
            shorten: function(string) {
                string = $.trim(string);
                if (string.length > options.length) {
                    return jQuery.trim(string).substring(0, options.length).split(" ").slice(0, -1).join(" ") + "...";
                } else
                    return string;
            },
            stripHTML: function(string) {
                if (typeof string === "undefined" || string === null)
                    return '';
                return string.replace(/(<([^>]+)>)|nbsp;|\s{2,}|/ig, "");
            }
        }

        function SocialFeedPost(social_network, data) {
            this.content = data;
            this.content.attachment = (this.content.attachment == undefined) ? '' : this.content.attachment;
            this.content.time_ago = data.dt_create.fromNow();
            this.content.dt_create = this.content.dt_create.valueOf();
            this.content.text = Utility.wrapLinks(Utility.shorten(data.message + ' ' + data.description), data.social_network);
            this.content.moderation_passed = (options.moderation) ? options.moderation(this.content) : true;

            Feed[social_network].posts.push(this);
        }
        SocialFeedPost.prototype = {
            render: function() {
                var rendered_html = Feed.template(this.content);
                var data = this.content;

                if ($(container).children('[social-feed-id=' + data.id + ']').length != 0)
                    return false;
                if ($(container).children().length == 0) {
                    $(container).append(rendered_html);
                } else {
                    var i = 0,
                        insert_index = -1;
                    $.each($(container).children(), function() {
                        if ($(this).attr('dt-create') < data.dt_create) {
                            insert_index = i;
                            return false;
                        }
                        i++;
                    });
                    $(container).append(rendered_html);
                    if (insert_index >= 0) {
                        insert_index++;
                        var before = $(container).children('div:nth-child(' + insert_index + ')'),
                            current = $(container).children('div:last-child');
                        $(current).insertBefore(before);
                    }

                }
                //if (lastelement) {
                //loaded[data.social_network]--;
                //fireCallback();
                //}
            }

        }
        var Feed = {
            template: false,
            init: function() {
                Feed.getTemplate(function() {
                    social_networks.forEach(function(network) {
                        if (options[network]) {
                            //loaded[network] = 0;
                            options[network].accounts.forEach(function(account) {
                                //loaded[network]++;
                                Feed[network].getData(account);
                            });
                        }
                    });
                });
            },
            getTemplate: function(callback) {
                if (Feed.template)
                    return callback();
                else {
                    if (options.template_html) {
                        Feed.template = doT.template(options.template_html);
                        return callback();
                    } else {
                        $.get(options.template, function(template_html) {
                            Feed.template = doT.template(template_html);
                            return callback();
                        });
                    }
                }
            },
            twitter: {
                posts: [],
                loaded: false,
                api: 'http://api.tweecool.com/',

                getData: function(account) {

                    var cb = new Codebird;
                    cb.setConsumerKey(options.twitter.consumer_key, options.twitter.consumer_secret);

                    switch (account[0]) {
                        case '@':
                            var userid = account.substr(1);
                            cb.__call(
                                "statuses_userTimeline",
                                "id=" + userid + "&count=" + options.twitter.limit,
                                Feed.twitter.utility.getPosts,
                                true // this parameter required
                            );
                            break;
                        case '#':
                            var hashtag = account.substr(1);
                            cb.__call(
                                "search_tweets",
                                "q=from:flozzamusic " + hashtag + "&count=" + options.twitter.limit,
                                function(reply) {
                                    Feed.twitter.utility.getPosts(reply.statuses);
                                },
                                true // this parameter required
                            );
                            break;
                        default:
                    }
                },
                utility: {
                    getPosts: function(json) {
                        $.each(json, function() {
                            var element = this;
                            var post = new SocialFeedPost('twitter', Feed.twitter.utility.unifyPostData(element));
                            post.render();
                        });
                    },
                    unifyPostData: function(element) {
                        var post = {};
                        post.id = element.id;
                        post.dt_create = moment(Feed.twitter.utility.fixTwitterDate(element.created_at));
                        post.author_link = 'http://twitter.com/' + element.user.screen_name;
                        post.author_picture = element.user.profile_image_url;
                        post.post_url = post.author_link + '/status/' + element.id_str;
                        post.author_name = element.user.name;
                        post.message = element.text;
                        post.description = '';
                        post.social_network = 'twitter';
                        post.link = 'http://twitter.com/' + element.user.screen_name + '/status/' + element.id_str;

                        if (options.show_media === true) {
                            if (element.entities.media && element.entities.media.length > 0) {
                                image_url = element.entities.media[0].media_url;
                                if (image_url) {
                                    post.attachment = '<img class="attachment" src="' + image_url + '" />';
                                }
                            }
                        }
                        return post;
                    },
                    fixTwitterDate: function(created_at) {
                        created_at = created_at.replace('+0000', 'Z');
                        if (created_at !== undefined)
                            return created_at;
                    }
                }
            },
            facebook: {
                posts: [],
                graph: 'https://graph.facebook.com/',
                loaded: false,
                getData: function(account) {
                    var request_url, limit = 'limit=' + options.facebook.limit,
                        query_extention = '&access_token=' + options.facebook.access_token + '&locale=de_DE&callback=?';
                    switch (account[0]) {
                        case '@':
                            var username = account.substr(1);

                            request_url = Feed.facebook.graph + username + '/posts?' + limit + query_extention;
                            Utility.request(request_url, Feed.facebook.utility.getPosts);
                            break;
                        case '#':
                            var hashtag = account.substr(1);

                            request_url = Feed.facebook.graph + 'search?q=%23' + hashtag + '&' + limit + query_extention;
                            Utility.request(request_url, Feed.facebook.utility.getPosts);
                            break;
                        default:
                            request_url = Feed.facebook.graph + 'search?q=' + account + '&' + limit + query_extention;
                            Utility.request(request_url, Feed.facebook.utility.getPosts);
                    }
                },
                utility: {
                    getPosts: function(json) {
                        if (json['data'])
                            json['data'].forEach(function(element) {
                                var post = new SocialFeedPost('facebook', Feed.facebook.utility.unifyPostData(element));
                                post.render();
                            });
                    },
                    unifyPostData: function(element) {
                        var post = {},
                            text = (element.message) ? element.message : element.story;

                        post.id = element.id;
                        post.dt_create = moment(element.created_time);
                        post.author_link = 'http://facebook.com/' + element.from.id;
                        post.author_picture = Feed.facebook.graph + element.from.id + '/picture';
                        post.author_name = element.from.name;
                        if (text) {
                            post.message = text;
                        }
                        post.description = (element.description) ? element.description : '';
                        post.link = (element.link) ? element.link : 'http://facebook.com/' + element.from.id;
                        post.social_network = 'facebook';

                        if (options.show_media === true) {
                            if (element.picture) {
                                var image_url = element.picture;
                                if (element.object_id) {
                                    image_url = Feed.facebook.graph + element.object_id + '/picture/?type=normal';
                                } else {
                                    image_url = image_url + "&w=500&h=500"
                                }
                                post.attachment = '<img class="attachment" src="' + image_url + '" />';
                            }
                        }
                        return post;
                    }
                }
            },
            google: {
                posts: [],
                loaded: false,
                api : 'https://www.googleapis.com/plus/v1/',
                getData: function(account) {
                    var request_url;
                    switch (account[0]) {
                        case '#':
                            var hashtag = account.substr(1);
                            request_url = Feed.google.api + 'activities?query=' + hashtag + '&key=' + options.google.access_token + '&maxResults=' + options.google.limit;
                            Utility.request(request_url, Feed.google.utility.getPosts);
                            break;

                        case '@':
                            var username = account.substr(1);
                            request_url = Feed.google.api + 'people/' + username + '/activities/public?key=' + options.google.access_token + '&maxResults=' + options.google.limit;
                            Utilityrequest(request_url, Feed.google.utility.getPosts);
                            break;

                        default:
                    }
                },
                utility: {
                    getPosts: function(json) {
                        json.items.forEach(function(element) {
                            var post = new SocialFeedPost('google', Feed.google.utility.unifyPostData(element));
                            post.render();
                        });
                    },
                    unifyPostData: function(element) {
                        var post = {};

                        post.id = element.id;
                        post.attachment = '';
                        post.description = '';
                        post.dt_create = moment(element.published);
                        post.author_link = element.actor.url;
                        post.author_picture = element.actor.image.url;
                        post.author_name = element.actor.displayName;

                        if (options.show_media === true) {
                            if (element.object.attachments) {
                                $.each(element.object.attachments, function() {
                                    var image = '';
                                    if (this.fullImage) {
                                        image = this.fullImage.url;
                                    } else {
                                        if (this.objectType == 'album') {
                                            if (this.thumbnails && this.thumbnails.length > 0)
                                                if (this.thumbnails[0].image)
                                                    image = this.thumbnails[0].image.url;
                                        }
                                    }
                                    post.attachment = '<img class="attachment" src="' + image + '"/>';
                                });
                            }
                        }
                        if (element.object.content === '') {
                            $.each(element.object.attachments, function() {
                                if (this.content !== undefined) {
                                    post.message = this.content;
                                } else if (this.displayName !== undefined) {
                                    post.message = this.displayName + '<br />' + this.url;
                                }
                            });
                        } else {
                            post.message = element.object.content;
                        }
                        post.social_network = 'google-plus';
                        post.link = element.url;

                        return post;
                    }
                }
            },
            instagram: {
                posts: [],
                loaded: false,
                getData: function(account) {
                    var url,
                        limit = 'count=' + options.instagram.limit,
                        query_extention = 'client_id=' + options.instagram.client_id + '&' + limit + '&callback=?',
                        igm_api_base = 'https://api.instagram.com/v1/';

                    switch (account[0]) {
                        case '@':
                            var username = account.substr(1);
                            url = igm_api_base + 'users/search/?q=' + username + '&' + query_extention;
                            Utility.request(url, Feed.instagram.utility.getUsers);
                            break;
                        case '#':
                            var hashtag = account.substr(1);
                            url = igm_api_base + 'tags/' + hashtag + '/media/recent/?' + query_extention;
                            Utility.request(url, Feed.instagram.utility.getImages);
                            break;
                        default:
                    }
                },
                utility: {
                    getImages: function(json) {
                        json.data.forEach(function(element) {
                            var post = new SocialFeedPost('instagram', Feed.instagram.utility.unifyPostData(element));
                            post.render();
                        });
                    },
                    getUsers: function(json, username) {
                        json.data.forEach(function(user) {
                            if (user.username == username) {
                                var url = igm_api_base + 'users/' + user.id + '/media/recent/?' + query_extention;
                                Utility.request(url, Feed.instagram.utility.getImages);
                            }
                        });
                    },
                    unifyPostData: function(element) {
                        var post = {};

                        post.id = element.id;
                        post.dt_create = moment(element.created_time * 1000);
                        post.author_link = 'http://instagram.com/' + element.user.username;
                        post.author_picture = element.user.profile_picture;
                        post.author_name = element.user.full_name;
                        post.message = (element.caption && element.caption) ? element.caption.text : '';
                        post.description = '';
                        post.social_network = 'instagram';
                        post.link = element.link;
                        if (options.show_media) {
                            post.attachment = '<img class="attachment" src="' + element.images.standard_resolution.url + '' + '" />';
                        }
                        return post;
                    }
                }
            },
            vk: {
                posts: [],
                loaded: false,
                base: 'http://vk.com/',
                api: 'https://api.vk.com/method/',
                user_json_template: 'https://api.vk.com/method/' + 'users.get?fields=first_name,%20last_name,%20screen_name,%20photo&uid=',
                group_json_template: 'https://api.vk.com/method/' + 'groups.getById?fields=first_name,%20last_name,%20screen_name,%20photo&gid=',
                getData: function(account) {
                    var request_url;

                    switch (account[0]) {
                        case '@':
                            var username = account.substr(1);
                            request_url = Feed.vk.api + 'wall.get?owner_id=' + username + '&filter=' + options.vk.source + '&count=' + options.vk.limit + '&callback=?';
                            Utility.get_request(request_url, Feed.vk.utility.getPosts);
                            break;
                        case '#':
                            var hashtag = account.substr(1);
                            request_url = Feed.vk.api + 'newsfeed.search?q=' + hashtag + '&count=' + options.vk.limit + '&callback=?';
                            Utility.get_request(request_url, Feed.vk.utility.getPosts);
                            break;
                        default:
                    }
                },
                utility: {
                    getPosts: function(json) {
                        $.each(json.response, function() {
                            if (this != parseInt(this) && this.post_type == 'post') {
                                var owner_id = (this.owner_id) ? this.owner_id : this.from_id,
                                    vk_wall_owner_url = (owner_id > 0) ? (Feed.vk.user_json_template + owner_id + '&callback=?') : (Feed.vk.group_json_template + (-1) * owner_id + '&callback=?'),
                                    element = this;
                                Utility.get_request(vk_wall_owner_url, function(wall_owner) {
                                    Feed.vk.utility.unifyPostData(wall_owner, element, json)
                                });
                            }
                        });
                    },
                    unifyPostData: function(wall_owner, element, json) {
                        var post = {};

                        post.id = element.id;
                        post.dt_create = moment.unix(element.date);
                        post.description = ' ';
                        post.message = Utility.stripHTML(element.text);
                        post.social_network = 'vk';
                        if (options.show_media) {
                            if (element.attachment) {
                                if (element.attachment.type == 'video')
                                    post.attachment = '<img class="attachment" src="' + element.attachment.video.image_big + '" />';
                                if (element.attachment.type == 'photo')
                                    post.attachment = '<img class="attachment" src="' + element.attachment.photo.src_big + '" />';
                                if (element.attachment.type == 'link')
                                    post.attachment = '<img class="attachment" src="' + element.attachment.link.image_src + '" />';
                            }
                        }

                        if (element.from_id > 0) {
                            var vk_user_json = Feed.vk.user_json_template + element.from_id + '&callback=?';
                            Utility.get_request(vk_user_json, function(user_json) {
                                var vk_post = new SocialFeedPost('vk', Feed.vk.utility.getUser(user_json, post, element, json));
                                vk_post.render();
                            });

                        } else {
                            var vk_group_json = Feed.vk.group_json_template + (-1) * element.from_id + '&callback=?';
                            Utility.get_request(vk_group_json, function(user_json) {
                                var vk_post = new SocialFeedPost('vk', Feed.vk.utility.getGroup(user_json, post, element, json));
                                vk_post.render();
                            });
                        }
                    },
                    getUser: function(user_json, post, element, json) {
                        post.author_name = user_json.response[0].first_name + ' ' + user_json.response[0].last_name;
                        post.author_picture = user_json.response[0].photo;
                        post.author_link = Feed.vk.base + user_json.response[0].screen_name;
                        post.link = Feed.vk.base + user_json.response[0].screen_name + '?w=wall' + element.from_id + '_' + element.id;

                        return post;
                    },
                    getGroup: function(user_json, post, element, json) {
                        post.author_name = user_json.response[0].name;
                        post.author_picture = user_json.response[0].photo;
                        post.author_link = Feed.vk.base + user_json.response[0].screen_name;
                        post.link = Feed.vk.base + user_json.response[0].screen_name + '?w=wall-' + user_json.response[0].gid + '_' + element.id;

                        return post;
                    }
                }
            },
            blogspot: {
                loaded: false,
                getData: function(account) {
                    var url;

                    switch (account[0]) {
                        case '@':
                            var username = account.substr(1);
                            url = 'http://' + username + '.blogspot.com/feeds/posts/default?alt=json-in-script&callback=?';
                            request(url, getPosts);
                            break;
                        default:
                    }
                },
                utility: {
                    getPosts: function(json) {

                        $.each(json.feed.entry, function() {
                            var post = {},
                                element = this;
                            post.id = element.id['$t'].replace(/[^a-z0-9]/gi, '');
                            post.dt_create = moment((element.published['$t']));
                            post.author_link = element.author[0]['uri']['$t'];
                            post.author_picture = 'http:' + element.author[0]['gd$image']['src'];
                            post.author_name = element.author[0]['name']['$t'];
                            post.message = element.title['$t'] + '</br></br>' + stripHTML(element.content['$t']);
                            post.description = '';
                            post.social_network = 'blogspot';
                            post.link = element.link.pop().href;

                            if (options.show_media) {
                                if (element['media$thumbnail'])
                                    post.attachment = '<img class="attachment" src="' + element['media$thumbnail']['url'] + '" />';
                            }

                            post.render();

                        });
                    }
                }
            }
        }
        // Initiate function
        Feed.init();
        if (options.update_period) {
            setInterval(function() {
                return Feed.init();
            }, options.update_period);
        }
    };
})(jQuery);