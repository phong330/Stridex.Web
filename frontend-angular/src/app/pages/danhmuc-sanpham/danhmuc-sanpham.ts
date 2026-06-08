import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { SanphamService } from '../../services/sanpham.service';
import { SanPham } from '../../models/sanpham';
import { TheSanPhamComponent } from '../../components/the-san-pham/the-san-pham.component';

import { DANH_MUC_SAN_PHAM } from '../../shared/danhmuc-sanpham';

@Component({
  selector: 'app-danhmuc-sanpham',
  standalone: true,
  imports: [CommonModule, TheSanPhamComponent],
  templateUrl: './danhmuc-sanpham.component.html',
  styleUrls: ['./danhmuc-sanpham.component.css']
})
export class DanhmucSanphamComponent {
  dsSanPham: SanPham[] = [];

  slug = '';
  tenDanhMuc = '';
  giaTriDanhMuc = '';

  mapDanhMuc: any = {
    'bong-ro': {
      ten: 'Bóng rổ',
      giaTri: DANH_MUC_SAN_PHAM.bongRo
    },
    'bong-chuyen': {
      ten: 'Bóng chuyền',
      giaTri: DANH_MUC_SAN_PHAM.bongChuyen
    },
    'bong-da-futsal': {
      ten: 'Bóng đá & Futsal',
      giaTri: DANH_MUC_SAN_PHAM.bongDaFutsal
    },
    'tap-gym-workout': {
      ten: 'Tập Gym & Workout',
      giaTri: DANH_MUC_SAN_PHAM.tapGymWorkout
    },
    'chay-bo-di-bo': {
      ten: 'Chạy bộ & Đi bộ',
      giaTri: DANH_MUC_SAN_PHAM.chayBoDiBo
    },
    'cau-long': {
      ten: 'Cầu lông',
      giaTri: DANH_MUC_SAN_PHAM.cauLong
    },
    'pickleball': {
      ten: 'Pickleball',
      giaTri: DANH_MUC_SAN_PHAM.pickleball
    }
  };

  constructor(
    private route: ActivatedRoute,
    private sanphamService: SanphamService
  ) {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';

      const dm = this.mapDanhMuc[this.slug];

      this.tenDanhMuc = dm?.ten || 'Danh mục sản phẩm';
      this.giaTriDanhMuc = dm?.giaTri || '';
    });

    this.sanphamService.layTatCa().subscribe(ds => {
      this.dsSanPham = ds;
    });
  }

  get danhSachLoc() {
    return this.dsSanPham.filter(sp =>
      sp.loai === this.giaTriDanhMuc
    );
  }
}