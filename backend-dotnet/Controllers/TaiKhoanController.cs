using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Google.Apis.Auth;

namespace StridexApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        private const string GoogleClientId = "274546988937-svmbcusn3179tsgp854nfc2dismq0sbu.apps.googleusercontent.com";

        public TaiKhoanController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("dang-ky")]
        public IActionResult DangKy([FromBody] TaiKhoanDto tk)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection")!;

            string hoTen = tk.HoTen.Trim();
            string email = tk.Email.Trim().ToLower();
            string matKhau = tk.MatKhau.Trim();

            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();

            string checkSql = @"SELECT COUNT(*) 
                            FROM NguoiDung
                            WHERE LOWER(LTRIM(RTRIM(Email))) = @Email";

            using SqlCommand checkCmd = new SqlCommand(checkSql, conn);
            checkCmd.Parameters.AddWithValue("@Email", email);

            int count = Convert.ToInt32(checkCmd.ExecuteScalar());

            if (count > 0)
            {
                return BadRequest(new { message = "Email đã tồn tại!" });
            }

            string sql = @"INSERT INTO NguoiDung (HoTen, Email, MatKhau, VaiTro)
                       VALUES (@HoTen, @Email, @MatKhau, N'user')";

            using SqlCommand cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@HoTen", hoTen);
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@MatKhau", matKhau);

            cmd.ExecuteNonQuery();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        [HttpPost("dang-nhap")]
        public IActionResult DangNhap([FromBody] DangNhapDto dto)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection")!;

            string email = dto.Email.Trim().ToLower();
            string matKhau = dto.MatKhau.Trim();

            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();

            string sql = @"SELECT Id, HoTen, Email, VaiTro
                       FROM NguoiDung
                       WHERE LOWER(LTRIM(RTRIM(Email))) = @Email
                       AND LTRIM(RTRIM(MatKhau)) = @MatKhau";

            using SqlCommand cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@MatKhau", matKhau);

            using SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return Ok(new
                {
                    message = "Đăng nhập thành công!",
                    user = new
                    {
                        id = reader["Id"],
                        hoTen = reader["HoTen"],
                        email = reader["Email"],
                        vaiTro = reader["VaiTro"]
                    }
                });
            }

            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng!" });
        }

        [HttpPost("dang-nhap-google")]
        public async Task<IActionResult> DangNhapGoogle([FromBody] GoogleLoginDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.IdToken))
                {
                    return BadRequest(new { message = "Thiếu Google ID Token!" });
                }

                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>
                {
                    GoogleClientId
                }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, settings);

                string email = payload.Email.Trim().ToLower();
                string hoTen = string.IsNullOrWhiteSpace(payload.Name) ? email : payload.Name;

                string connectionString = _configuration.GetConnectionString("DefaultConnection")!;

                using SqlConnection conn = new SqlConnection(connectionString);
                conn.Open();

                string findSql = @"SELECT Id, HoTen, Email, VaiTro
                               FROM NguoiDung
                               WHERE LOWER(LTRIM(RTRIM(Email))) = @Email";

                using SqlCommand findCmd = new SqlCommand(findSql, conn);
                findCmd.Parameters.AddWithValue("@Email", email);

                using SqlDataReader reader = findCmd.ExecuteReader();

                if (reader.Read())
                {
                    return Ok(new
                    {
                        message = "Đăng nhập Google thành công!",
                        user = new
                        {
                            id = reader["Id"],
                            hoTen = reader["HoTen"],
                            email = reader["Email"],
                            vaiTro = reader["VaiTro"]
                        }
                    });
                }

                reader.Close();

                string insertSql = @"INSERT INTO NguoiDung (HoTen, Email, MatKhau, VaiTro)
                                 OUTPUT INSERTED.Id
                                 VALUES (@HoTen, @Email, @MatKhau, N'user')";

                using SqlCommand insertCmd = new SqlCommand(insertSql, conn);
                insertCmd.Parameters.AddWithValue("@HoTen", hoTen);
                insertCmd.Parameters.AddWithValue("@Email", email);
                insertCmd.Parameters.AddWithValue("@MatKhau", "GOOGLE_LOGIN");

                int newId = Convert.ToInt32(insertCmd.ExecuteScalar());

                return Ok(new
                {
                    message = "Đăng nhập Google thành công!",
                    user = new
                    {
                        id = newId,
                        hoTen = hoTen,
                        email = email,
                        vaiTro = "user"
                    }
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new
                {
                    message = "Token Google không hợp lệ hoặc lỗi xử lý đăng nhập Google!",
                    error = ex.Message
                });
            }
        }

        [HttpGet]
        public IActionResult LayTatCaNguoiDung()
        {
            string connectionString =
            _configuration.GetConnectionString("DefaultConnection")!;

            List<object> dsNguoiDung = new();

            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();

            string sql = @"SELECT Id, HoTen, Email, VaiTro
               FROM NguoiDung
               ORDER BY Id";

            using SqlCommand cmd = new SqlCommand(sql, conn);
            using SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                dsNguoiDung.Add(new
                {
                    id = Convert.ToInt32(reader["Id"]),
                    hoTen = reader["HoTen"].ToString(),
                    email = reader["Email"].ToString(),
                    vaiTro = reader["VaiTro"].ToString()
                });
            }

            return Ok(dsNguoiDung);

        }

    }
    public class TaiKhoanDto
    {
        public string HoTen { get; set; } = "";
        public string Email { get; set; } = "";
        public string MatKhau { get; set; } = "";
    }

    public class DangNhapDto
    {
        public string Email { get; set; } = "";
        public string MatKhau { get; set; } = "";
    }

    public class GoogleLoginDto
    {
        public string IdToken { get; set; } = "";
    }
}
