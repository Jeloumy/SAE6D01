import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-geolocation-dialog',
  templateUrl: './geolocation-dialog.component.html',
})
export class GeolocationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GeolocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onAccept(): void {
    this.dialogRef.close(true);
  }

  onDecline(): void {
    this.dialogRef.close(false);
  }
}
