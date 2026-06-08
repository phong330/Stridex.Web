import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SanPham } from '../models/sanpham';

@Injectable({ providedIn: 'root' })
export class GiohangService {

  private key = 'gioHangStridex';

  private danhSachNguon = new BehaviorSubject<any[]>(this.layTuLocalStorage());
  danhSach$ = this.danhSachNguon.asObservable();

  private layTuLocalStorage() {
    const duLieu = localStorage.getItem(this.key);
    return duLieu ? JSON.parse(duLieu) : [];
  }

  private luuVaoLocalStorage(ds: any[]) {
    localStorage.setItem(this.key, JSON.stringify(ds));
    this.danhSachNguon.next([...ds]);
  }

  them(sp: SanPham) {
    const ds = [...this.danhSachNguon.value];
    const item = ds.find(x => x.id === sp.id);

    if (item) {
      item.soLuong++;
    } else {
      ds.push({ ...sp, soLuong: 1 });
    }

    this.luuVaoLocalStorage(ds);
  }

  tang(sp: any) {
    const ds = [...this.danhSachNguon.value];
    const item = ds.find(x => x.id === sp.id);

    if (item) {
      item.soLuong++;
    }

    this.luuVaoLocalStorage(ds);
  }

  giam(sp: any) {
    const ds = [...this.danhSachNguon.value];
    const item = ds.find(x => x.id === sp.id);

    if (item && item.soLuong > 1) {
      item.soLuong--;
    }

    this.luuVaoLocalStorage(ds);
  }

  xoa(id: number) {
    const ds = this.danhSachNguon.value.filter(sp => sp.id !== id);
    this.luuVaoLocalStorage(ds);
  }

  xoaTatCa() {
    this.luuVaoLocalStorage([]);
  }

  tongTien() {
    return this.danhSachNguon.value.reduce(
      (tong, sp) => tong + sp.gia * sp.soLuong, 0
    );
  }

  soLuong() {
    return this.danhSachNguon.value.reduce(
      (tong, sp) => tong + sp.soLuong, 0
    );
  }
}