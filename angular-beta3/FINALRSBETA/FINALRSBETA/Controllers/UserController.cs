using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using FINALRSBETA.Context;
using FINALRSBETA.Helpers;
using FINALRSBETA.Models;
using FINALRSBETA.Models.Dto;
using FINALRSBETA.UtilityService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FINALRSBETA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        public UserController(AppDbContext appDbContext, IConfiguration configuration, IEmailService emailService)
        {
            _authContext = appDbContext;
            _configuration = configuration;
            _emailService = emailService;
        }
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();

            var user = await _authContext.Users
                .FirstOrDefaultAsync(x => x.Email == userObj.Email);
            if (user == null)
                return NotFound(new { Message = "მომხმარებელი არ მოიძებება!" });

            if (!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
                return BadRequest(new { Message = "პაროლი არასწორია!" });

            user.Token = CreateJwt(user);

            return Ok(new
            {
                Token=user.Token,
                Message = "მოგესალმებით!"
            });

        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();
            //Check Email
            if (await CheckUserNameExistAsync(userObj.Email))
                return BadRequest(new { Message = "მეილი უკვე დარეგისტრირებულია!" });
            //check UserId
            var usr = CheckUserIDStrength(userObj.UserId);

            if (await CheckUserIdExistAsync(userObj.UserId))
                return BadRequest(new { Message = "პირადი ნომერი უკვე დარეგისტრირებულია!" });

            if (!string.IsNullOrEmpty(usr))
                return BadRequest(new { Message = usr.ToString() });

            //Check password Strength
            var pass = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new { Message = pass.ToString() });



            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";
            await _authContext.Users.AddAsync(userObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "თქვენ დარეგისტრირდით!"
            });
        }
        private Task<bool> CheckUserNameExistAsync(string email)
            => _authContext.Users.AnyAsync(x => x.Email == email);
        private Task<bool> CheckUserIdExistAsync(string userid)
            => _authContext.Users.AnyAsync(x => x.UserId == userid);
        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
                sb.Append("პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო" + Environment.NewLine);
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]")
                && Regex.IsMatch(password, "[0-9]")))
                sb.Append("პაროლი უნდა შეიცავდეს,დიდ-პატარა ასოს და რიცხვს" + Environment.NewLine);
            if (!Regex.IsMatch(password, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,',\\,.,/,~,`,-,=]"))
                sb.Append("პაროლი უნდა შეიცავდეს სიმბოლოს!" + Environment.NewLine);
            return sb.ToString();
        }
        private string CheckUserIDStrength(string userId)
        {
            StringBuilder ib = new StringBuilder();
            if (userId.Length < 11)
                ib.Append("პირადობა უნდა შეიცავდეს 11 რიცხვს" + Environment.NewLine);
            if (userId.Length > 11)
                ib.Append("პირადობა უნდა შეიცავდეს 11 რიცხვს" + Environment.NewLine);
            //if ((Regex.IsMatch(userId, "[0-9]")))
            //    ib.Append("პირადობა უნდა შეიცავდეს მხოლოდ რიცხვებს" + Environment.NewLine);
            //if ((Regex.IsMatch(userId, "[a-z]") && Regex.IsMatch(userId, "[A-Z]")))
            //    ib.Append("პირადობა უნდა შეიცავდეს მხოლოდ რიცხვებს" + Environment.NewLine);
            return ib.ToString();
        }

        private string CreateJwt(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret......");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.FirstName} { user.LastName}")
            });
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddMinutes(30),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsers()
        {
            return Ok(await _authContext.Users.ToListAsync());
        }
        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(a=> a.Email == email);
            if(user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "email Doesn't Exist"
                });
            }
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(4);
            string from = _configuration["EmailSettings:From"];
            var emailModule = new EmailModel(email, "Reset Password!", EmailBody.EmailStringBody(email, emailToken));
            _emailService.SendEmail(emailModule);
            _authContext.Entry(user).State= EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _authContext.Users.AsNoTracking().FirstOrDefaultAsync(a => a.Email == resetPasswordDto.Email);
            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User Doesn't Exist"
                });
            }
            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiry;
            if(tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Invalid Reset Link"
                });
            }
            user.Password = PasswordHasher.HashPassword(resetPasswordDto.NewPassword);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Reset Succesfully"
            });
        }
    }
}
