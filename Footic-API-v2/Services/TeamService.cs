using footic.DTOs.teams;
using footic.EData;
using footic.Models;
using Microsoft.EntityFrameworkCore;

namespace footic.Services
{
    public class TeamService
    {
        private readonly PlSimulationDbContext _context;
        public TeamService(PlSimulationDbContext context)
        {
            _context = context;
        }
        public async Task<TeamDetailsDTO> GetTeamDetailsAsync(int teamId)
        {
            // 1. جلب بيانات الفريق الأساسية مع الإحصائيات واللاعبين في Query واحدة
            var team = await _context.Teams
         .Include(t => t.TeamStat)
         .Include(t => t.Players)
         .Include(t => t.League)
         .Include(t => t.Stadium) // ضروري جداً لمنع الـ Null
         .AsNoTracking()
         .FirstOrDefaultAsync(t => t.TeamId == teamId);

            if (team == null) return null;

            // 2. جلب الماتشات اللي خلصت عشان نحسب الـ Form Guide
            var finishedMatches = await _context.Matches
                .Where(m => (m.HomeTeamId == teamId || m.AwayTeamId == teamId) && m.Status == (int)MatchState.Finished)
                .OrderByDescending(m => m.MatchDate)
                .Take(5)
                .ToListAsync();

            // 3. جلب الماتش القادم
            var nextMatch = await _context.Matches
                //.Include(m => m.HomeTeam)
                //.Include(m => m.AwayTeam)
                .Where(m => (m.HomeTeamId == teamId || m.AwayTeamId == teamId) && m.Status == (int)MatchState.Upcoming)
                .OrderBy(m => m.MatchDate)
                .FirstOrDefaultAsync();

            string opponentLogo = null;
if (nextMatch != null)
{
    // لو الفريق الحالي هو صاحب الأرض (Home)، يبقى الخصم هو الـ Away والعكس
    int? opponentId = (nextMatch.HomeTeamId == teamId) ? nextMatch.AwayTeamId : nextMatch.HomeTeamId;

    opponentLogo = await _context.Teams
        .Where(t => t.TeamId == opponentId)
        .Select(t => t.Logo)
        .FirstOrDefaultAsync();
}

            // 4. بناء الـ DTO النهائي
            return new TeamDetailsDTO
            {
                Header = new TeamHeaderDTO
                {
                    TeamName = team.Tname,
                    TeamLogo = team.Logo,
                    CoachName = team.Coach, // ممكن تخليه متغير من الداتا بيز
                    StadiumName = team.Stadium?.Sname,
                    LeagueName = team.League?.Lname,
                    FormGuide = finishedMatches.Select(m => GetResultChar(teamId, m)).ToList(),
                    NextMatch = nextMatch == null ? null : new NextMatchDTO
                    {
                        OpponentLogo = opponentLogo, // هنا بنستخدم اللوجو اللي جبناه يدوي
                        MatchDate = nextMatch.MatchDate
                    }
                },
                Stats = new TeamQuickStatsDTO
                {
                    MatchesPlayed = (team.TeamStat?.WinsNumber ?? 0)+ (team.TeamStat?.LoseNumber ?? 0)+ (team.TeamStat?.DrawNumber ?? 0),
                    GoalsScored = team.TeamStat?.GoalsFor ?? 0,
                    GoalsConceded = team.TeamStat?.GoalsAgainst ?? 0,
                    TotalMarketValue = "€38.35m"
                },
               
            };
        }
        private char GetResultChar(int teamId, Match match)
        {
            if (match.HomeTeamScore == match.AwayTeamScore) return 'D';
            bool isWinner = (match.HomeTeamId == teamId && match.HomeTeamScore > match.AwayTeamScore) ||
                            (match.AwayTeamId == teamId && match.AwayTeamScore > match.HomeTeamScore);
            return isWinner ? 'W' : 'L';
        }


    }
}
