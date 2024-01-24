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
    constructor(what: string) {}

    @Info
    sayIt(what: string) { return what + ' world' }
  }

  new Hello('hi.').sayIt('hello')
  ```

  以上代码输出如下：

  ```text
  [I][2024-01-22T08:39:56.985Z][call_id:1][Class Hello][NEW] 
  params: hi.
  [I][2024-01-22T08:39:56.987Z][call_id:1][Class Hello][END]
  result: _logger_wrapped {}
  [I][2024-01-22T08:39:56.989Z][call_id:2][Hello.sayIt][ENTER]
  params: hello
  [I][2024-01-22T08:39:56.989Z][call_id:2][Hello.sayIt][LEAVE]
  result: hello world
  ```

## 更多说明

- TODO
