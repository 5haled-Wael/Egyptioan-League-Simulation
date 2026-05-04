using footic.DTOs.League;
using footic.EData;
using footic.Models;
using Microsoft.EntityFrameworkCore;

namespace footic.Services
{
    public class LeagueStandingService
    {
        private readonly PlSimulationDbContext _context;
        public LeagueStandingService(PlSimulationDbContext context)
        {
            _context = context;
        }

        public async Task<List<LeaueStandingDTO>> GetStandingAsync()
        {
            // جلب الفرق مع إحصائياتها
            var teams = await _context.Teams
                .Include(t => t.TeamStat)
                .AsNoTracking()
                .ToListAsync();

            // جلب كل المباريات المنتهية
            var allFinishedMatches = await _context.Matches
                .Where(m => m.Status == (int)MatchState.Finished)
                .OrderByDescending(m => m.MatchDate)
                .AsNoTracking()
                .ToListAsync();

            var standings = teams.Select(team => new LeaueStandingDTO
            {
                TeamId = team.TeamId,
                TeamName = team.Tname,
                LogoUrl = team.Logo ?? "",
                
                Played = (team.TeamStat?.WinsNumber ?? 0) + 
                        (team.TeamStat?.DrawNumber ?? 0) + 
                        (team.TeamStat?.LoseNumber ?? 0),
                
                Won = team.TeamStat?.WinsNumber ?? 0,
                Drawn = team.TeamStat?.DrawNumber ?? 0,
                Lost = team.TeamStat?.LoseNumber ?? 0,
                GoalsFor = team.TeamStat?.GoalsFor ?? 0,
                GoalsAgainst = team.TeamStat?.GoalsAgainst ?? 0,
                Points = team.TeamStat?.Points ?? 0,
                // لا تحدد GoalDifference هنا لأنه Read Only
                
                LastFiveMatches = allFinishedMatches
                    .Where(m => m.HomeTeamId == team.TeamId || m.AwayTeamId == team.TeamId)
                    .Take(5)
                    .Select(m => GetResultChar(team.TeamId, m))
                    .ToList()
            }).ToList();

            // حساب الترتيب وتعيين Position
            var sortedStandings = standings
                .OrderByDescending(s => s.Points)
                .ThenByDescending(s => s.GoalDifference)
                .ThenByDescending(s => s.GoalsFor)
                .ThenBy(s => s.TeamName)
                .ToList();

            // تعيين Position لكل فريق
            for (int i = 0; i < sortedStandings.Count; i++)
            {
                sortedStandings[i].Position = i + 1;
            }

            return sortedStandings;
        }

        public async Task<LeagueHighstDTO> Get_Highst_Async()
        {
            // تحديث المراكز أولاً
            await UpdateTeamStatsPositions();
            
            var teams = await _context.Teams
                .Include(t => t.TeamStat)
                .AsNoTracking()
                .ToListAsync();
                
            var matches = await _context.Matches
                .Where(m => m.Status == (int)MatchState.Finished)
                .AsNoTracking()
                .ToListAsync();

            return new LeagueHighstDTO 
            {
                TopScoring = GetTopScorer(teams),
                BestDefense = GetBestDefense(teams),
                TopClimber = GetTopClimber(teams),
                TopSlider = GetTopSlider(teams),
                WorstDefense = GetWorstDefense(teams),
                BestGD = GetBestGD(teams),
                TopHomeWinner = GetTopHomeWinner(teams, matches),
                TopAwayWinner = GetTopAwayWinner(teams, matches),
            };
        }

        public async Task<LeaueLeaderDTO> GetLeagueLeaderAsync()
        {
            // جلب الفريق صاحب المركز الأول من TeamStats
            var leaderTeam = await _context.Teams
                .Include(t => t.TeamStat)
                .Include(t => t.Players)
                    .ThenInclude(p => p.PlayerStat)
                .OrderBy(t => t.TeamStat.Position)
                .FirstOrDefaultAsync();

            if (leaderTeam == null) return null;

            var topScorerInTeam = leaderTeam.Players?
                .Where(p => p.PlayerStat != null)
                .OrderByDescending(p => p.PlayerStat.Goals)
                .FirstOrDefault();

            return new LeaueLeaderDTO
            {
                TeamName = leaderTeam.Tname ?? "Unknown",
                TeamLogo = leaderTeam.Logo ?? "",
                Points = leaderTeam.TeamStat?.Points ?? 0,

                TopScorerName = topScorerInTeam?.Pname ?? "لا يوجد لاعبين",
                TopScorerGoals = topScorerInTeam?.PlayerStat?.Goals ?? 0,
                TopScorerImage = topScorerInTeam?.Pimage ?? "default-player.png"
            };
        }

