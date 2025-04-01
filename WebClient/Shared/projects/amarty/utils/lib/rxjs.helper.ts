export function getErrorMessage(error: any, message: string = 'ERROR.COMMON_ERROR') {
  let errorMessage = message;

  if (error.error) {
    errorMessage = error.error.message;
  } else if (error.message) {
    errorMessage = error.message;
  } else if (error.statusText) {
    errorMessage = error.statusText;
  }

  return errorMessage;
}
