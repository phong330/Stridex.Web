import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SanphamService } from '../../services/sanpham.service';
import { SanPham } from '../../models/sanpham';
import { TheSanPhamComponent } from '../../components/the-san-pham/the-san-pham.component';

@Component({
  selector: 'app-sanpham',
  standalone: true,
  imports: [CommonModule, FormsModule, TheSanPhamComponent],
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent {
  dsSanPham: SanPham[] = [];

  tuKhoa = '';
  loaiDangChon = 'Tat ca';

  constructor(
    private sanphamService: SanphamService,
    private route: ActivatedRoute
  ) {
    this.sanphamService.layTatCa().subscribe(
      ds => this.dsSanPham = ds
    );

    this.route.queryParams.subscribe(p => {
      this.tuKhoa = p['q'] || '';
    });
  }

  get danhSachLoc() {
    const tim = this.tuKhoa.toLowerCase();

    return this.dsSanPham.filter(sp =>
      (this.loaiDangChon === 'Tat ca' || sp.loai === this.loaiDangChon)
      &&
      (
        sp.ten.toLowerCase().includes(tim)
        ||
        sp.loai.toLowerCase().includes(tim)
        ||
        sp.mota.toLowerCase().includes(tim)
      )
    );
  }
}