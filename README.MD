# @fimagine/logger

[中文README](./README.CN.MD)

You can try this module, if your code is written in typescript with class-style, and you need make some log output when a function is called.

## Notices

- Base on experimental stage 2 decorators implementation, currently not available with stage 3 decorator (since Typescript 5.0)
- Will bring performance loss, please decide for yourself how to handle this.

## Quick Start

- step 1: enable experimentalDecorators in your project

  choose one of the ways;

  - in "tsconfig.json"

    ```json
    {
      "compilerOptions": {
        "experimentalDecorators": true, // this line
      }
    }
    ```
  - or "tsc"
    ``tsc --target ES5 --experimentalDecorators``
- step 2: use this module in your code

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

  you would see this in your console:

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

## For More

- TODO
