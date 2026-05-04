using System.Text.RegularExpressions;
using footic.DTOs.Match;
using footic.EData;
using footic.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileSystemGlobbing;

namespace footic.Services
{
    public class MatchService
    {
        private readonly PlSimulationDbContext _context;
        public MatchService(PlSimulationDbContext context)
        {
            _context = context;
        }
        //return all matches
        public async Task<List<MatchDTO>> GetallMatches()
        {
            var matches = await _context.Matches.AsNoTracking().ToListAsync();
            var returnedmatches = matches.Select(Match => new MatchDTO
            {
                Id = Match.MatchId,
                HomeTeamID = Match.HomeTeamId,
                AwayTeamID = Match.AwayTeamId,
                HomeTeamScore = Match.Status == (int)MatchState.Finished ? Match.HomeTeamScore : null,
                AwayTeamScore = Match.Status == (int)MatchState.Finished ? Match.AwayTeamScore : null,
                MatchState = Match.Status,
                Matchdate = Match.MatchDate,
                Matchtime= Match.MatchTime,
                stadiumID = Match.StadiumId,
                week = Match.Week
            }).ToList();

            return returnedmatches;
        }

        public async Task<MatchDTO> GetMatchById(int matchid)
        {

            var match = await _context.Matches
           .Include(m => m.HomeTeam)
           .Include(m => m.AwayTeam)
           .Include(m => m.Stadium)
           .AsNoTracking()
           .FirstOrDefaultAsync(m => m.MatchId == matchid);

            if (match == null) return null;

            bool showScore = match.Status == (int)MatchState.Finished || match.Status == (int)MatchState.Live || match.Status == (int)MatchState.Upcoming || match.Status == (int)MatchState.Postponed;

            return new MatchDTO
            {
                Id = match.MatchId,
                HomeTeamID = match.HomeTeamId,
                AwayTeamID = match.AwayTeamId,

                // إخفاء الأهداف لو المباراة لم تبدأ بعد
                HomeTeamScore = showScore ? match.HomeTeamScore : null,
                AwayTeamScore = showScore ? match.AwayTeamScore : null,

                MatchState = match.Status,
                Matchdate = match.MatchDate,
                Matchtime = match.MatchTime,
                stadiumID = match.StadiumId,
                week = match.Week

            };
        }
            // إرجاع كل مباريات فريق معين بناءً على معرف الفريق
            public async Task<List<MatchDTO>> GetMatchesByTeamId(int teamId)
        {
            // البحث عن المباريات التي يكون فيها الفريق طرفاً (سواء أرض أو ضيف)
            var matches = await _context.Matches
                .AsNoTracking()
                .Where(m => m.HomeTeamId == teamId || m.AwayTeamId == teamId)
                .OrderBy(m => m.MatchDate) // ترتيب المباريات حسب التاريخ
                .ToListAsync();

            // تحويل البيانات إلى DTO
            var returnedMatches = matches.Select(match => new MatchDTO
            {
                Id = match.MatchId,
                HomeTeamID = match.HomeTeamId,
                AwayTeamID = match.AwayTeamId,
                // إظهار النتيجة فقط إذا كانت المباراة قد انتهت (بناءً على منطق الكود السابق لديك)
                HomeTeamScore = match.Status == (int)MatchState.Finished ? match.HomeTeamScore : null,
                AwayTeamScore = match.Status == (int)MatchState.Finished ? match.AwayTeamScore : null,
                MatchState = match.Status,
                Matchdate = match.MatchDate,
                Matchtime = match.MatchTime,
                stadiumID = match.StadiumId,
                week = match.Week
            }).ToList();

            return returnedMatches;
        }

    }
}

