import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-geolocation-dialog',
  templateUrl: './geolocation-dialog.component.html',
  styleUrls: ['./geolocation-dialog.component.scss']
})
export class GeolocationDialogComponent {

  constructor(public dialogRef: MatDialogRef<GeolocationDialogComponent>) {}

  onAccept(): void {
    this.dialogRef.close(true);
  }

  onDecline(): void {
    this.dialogRef.close(false);
  }
}
