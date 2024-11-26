import { Annotation } from "@fimagine/annotation";
export type LogTiming = 'ENTER' | 'LEAVE' | 'REJECT' | 'NEW' | 'END' | 'DIRECT';
export interface IGlobalLoggerConfig {
    currentTime: () => string;
    console: Console;
    onPrint?: (Logger: ILogger, whoami: string, uid: number, timing: LogTiming, args: any[], result?: any) => any;
    showArgs: boolean;
    showRet: boolean;
    disabled: boolean;
}
export interface ILoggerOpts extends Partial<IGlobalLoggerConfig> {
    level: 'warn' | 'log' | 'debug' | 'info' | 'error';
}
export interface IWrappedFunc<F extends (...args: any[]) => any> {
    (...args: Parameters<F>): ReturnType<F>;
}
export interface ILogger extends Annotation.IFunc, Annotation.IProp, Annotation.ICls, ILoggerOpts {
    Wrap<F extends (...args: any[]) => any>(whoami: string, func: F): IWrappedFunc<F>;
    Wrap<F extends (...args: any[]) => any>(func: F): (...args: Parameters<F>) => ReturnType<F>;
    Clone(opts?: Partial<ILoggerOpts>): ILogger;
    print(whoami: string, ...args: any[]): void;
}
export interface ILoggerCreator {
    (opts?: Partial<ILoggerOpts>): ILogger;
}
export declare const Warn: ILogger;
export declare const Log: ILogger;
export declare const Debug: ILogger;
export declare const Info: ILogger;
export declare const Err: ILogger;
declare const Logger: ILogger & {
    Config: IGlobalLoggerConfig;
    Create: ILoggerCreator;
    Warn: ILogger;
    Log: ILogger;
    Debug: ILogger;
    Info: ILogger;
    Err: ILogger;
};
export default Logger;
