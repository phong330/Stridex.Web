import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GiohangService } from '../../services/giohang.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-thanh-dieu-huong',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './thanh-dieu-huong.component.html',
  styleUrls: ['./thanh-dieu-huong.component.css']
})
export class ThanhDieuHuongComponent {
  tuKhoaTimKiem = '';
  soLuong = 0;
  hienDanhMuc = false;
  hienMenuTaiKhoan = false;
  tuKhoa = '';

  constructor(
    private giohang: GiohangService,
    public auth: AuthService,
    private router: Router
  ) {
    this.giohang.danhSach$.subscribe(() => {
      this.soLuong = this.giohang.soLuong();
    });
  }

  get nguoiDungDangNhap() {
    return this.auth.layNguoiDungDangNhap();
  }

  batTatDanhMuc() {
    this.hienDanhMuc = !this.hienDanhMuc;
    this.hienMenuTaiKhoan = false;
  }

  dongDanhMuc() {
    this.hienDanhMuc = false;
  }

  batTatMenuTaiKhoan() {
    this.hienMenuTaiKhoan = !this.hienMenuTaiKhoan;
    this.hienDanhMuc = false;
  }

  dongMenuTaiKhoan() {
    this.hienMenuTaiKhoan = false;
  }

  dangXuat() {
    this.auth.dangXuat();
    this.hienMenuTaiKhoan = false;
    this.router.navigate(['/dang-nhap']);
  }

  timKiem() {
    if (this.tuKhoa.trim() !== '') {
      this.router.navigate(['/san-pham'], {
        queryParams: {
          q: this.tuKhoa
        }
      });

      this.tuKhoa = '';
      this.dongDanhMuc();
      this.dongMenuTaiKhoan();
    }
  }
  timKiemSanPham() {
    const tuKhoa = this.tuKhoaTimKiem.trim();

    if (tuKhoa === '') {
      return;
    }

    this.router.navigate(['/san-pham'], {
      queryParams: { q: tuKhoa }
    });
  }
}