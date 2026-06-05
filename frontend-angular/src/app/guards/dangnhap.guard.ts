import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const dangNhapGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.daDangNhap()) {
    return true;
  }

  alert('Vui lòng đăng nhập để sử dụng chức năng này!');
  router.navigate(['/dang-nhap']);

  return false;
};