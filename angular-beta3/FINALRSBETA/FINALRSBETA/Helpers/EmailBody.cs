namespace FINALRSBETA.Helpers
{
    public static class EmailBody
    {
        public static string EmailStringBody (string email, string emailToken)
        {
            return $@"<html lang=""en"">
  <head>
    <meta charset=""UTF-8"">
    <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Document</title>
    </head>
<body>
    <h1>EMAIL SENT</h1>
    <a href=""http://localhost:4200/reset-password?email={email}&code={emailToken}"">Reset Password</a>
</body>
</html>";
        }
    }
}
