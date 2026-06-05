import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChiTietDonHangRequest {
  sanPhamId: number;
  soLuong: number;
  donGia: number;
}

export interface TaoDonHangRequest {
  nguoiDungId: number;
  chiTiet: ChiTietDonHangRequest[];
}

export interface DonHangAdmin {
  id: number;
  ma: string;
  khachHang: string;
  email: string;
  ngay: string;
  tongTien: number;
  trangThai: string;
}

export interface DoanhThuThang {
  thang: string;
  doanhThu: number;
  phanTram: number;
}

@Injectable({
  providedIn: 'root'
})
export class DonhangService {
  private api = 'http://localhost:5000/api/donhang';

  constructor(private http: HttpClient) {}

  taoDonHang(data: TaoDonHangRequest): Observable<any> {
    return this.http.post(this.api, data);
  }

  layTatCaDonHang(): Observable<DonHangAdmin[]> {
    return this.http.get<DonHangAdmin[]>(this.api);
  }

  layDoanhThuTheoThang(): Observable<DoanhThuThang[]> {
    return this.http.get<DoanhThuThang[]>(`${this.api}/doanh-thu-thang`);
  }
}