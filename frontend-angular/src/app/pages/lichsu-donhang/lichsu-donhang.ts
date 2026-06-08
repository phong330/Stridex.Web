import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DonhangService, DonHangAdmin } from '../../services/donhang.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lichsu-donhang',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lichsu-donhang.html',
  styleUrls: ['./lichsu-donhang.css']
})
export class LichsuDonhangComponent {
  dsDonHang: DonHangAdmin[] = [];
  dangTai = true;

  constructor(
    private donhangService: DonhangService,
    private auth: AuthService
  ) {
    this.taiLichSuDonHang();
  }

  taiLichSuDonHang() {
    const nguoiDung = this.auth.layNguoiDungDangNhap();

    if (!nguoiDung) {
      this.dsDonHang = [];
      this.dangTai = false;
      return;
    }

    this.donhangService.layDonHangTheoNguoiDung(nguoiDung.id).subscribe({
      next: (ds) => {
        this.dsDonHang = ds;
        this.dangTai = false;
      },
      error: () => {
        this.dsDonHang = [];
        this.dangTai = false;
        alert('Không tải được lịch sử đơn hàng!');
      }
    });
  }
}