import { Annotation } from "@fimagine/annotation";
export type LogTiming = 'ENTER' | 'LEAVE' | 'REJECT' | 'NEW' | 'END'
export interface IGlobalLoggerConfig {
  currentTime: () => string;
  console: Console;
  print?: (Logger: ILogger, whoami: string, uid: number, timing: LogTiming, args: any[], result?: any) => any;
  showArgs: boolean;
  showRet: boolean;
  disabled: boolean;
}
export interface ILoggerOpts extends Partial<IGlobalLoggerConfig> {
  level: 'warn' | 'log' | 'debug' | 'info' | 'error';
}
export interface IWrappedFunc<F extends (...args: any[]) => any> {
  (...args: Parameters<F>): ReturnType<F>
}
export interface ILogger extends Annotation.IFunc, Annotation.IProp, Annotation.ICls, ILoggerOpts {
  Wrap<F extends (...args: any[]) => any>(whoami: string, func: F): IWrappedFunc<F>;
  Wrap<F extends (...args: any[]) => any>(func: F): (...args: Parameters<F>) => ReturnType<F>;
  Clone(opts?: Partial<ILoggerOpts>): ILogger;
}
export interface ILoggerCreator {
  (opts?: Partial<ILoggerOpts>): ILogger;
}
let _uid = 0;

