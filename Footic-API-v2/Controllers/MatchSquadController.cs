using footic.DTOs.squad;
using footic.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace footic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchSquadController : ControllerBase
    {
        private readonly MatchSquadService _matchSquadService;

        public MatchSquadController(MatchSquadService matchSquadService)
        {
            _matchSquadService = matchSquadService;
        }

        // 1. POST: api/MatchSquad/set-lineup
        [HttpPost("set-lineup")]
        public async Task<IActionResult> SetLineup([FromBody] SetLineupRequest request)
        {
            var result = await _matchSquadService.SetInitialLineup(request.MatchId, request.TeamId, request.SelectedStarterIds);

            if (result == "Success")
                return Ok(new { Message = "تم حفظ التشكيلة بنجاح" });

            return BadRequest(new { Message = result });
        }

        // 2. GET: api/MatchSquad/full-squad/5/1
        [HttpGet("full-squad/{matchId}/{teamId}")]
        public async Task<IActionResult> GetFullSquad(int matchId, int teamId)
        {
            var squad = await _matchSquadService.GetFullSquad(matchId, teamId);

            if (squad == null)
                return NotFound(new { Message = "لم يتم العثور على تشكيلة لهذه المباراة" });

            return Ok(squad);
        }

        // 3. POST: api/MatchSquad/substitute
        [HttpPost("substitute")]
        public async Task<IActionResult> PerformSub([FromBody] SubstitutionRequest request)
        {
            var result = await _matchSquadService.PerformSubstitution(
                request.MatchId,
                request.TeamId,
                request.PlayerOutId,
                request.PlayerInId);

            if (result.StartsWith("Success"))
            {
                // فصل رسالة النجاح عن التنبيه إن وجد
                var parts = result.Split(':');
                return Ok(new
                {
                    Message = "تم التبديل بنجاح",
                    Warning = parts.Length > 1 ? parts[1] : null
                });
            }

            return BadRequest(new { Message = result });
        }
    }
}