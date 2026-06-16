import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThanhToanService } from '../../services/thanhtoan.service';
import { GiohangService } from '../../services/giohang.service';
import { AuthService } from '../../services/auth.service';
import { DonhangService } from '../../services/donhang.service';

@Component({
  selector: 'app-giohang',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './giohang.component.html',
  styleUrls: ['./giohang.component.css']
})
export class GiohangComponent {

  dsGioHang: any[] = [];
  tongTien = 0;

  constructor(
    public giohang: GiohangService,
    private auth: AuthService,
    private donhangService: DonhangService,
    private thanhToanService: ThanhToanService
  ) {
    this.giohang.danhSach$.subscribe(ds => {
      this.dsGioHang = ds;
      this.tongTien = this.giohang.tongTien();
    });
  }

  tang(sp: any) {
    this.giohang.tang(sp);
  }

  giam(sp: any) {
    this.giohang.giam(sp);
  }

  xoa(id: number) {
    this.giohang.xoa(id);
  }

  thanhToan() {

    const nguoiDung = this.auth.layNguoiDungDangNhap();

    if (!nguoiDung) {
      alert('Vui lòng đăng nhập!');
      return;
    }

    const chiTiet = this.dsGioHang.map(sp => ({
      sanPhamId: sp.id,
      soLuong: sp.soLuong,
      donGia: sp.gia
    }));

    this.donhangService.taoDonHang({
      nguoiDungId: nguoiDung.id,
      chiTiet
    }).subscribe({
      next: r => {
        alert('Đặt hàng thành công! Mã đơn: ' + r.maDonHang);
        this.giohang.xoaTatCa();
      },
      error: () => alert('Đặt hàng thất bại!')
    });

  }

  thanhToanVnPay() {
    const nguoiDung = this.auth.layNguoiDungDangNhap();

    if (!nguoiDung) {
      alert('Vui lòng đăng nhập!');
      return;
    }

    const chiTiet = this.dsGioHang.map(sp => ({
      sanPhamId: sp.id,
      soLuong: sp.soLuong,
      donGia: sp.gia
    }));

    this.donhangService.taoDonHang({
      nguoiDungId: nguoiDung.id,
      chiTiet
    }).subscribe({

      next: (donHang: any) => {

        const maDonHang = donHang.maDonHang;
        const soTien = this.tongTien;

        // Xóa giỏ hàng ngay sau khi tạo đơn
        this.giohang.xoaTatCa();

        this.thanhToanService
          .taoThanhToanVnPay(maDonHang, soTien)
          .subscribe({

            next: (res: any) => {
              window.location.href = res.paymentUrl;
            },

            error: (err) => {
              console.error(err);
              alert('Không tạo được thanh toán VNPay');
            }

          });

      },

      error: () => {
        alert('Không tạo được đơn hàng');
      }

    });

  }
}