const Config: IGlobalLoggerConfig = {
  currentTime: () => '' + new Date().getTime(),
  console: console,
  showArgs: false,
  showRet: false,
  disabled: false,
};
const Create: ILoggerCreator = function (opts: Partial<ILoggerOpts> = {}): ILogger {
  const show = (r: ILogger, whoami: string, uid: number, short_level: string, timing: LogTiming, params: any[] = [], result: any = void 0) => {
    if (r.print) r.print(r, whoami, uid, timing, params, result)
    const args = [`${short_level}[${r.currentTime!()}][call_id:${uid}][${whoami}][${timing}]`];
    (r.showArgs && (timing === 'ENTER' || timing === 'NEW')) && args.push('\nparams:', ...params);
    (r.showRet && (timing === 'LEAVE' || timing === 'END')) && args.push('\nresult:', result);
    (timing === 'REJECT') && args.push('\nreason:', result);
    r.console![r.level](...args)
  }
  const handle_any_result = <T>(result: T, print_leave_log: (r: any) => void, print_reject_log: (r: any) => void) => {
    if (!(result instanceof Promise)) {
      print_leave_log(result)
      return result;
    }
    return new Promise((r0, r1) => result.then(value => {
      print_leave_log(value)
      return r0(value)
    }).catch(reason => {
      print_reject_log(reason)
      return r1(reason)
    }))
  }
  const ret: ILogger = function r(target: any, arg2?: any, arg3?: any): any {
    if (arg3) {
      const property = arg2 as string
      const descriptor = arg3 as TypedPropertyDescriptor<any>;
      const { value, get, set } = descriptor;

      // CLASS FUNCTION DECORATOR
      if (value) {
        const whoami = `${target.constructor.name}.${property}`;
        descriptor.value = function (...params: any) {
          const short_level = `[${r.level[0].toUpperCase()}]`
          if (r.disabled) return value.call(this, ...params);
          const uid = ++_uid
          show(r, whoami, uid, short_level, 'ENTER', params);
          const ret = value.call(this, ...params);
          const print_leave_log = (ret: any) => show(r, whoami, uid, short_level, 'LEAVE', params, ret);
          const print_reject_log = (reason: any) => show(r, whoami, uid, short_level, 'REJECT', params, reason);
          return handle_any_result(ret, print_leave_log, print_reject_log)
        };
      }
      // CLASS GETTER DECORATOR
      if (get) {
        const whoami = `${target.constructor.name}.${property} getter`;
        descriptor.get = function () {
          const short_level = `[${r.level[0].toUpperCase()}]`
          if (r.disabled) return get.call(this);
          const uid = ++_uid
          show(r, whoami, uid, short_level, 'ENTER', void 0);
          const ret = get.call(this);
          const print_leave_log = (ret: any) => show(r, whoami, uid, short_level, 'LEAVE', void 0, ret);
          const print_reject_log = (reason: any) => show(r, whoami, uid, short_level, 'REJECT', void 0, reason);
          return handle_any_result(ret, print_leave_log, print_reject_log)
        };
      }
      // CLASS FUNCTION DECORATOR
      if (set) {
        const whoami = `${target.constructor.name}.${property} setter`;
        descriptor.set = function (...params: any[]) {
          const short_level = `[${r.level[0].toUpperCase()}]`
          if (r.disabled) return set.call(this, params[0]);
          const uid = ++_uid
          show(r, whoami, uid, short_level, 'ENTER', params);
          set.call(this, params[0]);
          const print_leave_log = (ret: any) => show(r, whoami, uid, short_level, 'LEAVE', params, void 0);
          const print_reject_log = (reason: any) => show(r, whoami, uid, short_level, 'REJECT', params, reason);
          return handle_any_result(ret, print_leave_log, print_reject_log)
        };
      }
    } else if (arg2) {
      console.log(target, arg2);
    } else {
      const whoami = `Class ${target.name}`
      // CLASS DECORATOR
      return class _logger_wrapped extends target {
        constructor(...params: any[]) {
          const short_level = `[${r.level[0].toUpperCase()}]`
          const uid = ++_uid
          show(r, whoami, uid, short_level, 'NEW', params);
          super(...params);
          show(r, whoami, uid, short_level, 'END', params, this);
        }
      }
    }
  };
  const raw: Partial<ILogger> = {};
  ret.level = opts.level || 'log';
  ret.disabled = void 0 as unknown as any
  ret.showArgs = void 0 as unknown as any
  ret.currentTime = void 0 as unknown as any;
  ret.console = void 0 as unknown as any;
  ret.showRet = void 0 as unknown as any
  ret.print = void 0 as unknown as any
  ret.Clone = (opts) => Create({ ...ret, ...opts })
  ret.Wrap = <F extends (...args: any[]) => any>(a: string | F, b?: F): IWrappedFunc<F> => {
    const any_func: F = typeof a === 'function' ? a : b!;
    const r = ret;
    const whoami = typeof a === 'string' ? a : `${any_func.name || '<ANONYMOUS>'}`;
    return (...params: Parameters<F>): ReturnType<F> => {
      const short_level = `[${r.level[0].toUpperCase()}]`
      if (r.disabled) return any_func(...params);
      const uid = ++_uid
      show(r, whoami, uid, short_level, 'ENTER', r.showArgs ? params : void 0);
      const ret = any_func(...params);
      const print_leave_log = (ret: any) => show(r, whoami, uid, short_level, 'LEAVE', params, ret);
      const print_reject_log = (reason: any) => show(r, whoami, uid, short_level, 'REJECT', params, reason);
      return handle_any_result(ret, print_leave_log, print_reject_log)
    }
  };
  const make_property = <K extends keyof IGlobalLoggerConfig = keyof IGlobalLoggerConfig>(k: K) => {
    Object.defineProperty(ret, k, {
      get: () => k in raw ? raw[k] : k in opts ? opts[k] : Config[k],
      set: (v: ILogger[K]) => raw[k] = v
    })
  }
  make_property('disabled');
  make_property('showArgs');
  make_property('currentTime');
  make_property('console');
  make_property('showRet');
  make_property('print');
  return ret
}

export const Warn: ILogger = Create({ level: 'warn' })
export const Log: ILogger = Create({ level: 'log' })
export const Debug: ILogger = Create({ level: 'debug' })
export const Info: ILogger = Create({ level: 'info' })
export const Err: ILogger = Create({ level: 'error' })

const Logger: ILogger & {
  Config: IGlobalLoggerConfig;
  Create: ILoggerCreator;
  Warn: ILogger;
  Log: ILogger;
  Debug: ILogger;
  Info: ILogger;
  Err: ILogger;
} = Object.assign(Log, { Config, Create, Warn, Log, Debug, Info, Err })
export default Logger;