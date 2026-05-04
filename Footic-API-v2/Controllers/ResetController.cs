using footic.EData;
using footic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace footic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResetController : ControllerBase
    {
        private readonly PlSimulationDbContext _context;

        public ResetController(PlSimulationDbContext context)
        {
            _context = context;
        }

        [HttpPost("reset-season")]
        public async Task<IActionResult> ResetSeason()
        {
            try
            {
                // ========== IMPORTANT: نحافظ على التشكيلات ==========
                // مش بنمسح MatchSquadPlayers ولا MatchSquads عشان نسرع العملية
                // ===================================================

                // 1. امسح LeagueStandingsHistory (الترتيب التاريخي)
                await _context.LeagueStandingsHistory.ExecuteDeleteAsync();

                // 2. امسح PlayerStats (إحصائيات اللاعبين - الهدافين)
                await _context.PlayerStats.ExecuteDeleteAsync();

                // 3. Reset TeamStats (إحصائيات الفرق)
                await _context.TeamStats.ExecuteUpdateAsync(t => t
                    .SetProperty(x => x.WinsNumber, 0)
                    .SetProperty(x => x.DrawNumber, 0)
                    .SetProperty(x => x.LoseNumber, 0)
                    .SetProperty(x => x.GoalsFor, 0)
                    .SetProperty(x => x.GoalsAgainst, 0)
                    .SetProperty(x => x.Points, 0)
                    .SetProperty(x => x.Position, 0)
                    .SetProperty(x => x.PreviousPosition, 0)
                    .SetProperty(x => x.CleanSheets, 0)
                );

                // 4. Reset الـ Matches (نتائج المباريات)
                await _context.Matches.ExecuteUpdateAsync(m => m
                    .SetProperty(x => x.HomeTeamScore, 0)
                    .SetProperty(x => x.AwayTeamScore, 0)
                    .SetProperty(x => x.Status, 0)
                );

                // 5. Reset الـ Player Fit (اللياقة البدنية)
                await _context.Players.ExecuteUpdateAsync(p => p
                    .SetProperty(x => x.Fit, 100)
                );

                return Ok(new { 
                    message = "✅ Season reset successfully! Squads preserved for faster simulation.",
                    details = new
                    {
                        matchesReset = true,
                        standingHistoryReset = true,
                        playerStatsReset = true,
                        teamStatsReset = true,
                        squadsPreserved = true,  // التشكيلات محفوظة
                        playersFitReset = true
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Reset كامل (مع حذف التشكيلات) - يستخدم مرة واحدة بس أو عند الحاجة
        [HttpPost("reset-hard")]
        public async Task<IActionResult> ResetHard()
        {
            try
            {
                // 1. امسح التشكيلات
                await _context.MatchSquadPlayers.ExecuteDeleteAsync();
                await _context.MatchSquads.ExecuteDeleteAsync();

                // 2. امسح LeagueStandingsHistory
                await _context.LeagueStandingsHistory.ExecuteDeleteAsync();

                // 3. امسح PlayerStats
                await _context.PlayerStats.ExecuteDeleteAsync();

                // 4. Reset TeamStats
                await _context.TeamStats.ExecuteUpdateAsync(t => t
                    .SetProperty(x => x.WinsNumber, 0)
                    .SetProperty(x => x.DrawNumber, 0)
                    .SetProperty(x => x.LoseNumber, 0)
                    .SetProperty(x => x.GoalsFor, 0)
                    .SetProperty(x => x.GoalsAgainst, 0)
                    .SetProperty(x => x.Points, 0)
                    .SetProperty(x => x.Position, 0)
                    .SetProperty(x => x.PreviousPosition, 0)
                    .SetProperty(x => x.CleanSheets, 0)
                );

                // 5. Reset المباريات
                await _context.Matches.ExecuteUpdateAsync(m => m
                    .SetProperty(x => x.HomeTeamScore, 0)
                    .SetProperty(x => x.AwayTeamScore, 0)
                    .SetProperty(x => x.Status, 0)
                );

                // 6. Reset لياقة اللاعبين
                await _context.Players.ExecuteUpdateAsync(p => p
                    .SetProperty(x => x.Fit, 100)
                );

                return Ok(new { 
                    message = "✅ Hard reset completed! All data including squads cleared.",
                    details = new
                    {
                        matchesReset = true,
                        standingHistoryReset = true,
                        playerStatsReset = true,
                        teamStatsReset = true,
                        squadsReset = true,
                        playersFitReset = true
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}