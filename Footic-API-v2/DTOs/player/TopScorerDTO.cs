namespace footic.DTOs.player
{
    public class TopScorerDTO
    {
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string PlayerImage { get; set; }
        public int Goals { get; set; }
        public int Appearances { get; set; }
        public string TeamName { get; set; }
        public string TeamLogo { get; set; }
        public string Position { get; set; }
        public decimal GoalsPerGame { get; set; }
    }
}