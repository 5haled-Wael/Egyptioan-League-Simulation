using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using footic.DTOs.USER;
using footic.EData;
using footic.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto.Generators;

namespace footic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PlSimulationDbContext _context; // استبدله بسياق قاعدة بياناتك
        private readonly IConfiguration _configuration;

        public AuthController(PlSimulationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            if (await _context.Users.AnyAsync(u => u.UserName == request.UserName))
            {
                return BadRequest("اسم المستخدم هذا مأخوذ بالفعل، اختر اسماً آخر.");
            }

            // التأكد من عدم تكرار البريد الإلكتروني
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("هذا البريد الإلكتروني مسجل مسبقاً.");
            }
            if (request.TeamId.HasValue)
            {
                var teamExists = await _context.Teams.AnyAsync(t => t.TeamId == request.TeamId);
                if (!teamExists)
                {
                    return BadRequest("رقم الفريق المختار غير موجود في الدوري.");
                }
            }
            // 1. تشفير كلمة المرور باستخدام BCrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                UserName = request.UserName.Trim(),
                Upassword = hashedPassword, // حفظ الـ Hash وليس النص الصريح
                Email = request.Email.Trim().ToLower(),
                UserType = "User", // القيمة الافتراضية
                TeamId = request.TeamId
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully!");
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);

            if (user == null) return BadRequest("User not found.");

            // 2. التحقق من كلمة المرور
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Upassword))
            {
                return BadRequest("Wrong password.");
            }

            // 3. إنشاء التوكن
            string token = CreateToken(user);
            return Ok(token);
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.UserType), // استخدام UserType كصلاحية
            new Claim("FavoriteTeamId", user.TeamId.ToString() ?? "0") // معلومة إضافية
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
