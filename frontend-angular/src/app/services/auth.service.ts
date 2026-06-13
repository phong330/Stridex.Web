import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/TaiKhoan';

  constructor(private http: HttpClient) {}

  dangKy(nguoiDung: any) {
    return this.http.post<any>(`${this.apiUrl}/dang-ky`, nguoiDung);
  }

  dangNhap(thongTin: any) {
    return this.http.post<any>(`${this.apiUrl}/dang-nhap`, thongTin);
  }

  dangNhapGoogle(idToken: string) {
    return this.http.post<any>(`${this.apiUrl}/dang-nhap-google`, {
      idToken: idToken
    });
  }

  luuDangNhap(nguoiDung: any) {
    localStorage.setItem('nguoiDungDangNhap', JSON.stringify(nguoiDung));
  }

  layNguoiDungDangNhap() {
    const data = localStorage.getItem('nguoiDungDangNhap');
    return data ? JSON.parse(data) : null;
  }

  layNguoiDung() {
    return this.layNguoiDungDangNhap();
  }

  daDangNhap(): boolean {
    return this.layNguoiDungDangNhap() !== null;
  }

  dangXuat() {
    localStorage.removeItem('nguoiDungDangNhap');
  }

  laAdmin(): boolean {
    const nguoiDung = this.layNguoiDungDangNhap();

    if (!nguoiDung) {
      return false;
    }

    return String(nguoiDung.vaiTro).toLowerCase() === 'admin';
  }
}