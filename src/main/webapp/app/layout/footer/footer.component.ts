import { Component } from '@angular/core';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  styles: [
    `
      .footer {
        padding: 10px 0;
        background-color: #ffffff;
        position: relative;
        bottom: 0;
        left: 0;
        z-index: 1000;
      }
    `,
  ],
})
export class FooterComponent {}
