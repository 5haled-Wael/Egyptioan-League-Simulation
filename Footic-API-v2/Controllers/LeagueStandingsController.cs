using footic.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace footic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeagueStandingsController : ControllerBase
    {
        private readonly LeagueStandingService _leaguestandingservice;
        public LeagueStandingsController(LeagueStandingService leaguestandingservice) { 
        
         _leaguestandingservice = leaguestandingservice;
        
        }
        [HttpGet("standings")]
       //get standing
       //api/leauestandings/standings
        public async Task<IActionResult> GetStandings()
        {
            var reasult = await _leaguestandingservice.GetStandingAsync();
            return Ok(reasult);
        }
        [HttpGet("heighst")]
        //api/leauestandings/heighst
        public async Task<IActionResult> GetHighst()
        {
            var heighst = await _leaguestandingservice.Get_Highst_Async();
            return Ok(heighst);
        }

        [HttpGet("leader")]
        //api/leauestandings/leader
        public async Task<IActionResult> Getleader()
        {
            var leader = await _leaguestandingservice.GetLeagueLeaderAsync();
            return Ok(leader);
        }

        [HttpGet("progress")]
        public async Task<IActionResult> progress()
        {
            var progress = await _leaguestandingservice.CalculateLeagueProgressAsync();
            return Ok(progress);
        }

        [HttpGet("standings/week/{weekNumber}")]
        public async Task<IActionResult> GetStandingsByWeek(int weekNumber)
        {
            var result = await _leaguestandingservice.GetStandingsByWeekAsync(weekNumber);
            return Ok(result);
        }

        [HttpGet("standings/current")]
        public async Task<IActionResult> GetCurrentStandings()
        {
            var result = await _leaguestandingservice.GetCurrentStandingsAsync();
            return Ok(result);
        }
    }
}
