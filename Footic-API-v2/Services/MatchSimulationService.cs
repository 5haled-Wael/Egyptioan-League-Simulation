using footic.EData;
using footic.Models;
using Microsoft.EntityFrameworkCore;

namespace footic.Services
{
    public class MatchSimulationService
    {
        private readonly PlSimulationDbContext _context;
        private static readonly Random random = new Random();

        public MatchSimulationService(PlSimulationDbContext context)
        {
            _context = context;
        }

        public async Task SimulateMatchAsync(int matchId)
        {
            // تحقق من وجود المباراة
            var match = await _context.Matches
                .FirstOrDefaultAsync(m => m.MatchId == matchId);
            
            await EnsureTeamStatsExist(match.HomeTeamId);
            await EnsureTeamStatsExist(match.AwayTeamId);

            if (match == null)
                throw new Exception($"Match with ID {matchId} not found");

            // جلب التشكيلات مع البيانات المطلوبة
            var squads = await _context.MatchSquads
                .Include(s => s.MatchSquadPlayers)
                    .ThenInclude(msp => msp.Player)
                        .ThenInclude(p => p.PlayerStat)
                .Where(s => s.MatchId == matchId)
                .ToListAsync();

            if (squads == null || squads.Count < 2)
                throw new Exception($"Match {matchId} does not have enough squads. Found: {squads?.Count ?? 0}");

            // تحديد الفريقين
            var homeSquad = squads.FirstOrDefault();
            var awaySquad = squads.LastOrDefault();

            if (homeSquad == null || awaySquad == null)
                throw new Exception("Could not identify home and away squads");

            // تحقق من وجود لاعبين في كل تشكيلة
            if (homeSquad.MatchSquadPlayers == null || !homeSquad.MatchSquadPlayers.Any(p => p.IsStarter == true))
            if (awaySquad.MatchSquadPlayers == null || !awaySquad.MatchSquadPlayers.Any(p => p.IsStarter == true))

            // تهيئة البيانات
            match.HomeTeamScore = 0;
            match.AwayTeamScore = 0;
            homeSquad.Substitutions = 0;
            awaySquad.Substitutions = 0;

            var goalScorers = new Dictionary<int, int>();

            // محاكاة المباراة
            for (int minute = 1; minute <= 90; minute++)
            {
                UpdateStamina(homeSquad);
                UpdateStamina(awaySquad);

                TryInjuries(homeSquad, minute);
                TryInjuries(awaySquad, minute);

                TryCards(homeSquad, minute);
                TryCards(awaySquad, minute);

                TryCreateChance(match, homeSquad, awaySquad, true, goalScorers);
                TryCreateChance(match, awaySquad, homeSquad, false, goalScorers);

                if (minute >= 60)
                {
                    TrySubstitution(homeSquad);
                    TrySubstitution(awaySquad);
                }
            }

            match.Status = (int)MatchState.Finished;
            _context.Matches.Update(match);
            
            // حفظ التغييرات أولاً
            await _context.SaveChangesAsync();

            // تحديث الترتيب وإحصائيات اللاعبين
            await UpdateStandingsAsync(match);
            await UpdatePlayerStatsAsync(squads, goalScorers);
            
            await _context.SaveChangesAsync();
        }

        // ... باقي الكود كما هو ...
        
        private void UpdateStamina(MatchSquad squad)
        {
            if (squad?.MatchSquadPlayers == null) return;
            
            foreach (var msp in squad.MatchSquadPlayers.Where(p => p.IsStarter == true))
            {
                if (msp.Player != null)
                {
                    msp.Player.Fit -= 1;
                    if (msp.Player.Fit < 0) msp.Player.Fit = 0;
                }
            }
        }

        private void TryInjuries(MatchSquad squad, int minute)
        {
            if (squad?.MatchSquadPlayers == null) return;
            
            foreach (var msp in squad.MatchSquadPlayers.Where(p => p.IsStarter == true).ToList())
            {
                if (msp.Player == null) continue;
                
                double injuryChance = 0.001 + (1 - (double)msp.Player.Fit / 100) * 0.01;
                if (random.NextDouble() <= injuryChance)
                    ForceSubstitution(squad, msp);
            }
        }

        private void TryCards(MatchSquad squad, int minute)
        {
            if (squad?.MatchSquadPlayers == null) return;
            
            foreach (var msp in squad.MatchSquadPlayers.Where(p => p.IsStarter == true).ToList())
            {
                if (random.NextDouble() < 0.02)
                    if (random.NextDouble() >= 0.95)
                        msp.IsStarter = false;
            }
        }