        public async Task<int> CalculateLeagueProgressAsync(int leagueId=1)
        {
            // 1. نجيب إجمالي عدد الماتشات المفروض تتلعب في الدوري ده
            var totalMatches = 36;
                //await _context.Matches
                //.CountAsync(m => m.LeagueId==leagueId);

            if (totalMatches == 0) return 0;

            // 2. نجيب عدد الماتشات اللي خلصت فعلاً
            var finishedMatches = await _context.Matches
                .CountAsync(m => m.LeagueId == leagueId && m.Status ==(int)MatchState.Finished);

            // 3. النسبة المئوية للتقدم
            double progress = ((double)finishedMatches / totalMatches) * 100;

            return (int)Math.Round(progress);
        }
        // 1. وظيفة حفظ ترتيب الجدول للأسبوع الحالي (Snapshot)
        public async Task SaveWeeklyStandings(int weekNumber)
        {
            //من الأفضل دائماً التأكد من عدم حفظ بيانات لنفس الأسبوع مرتين إذا استدعيت الميثود بالخطأ. يمكنك إضافة هذا السطر في بداية
            var existingEntries = _context.LeagueStandingsHistory.Where(h => h.WeekNumber == weekNumber);
            if (existingEntries.Any())
            {
                _context.LeagueStandingsHistory.RemoveRange(existingEntries);
            }
            // جلب الترتيب الحالي مرتباً وجاهزاً باستخدام الميثود الموجودة فعلياً لديك
            var currentStandings = await GetStandingAsync();

            // تحويل البيانات من DTO إلى موديل التاريخ (History Model)
            // لاحظ استخدام اسم الموديل كما هو متوقع في قاعدة بياناتك
            var historyEntries = currentStandings.Select((s, index) => new LeagueStandingsHistory
            {
                WeekNumber = weekNumber,
                TeamId = s.TeamId,
                Played = s.Played,
                Won = s.Won,
                Drawn = s.Drawn,
                Lost = s.Lost,
                GoalsFor = s.GoalsFor,
                GoalsAgainst = s.GoalsAgainst,
                Points = s.Points,
                Position = index + 1 // الترتيب بناءً على النتيجة المرتبة من GetStandingAsync
            }).ToList();

            // إضافة البيانات للجدول المخصص وحفظ التغييرات
            _context.LeagueStandingsHistory.AddRange(historyEntries);
            await _context.SaveChangesAsync();
        }

        // 2. وظيفة استرجاع الترتيب الخاص بأسبوع معين
        public async Task<List<LeaueStandingDTO>> GetStandingsByWeekAsync(int weekNumber)
        {
            return await _context.LeagueStandingsHistory
                .AsNoTracking()
                .Where(h => h.WeekNumber == weekNumber)
                .OrderBy(h => h.Position)
                .Select(h => new LeaueStandingDTO
                {
                    TeamId = h.TeamId,
                    Points = h.Points,
                    Played = h.Played,
                    Won = h.Won,
                    Drawn = h.Drawn,
                    Lost = h.Lost,
                    GoalsFor = h.GoalsFor,
                    GoalsAgainst = h.GoalsAgainst,

                    // بما أن جدول التاريخ لا يخزن اسم الفريق واللوجو، سنحتاج لعمل Join مع جدول الفرق
                    TeamName = h.Team.Tname,
                    LogoUrl = h.Team.Logo
                })
                .ToListAsync();
        }
        public async Task<List<LeaueStandingDTO>> GetCurrentStandingsAsync()
        {
            var maxWeek = await _context.LeagueStandingsHistory
                .MaxAsync(h => (int?)h.WeekNumber) ?? 1;
            
            return await GetStandingsByWeekAsync(maxWeek);
        }
        private char GetResultChar(int teamId, Match match)
        {
            if (match.HomeTeamScore == match.AwayTeamScore) return 'D'; // تعادل

            // هل الفريق كان صاحب الأرض وكسب؟ أو كان الضيف وكسب؟
            bool isWinner = (match.HomeTeamId == teamId && match.HomeTeamScore > match.AwayTeamScore) ||
                           (match.AwayTeamId == teamId && match.AwayTeamScore > match.HomeTeamScore);

            return isWinner ? 'W' : 'L';
        }

