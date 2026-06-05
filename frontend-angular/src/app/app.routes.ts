import { Routes } from '@angular/router';

import { TrangchuComponent } from './pages/trangchu/trangchu.component';
import { SanphamComponent } from './pages/sanpham/sanpham.component';
import { ChitietSanphamComponent } from './pages/chitiet-sanpham/chitiet-sanpham.component';
import { GiohangComponent } from './pages/giohang/giohang.component';
import { DangnhapComponent } from './pages/dangnhap/dangnhap.component';

import { dangNhapGuard } from './guards/dangnhap.guard';

export const routes: Routes = [
  { path: '', component: TrangchuComponent },

  { path: 'san-pham', component: SanphamComponent },

  { path: 'san-pham/:id', component: ChitietSanphamComponent },

  {
    path: 'gio-hang',
    component: GiohangComponent,
    canActivate: [dangNhapGuard]
  },

  { path: 'dang-nhap', component: DangnhapComponent },
  
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin').then(m => m.AdminComponent)
  },

  { path: '**', redirectTo: '' }
];