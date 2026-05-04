namespace footic.Models
{
    public class LeagueStandingsHistory
    {
        public int Id { get; set; }
        public int WeekNumber { get; set; }
        public int TeamId { get; set; }
        public int Played { get; set; }
        public int Won { get; set; }
        public int Drawn { get; set; }
        public int Lost { get; set; }
        public int GoalsFor { get; set; }
        public int GoalsAgainst { get; set; }
        public int Points { get; set; }
        public int Position { get; set; }

        // علاقة مع جدول الفرق (اختياري ولكن يفضل)
        public virtual Team Team { get; set; }
    }
}
