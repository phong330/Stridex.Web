import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { filter } from 'rxjs';
import { routes } from './app/app.routes';
import { ThanhDieuHuongComponent } from './app/components/thanh-dieu-huong/thanh-dieu-huong.component';
import { ChanTrangComponent } from './app/components/chan-trang/chan-trang.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ThanhDieuHuongComponent, ChanTrangComponent],
  template: `
    <app-thanh-dieu-huong *ngIf="!laTrangAdmin"></app-thanh-dieu-huong>

    <main [class.min-h-screen]="true" [class.pt-20]="!laTrangAdmin">
      <router-outlet></router-outlet>
    </main>

    <app-chan-trang *ngIf="!laTrangAdmin"></app-chan-trang>
  `
})
export class AppComponent {
  laTrangAdmin = false;

  constructor(private router: Router) {
    this.laTrangAdmin = this.router.url.startsWith('/admin');

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.laTrangAdmin = this.router.url.startsWith('/admin');
      });
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimations()]
});

