using footic.DTOs.player;
using footic.EData;
using footic.Models;
using Microsoft.EntityFrameworkCore;

namespace footic.Services
{
    public class PlayerService : IplayerService
    {
        private readonly PlSimulationDbContext _context;

        public PlayerService(PlSimulationDbContext context)
        {
            _context = context;
        }

        // 1. جلب كل لاعبي فريق معين
        public async Task<List<PlayerDTO>> GetPlayersByTeamIdAsync(int teamId)
        {
            return await _context.Players
                .Include(p => p.PlayerStat)
                .Where(p => p.TeamId == teamId)
                .AsNoTracking()
                .Select(p => MapToDTO(p)) // استخدمنا ميثود المابينج لتقليل تكرار الكود
                .ToListAsync();
        }

        // 2. جلب بيانات لاعب محدد بواسطة الـ ID
        public async Task<PlayerDTO> GetPlayerByIdAsync(int playerId)
        {
            var player = await _context.Players
                .Include(p => p.PlayerStat)
                .Include(p => p.Team) // ضفنا التيم هنا عشان نعرف بيلعب فين
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.PlayerId == playerId);

            if (player == null) return null;

            return MapToDetailsDTO(player);
        }

        // ميثود "سينيور" خاصة لتوحيد عملية تحويل الموديل لـ DTO (Refactoring)
        private static PlayerDTO MapToDTO(Player p)
        {
            return new PlayerDTO
            {
                playerid = p.PlayerId,
                ShirtNumber = p.Pnumber,
                PlayerImage = p.Pimage,      // Pimage مش PImage
                name = p.Pname,              // Pname مش PName
                Age = p.Age,
                nationality = p.Nationality,
                Position = p.Position,
                MarketValue = (decimal)(p.MarketValue ?? 0),
                StrongFoot = p.StrongFoot,
                power = (int)(p.Poweer ?? 0),
            };
        }

        private static PlayerStatsDTO MapToDetailsDTO(Player p)
        {
            return new PlayerStatsDTO
            {
                playerid = p.PlayerId,
                ShirtNumber = p.Pnumber,
                PlayerImage = p.Pimage,
                name = p.Pname,
                Age = p.Age,
                nationality = p.Nationality,
                Position = p.Position,
                MarketValue = (decimal)(p.MarketValue ?? 0),
                StrongFoot = p.StrongFoot,
                power = (int)(p.Poweer ?? 0),
                Joined = p.Joined,
                EndContract = p.EndContract,
                Fit = p.Fit,
                Height = p.PlayerStat?.Height ?? 0,
                Weight = p.PlayerStat?.Weight ?? 0,
                Goals = (int)(p.PlayerStat?.Goals ?? 0),
                Assists = p.PlayerStat?.Assists ?? 0,
                RedCards = p.PlayerStat?.RedCards ?? 0,
                YellowCards = p.PlayerStat?.YellowCards ?? 0,
            };
        }
        // جلب كل اللاعبين الموجودين في قاعدة البيانات
        public async Task<List<PlayerDTO>> GetAllPlayersAsync()
        {
            return await _context.Players
                .Include(p => p.PlayerStat)
                .AsNoTracking()
                .Select(p => MapToDTO(p)) // استخدام الميثود الموحدة للتحويل
                .ToListAsync();
        }

        public async Task<List<PlayerStatsDTO>> GetAllPlayersWithStatsAsync()
        {
            return await _context.Players
                .Include(p => p.PlayerStat)
                .AsNoTracking()
                .Select(p => MapToDetailsDTO(p))
                .ToListAsync();
        }
    

        public async Task<List<TopScorerDTO>> GetTopScorersAsync(int limit)
        {
            var topScorers = await _context.Players
                .Include(p => p.PlayerStat)
                .Include(p => p.Team)
                .Where(p => (p.PlayerStat.Goals ?? 0) > 0)
                .OrderByDescending(p => p.PlayerStat.Goals)
                .ThenByDescending(p => p.PlayerStat.Appearences)
                .Take(limit)
                .Select(p => new TopScorerDTO
                {
                    PlayerId = p.PlayerId,
                    PlayerName = p.Pname ?? "",     // جرب Pname (بحرف p صغير)
                    PlayerImage = p.Pimage ?? "",   // جرب Pimage (بحرف p صغير)
                    Goals = p.PlayerStat.Goals ?? 0,
                    Appearances = p.PlayerStat.Appearences ?? 0,
                    TeamName = p.Team.Tname ?? "",  // جرب Tname (بحرف t صغير)
                    TeamLogo = p.Team.Logo ?? "",
                    Position = p.Position ?? "",
                    GoalsPerGame = p.PlayerStat.Appearences > 0 
                        ? Math.Round((decimal)(p.PlayerStat.Goals ?? 0) / (p.PlayerStat.Appearences ?? 1), 2)
                        : 0
                })
                .ToListAsync();
            
            return topScorers;
        }

        public async Task<List<TopScorerDTO>> GetTopScorersByLeagueAsync(int leagueId, int limit)
        {
            var topScorers = await _context.Players
                .Include(p => p.PlayerStat)
                .Include(p => p.Team)
                .Where(p => p.Team.LeagueId == leagueId && (p.PlayerStat.Goals ?? 0) > 0)
                .OrderByDescending(p => p.PlayerStat.Goals)
                .ThenByDescending(p => p.PlayerStat.Appearences)
                .Take(limit)
                .Select(p => new TopScorerDTO
                {
                    PlayerId = p.PlayerId,
                    PlayerName = p.Pname ?? "",      // Pname وليس PName
                    PlayerImage = p.Pimage ?? "",    // Pimage وليس PImage
                    Goals = p.PlayerStat.Goals ?? 0,
                    Appearances = p.PlayerStat.Appearences ?? 0,
                    TeamName = p.Team.Tname ?? "",   // Tname وليس TName
                    TeamLogo = p.Team.Logo ?? "",
                    Position = p.Position ?? "",
                    GoalsPerGame = p.PlayerStat.Appearences > 0 
                        ? Math.Round((decimal)(p.PlayerStat.Goals ?? 0) / (p.PlayerStat.Appearences ?? 1), 2)
                        : 0
                })
                .ToListAsync();
            
            return topScorers;
        }

    }

}
 