        private void TrySubstitution(MatchSquad squad)
        {
            if (squad?.MatchSquadPlayers == null) return;
            if (squad.Substitutions >= 5) return;

            var tiredMsp = squad.MatchSquadPlayers
                .Where(p => p.IsStarter == true && p.Player != null)
                .OrderBy(p => p.Player.Fit)
                .FirstOrDefault();

            if (tiredMsp == null || tiredMsp.Player.Fit > 40) return;

            var subMsp = squad.MatchSquadPlayers
                .Where(p => p.IsStarter == false && p.Player != null && p.Player.Position == tiredMsp.Player.Position)
                .OrderByDescending(p => p.Player.Poweer)
                .FirstOrDefault();

            if (subMsp != null)
            {
                tiredMsp.IsStarter = false;
                subMsp.IsStarter = true;
                squad.Substitutions++;
            }
        }

        private void ForceSubstitution(MatchSquad squad, MatchSquadPlayer injuredPlayer)
        {
            if (squad?.MatchSquadPlayers == null || injuredPlayer?.Player == null) return;
            
            if (squad.Substitutions >= 5)
            {
                injuredPlayer.IsStarter = false;
                return;
            }

            var subMsp = squad.MatchSquadPlayers
                .Where(p => p.IsStarter == false && p.Player != null && p.Player.Position == injuredPlayer.Player.Position)
                .FirstOrDefault();

            if (subMsp != null)
            {
                injuredPlayer.IsStarter = false;
                subMsp.IsStarter = true;
                squad.Substitutions++;
            }
        }

        private void TryCreateChance(
        Match match,
        MatchSquad attackSquad,
        MatchSquad defendSquad,
        bool isHome,
        Dictionary<int, int> goalScorers)
        {
            if (attackSquad?.MatchSquadPlayers == null || defendSquad?.MatchSquadPlayers == null) return;
            
            double attackPower = CalculateSquadPower(attackSquad, true);
            double defensePower = CalculateSquadPower(defendSquad, false);

            // تعديل: زيادة فرصة خلق الفرص
            double chanceProb = attackPower / (attackPower + defensePower + 50); // إضافة 50 لتقليل التفاوت
            
            // تعديل: زيادة عدد الفرص من 0.012 إلى 0.05 (زيادة 4 أضعاف)
            if (random.NextDouble() < chanceProb * 0.05)
            {
                var gk = defendSquad.MatchSquadPlayers
                    .FirstOrDefault(p => p.Player != null && p.Player.Position == "GK" && p.IsStarter == true);

                double gkPower = gk?.Player?.Poweer ?? 50;
                
                // تعديل: زيادة معدل التحول إلى أهداف
                double conversionRate = (attackPower / (attackPower + gkPower)) * 0.7; // من 0.5 إلى 0.7

                if (random.NextDouble() < conversionRate)
                {
                    if (isHome) match.HomeTeamScore++;
                    else match.AwayTeamScore++;

                    // اختيار الهداف (كما هو)
                    var candidates = attackSquad.MatchSquadPlayers
                        .Where(p => p.IsStarter == true && p.Player != null && p.Player.Position != "GK")
                        .ToList();

                    if (candidates.Any())
                    {
                        double totalPower = candidates.Sum(p => p.Player.Poweer ?? 1);
                        double roll = random.NextDouble() * totalPower;
                        double cumulative = 0;

                        foreach (var candidate in candidates)
                        {
                            cumulative += candidate.Player.Poweer ?? 1;
                            if (roll <= cumulative)
                            {
                                var pid = candidate.Player.PlayerId;
                                goalScorers[pid] = goalScorers.GetValueOrDefault(pid, 0) + 1;
                                break;
                            }
                        }
                    }
                }
            }
        }

        private double CalculateSquadPower(MatchSquad squad, bool isAttack)
        {
            if (squad?.MatchSquadPlayers == null) return 0;
            
            var activePlayers = squad.MatchSquadPlayers.Where(p => p.IsStarter == true && p.Player != null);

            return isAttack
                ? activePlayers.Sum(p => (p.Player.Poweer ?? 0) * 0.6)
                : activePlayers.Sum(p => (p.Player.Poweer ?? 0) * 0.4);
        }

