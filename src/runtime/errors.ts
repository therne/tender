class BaseError extends Error {
  constructor(message: string, public originalOutput: string) {
    super(`${message} (original output: ${originalOutput})`);
  }

}

export class ScriptSyntaxError extends BaseError {
  constructor(originalOutput: string) {
    super('invalid syntax', originalOutput);
  }
}

export class PermissionError extends BaseError {
  constructor(originalOutput: string) {
    super('permission error', originalOutput);
  }
}

export class NoOutputError extends Error {}
