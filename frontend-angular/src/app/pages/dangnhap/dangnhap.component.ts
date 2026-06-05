import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dangnhap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: ` 
  <section id="trang-auth-moi">

    <div class="auth-container" [class.active]="dangMoDangKy">

      <div class="curved-shape"></div>
      <div class="curved-shape2"></div>

      <!-- FORM ĐĂNG NHẬP -->
      <div class="form-box Login">
        <h2 class="animation" style="--D:0; --S:21">Đăng nhập</h2>

        <form [formGroup]="formDangNhap" (ngSubmit)="dangNhap()">

          <div class="input-box animation" style="--D:1; --S:22">
            <input type="email" formControlName="email" required>
            <label>Email</label>
            <span class="icon-auth">👤</span>
          </div>

          <div class="input-box animation" style="--D:2; --S:23">
            <input type="password" formControlName="matKhau" required>
            <label>Mật khẩu</label>
            <span class="icon-auth">🔒</span>
          </div>

          <p *ngIf="formDangNhap.invalid && daBamDangNhap" class="loi-auth animation" style="--D:3; --S:24">
            Vui lòng nhập đúng email và mật khẩu.
          </p>

          <div class="input-box animation" style="--D:4; --S:25">
            <button class="btn-auth" type="submit">Đăng nhập</button>
          </div>

          <div class="regi-link animation" style="--D:5; --S:26">
            <p>
              Chưa có tài khoản?
              <br>
              <a href="#" (click)="moDangKy($event)">Đăng ký</a>
            </p>
          </div>

        </form>
      </div>

      <!-- PHẦN CHỮ BÊN PHẢI KHI ĐĂNG NHẬP -->
      <div class="info-content Login">
        <h2 class="animation" style="--D:0; --S:20">WELCOME BACK!</h2>
        <p class="animation" style="--D:1; --S:21">
          Chào mừng tôi quay lại STRIDEX SPORT. Đăng nhập để mua hàng và quản lý giỏ hàng.
        </p>
      </div>

      <!-- FORM ĐĂNG KÝ -->
      <div class="form-box Register">
        <h2 class="animation" style="--li:17; --S:0">Đăng ký</h2>

        <form [formGroup]="formDangKy" (ngSubmit)="dangKy()">

          <div class="input-box animation" style="--li:18; --S:1">
            <input type="text" formControlName="hoTen" required>
            <label>Họ tên</label>
            <span class="icon-auth">👤</span>
          </div>

          <div class="input-box animation" style="--li:19; --S:2">
            <input type="email" formControlName="email" required>
            <label>Email</label>
            <span class="icon-auth">✉️</span>
          </div>

          <div class="input-box animation" style="--li:20; --S:3">
            <input type="password" formControlName="matKhau" required>
            <label>Mật khẩu</label>
            <span class="icon-auth">🔒</span>
          </div>

          <p *ngIf="formDangKy.invalid && daBamDangKy" class="loi-auth animation" style="--li:21; --S:4">
            Vui lòng nhập đầy đủ thông tin. Mật khẩu tối thiểu 6 ký tự.
          </p>

          <div class="input-box animation" style="--li:22; --S:5">
            <button class="btn-auth" type="submit">Đăng ký</button>
          </div>

          <div class="regi-link animation" style="--li:23; --S:6">
            <p>
              Đã có tài khoản?
              <br>
              <a href="#" (click)="moDangNhap($event)">Đăng nhập</a>
            </p>
          </div>

        </form>
      </div>

      <!-- PHẦN CHỮ BÊN TRÁI KHI ĐĂNG KÝ -->
      <div class="info-content Register">
        <h2 class="animation" style="--li:17; --S:0">WELCOME!</h2>
        <p class="animation" style="--li:18; --S:1">
          Tạo tài khoản STRIDEX để mua sắm đồ thể thao, thêm giỏ hàng và theo dõi đơn hàng.
        </p>
      </div>

    </div>

  </section>
  `
})
export class DangnhapComponent {
  dangMoDangKy = false;

  daBamDangNhap = false;
  daBamDangKy = false;

  formDangNhap = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    matKhau: ['', [Validators.required, Validators.minLength(6)]]
  });

  formDangKy = this.fb.group({
    hoTen: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    matKhau: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.router.url.includes('dang-ky')) {
      this.dangMoDangKy = true;
    }
  }

  moDangKy(event: Event) {
    event.preventDefault();
    this.dangMoDangKy = true;
  }

  moDangNhap(event: Event) {
    event.preventDefault();
    this.dangMoDangKy = false;
  }

  dangNhap() {
    this.daBamDangNhap = true;

    if (this.formDangNhap.invalid) {
      return;
    }

    const thongTin = {
      email: this.formDangNhap.value.email ?? '',
      matKhau: this.formDangNhap.value.matKhau ?? ''
    };

    this.auth.dangNhap(thongTin).subscribe({
      next: (nguoiDung) => {
        this.auth.luuDangNhap(nguoiDung);

        if (nguoiDung.vaiTro === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        alert('Sai email hoặc mật khẩu!');
      }
    });
  }

  dangKy() {
    this.daBamDangKy = true;

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
        this.formDangKy.reset();
        this.dangMoDangKy = false;
      },
      error: () => {
        alert('Email đã tồn tại!');
      }
    });
  }
}