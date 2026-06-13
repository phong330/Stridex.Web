import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ThanhToanService {
  private apiUrl = 'http://localhost:5000/api/ThanhToan';

  constructor(private http: HttpClient) {}

  taoThanhToanVnPay(maDonHang: string, soTien: number) {
    return this.http.post<any>(`${this.apiUrl}/tao-thanh-toan-vnpay`, {
      maDonHang: maDonHang,
      soTien: soTien
    });
  }
}