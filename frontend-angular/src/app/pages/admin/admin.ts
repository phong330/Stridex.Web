import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SanphamService } from '../../services/sanpham.service';
import { SanPham } from '../../models/sanpham';
import { AuthService } from '../../services/auth.service';

interface DonHangAdmin {
  ma: string;
  khachHang: string;
  email?: string;
  ngay: string;
  tongTien: number;
  trangThai: string;
}

interface DoanhThuThang {
  thang: string;
  doanhThu?: number;
  phanTram: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent {
  tabDangChon = 'dashboard';
  tuKhoaAdmin = '';
  dangTai = true;
  cheDoToi = false;
  hienMenuAdmin = false;

  dsSanPham: SanPham[] = [];
  dsNoiBat: SanPham[] = [];

  dangSua = false;

  trangDonHang = 1;
  soDonMoiTrang = 5;

  tongDoanhThu = 0;
  tongDonHang = 0;
  tongNguoiDung = 0;
  tiLeTangTruong = 0;

  doanhThuThang: DoanhThuThang[] = [];
  donHangMoi: DonHangAdmin[] = [];

  sanPhamDangSua: SanPham = {
    id: 0,
    ten: '',
    loai: 'Bong ro',
    gia: 0,
    hinh: '',
    mota: '',
    noiBat: false
  };

  // =========================
  // DANH SÁCH SẢN PHẨM ADMIN
  // =========================

  loaiSanPhamDangChon = 'Tat ca';
  trangSanPham = 1;
  soSanPhamMoiTrang = 16;

  cacLoaiSanPham = [
    {
      key: 'tatCa',
      tenHienThi: 'Tất cả',
      giaTri: 'Tat ca'
    },
    {
      key: 'bongRo',
      tenHienThi: 'Bóng rổ',
      giaTri: 'Bong ro'
    },
    {
      key: 'bongChuyen',
      tenHienThi: 'Bóng chuyền',
      giaTri: 'Bong chuyen'
    },
    {
      key: 'bongDaFutsal',
      tenHienThi: 'Bóng đá & Futsal',
      giaTri: 'Bong da futsal'
    },
    {
      key: 'tapGymWorkout',
      tenHienThi: 'Tập Gym & Workout',
      giaTri: 'Tap gym workout'
    },
    {
      key: 'chayBoDiBo',
      tenHienThi: 'Chạy bộ & Đi bộ',
      giaTri: 'Chay bo di bo'
    },
    {
      key: 'cauLong',
      tenHienThi: 'Cầu lông',
      giaTri: 'Cau long'
    },
    {
      key: 'pickleball',
      tenHienThi: 'Pickleball',
      giaTri: 'Pickleball'
    }
  ];

  dangMoFormSuaDanhSach = false;

  sanPhamDangSuaTuDanhSach: SanPham = {
    id: 0,
    ten: '',
    loai: 'Bong ro',
    gia: 0,
    hinh: '',
    mota: '',
    noiBat: false
  };

  constructor(
    private sanphamService: SanphamService,
    public auth: AuthService,
    private router: Router
  ) {
    this.taiSanPham();
  }

  // =========================
  // HEADER ADMIN
  // =========================

  get emailAdmin() {
    return this.auth.layNguoiDungDangNhap()?.email ?? 'admin@stridex.vn';
  }

  batTatMenuAdmin() {
    this.hienMenuAdmin = !this.hienMenuAdmin;
  }

  get tieuDeTrang() {
    const ten: any = {
      dashboard: 'Dashboard',
      users: 'Users',
      orders: 'Orders',
      products: 'Thêm / sửa sản phẩm',
      productList: 'Tất cả sản phẩm',
      reports: 'Reports',
      settings: 'Settings'
    };

    return ten[this.tabDangChon] ?? 'Admin';
  }

  chonTab(tab: string) {
    this.tabDangChon = tab;
  }

  doiCheDo() {
    this.cheDoToi = !this.cheDoToi;
  }

  dangXuat() {
    this.auth.dangXuat();
    this.router.navigate(['/dang-nhap']);
  }

  // =========================
  // SẢN PHẨM TỪ SQL
  // =========================

  taiSanPham() {
    this.dangTai = true;

    this.sanphamService.layTatCa().subscribe({
      next: (ds) => {
        this.dsSanPham = ds;
        this.dsNoiBat = ds.filter(sp => sp.noiBat);

        this.tongDoanhThu = 0;
        this.tongDonHang = this.donHangMoi.length;
        this.tongNguoiDung = 0;
        this.tiLeTangTruong = 0;

        this.dangTai = false;
      },
      error: () => {
        this.dsSanPham = [];
        this.dsNoiBat = [];
        this.dangTai = false;
        alert('Không tải được danh sách sản phẩm từ SQL!');
      }
    });
  }

  // =========================
  // FORM THÊM / SỬA SẢN PHẨM CŨ
  // =========================

  luuSanPham() {
    if (!this.sanPhamDangSua.ten.trim()) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    if (!this.sanPhamDangSua.hinh.trim()) {
      alert('Vui lòng nhập link hình ảnh!');
      return;
    }

    if (this.sanPhamDangSua.gia <= 0) {
      alert('Giá sản phẩm phải lớn hơn 0!');
      return;
    }

    if (this.dangSua) {
      this.sanphamService
        .suaSanPham(this.sanPhamDangSua.id, this.sanPhamDangSua)
        .subscribe({
          next: () => {
            alert('Cập nhật sản phẩm thành công!');
            this.taiSanPham();
            this.lamMoiForm();
          },
          error: () => {
            alert('Cập nhật sản phẩm thất bại!');
          }
        });
    } else {
      const sanPhamMoi: SanPham = {
        ...this.sanPhamDangSua,
        id: 0
      };

      this.sanphamService.themSanPham(sanPhamMoi).subscribe({
        next: () => {
          alert('Thêm sản phẩm thành công!');
          this.taiSanPham();
          this.lamMoiForm();
        },
        error: () => {
          alert('Thêm sản phẩm thất bại!');
        }
      });
    }
  }

  chonSua(sp: SanPham) {
    this.dangSua = true;
    this.sanPhamDangSua = { ...sp };
    this.tabDangChon = 'products';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  xoaSanPham(id: number) {
    const dongY = confirm('Tôi có chắc muốn xóa sản phẩm này không?');

    if (!dongY) return;

    this.sanphamService.xoaSanPham(id).subscribe({
      next: () => {
        alert('Xóa sản phẩm thành công!');
        this.taiSanPham();
      },
      error: () => {
        alert('Xóa sản phẩm thất bại!');
      }
    });
  }

  lamMoiForm() {
    this.dangSua = false;

    this.sanPhamDangSua = {
      id: 0,
      ten: '',
      loai: 'Bong ro',
      gia: 0,
      hinh: '',
      mota: '',
      noiBat: false
    };
  }

  get danhSachSanPhamLoc() {
    const tuKhoa = this.tuKhoaAdmin.toLowerCase().trim();

    if (!tuKhoa) {
      return this.dsSanPham;
    }

    return this.dsSanPham.filter(sp =>
      sp.ten.toLowerCase().includes(tuKhoa) ||
      sp.loai.toLowerCase().includes(tuKhoa) ||
      sp.mota.toLowerCase().includes(tuKhoa)
    );
  }

  // =========================
  // DANH SÁCH TẤT CẢ SẢN PHẨM
  // LỌC THEO LOẠI + PHÂN TRANG 16 SẢN PHẨM
  // =========================

  get danhSachSanPhamTheoLoai() {
    let danhSach = this.dsSanPham;

    if (this.loaiSanPhamDangChon !== 'Tat ca') {
      danhSach = danhSach.filter(sp => sp.loai === this.loaiSanPhamDangChon);
    }

    const tuKhoa = this.tuKhoaAdmin.toLowerCase().trim();

    if (tuKhoa) {
      danhSach = danhSach.filter(sp =>
        sp.ten.toLowerCase().includes(tuKhoa) ||
        sp.loai.toLowerCase().includes(tuKhoa) ||
        sp.mota.toLowerCase().includes(tuKhoa)
      );
    }

    return danhSach;
  }

  get tongTrangSanPham() {
    return Math.ceil(this.danhSachSanPhamTheoLoai.length / this.soSanPhamMoiTrang);
  }

  get cacTrangSanPham() {
    return Array.from(
      { length: this.tongTrangSanPham },
      (_, i) => i + 1
    );
  }

  get danhSachSanPhamHienThi() {
    const batDau = (this.trangSanPham - 1) * this.soSanPhamMoiTrang;
    const ketThuc = batDau + this.soSanPhamMoiTrang;

    return this.danhSachSanPhamTheoLoai.slice(batDau, ketThuc);
  }

  chonLoaiSanPham(giaTri: string) {
    this.loaiSanPhamDangChon = giaTri;
    this.trangSanPham = 1;
  }

  chonTrangSanPham(trang: number) {
    this.trangSanPham = trang;
  }

  moFormSuaTuDanhSach(sp: SanPham) {
    this.dangMoFormSuaDanhSach = true;
    this.sanPhamDangSuaTuDanhSach = { ...sp };

    setTimeout(() => {
      const form = document.getElementById('form-sua-san-pham-danh-sach');
      form?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  dongFormSuaTuDanhSach() {
    this.dangMoFormSuaDanhSach = false;

    this.sanPhamDangSuaTuDanhSach = {
      id: 0,
      ten: '',
      loai: 'Bong ro',
      gia: 0,
      hinh: '',
      mota: '',
      noiBat: false
    };
  }

  capNhatSanPhamTuDanhSach() {
    if (!this.sanPhamDangSuaTuDanhSach.ten.trim()) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    if (!this.sanPhamDangSuaTuDanhSach.hinh.trim()) {
      alert('Vui lòng nhập link hình ảnh!');
      return;
    }

    if (this.sanPhamDangSuaTuDanhSach.gia <= 0) {
      alert('Giá sản phẩm phải lớn hơn 0!');
      return;
    }

    this.sanphamService
      .suaSanPham(
        this.sanPhamDangSuaTuDanhSach.id,
        this.sanPhamDangSuaTuDanhSach
      )
      .subscribe({
        next: () => {
          alert('Cập nhật sản phẩm thành công!');
          this.taiSanPham();
          this.dongFormSuaTuDanhSach();
        },
        error: () => {
          alert('Cập nhật sản phẩm thất bại!');
        }
      });
  }

  xoaSanPhamTuDanhSach(id: number) {
    const dongY = confirm('Tôi có chắc muốn xóa sản phẩm này không?');

    if (!dongY) return;

    this.sanphamService.xoaSanPham(id).subscribe({
      next: () => {
        alert('Xóa sản phẩm thành công!');
        this.taiSanPham();

        if (this.danhSachSanPhamHienThi.length === 0 && this.trangSanPham > 1) {
          this.trangSanPham--;
        }
      },
      error: () => {
        alert('Xóa sản phẩm thất bại!');
      }
    });
  }

  // =========================
  // ĐƠN HÀNG
  // =========================

  get donHangHienThi() {
    const batDau = (this.trangDonHang - 1) * this.soDonMoiTrang;
    const ketThuc = batDau + this.soDonMoiTrang;

    return this.donHangMoi.slice(batDau, ketThuc);
  }

  doiTrangDonHang(huong: number) {
    const tongTrang = Math.ceil(this.donHangMoi.length / this.soDonMoiTrang);
    const trangMoi = this.trangDonHang + huong;

    if (trangMoi >= 1 && trangMoi <= tongTrang) {
      this.trangDonHang = trangMoi;
    }
  }
}