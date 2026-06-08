using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StridexApi.Data;
using StridexApi.Models;

namespace StridexApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaiKhoanController : ControllerBase
    {
        private readonly AppDbContext _context;

        [HttpGet]
        public async Task<IActionResult> LayTatCaNguoiDung()
        {
            var danhSach = await _context.NguoiDungs
                .Select(nd => new
                {
                    id = nd.Id,
                    hoTen = nd.HoTen,
                    email = nd.Email,
                    vaiTro = nd.VaiTro
                })
                .OrderByDescending(nd => nd.id)
                .ToListAsync();

            return Ok(danhSach);
        }
        public TaiKhoanController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("dang-ky")]
        public async Task<IActionResult> DangKy(NguoiDung nguoiDung)
        {
            var daTonTai = await _context.NguoiDungs
                .AnyAsync(nd => nd.Email == nguoiDung.Email);

            if (daTonTai)
            {
                return BadRequest(new
                {
                    thongBao = "Email đã tồn tại."
                });
            }

            nguoiDung.VaiTro = "KhachHang";

            _context.NguoiDungs.Add(nguoiDung);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                thongBao = "Đăng ký thành công."
            });
        }

        [HttpPost("dang-nhap")]
        public async Task<IActionResult> DangNhap([FromBody] DangNhapRequest request)
        {
            var nguoiDung = await _context.NguoiDungs
                .FirstOrDefaultAsync(nd =>
                    nd.Email == request.Email &&
                    nd.MatKhau == request.MatKhau
                );

            if (nguoiDung == null)
            {
                return Unauthorized(new
                {
                    thongBao = "Sai email hoặc mật khẩu."
                });
            }

            return Ok(new
            {
                id = nguoiDung.Id,
                hoTen = nguoiDung.HoTen,
                email = nguoiDung.Email,
                vaiTro = nguoiDung.VaiTro,
                thongBao = "Đăng nhập thành công."
            });
        }
    }

    public class DangNhapRequest
    {
        public string Email { get; set; } = "";

        public string MatKhau { get; set; } = "";
    }
}