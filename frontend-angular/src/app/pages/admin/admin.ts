import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SanphamService } from '../../services/sanpham.service';
import { SanPham } from '../../models/sanpham';
import { AuthService } from '../../services/auth.service';
import { DonhangService, DonHangAdmin, DoanhThuThang } from '../../services/donhang.service';
import { NguoidungService, NguoiDungAdmin } from '../../services/nguoidung.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent {
  // =========================
  // TRẠNG THÁI GIAO DIỆN
  // =========================

  tabDangChon = 'dashboard';
  tuKhoaAdmin = '';
  dangTai = true;
  cheDoToi = false;
  hienMenuAdmin = false;

  // =========================
  // DỮ LIỆU CHÍNH
  // =========================

  dsSanPham: SanPham[] = [];
  dsNoiBat: SanPham[] = [];
  dsNguoiDung: NguoiDungAdmin[] = [];

  donHangMoi: DonHangAdmin[] = [];
  doanhThuThang: DoanhThuThang[] = [];

  // =========================
  // THỐNG KÊ DASHBOARD
  // =========================

  tongDoanhThu = 0;
  tongDonHang = 0;
  tongNguoiDung = 0;
  tiLeTangTruong = 0;

  // =========================
  // PHÂN TRANG ĐƠN HÀNG
  // =========================

  trangDonHang = 1;
  soDonMoiTrang = 5;

  // =========================
  // FORM THÊM / SỬA SẢN PHẨM
  // =========================

  dangSua = false;

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
    private donhangService: DonhangService,
    private nguoidungService: NguoidungService,
    public auth: AuthService,
    private router: Router
  ) {
    this.taiTatCaDuLieu();
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
      users: 'Quản lý người dùng',
      orders: 'Quản lý đơn hàng',
      products: 'Thêm / sửa sản phẩm',
      productList: 'Tất cả sản phẩm',
      reports: 'Báo cáo',
      settings: 'Cài đặt'
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
  // TẢI DỮ LIỆU DASHBOARD
  // =========================

  taiTatCaDuLieu() {
    this.dangTai = true;

    this.taiSanPham();
    this.taiDonHang();
    this.taiDoanhThuTheoThang();
    this.taiNguoiDung();
  }

  capNhatThongKe() {
    this.tongDonHang = this.donHangMoi.length;
    this.tongNguoiDung = this.dsNguoiDung.length;

    this.tongDoanhThu = this.donHangMoi.reduce(
      (tong, dh) => tong + Number(dh.tongTien),
      0
    );

    this.tiLeTangTruong = this.tongDonHang > 0 ? 12 : 0;
  }

  // =========================
  // SẢN PHẨM TỪ SQL
  // =========================

  taiSanPham() {
    this.sanphamService.layTatCa().subscribe({
      next: (ds) => {
        this.dsSanPham = ds;
        this.dsNoiBat = ds.filter(sp => sp.noiBat);
        this.capNhatThongKe();
        this.dangTai = false;
      },
      error: () => {
        this.dsSanPham = [];
        this.dsNoiBat = [];
        this.capNhatThongKe();
        this.dangTai = false;
        alert('Không tải được danh sách sản phẩm từ SQL!');
      }
    });
  }

  // =========================
  // ĐƠN HÀNG TỪ SQL
  // =========================

  taiDonHang() {
    this.donhangService.layTatCaDonHang().subscribe({
      next: (ds) => {
        this.donHangMoi = ds;
        this.trangDonHang = 1;
        this.capNhatThongKe();
      },
      error: () => {
        this.donHangMoi = [];
        this.capNhatThongKe();
      }
    });
  }

  taiDoanhThuTheoThang() {
    this.donhangService.layDoanhThuTheoThang().subscribe({
      next: (ds) => {
        this.doanhThuThang = ds;
      },
      error: () => {
        this.doanhThuThang = [];
      }
    });
  }

  capNhatTrangThaiDonHang(dh: DonHangAdmin) {
    this.donhangService.capNhatTrangThai(dh.id, dh.trangThai).subscribe({
      next: () => {
        alert('Cập nhật trạng thái đơn hàng thành công!');
        this.taiDonHang();
      },
      error: () => {
        alert('Cập nhật trạng thái đơn hàng thất bại!');
      }
    });
  }

  get donHangHienThi() {
    const batDau = (this.trangDonHang - 1) * this.soDonMoiTrang;
    return this.donHangMoi.slice(batDau, batDau + this.soDonMoiTrang);
  }

  get tongTrangDonHang() {
    return Math.ceil(this.donHangMoi.length / this.soDonMoiTrang);
  }

  doiTrangDonHang(kieu: number) {
    const trangMoi = this.trangDonHang + kieu;

    if (trangMoi < 1 || trangMoi > this.tongTrangDonHang) {
      return;
    }

    this.trangDonHang = trangMoi;
  }

  // =========================
  // NGƯỜI DÙNG TỪ SQL
  // =========================

  taiNguoiDung() {
    this.nguoidungService.layTatCa().subscribe({
      next: (ds) => {
        this.dsNguoiDung = ds;
        this.capNhatThongKe();
      },
      error: () => {
        this.dsNguoiDung = [];
        this.capNhatThongKe();
      }
    });
  }

  get danhSachNguoiDungLoc() {
    const tuKhoa = this.tuKhoaAdmin.toLowerCase().trim();

    if (!tuKhoa) {
      return this.dsNguoiDung;
    }

    return this.dsNguoiDung.filter(nd =>
      nd.hoTen.toLowerCase().includes(tuKhoa) ||
      nd.email.toLowerCase().includes(tuKhoa) ||
      nd.vaiTro.toLowerCase().includes(tuKhoa)
    );
  }

  // =========================
  // FORM THÊM / SỬA SẢN PHẨM
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

  get danhSachSanPhamHienThi() {
    const batDau = (this.trangSanPham - 1) * this.soSanPhamMoiTrang;

    return this.danhSachSanPhamTheoLoai.slice(
      batDau,
      batDau + this.soSanPhamMoiTrang
    );
  }

  get tongTrangSanPham() {
    return Math.ceil(
      this.danhSachSanPhamTheoLoai.length / this.soSanPhamMoiTrang
    );
  }

  get cacTrangSanPham() {
    return Array.from(
      { length: this.tongTrangSanPham },
      (_, i) => i + 1
    );
  }

  chonLoaiSanPham(loai: string) {
    this.loaiSanPhamDangChon = loai;
    this.trangSanPham = 1;
  }

  chonTrangSanPham(trang: number) {
    this.trangSanPham = trang;
  }

  moFormSuaTuDanhSach(sp: SanPham) {
    this.dangMoFormSuaDanhSach = true;
    this.sanPhamDangSuaTuDanhSach = { ...sp };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
    this.xoaSanPham(id);
  }
}