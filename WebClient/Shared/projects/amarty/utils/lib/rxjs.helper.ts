import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export function handleApiError(
    snackBar: MatSnackBar,
    message: string = 'Unexpected error occurred.',) {
    return catchError((error: any) => {
        let errorMessage = message;

      if (error.error) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.statusText) {
        errorMessage = error.statusText;
      }

        snackBar.open(errorMessage, 'Close', {duration: 3000});
        return throwError(() => error);
    });
}
