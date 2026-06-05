namespace StridexApi.Models
{
    public class DonHang
    {
        public int Id { get; set; }

        public string MaDonHang { get; set; } = "";

        public int NguoiDungId { get; set; }

        public DateTime NgayDat { get; set; }

        public decimal TongTien { get; set; }

        public string TrangThai { get; set; } = "Đang xử lý";
    }
}