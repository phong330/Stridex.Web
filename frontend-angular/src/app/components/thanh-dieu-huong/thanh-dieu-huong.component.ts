import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GiohangService } from '../../services/giohang.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-thanh-dieu-huong',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
<header id="dau-trang">

  <div id="thanh-tren">
    <a routerLink="/" id="logo">
      <span id="bieu-tuong-logo">●●●●●</span>
      <span>STRIDEX.VN</span>
    </a>

    <div id="o-tim-kiem">
      <span>⌕</span>
      <input placeholder="Tìm sản phẩm..." />
    </div>

    <div id="nhom-bieu-tuong">
      <a routerLink="/trang-chu" class="nut-tron">⌂</a>
      <a routerLink="" class="nut-tron">♡</a>
      <a routerLink="/dang-nhap" class="nut-tron">♙</a>
      <a routerLink="/gio-hang" class="nut-tron">🛒</a>
    </div>
  </div>

  <nav id="thanh-menu">
    <button id="nut-danh-muc" (click)="batTatDanhMuc()">
      ☰ Danh mục sản phẩm
    </button>

  <a routerLink="/" fragment="giay-the-thao">Giày thể thao</a>
  <a routerLink="/" fragment="ao-the-thao">Áo thể thao</a>
  <a routerLink="/" fragment="quan-the-thao">Quần thể thao</a>
  <a routerLink="/" fragment="phu-kien-the-thao">Phụ kiện thể thao</a>
  <a routerLink="/" fragment="bong-the-thao">Bóng thể thao</a>
  </nav>

  <section id="bang-danh-muc" *ngIf="hienDanhMuc">

    <div id="tab-danh-muc">
      <a routerLink="" class="tab-dang-chon">🏸 Môn thể thao</a>
      <a routerLink="">🏃 Thể thao Nam</a>
      <a routerLink="">🤸 Thể thao Nữ</a>
      <a routerLink="">🎒 Phụ kiện</a>
      <a routerLink="">🏷️ Thương hiệu</a>
    </div>

    <div id="luoi-danh-muc">

      <div class="cot-danh-muc">
        <h3>BÓNG RỔ</h3>
        <p>Bóng thi đấu</p>
        <p>Giày bóng rổ</p>
        <p>Quần áo</p>
        <p>Phụ kiện bóng rổ</p>
      </div>

      <div class="cot-danh-muc">
        <h3>BÓNG CHUYỀN</h3>
        <p>Bóng thi đấu</p>
        <p>Giày bóng chuyền</p>
        <p>Quần áo</p>
        <p>Phụ kiện bóng chuyền</p>
      </div>

      <div class="cot-danh-muc">
        <h3>BÓNG ĐÁ & FUTSAL</h3>
        <p>Bóng thi đấu</p>
        <p>Giày bóng đá</p>
        <p>Quần áo</p>
        <p>Phụ kiện bóng đá</p>
      </div>

      <div class="cot-danh-muc">
        <h3>TẬP GYM & WORKOUT</h3>
        <p>Quần áo</p>
        <p>Giày tập Gym</p>
        <p>Phụ kiện tập Fitness</p>
      </div>

      <div class="cot-danh-muc">
        <h3>CHẠY BỘ & ĐI BỘ</h3>
        <p>Giày chạy bộ</p>
        <p>Quần áo</p>
        <p>Phụ kiện chạy bộ</p>
      </div>

      <div class="cot-danh-muc">
        <h3>CẦU LÔNG</h3>
        <p>Vợt cầu lông</p>
        <p>Cầu thi đấu</p>
        <p>Giày cầu lông</p>
        <p>Quần áo</p>
        <p>Phụ kiện cầu lông</p>
      </div>

      <div class="cot-danh-muc">
        <h3>PICKLEBALL</h3>
        <p>Giày Pickleball</p>
        <p>Vợt Pickleball</p>
        <p>Phụ kiện Pickleball</p>
      </div>

    </div>
  </section>

</header>
`
})
export class ThanhDieuHuongComponent {
  soLuong = 0;
  hienDanhMuc = false;

  constructor(
    private giohang: GiohangService,
    public auth: AuthService
  ) {
    this.giohang.danhSach$.subscribe(ds => this.soLuong = ds.length);
  }

  batTatDanhMuc() {
    this.hienDanhMuc = !this.hienDanhMuc;
  }
}