import Log from "../dist";

const LogWithArg = Log.Create({ level: 'info', showArgs: true, showRet: true })

const LogWithCustomTime = Log.Create({
  level: 'info', currentTime: () => {
    const now = new Date(0)
    return (
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ` +
      `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    )
  }
})

const LogWithCustomPrint = Log.Create({
  print: (logger, func_name, uid, timing, args, result) => {
    const time = logger.currentTime?.()
    console.log(time, func_name, uid, timing, args, result)
  }
})

const LogWithCustomConsole = Log.Create({
  level: 'info',
  console: {
    ...console,
    info: (...args: any[]) => console.log('im custom console,', ...args)
  }
})

@Log.Warn
@Log.Info
class Foo {
  @Log.Warn
  simple_warn() { return "i'm return value" }

  @Log.Debug
  simple_debug() { return "i'm return value" }

  @Log.Log
  simple_log() { return "i'm return value" }

  @Log.Info
  simple_info() { return "i'm return value" }

  @Log.Err
  simple_err() { return "i'm return value" }

  @LogWithArg
  log_with_params_and_return(...args: any[]) { return "i'm return value" }

  @LogWithArg
  async log_with_params_and_async_resolve(...args: any[]) { return "i'm return value" }

  @LogWithArg
  async log_with_params_and_async_throw(...args: any[]) { throw "i'm reject reason" }

  @LogWithArg
  log_with_params_and_promise_resolve(...args: any[]) { return Promise.resolve("i'm return value") }

  @LogWithArg
  log_with_params_and_promise_reject(...args: any[]) { return Promise.reject("i'm reject reason") }

  @LogWithCustomTime
  custom_time_string() { return "i'm return value" }

  @LogWithCustomPrint
  custom_print() { return "i'm return value" }

  @LogWithCustomConsole
  custom_console() { return "i'm return value" }
}

function get_base_prototype(p: any): any {
  if (p.constructor.name !== '_logger_wrapped') return p;
  return get_base_prototype(Object.getPrototypeOf(p))

}
function get_base_prototype_by_inst(inst: any): any {
  return get_base_prototype(Object.getPrototypeOf(inst))
}

async function run() {
  const bar = new Foo()
  const real_prototype = get_base_prototype_by_inst(bar)
  const func_names = Object.getOwnPropertyNames(real_prototype).filter(v => v !== 'constructor' && typeof (real_prototype as any)[v] === 'function')

  for (const func_name of func_names) {
    console.log('\n')
    try { await (bar as any)[func_name]("i'm params 1", "i'm params 2") } catch (e) { }
  }

  console.log('\n')
  console.log('Log.Config.disabled = true');
  Log.Config.disabled = true;
  console.log('"log_with_params_and_return" called, result:', bar.log_with_params_and_return("i'm params 1", "i'm params 2"));
  console.log('Log.Config.disabled = false');
  Log.Config.disabled = false;
  console.log('"log_with_params_and_return" called, result:', bar.log_with_params_and_return("i'm params 1", "i'm params 2"));


  console.log('\n')
  console.log('LogWithCustomTime.disabled = true');
  LogWithCustomTime.disabled = true
  console.log('"custom_time_string" called, result:', bar.custom_time_string());
  console.log('LogWithCustomTime.disabled = false');
  LogWithCustomTime.disabled = false
  console.log('"custom_time_string" called, result:', bar.custom_time_string());
}
run()