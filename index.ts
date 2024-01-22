import { Annotation } from "@gim/annotation";
export type LogTiming = 'enter' | 'leave' | 'reject'
export interface IGlobalLoggerConfig {
  currentTime: () => string;
  console: Console;
  print?: (Logger: ILogger, func: string, uid: string, timing: LogTiming, args: any[], result?: any) => any;
  showArgs: boolean;
  showRet: boolean;
  disabled: boolean;
}
export interface ILoggerOpts extends Partial<IGlobalLoggerConfig> {
  level: 'warn' | 'log' | 'debug' | 'info' | 'error';
}
export interface ILogger extends Annotation.IFunc, ILoggerOpts {

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
  const ret: ILogger = function _RET(target: Annotation.Prototype, property: string, descriptor: any) {
    const show = (str: string, timing: LogTiming, params: any[] = [], result: any = void 0) => {
      const args = [str];
      (_RET.showArgs && timing === 'enter') && args.push('\nparams:', ...params);
      (_RET.showRet && timing === 'leave') && args.push('\nresult:', result);
      (timing === 'reject') && args.push('\nreason:', result);
      _RET.console![_RET.level](...args)
    }

    const func = `${target.constructor.name}.${property}`;
    const short_level = `[${_RET.level[0].toUpperCase()}]`
    const fixed = `[${func}]`
    const { value } = descriptor;
    descriptor.value = function (...params: any) {
      if (_RET.disabled) return value.call(this, ...params);
      const uid = `[call_id:${++_uid}]`

      _RET.print ?
        _RET.print(_RET, func, uid, 'enter', params) :
        show(`${short_level}[${_RET.currentTime!()}]${uid}${fixed}[ENTER]`, 'enter', _RET.showArgs ? params : void 0);

      const ret = value.call(this, ...params);

      const print_leave_log = (ret: any) => _RET.print ?
        _RET.print(_RET, func, uid, 'leave', params, ret) :
        show(`${short_level}[${_RET.currentTime!()}]${uid}${fixed}[LEAVE]`, 'leave', void 0, ret);

      const print_reject_log = (reason: any) => _RET.print ?
        _RET.print(_RET, func, uid, 'reject', params, reason) :
        show(`${short_level}[${_RET.currentTime!()}]${uid}${fixed}[REJECT]`, 'reject', void 0, reason);

      if (!(ret instanceof Promise)) {
        print_leave_log(ret)
        return ret;
      }
      return new Promise((r0, r1) => ret.then(value => {
        print_leave_log(value)
        return r0(value)
      }).catch(reason => {
        print_reject_log(reason)
        return r1(reason)
      }))
    };
  };
  const raw: Partial<ILogger> = {};
  ret.level = opts.level || 'log';
  ret.disabled = void 0 as unknown as any
  ret.showArgs = void 0 as unknown as any
  ret.currentTime = void 0 as unknown as any;
  ret.console = void 0 as unknown as any;
  ret.showRet = void 0 as unknown as any
  ret.print = void 0 as unknown as any

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

export const Warn: Annotation.IFunc = Create({ level: 'warn' })
export const Log: Annotation.IFunc = Create({ level: 'log' })
export const Debug: Annotation.IFunc = Create({ level: 'debug' })
export const Info: Annotation.IFunc = Create({ level: 'info' })
export const Err: Annotation.IFunc = Create({ level: 'error' })

const Logger: Annotation.IFunc & {
  Config: IGlobalLoggerConfig;
  Create: ILoggerCreator;
  Warn: Annotation.IFunc;
  Log: Annotation.IFunc;
  Debug: Annotation.IFunc;
  Info: Annotation.IFunc;
  Err: Annotation.IFunc;
} = Object.assign(Log, { Config, Create, Warn, Log, Debug, Info, Err })
export default Logger;