        private async Task UpdateStandingsAsync(Match match)
        {
            // 1. تحديث LeagueStandingsHistory
            var homeStanding = await _context.LeagueStandingsHistory
                .Where(s => s.TeamId == match.HomeTeamId)
                .OrderByDescending(s => s.WeekNumber)
                .FirstOrDefaultAsync();

            var awayStanding = await _context.LeagueStandingsHistory
                .Where(s => s.TeamId == match.AwayTeamId)
                .OrderByDescending(s => s.WeekNumber)
                .FirstOrDefaultAsync();

            if (homeStanding == null || awayStanding == null) return;

            homeStanding.Played++;
            awayStanding.Played++;
            homeStanding.GoalsFor += match.HomeTeamScore;
            homeStanding.GoalsAgainst += match.AwayTeamScore;
            awayStanding.GoalsFor += match.AwayTeamScore;
            awayStanding.GoalsAgainst += match.HomeTeamScore;

            if (match.HomeTeamScore > match.AwayTeamScore)
            {
                homeStanding.Won++;
                homeStanding.Points += 3;
                awayStanding.Lost++;
            }
            else if (match.HomeTeamScore < match.AwayTeamScore)
            {
                awayStanding.Won++;
                awayStanding.Points += 3;
                homeStanding.Lost++;
            }
            else
            {
                homeStanding.Drawn++;
                awayStanding.Drawn++;
                homeStanding.Points++;
                awayStanding.Points++;
            }

            // 2. تحديث TeamStats (بدون Played)
            var homeTeamStat = await _context.TeamStats
                .FirstOrDefaultAsync(t => t.TeamStatsId == match.HomeTeamId);
            
            var awayTeamStat = await _context.TeamStats
                .FirstOrDefaultAsync(t => t.TeamStatsId == match.AwayTeamId);

            if (homeTeamStat != null)
            {
                homeTeamStat.WinsNumber = homeStanding.Won;
                homeTeamStat.DrawNumber = homeStanding.Drawn;
                homeTeamStat.LoseNumber = homeStanding.Lost;
                homeTeamStat.GoalsFor = homeStanding.GoalsFor;
                homeTeamStat.GoalsAgainst = homeStanding.GoalsAgainst;
                homeTeamStat.Points = homeStanding.Points;
            }

            if (awayTeamStat != null)
            {
                awayTeamStat.WinsNumber = awayStanding.Won;
                awayTeamStat.DrawNumber = awayStanding.Drawn;
                awayTeamStat.LoseNumber = awayStanding.Lost;
                awayTeamStat.GoalsFor = awayStanding.GoalsFor;
                awayTeamStat.GoalsAgainst = awayStanding.GoalsAgainst;
                awayTeamStat.Points = awayStanding.Points;
            }

            _context.LeagueStandingsHistory.UpdateRange(homeStanding, awayStanding);
            await RecalculatePositionsAsync(match.LeagueId);
            
            var leagueStandingService = new LeagueStandingService(_context);
            await leagueStandingService.UpdateTeamStatsPositions();
            
            await _context.SaveChangesAsync();
        }

        private async Task RecalculatePositionsAsync(int leagueId)
        {
            var allTeamIds = await _context.Teams
                .Where(t => t.LeagueId == leagueId)
                .Select(t => t.TeamId)
                .ToListAsync();

            var standings = new List<LeagueStandingsHistory>();

            foreach (var teamId in allTeamIds)
            {
                var latest = await _context.LeagueStandingsHistory
                    .Where(s => s.TeamId == teamId)
                    .OrderByDescending(s => s.WeekNumber)
                    .FirstOrDefaultAsync();

                if (latest != null) standings.Add(latest);
            }

            var sorted = standings
                .OrderByDescending(s => s.Points)
                .ThenByDescending(s => s.GoalsFor - s.GoalsAgainst)
                .ThenByDescending(s => s.GoalsFor)
                .ToList();

            for (int i = 0; i < sorted.Count; i++)
                sorted[i].Position = i + 1;

            _context.LeagueStandingsHistory.UpdateRange(sorted);
        }

        private async Task UpdatePlayerStatsAsync(List<MatchSquad> squads, Dictionary<int, int> goalScorers)
        {
            var allPlayers = squads
                .SelectMany(s => s.MatchSquadPlayers)
                .Select(msp => msp.Player)
                .Where(p => p != null)
                .DistinctBy(p => p.PlayerId)
                .ToList();

            foreach (var player in allPlayers)
            {
                // تأكد من وجود PlayerStat
                if (player.PlayerStat == null)
                {
                    var newStat = new PlayerStat
                    {
                        PlayerStatsId = player.PlayerId,
                        Appearences = 0,
                        Goals = 0,
                        Assists = 0,
                        YellowCards = 0,
                        RedCards = 0,
                        Fouls = 0
                    };
                    _context.PlayerStats.Add(newStat);
                    player.PlayerStat = newStat;
                }

                // زيادة عدد المباريات
                player.PlayerStat.Appearences = (player.PlayerStat.Appearences ?? 0) + 1;

                // إضافة الأهداف
                if (goalScorers.TryGetValue(player.PlayerId, out int goals))
                {
                    player.PlayerStat.Goals = (player.PlayerStat.Goals ?? 0) + goals;
                }
                
                // TODO: أضف الأسيستات والبطاقات هنا
                // (هتحتاج tracking للـ assists في الـ MatchSimulation)
            }
            
            await _context.SaveChangesAsync();
        }

        private async Task EnsureTeamStatsExist(int teamId)
        {
            var teamStat = await _context.TeamStats
                .FirstOrDefaultAsync(ts => ts.TeamStatsId == teamId);
            
            if (teamStat == null)
            {
                teamStat = new TeamStat
                {
                    TeamStatsId = teamId,
                    WinsNumber = 0,
                    DrawNumber = 0,
                    LoseNumber = 0,
                    GoalsFor = 0,
                    GoalsAgainst = 0,
                    Points = 0,
                    Position = 0,
                    PreviousPosition = 0,
                    CleanSheets = 0
                };
                _context.TeamStats.Add(teamStat);
                await _context.SaveChangesAsync();
            }
        }
    }
}