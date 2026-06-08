import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SanPham } from '../../models/sanpham';
import { GiohangService } from '../../services/giohang.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-the-san-pham',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './the-san-pham.component.html',
  styleUrls: ['./the-san-pham.component.css']
})
export class TheSanPhamComponent {
  @Input({ required: true }) sanpham!: SanPham;

  constructor(
    private giohang: GiohangService,
    private auth: AuthService,
    private router: Router
  ) { }

  themVaoGio() {
    if (!this.auth.daDangNhap()) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      this.router.navigate(['/dang-nhap']);
      return;
    }

    this.giohang.them(this.sanpham);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  }
}