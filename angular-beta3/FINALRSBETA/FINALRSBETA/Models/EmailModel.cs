namespace FINALRSBETA.Models
{
    public class EmailModel
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public EmailModel(string to, string subject, string contents)
        {
            To= to;
            Subject= subject;
            Content= contents;
        }
    }
}
