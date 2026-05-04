using footic.EData;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace footic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        private readonly IplayerService _playerService;

        public PlayerController(IplayerService playerService)
        {
            _playerService = playerService;
        }
        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetByTeam(int teamId)
        {
            var players = await _playerService.GetPlayersByTeamIdAsync(teamId);

            
            if (players == null) return NotFound("Team not found or has no players.");

            return Ok(players);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlayer(int id)
        {
            var player = await _playerService.GetPlayerByIdAsync(id);
            if (player == null) return NotFound("اللاعب غير موجود");

            return Ok(player);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var players = await _playerService.GetAllPlayersAsync();
            return Ok(players);
        }
        [HttpGet("with-stats")]
        public async Task<IActionResult> GetAllPlayersWithStats()
        {
            var players = await _playerService.GetAllPlayersWithStatsAsync();
            return Ok(players);
        }
        [HttpGet("top-scorers")]
        public async Task<IActionResult> GetTopScorers([FromQuery] int limit = 10)
        {
            var topScorers = await _playerService.GetTopScorersAsync(limit);
            return Ok(topScorers);
        }

        [HttpGet("top-scorers/league/{leagueId}")]
        public async Task<IActionResult> GetTopScorersByLeague(int leagueId, [FromQuery] int limit = 10)
        {
            var topScorers = await _playerService.GetTopScorersByLeagueAsync(leagueId, limit);
            return Ok(topScorers);
        }
    }
}
