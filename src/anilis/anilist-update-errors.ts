type CustomErrorObject = {
  message: string,
  data: any
}

export class CustomError extends Error {

  message: string
  data: any

  constructor(customErrorObject: CustomErrorObject, ...params: any[]) {
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.name = 'CustomError'
    this.message = customErrorObject.message
    this.data = customErrorObject.data
  }

  is404() {
    return Array.isArray(this.data) && this.data[0].message === "Not Found."
  }
}
