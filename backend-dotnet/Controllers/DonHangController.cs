using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StridexApi.Data;
using StridexApi.Models;
using StridexApi.Services;

namespace StridexApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonHangController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public DonHangController(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // ==============================
        // LẤY ĐƠN HÀNG THEO NGƯỜI DÙNG
        // API: GET /api/donhang/nguoi-dung/1
        // ==============================
        [HttpGet("nguoi-dung/{nguoiDungId}")]
        public async Task<IActionResult> LayDonHangTheoNguoiDung(int nguoiDungId)
        {
            var danhSach = await _context.DonHangs
                .Where(dh => dh.NguoiDungId == nguoiDungId)
                .OrderByDescending(dh => dh.Id)
                .Select(dh => new
                {
                    id = dh.Id,
                    ma = dh.MaDonHang,
                    ngay = dh.NgayDat.ToString("dd/MM/yyyy"),
                    tongTien = dh.TongTien,
                    trangThai = dh.TrangThai
                })
                .ToListAsync();

            return Ok(danhSach);
        }

        // ==============================
        // CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
        // API: PUT /api/donhang/1/trang-thai
        // ==============================
        public class CapNhatTrangThaiRequest
        {
            public string TrangThai { get; set; } = "";
        }

        [HttpPut("{id}/trang-thai")]
        public async Task<IActionResult> CapNhatTrangThai(int id, [FromBody] CapNhatTrangThaiRequest request)
        {
            var donHang = await _context.DonHangs.FindAsync(id);

            if (donHang == null)
            {
                return NotFound(new
                {
                    thongBao = "Không tìm thấy đơn hàng."
                });
            }

            donHang.TrangThai = request.TrangThai;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                thongBao = "Cập nhật trạng thái thành công.",
                id = donHang.Id,
                trangThai = donHang.TrangThai
            });
        }

        // ==============================
        // LẤY TẤT CẢ ĐƠN HÀNG CHO ADMIN
        // API: GET /api/donhang
        // ==============================
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

        // ==============================
        // TẠO ĐƠN HÀNG + GỬI EMAIL
        // API: POST /api/donhang
        // ==============================
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

            var nguoiDung = await _context.NguoiDungs.FindAsync(request.NguoiDungId);

            if (nguoiDung == null)
            {
                return BadRequest(new
                {
                    thongBao = "Không tìm thấy người dùng."
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

            // Gửi email thông báo đặt hàng thành công
            try
            {
                string noiDungEmail = $@"
                    <h2>Xin chào {nguoiDung.HoTen}</h2>

                    <p>Bạn đã đặt hàng thành công tại <b>STRIDEX SPORT</b>.</p>

                    <p><b>Mã đơn hàng:</b> {donHang.MaDonHang}</p>
                    <p><b>Ngày đặt:</b> {donHang.NgayDat:dd/MM/yyyy HH:mm}</p>
                    <p><b>Tổng tiền:</b> {donHang.TongTien:N0} đ</p>
                    <p><b>Trạng thái:</b> {donHang.TrangThai}</p>

                    <hr>

                    <p>Cảm ơn bạn đã mua hàng tại STRIDEX SPORT!</p>
                ";

                await _emailService.GuiEmailAsync(
                    nguoiDung.Email,
                    "STRIDEX - Đặt hàng thành công",
                    noiDungEmail
                );
            }
            catch
            {
                // Nếu gửi email lỗi thì vẫn cho đặt hàng thành công
                // Không return lỗi ở đây để tránh làm hỏng chức năng đặt hàng
            }

            return Ok(new
            {
                thongBao = "Đặt hàng thành công.",
                donHangId = donHang.Id,
                maDonHang = donHang.MaDonHang
            });
        }

        // ==============================
        // DOANH THU THEO THÁNG
        // API: GET /api/donhang/doanh-thu-thang
        // ==============================
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

    // ==============================
    // REQUEST MODEL TẠO ĐƠN HÀNG
    // ==============================
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