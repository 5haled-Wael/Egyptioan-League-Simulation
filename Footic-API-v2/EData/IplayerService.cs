using footic.DTOs.player;

namespace footic.EData
{
    public interface IplayerService
    {
        Task<List<PlayerDTO>> GetPlayersByTeamIdAsync(int teamId);
        Task<PlayerDTO> GetPlayerByIdAsync(int playerId);
        Task<List<PlayerDTO>> GetAllPlayersAsync();

        Task<List<PlayerStatsDTO>> GetAllPlayersWithStatsAsync();
        Task<List<TopScorerDTO>> GetTopScorersAsync(int limit);
        Task<List<TopScorerDTO>> GetTopScorersByLeagueAsync(int leagueId, int limit);
    }
}
