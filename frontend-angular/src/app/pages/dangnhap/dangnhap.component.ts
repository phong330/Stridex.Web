import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-dangnhap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dangnhap.component.html',
  styleUrls: ['./dangnhap.component.css']
})
export class DangnhapComponent implements AfterViewInit {
  dangMoDangKy = false;

  daBamDangNhap = false;
  daBamDangKy = false;

  formDangNhap: FormGroup;
  formDangKy: FormGroup;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formDangNhap = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      matKhau: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.formDangKy = this.fb.group({
      hoTen: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      matKhau: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.router.url.includes('dang-ky')) {
      this.dangMoDangKy = true;
    }
  }

  ngAfterViewInit() {
    this.khoiTaoGoogleLogin();
  }

  khoiTaoGoogleLogin() {
    setTimeout(() => {
      if (typeof google === 'undefined') {
        console.error('Google Identity Services chưa được tải. Kiểm tra script trong index.html.');
        return;
      }

      const nutGoogle = document.getElementById('google-login-button');

      if (!nutGoogle) {
        console.error('Không tìm thấy thẻ có id="google-login-button" trong dangnhap.component.html');
        return;
      }

      google.accounts.id.initialize({
        client_id: '274546988937-svmbcusn3179tsgp854nfc2dismq0sbu.apps.googleusercontent.com',
        callback: (response: any) => {
          console.log('Google credential:', response.credential);

          if (!response.credential) {
            alert('Không nhận được Google Token!');
            return;
          }

          this.auth.dangNhapGoogle(response.credential).subscribe({
            next: (res: any) => {
              console.log('Kết quả Google login:', res);

              const nguoiDung = res.user;

              if (!nguoiDung) {
                alert('API không trả về thông tin người dùng!');
                return;
              }

              this.xuLyDangNhapThanhCong(nguoiDung);
            },
            error: (err: any) => {
              console.error('Lỗi Google login:', err);

              if (err.error && err.error.error) {
                alert(err.error.message + '\n\nChi tiết: ' + err.error.error);
              } else if (err.error && err.error.message) {
                alert(err.error.message);
              } else {
                alert('Đăng nhập Google thất bại!');
              }
            }
          });
        }
      });

      google.accounts.id.renderButton(
        nutGoogle,
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill'
        }
      );
    }, 300);
  }

  xuLyDangNhapThanhCong(nguoiDung: any) {
    this.auth.luuDangNhap(nguoiDung);

    const vaiTro = String(nguoiDung.vaiTro).toLowerCase();

    if (vaiTro === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
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
      next: (res: any) => {
        console.log('Kết quả đăng nhập thường:', res);

        const nguoiDung = res.user;

        if (!nguoiDung) {
          alert('API không trả về thông tin người dùng!');
          return;
        }

        this.xuLyDangNhapThanhCong(nguoiDung);
      },
      error: (err: any) => {
        console.error('Lỗi đăng nhập thường:', err);
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
      error: (err: any) => {
        console.error('Lỗi đăng ký:', err);
        alert('Email đã tồn tại!');
      }
    });
  }
}