using FINALRSBETA.Models;

namespace FINALRSBETA.UtilityService
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
    }
}
