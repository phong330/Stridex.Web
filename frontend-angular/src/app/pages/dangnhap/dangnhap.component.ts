import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dangnhap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dangnhap.component.html',
  styleUrls: ['./dangnhap.component.css']
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