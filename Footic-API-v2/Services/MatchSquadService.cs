using footic.EData;
using footic.Models;
using Microsoft.EntityFrameworkCore;

namespace footic.Services
{
    public class MatchSquadService
    {
        private readonly PlSimulationDbContext _context;

        public MatchSquadService(PlSimulationDbContext context)
        {
            _context = context;
        }

        // 1. اختيار الـ 11 الأساسيين وبقية السكواد
        // 1. اختيار الـ 11 الأساسيين وبقية السكواد
        public async Task<string> SetInitialLineup(int matchId, int teamId, List<int> selectedStarterIds)
        {
            if (selectedStarterIds.Count != 11)
                return "يجب اختيار 11 لاعباً بالضبط للتشكيلة الأساسية.";

            // التأكد من وجود MatchSquad أو إنشائه
            var squad = await _context.MatchSquads
                .Include(s => s.MatchSquadPlayers) // إضافة Include هنا مهمة للمسح
                .FirstOrDefaultAsync(s => s.MatchId == matchId && s.TeamId == teamId);

            if (squad == null)
            {
                squad = new MatchSquad { MatchId = matchId, TeamId = teamId, Substitutions = 0 };
                _context.MatchSquads.Add(squad);
            }
            else
            {
                // *** هام جداً: مسح التشكيلة القديمة إذا كانت موجودة لمنع التكرار ***
                _context.MatchSquadPlayers.RemoveRange(squad.MatchSquadPlayers);
            }

            // حفظ التغييرات الأولية لضمان وجود Id للـ squad
            await _context.SaveChangesAsync();

            // جلب كل لاعيبة الفريق المسجلين في النادي
            var teamPlayers = await _context.Players.Where(p => p.TeamId == teamId).ToListAsync();

            foreach (var player in teamPlayers)
            {
                var squadPlayer = new MatchSquadPlayer
                {
                    MatchSquadId = squad.Id,
                    PlayerId = player.PlayerId,
                    IsStarter = selectedStarterIds.Contains(player.PlayerId),
                    IsCaptain = false
                };
                _context.MatchSquadPlayers.Add(squadPlayer);
            }

            await _context.SaveChangesAsync();
            return "Success";
        }

        // 2. عرض التشكيلة (الأساسيين والاحتياط)
        public async Task<object> GetFullSquad(int matchId, int teamId)
        {
            var squad = await _context.MatchSquads
                .Include(s => s.MatchSquadPlayers)
                    .ThenInclude(mp => mp.Player)
                .FirstOrDefaultAsync(s => s.MatchId == matchId && s.TeamId == teamId);

            if (squad == null) return null;

            return new
            {
                SubstitutionsUsed = squad.Substitutions,
                StartingXI = squad.MatchSquadPlayers
                    .Where(mp => mp.IsStarter == true)
                    .Select(mp => new { mp.PlayerId, mp.Player.Pname, mp.Player.Position }).ToList(),
                Bench = squad.MatchSquadPlayers
                    .Where(mp => mp.IsStarter == false)
                    .Select(mp => new { mp.PlayerId, mp.Player.Pname, mp.Player.Position }).ToList()
            };
        }

        // 3. عملية التبديل مع التحقق من المراكز (النصيحة الأولى)
        public async Task<string> PerformSubstitution(int matchId, int teamId, int playerOutId, int playerInId)
        {
            var squad = await _context.MatchSquads
                .Include(s => s.MatchSquadPlayers)
                    .ThenInclude(mp => mp.Player)
                .FirstOrDefaultAsync(s => s.MatchId == matchId && s.TeamId == teamId);

            if (squad == null) return "القائمة غير موجودة";
            if (squad.Substitutions >= 5) return "تم استهلاك جميع التبديلات (5/5)";

            var playerOut = squad.MatchSquadPlayers.FirstOrDefault(p => p.PlayerId == playerOutId);
            var playerIn = squad.MatchSquadPlayers.FirstOrDefault(p => p.PlayerId == playerInId);

            if (playerOut == null || playerIn == null) return "أحد اللاعبين غير مسجل في قائمة المباراة";
            if (playerOut.IsStarter != true) return "اللاعب المختار للخروج ليس في الملعب حالياً";
            if (playerIn.IsStarter == true) return "اللاعب المختار للدخول موجود في الملعب بالفعل";

            // التحقق من المركز (النصيحة الأولى)
            string warning = "";
            if (playerOut.Player.Position != playerIn.Player.Position)
            {
                warning = $"تنبيه: تم تبديل {playerOut.Player.Position} بـ {playerIn.Player.Position}.";
            }

            // تنفيذ التبديل
            playerOut.IsStarter = false;
            playerIn.IsStarter = true;
            squad.Substitutions = (byte)((squad.Substitutions ?? 0) + 1);

            await _context.SaveChangesAsync();
            return "Success" + (string.IsNullOrEmpty(warning) ? "" : ":" + warning);
        }
    }
}

