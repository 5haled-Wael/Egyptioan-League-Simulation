//using System.ComponentModel.DataAnnotations;

//namespace footic.DTOs.USER
//{
//    public class UserDto
//    {
//        public required string UserName { get; set; }
//        public required string Password { get; set; }
//        public required string Email { get; set; }
//        public int? TeamId { get; set; }
//    }
//}
using System.ComponentModel.DataAnnotations;

public class UserDto
{
    [Required(ErrorMessage = "اسم المستخدم مطلوب")]
    [StringLength(20, MinimumLength = 3, ErrorMessage = "الاسم يجب أن يكون بين 3 و 20 حرف")]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "صيغة البريد الإلكتروني غير صحيحة")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8, ErrorMessage = "كلمة المرور لا يمكن أن تقل عن 8 أحرف")]
    public string Password { get; set; } = string.Empty;

    public int? TeamId { get; set; }
}