import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SanphamService } from '../../services/sanpham.service';
import { GiohangService } from '../../services/giohang.service';
import { SanPham } from '../../models/sanpham';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chitiet-sanpham',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './chitiet-sanpham.html',
  styleUrls: ['./chitiet-sanpham.component.css']
})
export class ChitietSanphamComponent {
  sanpham?: SanPham;

  constructor(
    route: ActivatedRoute,
    private sanphamService: SanphamService,
    private giohang: GiohangService,
    private auth: AuthService,
    private router: Router
  ) {
    const id = Number(route.snapshot.paramMap.get('id'));

    this.sanphamService.layTheoId(id).subscribe(sp => {
      this.sanpham = sp;
    });
  }

  themGioHang() {
    if (!this.auth.daDangNhap()) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      this.router.navigate(['/dang-nhap']);
      return;
    }

    if (this.sanpham) {
      this.giohang.them(this.sanpham);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    }
  }
}
