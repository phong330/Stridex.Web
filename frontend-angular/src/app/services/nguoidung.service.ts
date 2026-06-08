import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NguoiDungAdmin {
    id: number;
    hoTen: string;
    email: string;
    vaiTro: string;
}

@Injectable({
    providedIn: 'root'
})
export class NguoidungService {
    private api = 'http://localhost:5000/api/taikhoan';

    constructor(private http: HttpClient) { }

    layTatCa(): Observable<NguoiDungAdmin[]> {
        return this.http.get<NguoiDungAdmin[]>(this.api);
    }
}