        //calculate highst values
        #region helper functions
        //top scorer
        private HighstTeamDTO GetTopScorer(List<Team> teams)=>
            teams.OrderByDescending(t => t.TeamStat?.GoalsFor ?? 0)
             .Select(t => MapToHighlight(t, t.TeamStat?.GoalsFor ?? 0))
             .FirstOrDefault();
        //best defense
        private HighstTeamDTO GetBestDefense(List<Team> teams) =>
            teams.OrderBy(t => t.TeamStat?.GoalsAgainst ?? 0)
            .Select(t => MapToHighlight(t, t.TeamStat?.GoalsAgainst ?? 0)).FirstOrDefault();
        //worst defense
        private HighstTeamDTO GetWorstDefense(List<Team> teams) =>
        teams.OrderByDescending(t => t.TeamStat?.GoalsAgainst ?? 0)
             .Select(t => MapToHighlight(t, t.TeamStat?.GoalsAgainst ?? 0))
             .FirstOrDefault();
        //Best gaol difference
        private HighstTeamDTO GetBestGD(List<Team> teams) =>
        teams.OrderByDescending(t => (t.TeamStat?.GoalsFor ?? 0) - (t.TeamStat?.GoalsAgainst ?? 0))
             .Select(t => MapToHighlight(t, (t.TeamStat?.GoalsFor ?? 0) - (t.TeamStat?.GoalsAgainst ?? 0)))
             .FirstOrDefault();

        //Best home record
        private HighstTeamDTO GetTopHomeWinner(List<Team> teams, List<Match> matches)
        {
            var topTeamId = matches.Where(m => m.HomeTeamScore > m.AwayTeamScore)
                .GroupBy(m => m.HomeTeamId)
                .OrderByDescending(g => g.Count())
                .Select(g => new { Id = g.Key, Count = g.Count() })
                .FirstOrDefault();

            if (topTeamId == null) return null;
            var team = teams.First(t => t.TeamId == topTeamId.Id);
            return MapToHighlight(team, topTeamId.Count);
        }
        //best away record
        private HighstTeamDTO GetTopAwayWinner(List<Team> teams, List<Match> matches)
        {
            var topTeamId = matches.Where(m => m.AwayTeamScore > m.HomeTeamScore)
                .GroupBy(m => m.AwayTeamId)
                .OrderByDescending(g => g.Count())
                .Select(g => new { Id = g.Key, Count = g.Count() })
                .FirstOrDefault();

            if (topTeamId == null) return null;
            var team = teams.First(t => t.TeamId == topTeamId.Id);
            return MapToHighlight(team, topTeamId.Count);
        }
        //bigst climb
        private HighstTeamDTO GetTopClimber(List<Team> teams)
        {
            // 1. يفضل عمل الحسبة دي بطريقة Defensive
            var climber = teams
                .Where(t => t.TeamStat != null && t.TeamStat.PreviousPosition > 0) // تأكد إن فيه إحصائيات ومركز سابق
                .Select(team => new
                {
                    Team = team,
                    // بنستخدم الـ Position والـ PreviousPosition بأمان
                    Jump = (team.TeamStat.PreviousPosition) - (team.TeamStat.Position)
                })
                .Where(x => x.Jump > 0) // فلتر اللي طلعوا لفوق بس
                .OrderByDescending(x => x.Jump)
                .FirstOrDefault();

            // 2. عند الـ Return بنأمن الـ Mapping
            if (climber == null || climber.Team == null)
            {
                // رجع كائن فاضي أو قيم افتراضية بدل ما تضرب Error
                new HighstTeamDTO { TeamName = "No Climbers Yet", LogoUrl = "N/A", Value =0};
            }

            return MapToHighlight(climber.Team, climber.Jump);

        }
        //bigest drop
        private HighstTeamDTO GetTopSlider(List<Team> teams)
        {
            var climber = teams
                .Where(t => t.TeamStat != null && t.TeamStat.PreviousPosition > 0) // تأكد إن فيه إحصائيات ومركز سابق
                .Select(team => new
                {
                    Team = team,
                    // بنستخدم الـ Position والـ PreviousPosition بأمان
                    drop = (team.TeamStat.Position) - (team.TeamStat.PreviousPosition)
                })
                .Where(x => x.drop > 0) // فلتر اللي طلعوا لفوق بس
                .OrderByDescending(x => x.drop)
                .FirstOrDefault();

            // 2. عند الـ Return بنأمن الـ Mapping
            if (climber == null || climber.Team == null)
            {
                // رجع كائن فاضي أو قيم افتراضية بدل ما تضرب Error
                new HighstTeamDTO { TeamName = "No drop Yet", LogoUrl = "N/A", Value = 0 };
            }

            return MapToHighlight(climber.Team, climber.drop);

        }
        private HighstTeamDTO MapToHighlight(Team team, int value) =>
        new HighstTeamDTO { TeamName = team.Tname, LogoUrl = team.Logo, Value = value };
        #endregion


        public async Task UpdateTeamStatsPositions()
        {
            // جلب الترتيب الحالي مع المراكز
            var standings = await GetStandingAsync();
            
            // تحديث Position لكل فريق
            foreach (var standing in standings)
            {
                var teamStat = await _context.TeamStats
                    .FirstOrDefaultAsync(ts => ts.TeamStatsId == standing.TeamId);
                
                if (teamStat != null)
                {
                    teamStat.Position = standing.Position; // Position موجودة الآن
                }
            }
            
            await _context.SaveChangesAsync();
        }
    }
}

