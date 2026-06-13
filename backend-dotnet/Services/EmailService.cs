using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace StridexApi.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task GuiEmailAsync(string emailNhan, string tieuDe, string noiDung)
        {
            string emailGui = _configuration["EmailSettings:EmailGui"]
                ?? throw new Exception("Thiếu cấu hình EmailSettings:EmailGui trong appsettings.json");

            string matKhauUngDung = _configuration["EmailSettings:MatKhauUngDung"]
                ?? throw new Exception("Thiếu cấu hình EmailSettings:MatKhauUngDung trong appsettings.json");

            string smtpServer = _configuration["EmailSettings:SmtpServer"]
                ?? throw new Exception("Thiếu cấu hình EmailSettings:SmtpServer trong appsettings.json");

            string portText = _configuration["EmailSettings:Port"]
                ?? throw new Exception("Thiếu cấu hình EmailSettings:Port trong appsettings.json");

            int port = int.Parse(portText);

            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(
                "STRIDEX SPORT",
                emailGui
            ));

            email.To.Add(MailboxAddress.Parse(emailNhan));
            email.Subject = tieuDe;

            email.Body = new TextPart("html")
            {
                Text = noiDung
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                smtpServer,
                port,
                SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                emailGui,
                matKhauUngDung
            );

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}