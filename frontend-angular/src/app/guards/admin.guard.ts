import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.daDangNhap()) {
    alert('Vui lòng đăng nhập để vào trang quản trị!');
    router.navigate(['/dang-nhap']);
    return false;
  }

  if (!auth.laAdmin()) {
    alert('Tài khoản của tôi không có quyền Admin!');
    router.navigate(['/']);
    return false;
  }

  return true;
};