using footic.EData;
using footic.Models;
using footic.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace footic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchesSimulationController : ControllerBase
    {
        private readonly MatchSimulationService _simulationService;
        private readonly PlSimulationDbContext _context;

        public MatchesSimulationController(
            MatchSimulationService simulationService,
            PlSimulationDbContext context)
        {
            _simulationService = simulationService;
            _context = context;
        }

        [HttpPost("simulate/{id}")]
        public async Task<IActionResult> Simulate(int id)
        {
            try
            {
                await _simulationService.SimulateMatchAsync(id);
                return Ok(new { message = "Match simulation completed successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // =============== أضف هذه الـ Endpoints الجديدة ===============

        [HttpPost("simulate-week/{weekNumber}")]
        public async Task<IActionResult> SimulateWeek(int weekNumber)
        {
            try
            {
                // جلب جميع مباريات الأسبوع التي لم تنتهِ بعد
                var weekMatches = await _context.Matches
                    .Where(m => m.Week == weekNumber && m.Status != (int)MatchState.Finished)
                    .ToListAsync();

                if (!weekMatches.Any())
                {
                    return Ok(new 
                    { 
                        message = $"No pending matches found for week {weekNumber}",
                        matches = 0 
                    });
                }

                // محاكاة كل مباراة
                foreach (var match in weekMatches)
                {
                    await _simulationService.SimulateMatchAsync(match.MatchId);
                }

                // حفظ الترتيب بعد الأسبوع
                var leagueStandingService = new LeagueStandingService(_context);
                await leagueStandingService.SaveWeeklyStandings(weekNumber);

                return Ok(new 
                { 
                    message = $"Week {weekNumber} simulated successfully!", 
                    matches = weekMatches.Count,
                    weekNumber = weekNumber
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("simulate-all")]
        public async Task<IActionResult> SimulateAllMatches()
        {
            try
            {
                // جلب جميع المباريات التي لم تنتهِ بعد
                var allMatches = await _context.Matches
                    .Where(m => m.Status != (int)MatchState.Finished)
                    .OrderBy(m => m.Week)
                    .ThenBy(m => m.MatchId)
                    .ToListAsync();

                if (!allMatches.Any())
                {
                    return Ok(new 
                    { 
                        message = "No pending matches found. All matches are already finished!",
                        matches = 0 
                    });
                }

                // تجميع المباريات حسب الأسبوع
                var weeks = allMatches.GroupBy(m => m.Week).OrderBy(g => g.Key);

                var results = new List<object>();

                foreach (var weekGroup in weeks)
                {
                    var weekNumber = weekGroup.Key;
                    var weekMatches = weekGroup.ToList();

                    foreach (var match in weekMatches)
                    {
                        await _simulationService.SimulateMatchAsync(match.MatchId);
                    }

                    // حفظ الترتيب بعد كل أسبوع
                    var leagueStandingService = new LeagueStandingService(_context);
                    await leagueStandingService.SaveWeeklyStandings(weekNumber);

                    results.Add(new 
                    { 
                        week = weekNumber, 
                        matches = weekMatches.Count 
                    });
                }

                return Ok(new 
                { 
                    message = $"All matches simulated successfully! Total: {allMatches.Count} matches",
                    totalMatches = allMatches.Count,
                    weeks = results
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpPost("simulate-range")]
        public async Task<IActionResult> SimulateRange([FromQuery] int fromWeek, [FromQuery] int toWeek)
        {
            try
            {
                var allMatches = await _context.Matches
                    .Where(m => m.Week >= fromWeek && m.Week <= toWeek && m.Status != (int)MatchState.Finished)
                    .OrderBy(m => m.Week)
                    .ThenBy(m => m.MatchId)
                    .ToListAsync();

                if (!allMatches.Any())
                {
                    return Ok(new 
                    { 
                        message = $"No pending matches found for weeks {fromWeek} to {toWeek}",
                        matches = 0 
                    });
                }

                var weeks = allMatches.GroupBy(m => m.Week).OrderBy(g => g.Key);
                var results = new List<object>();

                foreach (var weekGroup in weeks)
                {
                    var weekNumber = weekGroup.Key;
                    var weekMatches = weekGroup.ToList();

                    foreach (var match in weekMatches)
                    {
                        await _simulationService.SimulateMatchAsync(match.MatchId);
                    }

                    var leagueStandingService = new LeagueStandingService(_context);
                    await leagueStandingService.SaveWeeklyStandings(weekNumber);

                    results.Add(new 
                    { 
                        week = weekNumber, 
                        matches = weekMatches.Count 
                    });
                }

                return Ok(new 
                { 
                    message = $"Weeks {fromWeek} to {toWeek} simulated successfully!",
                    totalMatches = allMatches.Count,
                    weeks = results
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("auto-create-squads")]
        public async Task<IActionResult> AutoCreateSquads()
        {
            try
            {
                var matches = await _context.Matches
                    .Where(m => m.Status != (int)MatchState.Finished)
                    .ToListAsync();

                var results = new List<object>();

                foreach (var match in matches)
                {
                    var existingSquads = await _context.MatchSquads
                        .Where(s => s.MatchId == match.MatchId)
                        .ToListAsync();

                    if (existingSquads.Any())
                    {
                        results.Add(new { matchId = match.MatchId, status = "already_has_squads" });
                        continue;
                    }

                    var homeTeamPlayers = await _context.Players
                        .Where(p => p.TeamId == match.HomeTeamId)
                        .ToListAsync();

                    var awayTeamPlayers = await _context.Players
                        .Where(p => p.TeamId == match.AwayTeamId)
                        .ToListAsync();

                    await CreateSquadForTeam(match.MatchId, match.HomeTeamId, homeTeamPlayers);
                    await CreateSquadForTeam(match.MatchId, match.AwayTeamId, awayTeamPlayers);

                    results.Add(new { matchId = match.MatchId, status = "created", homePlayers = homeTeamPlayers.Count, awayPlayers = awayTeamPlayers.Count });
                }

                return Ok(new { message = "Squads created successfully", results });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

                private async Task CreateSquadForTeam(int matchId, int teamId, List<Player> players)
        {
            var squad = new MatchSquad
            {
                MatchId = matchId,
                TeamId = teamId,
                Substitutions = 0
            };

            _context.MatchSquads.Add(squad);
            await _context.SaveChangesAsync();

            var starters = players
                .OrderByDescending(p => p.Poweer ?? 0)
                .Take(11)
                .ToList();

            foreach (var player in players)
            {
                var squadPlayer = new MatchSquadPlayer
                {
                    MatchSquadId = squad.Id,
                    PlayerId = player.PlayerId,
                    IsStarter = starters.Contains(player),
                    IsCaptain = player.PlayerId == starters.FirstOrDefault()?.PlayerId
                };
                _context.MatchSquadPlayers.Add(squadPlayer);
            }

            await _context.SaveChangesAsync();
        }
    }
}