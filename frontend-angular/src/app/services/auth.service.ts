import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NguoiDungDangKy {
  hoTen: string;
  email: string;
  matKhau: string;
}

export interface DangNhapRequest {
  email: string;
  matKhau: string;
}

export interface NguoiDungDangNhap {
  id: number;
  hoTen: string;
  email: string;
  vaiTro: string;
  thongBao: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/taikhoan';

  constructor(private http: HttpClient) { }

  dangKy(nguoiDung: NguoiDungDangKy): Observable<any> {
    return this.http.post(`${this.apiUrl}/dang-ky`, nguoiDung);
  }

  dangNhap(thongTin: DangNhapRequest): Observable<NguoiDungDangNhap> {
    return this.http.post<NguoiDungDangNhap>(
      `${this.apiUrl}/dang-nhap`,
      thongTin
    );
  }

  luuDangNhap(nguoiDung: NguoiDungDangNhap) {
    localStorage.setItem('nguoiDungDangNhap', JSON.stringify(nguoiDung));
  }

  layNguoiDungDangNhap(): NguoiDungDangNhap | null {
    const duLieu = localStorage.getItem('nguoiDungDangNhap');
    return duLieu ? JSON.parse(duLieu) : null;
  }

  daDangNhap(): boolean {
    return this.layNguoiDungDangNhap() !== null;
  }

  laAdmin(): boolean {
    const nguoiDung = this.layNguoiDungDangNhap();
    return nguoiDung?.vaiTro === 'Admin';
  }

  dangXuat() {
    localStorage.removeItem('nguoiDungDangNhap');
  }
}