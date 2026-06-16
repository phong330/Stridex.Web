using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using StridexApi.Data;

namespace StridexApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThanhToanController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public ThanhToanController(
            IConfiguration configuration,
            AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("tao-thanh-toan-vnpay")]
        public IActionResult TaoThanhToanVnPay([FromBody] TaoThanhToanDto dto)
        {
            string vnpUrl = _configuration["VnPay:BaseUrl"]!;
            string tmnCode = _configuration["VnPay:TmnCode"]!;
            string hashSecret = _configuration["VnPay:HashSecret"]!;
            string returnUrl = _configuration["VnPay:ReturnUrl"]!;

            string txnRef = dto.MaDonHang;
            string orderInfo = $"Thanh toan don hang {dto.MaDonHang}";
            string createDate = DateTime.Now.ToString("yyyyMMddHHmmss");

            long amount = dto.SoTien * 100;

            var vnpParams = new SortedList<string, string>
        {
            { "vnp_Version", "2.1.0" },
            { "vnp_Command", "pay" },
            { "vnp_TmnCode", tmnCode },
            { "vnp_Amount", amount.ToString() },
            { "vnp_CreateDate", createDate },
            { "vnp_CurrCode", "VND" },
            { "vnp_IpAddr", GetIpAddress() },
            { "vnp_Locale", "vn" },
            { "vnp_OrderInfo", orderInfo },
            { "vnp_OrderType", "other" },
            { "vnp_ReturnUrl", returnUrl },
            { "vnp_TxnRef", txnRef }
        };

            string queryString = BuildQueryString(vnpParams);
            string secureHash = HmacSHA512(hashSecret, queryString);

            string paymentUrl =
                vnpUrl + "?" + queryString + "&vnp_SecureHash=" + secureHash;

            return Ok(new
            {
                paymentUrl
            });
        }

        [HttpGet("vnpay-return")]
        public IActionResult VnPayReturn()
        {
            var query = Request.Query;

            string hashSecret = _configuration["VnPay:HashSecret"]!;
            string vnpSecureHash = query["vnp_SecureHash"].ToString();

            var vnpParams = new SortedList<string, string>();

            foreach (var item in query)
            {
                if (!string.IsNullOrEmpty(item.Value)
                    && item.Key.StartsWith("vnp_")
                    && item.Key != "vnp_SecureHash"
                    && item.Key != "vnp_SecureHashType")
                {
                    vnpParams.Add(item.Key, item.Value.ToString());
                }
            }

            string rawData = BuildQueryString(vnpParams);
            string checkHash = HmacSHA512(hashSecret, rawData);

            if (!checkHash.Equals(
                vnpSecureHash,
                StringComparison.InvariantCultureIgnoreCase))
            {
                return Redirect("http://localhost:4200/thanh-toan-that-bai");
            }

            string responseCode =
                query["vnp_ResponseCode"].ToString();

            string transactionStatus =
                query["vnp_TransactionStatus"].ToString();

            string maDonHang =
                query["vnp_TxnRef"].ToString();

            if (responseCode == "00" && transactionStatus == "00")
            {
                var donHang = _context.DonHangs
                    .FirstOrDefault(x => x.MaDonHang == maDonHang);

                if (donHang != null)
                {
                    donHang.TrangThai = "Đã thanh toán - Chờ duyệt";
                    _context.SaveChanges();
                }

                return Redirect(
                    $"http://localhost:4200/thanh-toan-thanh-cong?maDonHang={maDonHang}");
            }

            return Redirect(
                $"http://localhost:4200/thanh-toan-that-bai?maDonHang={maDonHang}");
        }

        private string BuildQueryString(SortedList<string, string> data)
        {
            var query = new StringBuilder();

            foreach (var item in data)
            {
                if (query.Length > 0)
                {
                    query.Append("&");
                }

                query.Append(WebUtility.UrlEncode(item.Key));
                query.Append("=");
                query.Append(WebUtility.UrlEncode(item.Value));
            }

            return query.ToString();
        }

        private string HmacSHA512(string key, string inputData)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);

            using HMACSHA512 hmac = new HMACSHA512(keyBytes);

            byte[] hashBytes = hmac.ComputeHash(inputBytes);

            return BitConverter.ToString(hashBytes)
                .Replace("-", "")
                .ToLower();
        }

        private string GetIpAddress()
        {
            string ipAddress =
                HttpContext.Connection.RemoteIpAddress?.ToString()
                ?? "127.0.0.1";

            if (ipAddress == "::1")
            {
                ipAddress = "127.0.0.1";
            }

            return ipAddress;
        }
    }

    public class TaoThanhToanDto
    {
        public string MaDonHang { get; set; } = "";

        public long SoTien { get; set; }
    }

}
