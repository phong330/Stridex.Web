import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { SanphamService } from '../../services/sanpham.service';
import { SanPham } from '../../models/sanpham';
import { TheSanPhamComponent } from '../../components/the-san-pham/the-san-pham.component';

@Component({
  selector: 'app-trangchu',
  standalone: true,
  imports: [RouterLink, CommonModule, TheSanPhamComponent],
  animations: [
    trigger('hienRa', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(25px)' }),
        animate('700ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
  <section id="banner-lon">
    <div class="anh-nen-banner">
      <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop">
    </div>

    <div class="khung khung-banner">
      <div @hienRa>
        <p class="chu-nho-banner">Premium Sport Store</p>

        <h1 class="tieu-de-banner">
          VƯỢT GIỚI HẠN
          <br>
          <span>MỖI NGÀY</span>
        </h1>

        <p class="mo-ta-banner">
          STRIDEX sống theo phong cách của bạn
        </p>

        <div class="nut-banner">
          <a routerLink="/san-pham" class="nut-do">Mua ngay</a>
          <a routerLink="/gio-hang" class="nut-vien">Xem giỏ hàng</a>
        </div>
      </div>
    </div>
  </section>

  <section id="logo-thuong-hieu" class="khung">
    <div class="hop-logo">JOGARBOLA</div>
    <div class="hop-logo">SAO VÀNG</div>
    <div class="hop-logo">PEAK</div>
    <div class="hop-logo">SPALDING</div>
    <div class="hop-logo">ĐỘNG LỰC</div>
  </section>

  <section class="khung khoi-loai-san-pham" *ngFor="let nhom of cacNhomSanPham">

    <div class="banner-nhom-san-pham" *ngIf="nhom.banner" [id]="nhom.id">
      <img [src]="nhom.banner" [alt]="nhom.tenHienThi">
    </div>

    <div class="dau-nhom-san-pham">
      <div>
        <p>{{nhom.phuDe}}</p>
        <h2>{{nhom.tenHienThi}}</h2>
      </div>

      <a routerLink="/san-pham">Xem tất cả</a>
    </div>

    <div class="thanh-truot-san-pham">
      <app-the-san-pham
        *ngFor="let sp of nhom.danhSach"
        [sanpham]="sp">
      </app-the-san-pham>
    </div>

  </section>
  `
})
export class TrangchuComponent {
  dsSanPham: SanPham[] = [];

  cacNhomSanPham: {
    id: string;
    loai: string;
    tenHienThi: string;
    phuDe: string;
    banner: string;
    danhSach: SanPham[];
  }[] = [];

  constructor(
    private sanphamService: SanphamService,
    private route: ActivatedRoute
  ) {
    this.sanphamService.layTatCa().subscribe((ds: SanPham[]) => {
      this.dsSanPham = ds;

      this.cacNhomSanPham = [
        {
          id: 'giay-the-thao',
          loai: 'Giay',
          tenHienThi: 'Giày thể thao',
          phuDe: 'Sản phẩm',
          banner: 'assets/banners/banner-giay.png',
          danhSach: this.locTheoLoai('Giay')
        },
        {
          id: 'ao-the-thao',
          loai: 'Ao',
          tenHienThi: 'Áo thể thao',
          phuDe: 'Thời trang',
          banner: 'assets/banners/banner-ao.png',
          danhSach: this.locTheoLoai('Ao')
        },
        {
          id: 'quan-the-thao',
          loai: 'Quan',
          tenHienThi: 'Quần thể thao',
          phuDe: 'Trang phục',
          banner: 'assets/banners/banner-quan.png',
          danhSach: this.locTheoLoai('Quan')
        },
        {
          id: 'phu-kien-the-thao',
          loai: 'Phu kien',
          tenHienThi: 'Phụ kiện thể thao',
          phuDe: 'Phụ kiện',
          banner: 'assets/banners/panner-PhuKien.png',
          danhSach: this.locTheoLoai('Phu kien')
        },
        {
          id: 'bong-the-thao',
          loai: 'Bong',
          tenHienThi: 'Bóng thể thao',
          phuDe: 'Dụng cụ',
          banner: 'assets/banners/banner-bongTheThao.png',
          danhSach: this.locTheoLoai('Bong')
        }
      ].filter(nhom => nhom.danhSach.length > 0);

      this.route.fragment.subscribe(id => {
        if (id) {
          setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 300);
        }
      });
    });
  }

  locTheoLoai(loai: string): SanPham[] {
    return this.dsSanPham.filter(sp => sp.loai === loai);
  }
}