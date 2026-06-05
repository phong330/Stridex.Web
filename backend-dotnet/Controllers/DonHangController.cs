using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StridexApi.Data;
using StridexApi.Models;

namespace StridexApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonHangController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DonHangController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> LayTatCaDonHang()
        {
            var danhSach = await _context.DonHangs
                .Join(
                    _context.NguoiDungs,
                    dh => dh.NguoiDungId,
                    nd => nd.Id,
                    (dh, nd) => new
                    {
                        id = dh.Id,
                        ma = dh.MaDonHang,
                        khachHang = nd.HoTen,
                        email = nd.Email,
                        ngay = dh.NgayDat.ToString("dd/MM/yyyy"),
                        tongTien = dh.TongTien,
                        trangThai = dh.TrangThai
                    }
                )
                .OrderByDescending(dh => dh.id)
                .ToListAsync();

            return Ok(danhSach);
        }

        [HttpPost]
        public async Task<IActionResult> TaoDonHang([FromBody] TaoDonHangRequest request)
        {
            if (request.NguoiDungId <= 0)
            {
                return BadRequest(new
                {
                    thongBao = "Người dùng không hợp lệ."
                });
            }

            if (request.ChiTiet == null || request.ChiTiet.Count == 0)
            {
                return BadRequest(new
                {
                    thongBao = "Giỏ hàng đang trống."
                });
            }

            var donHang = new DonHang
            {
                MaDonHang = "DH" + DateTime.Now.ToString("yyyyMMddHHmmss"),
                NguoiDungId = request.NguoiDungId,
                NgayDat = DateTime.Now,
                TongTien = request.ChiTiet.Sum(ct => ct.SoLuong * ct.DonGia),
                TrangThai = "Đang xử lý"
            };

            _context.DonHangs.Add(donHang);
            await _context.SaveChangesAsync();

            foreach (var item in request.ChiTiet)
            {
                var chiTiet = new ChiTietDonHang
                {
                    DonHangId = donHang.Id,
                    SanPhamId = item.SanPhamId,
                    SoLuong = item.SoLuong,
                    DonGia = item.DonGia
                };

                _context.ChiTietDonHangs.Add(chiTiet);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                thongBao = "Đặt hàng thành công.",
                donHangId = donHang.Id,
                maDonHang = donHang.MaDonHang
            });
        }

        [HttpGet("doanh-thu-thang")]
        public async Task<IActionResult> LayDoanhThuTheoThang()
        {
            var namHienTai = DateTime.Now.Year;

            var duLieu = await _context.DonHangs
                .Where(dh => dh.NgayDat.Year == namHienTai)
                .GroupBy(dh => dh.NgayDat.Month)
                .Select(g => new
                {
                    thangSo = g.Key,
                    doanhThu = g.Sum(x => x.TongTien)
                })
                .OrderBy(x => x.thangSo)
                .ToListAsync();

            decimal doanhThuCaoNhat = duLieu.Count > 0
                ? duLieu.Max(x => x.doanhThu)
                : 0;

            var ketQua = duLieu.Select(x => new
            {
                thang = "T" + x.thangSo,
                doanhThu = x.doanhThu,
                phanTram = doanhThuCaoNhat == 0
                    ? 0
                    : Math.Round((x.doanhThu / doanhThuCaoNhat) * 100, 0)
            });

            return Ok(ketQua);
        }
    }

    public class TaoDonHangRequest
    {
        public int NguoiDungId { get; set; }

        public List<ChiTietDonHangRequest> ChiTiet { get; set; } = new();
    }

    public class ChiTietDonHangRequest
    {
        public int SanPhamId { get; set; }

        public int SoLuong { get; set; }

        public decimal DonGia { get; set; }
    }
}