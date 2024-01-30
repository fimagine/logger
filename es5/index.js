"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = exports.Info = exports.Debug = exports.Log = exports.Warn = void 0;
var _uid = 0;
var Config = {
    currentTime: function () { return '' + new Date().getTime(); },
    console: console,
    showArgs: false,
    showRet: false,
    disabled: false,
};
var Create = function (opts) {
    if (opts === void 0) { opts = {}; }
    var show = function (r, whoami, uid, short_level, timing, params, result) {
        var _a;
        if (params === void 0) { params = []; }
        if (result === void 0) { result = void 0; }
        if (r.print)
            r.print(r, whoami, uid, timing, params, result);
        var args = ["".concat(short_level, "[").concat(r.currentTime(), "][call_id:").concat(uid, "][").concat(whoami, "][").concat(timing, "]")];
        (r.showArgs && (timing === 'ENTER' || timing === 'NEW')) && args.push.apply(args, __spreadArray(['\nparams:'], params, false));
        (r.showRet && (timing === 'LEAVE' || timing === 'END')) && args.push('\nresult:', result);
        (timing === 'REJECT') && args.push('\nreason:', result);
        (_a = r.console)[r.level].apply(_a, args);
    };
    var handle_any_result = function (result, print_leave_log, print_reject_log) {
        if (!(result instanceof Promise)) {
            print_leave_log(result);
            return result;
        }
        return new Promise(function (r0, r1) { return result.then(function (value) {
            print_leave_log(value);
            return r0(value);
        }).catch(function (reason) {
            print_reject_log(reason);
            return r1(reason);
        }); });
    };
    var ret = function r(target, arg2, arg3) {
        if (arg3) {
            var property = arg2;
            var descriptor = arg3;
            var value_1 = descriptor.value, get_1 = descriptor.get, set_1 = descriptor.set;
            // CLASS FUNCTION DECORATOR
            if (value_1) {
                var whoami_1 = "".concat(target.constructor.name, ".").concat(property);
                descriptor.value = function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    var short_level = "[".concat(r.level[0].toUpperCase(), "]");
                    if (r.disabled)
                        return value_1.call.apply(value_1, __spreadArray([this], params, false));
                    var uid = ++_uid;
                    show(r, whoami_1, uid, short_level, 'ENTER', params);
                    var ret = value_1.call.apply(value_1, __spreadArray([this], params, false));
                    var print_leave_log = function (ret) { return show(r, whoami_1, uid, short_level, 'LEAVE', params, ret); };
                    var print_reject_log = function (reason) { return show(r, whoami_1, uid, short_level, 'REJECT', params, reason); };
                    return handle_any_result(ret, print_leave_log, print_reject_log);
                };
            }
            // CLASS GETTER DECORATOR
            if (get_1) {
                var whoami_2 = "".concat(target.constructor.name, ".").concat(property, " getter");
                descriptor.get = function () {
                    var short_level = "[".concat(r.level[0].toUpperCase(), "]");
                    if (r.disabled)
                        return get_1.call(this);
                    var uid = ++_uid;
                    show(r, whoami_2, uid, short_level, 'ENTER', void 0);
                    var ret = get_1.call(this);
                    var print_leave_log = function (ret) { return show(r, whoami_2, uid, short_level, 'LEAVE', void 0, ret); };
                    var print_reject_log = function (reason) { return show(r, whoami_2, uid, short_level, 'REJECT', void 0, reason); };
                    return handle_any_result(ret, print_leave_log, print_reject_log);
                };
            }
            // CLASS FUNCTION DECORATOR
            if (set_1) {
                var whoami_3 = "".concat(target.constructor.name, ".").concat(property, " setter");
                descriptor.set = function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    var short_level = "[".concat(r.level[0].toUpperCase(), "]");
                    if (r.disabled)
                        return set_1.call(this, params[0]);
                    var uid = ++_uid;
                    show(r, whoami_3, uid, short_level, 'ENTER', params);
                    set_1.call(this, params[0]);
                    var print_leave_log = function (ret) { return show(r, whoami_3, uid, short_level, 'LEAVE', params, void 0); };
                    var print_reject_log = function (reason) { return show(r, whoami_3, uid, short_level, 'REJECT', params, reason); };
                    return handle_any_result(ret, print_leave_log, print_reject_log);
                };
            }
        }
        else if (arg2) {
            console.log(target, arg2);
        }
        else {
            var whoami_4 = "Class ".concat(target.name);
            // CLASS DECORATOR
            return /** @class */ (function (_super) {
                __extends(_logger_wrapped, _super);
                function _logger_wrapped() {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    var _this = this;
                    var short_level = "[".concat(r.level[0].toUpperCase(), "]");
                    var uid = ++_uid;
                    show(r, whoami_4, uid, short_level, 'NEW', params);
                    _this = _super.apply(this, params) || this;
                    show(r, whoami_4, uid, short_level, 'END', params, _this);
                    return _this;
                }
                return _logger_wrapped;
            }(target));
        }
    };
    var raw = {};
    ret.level = opts.level || 'log';
    ret.disabled = void 0;
    ret.showArgs = void 0;
    ret.currentTime = void 0;
    ret.console = void 0;
    ret.showRet = void 0;
    ret.print = void 0;
    ret.Clone = function (opts) { return Create(__assign(__assign({}, ret), opts)); };
    ret.Wrap = function (a, b) {
        var any_func = typeof a === 'function' ? a : b;
        var r = ret;
        var whoami = typeof a === 'string' ? a : "".concat(any_func.name || '<ANONYMOUS>');
        return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var short_level = "[".concat(r.level[0].toUpperCase(), "]");
            if (r.disabled)
                return any_func.apply(void 0, params);
            var uid = ++_uid;
            show(r, whoami, uid, short_level, 'ENTER', r.showArgs ? params : void 0);
            var ret = any_func.apply(void 0, params);
            var print_leave_log = function (ret) { return show(r, whoami, uid, short_level, 'LEAVE', params, ret); };
            var print_reject_log = function (reason) { return show(r, whoami, uid, short_level, 'REJECT', params, reason); };
            return handle_any_result(ret, print_leave_log, print_reject_log);
        };
    };
    var make_property = function (k) {
        Object.defineProperty(ret, k, {
            get: function () { return k in raw ? raw[k] : k in opts ? opts[k] : Config[k]; },
            set: function (v) { return raw[k] = v; }
        });
    };
    make_property('disabled');
    make_property('showArgs');
    make_property('currentTime');
    make_property('console');
    make_property('showRet');
    make_property('print');
    return ret;
};
exports.Warn = Create({ level: 'warn' });
exports.Log = Create({ level: 'log' });
exports.Debug = Create({ level: 'debug' });
exports.Info = Create({ level: 'info' });
exports.Err = Create({ level: 'error' });
var Logger = Object.assign(exports.Log, { Config: Config, Create: Create, Warn: exports.Warn, Log: exports.Log, Debug: exports.Debug, Info: exports.Info, Err: exports.Err });
exports.default = Logger;
