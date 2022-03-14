import { Component } from '@angular/core';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styles: [
    `
      .main-layout {
        min-height: calc(100vh - 164px) !important;
      }
    `,
  ],
})
export class MainComponent {}
