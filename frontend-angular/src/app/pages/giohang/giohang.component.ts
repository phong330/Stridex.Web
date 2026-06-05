import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GiohangService } from '../../services/giohang.service';
import { AuthService } from '../../services/auth.service';
import { DonhangService } from '../../services/donhang.service';
import { SanPham } from '../../models/sanpham';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './giohang.component.html',
  styleUrls: ['./giohang.component.css']
})


export class GiohangComponent {
  dsGioHang: SanPham[] = [];
  tongTien = 0;

  constructor(
    private giohang: GiohangService,
    private auth: AuthService,
    private donhangService: DonhangService
  ) {
    this.giohang.danhSach$.subscribe(ds => {
      this.dsGioHang = ds;
      this.tongTien = this.giohang.tongTien();
    });
  }

  xoa(id: number) {
    this.giohang.xoa(id);
  }

  thanhToan() {
    const nguoiDung = this.auth.layNguoiDungDangNhap();

    if (!nguoiDung) {
      alert('Vui lòng đăng nhập để thanh toán!');
      return;
    }

    if (this.dsGioHang.length === 0) {
      alert('Giỏ hàng đang trống!');
      return;
    }

    const chiTiet = this.dsGioHang.map(sp => ({
      sanPhamId: sp.id,
      soLuong: 1,
      donGia: sp.gia
    }));

    const donHang = {
      nguoiDungId: nguoiDung.id,
      chiTiet: chiTiet
    };

    this.donhangService.taoDonHang(donHang).subscribe({
      next: (res) => {
        alert('Đặt hàng thành công! Mã đơn hàng: ' + res.maDonHang);
        this.giohang.xoaTatCa();
      },
      error: () => {
        alert('Đặt hàng thất bại!');
      }
    });
  }
}