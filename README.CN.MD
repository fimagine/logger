# @fimagine/logger

[English README](./README.MD)

如果你的代码用的是typescript且用class方式写的，还需要在函数调用时产生一些输出。那你可以试试这玩意。

## 注意事项

- 基于Typescript的装饰器(stage 2)实现，但目前还不支持装饰器(stage 3)。
- 性能消耗是铁定有的，这方面还请您自行把握。

## Quick Start

- 步骤1: 开启experimentalDecorators

  - 可以在 "tsconfig.json"进行如下配置。

    ```json
    {
      "compilerOptions": {
        "experimentalDecorators": true, // this line
      }
    }
    ```
  - 或者在"tsc"后追加参数。
    ``tsc --target ES5 --experimentalDecorators``
- 步骤2: 在你的代码中引入

  ```typescript
  import { Info } from "@fimagine/logger"

  Info.showArgs = true; // show function params;
  Info.showRet = true; // show function return;

  // set current time string, or it will be unix timestamp in milliseconds.
  Info.currentTime = () => new Date().toISOString() 

  @Info
  class Hello {
    constructor(what: string) { }

    @Info
    sayIt(what: string) { return what + ' world' }

    @Info
    async resolved(what: string) { return what + ' resolved' }

    @Info
    async rejected(what: string) { throw what + ' rejected' }
  }
  const hello = new Hello('hi.')
  hello.sayIt('hello')
  hello.resolved('hello')
  hello.rejected('hello').catch(() => {})
  ```

  以上代码输出如下：

  ```text
  [I][2024-01-29T04:13:19.288Z][call_id:23][Class Hello][NEW]
  params: hi.
  [I][2024-01-29T04:13:19.288Z][call_id:23][Class Hello][END]
  result: _logger_wrapped {}
  [I][2024-01-29T04:13:19.288Z][call_id:24][Hello.sayIt][ENTER]
  params: hello
  [I][2024-01-29T04:13:19.289Z][call_id:24][Hello.sayIt][LEAVE]
  result: hello world
  [I][2024-01-29T04:13:19.289Z][call_id:25][Hello.resolved][ENTER]
  params: hello
  [I][2024-01-29T04:13:19.289Z][call_id:26][Hello.rejected][ENTER]
  params: hello
  [I][2024-01-29T04:13:19.290Z][call_id:25][Hello.resolved][LEAVE]
  result: hello resolved
  [I][2024-01-29T04:13:19.290Z][call_id:26][Hello.rejected][REJECT]
  reason: hello rejected
  ```

## 更多说明

- TODO
