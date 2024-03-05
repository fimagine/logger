import Logger, {
  Debug as _Debug,
  Err as _Err,
  Info as _Info,
  Warn as _Warn,
  Log as _Log,
  Log
} from "../dist";

Logger.Config.currentTime = () => new Date().toISOString()

const test_functions = new Map<string, () => void>()

function test_simple() {
  class Foo {
    @_Warn
    by_warn() { return "i'm return value" }

    @_Debug
    by_debug() { return "i'm return value" }

    @_Log
    by_log() { return "i'm return value" }

    @_Info
    by_info() { return "i'm return value" }

    @_Err
    by_err() { return "i'm return value" }
  }
  const bar = new Foo()
}
test_functions.set("simple", test_simple)

function test_promise() {
  const Log = _Log.Clone({ showArgs: true, showRet: true })

  class Hello {
    constructor(what: string) { }

    @Log
    async resolved(what: string) { return what + ' resolved' }

    @Log
    async rejected(what: string) { throw what + ' rejected' }
  }
  const hello = new Hello('hi.')
  hello.resolved('hello')
  hello.rejected('hello').catch(() => { })
}
test_functions.set("promise", test_promise)

function test_getter_setter() {
  class Cls {
    _str: string = ''

    @Log
    set str(v: string) { this._str = v }

    get str() { return this._str }
  }
  const c = new Cls();
  c.str = "hello";
  return c.str
}
test_functions.set("getter_setter", test_getter_setter)

function test_class_member() {
  class Cls {
    @((a: any, b: any) => {
      console.log("a:", a)
      console.log("b:", b)
    })
    str: string = ''
  }
}
test_functions.set("class_member", test_class_member)

function test_direct_print() {
  Log.print('Hello', 'a', 'b', 'c')
}
test_functions.set("test_direct_print", test_direct_print)

const test_name = process.argv[2]
if (test_name)
  test_functions.get(test_name)?.();
else
  test_functions.forEach(v => v());
