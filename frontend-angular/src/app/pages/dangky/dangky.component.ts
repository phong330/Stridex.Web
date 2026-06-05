import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dangky',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
  <section class="khung trang-dang-nhap">

    <form [formGroup]="formDangKy" (ngSubmit)="dangKy()" class="form-dang-nhap">

      <p class="chu-chao-mung">CREATE ACCOUNT</p>

      <h1 class="tieu-de-dang-nhap">Đăng ký</h1>

      <label class="nhom-o-nhap">
        <span>Họ tên</span>
        <input class="o-nhap" formControlName="hoTen">
      </label>

      <label class="nhom-o-nhap">
        <span>Email</span>
        <input class="o-nhap" formControlName="email">
      </label>

      <label class="nhom-o-nhap">
        <span>Mật khẩu</span>
        <input class="o-nhap" type="password" formControlName="matKhau">
      </label>

      <p *ngIf="formDangKy.invalid && daBam" class="thong-bao-loi">
        Vui lòng nhập đầy đủ thông tin. Mật khẩu tối thiểu 6 ký tự.
      </p>

      <button class="nut-do nut-dang-nhap-day-du" type="submit">
        Đăng ký
      </button>

      <p class="goi-y-chuyen-trang">
        Đã có tài khoản?
        <a routerLink="/dang-nhap">Đăng nhập</a>
      </p>

    </form>

  </section>
  `
})
export class DangkyComponent {
    daBam = false;

    formDangKy = this.fb.group({
        hoTen: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        matKhau: ['', [Validators.required, Validators.minLength(6)]]
    });

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router
    ) { }

    dangKy() {
        this.daBam = true;

        if (this.formDangKy.invalid) {
            return;
        }

        const nguoiDung = {
            hoTen: this.formDangKy.value.hoTen ?? '',
            email: this.formDangKy.value.email ?? '',
            matKhau: this.formDangKy.value.matKhau ?? ''
        };

        this.auth.dangKy(nguoiDung).subscribe({
            next: () => {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                this.router.navigate(['/dang-nhap']);
            },
            error: () => {
                alert('Email đã tồn tại!');
            }
        });
    }
}