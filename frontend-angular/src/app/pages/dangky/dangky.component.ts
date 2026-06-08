import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dangky',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dangky.component.html',
  styleUrls: ['./dangky.component.css']
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