using footic.DTOs.Match;
using footic.EData;
using footic.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace footic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        private readonly MatchService _matchservice;
        private readonly PlSimulationDbContext _context;
        private readonly CreateMatchesService _creatematchservice;

        public MatchController(MatchService matchservice, PlSimulationDbContext context, CreateMatchesService creatematchservice )
        {
            _matchservice = matchservice;
            _context = context;
            _creatematchservice = creatematchservice;
        }
        [HttpGet("all-matches")]
        public async Task<ActionResult<List<MatchDTO>>> GetAll()
        {

            var matches = await _matchservice.GetallMatches();

            if (matches == null || !matches.Any())
            {
                return Ok(new List<MatchDTO>());
            }

            return Ok(matches);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MatchDTO>> GetById(int id)
        {
            var match = await _matchservice.GetMatchById(id);

            if (match == null)
            {
                return NotFound(new { message = $"Match with ID {id} was not found." });
            }

            return Ok(match);



        }
        [HttpPost("generate-and-save-schedule")]
        public async Task<IActionResult> GenerateAndSaveSchedule()
        {
            // 1. التأكد أن الجدول فارغ (عشان الـ Endpoint تشتغل مرة واحدة فقط)
            // ده إجراء أمان سينيور عشان ما نكررش الجدول مرتين بالخطأ
            var existingMatches = await _context.Matches.AnyAsync();
            if (existingMatches)
            {
                return BadRequest("الجدول مولد ومحفوظ بالفعل في قاعدة البيانات. لا يمكنك تشغيل هذه العملية مرة أخرى.");
            }

            try
            {
                // 2. تحميل البيانات وتوليد الجدول في الميموري
                await _creatematchservice.InitializeData();
                var schedule = _creatematchservice.Schedule();

                if (schedule == null || !schedule.Any())
                {
                    return BadRequest("فشل في توليد المباريات. تأكد من وجود فرق وملاعب كافية.");
                }

                // 3. حفظ الجدول الناتج فوراً
                // ملحوظة: ميثود الـ SaveGeneratedMatches بتاخد قائمة DTOs والـ Schedule بيرجع قائمة DTOs
                int savedCount = await _creatematchservice.SaveGeneratedMatches(schedule);

                return Ok(new
                {
                    message = $"تم توليد وحفظ {savedCount} مباراة بنجاح.",
                    details = "تم إغلاق عملية التوليد لهذا الموسم."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"حدث خطأ تقني: {ex.Message}");
            }
        }
        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetMatchesByTeam(int teamId)
        {
            var matches = await _matchservice.GetMatchesByTeamId(teamId);

            if (matches == null || !matches.Any())
            {
                return NotFound($"No matches found for team with ID {teamId}");
            }

            return Ok(matches);
        }


    }
}
