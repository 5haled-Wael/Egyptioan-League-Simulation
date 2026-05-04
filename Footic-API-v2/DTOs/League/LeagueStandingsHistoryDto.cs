namespace footic.DTOs.League
{
    public class LeagueStandingsHistoryDto
    {
        public int Id { get; set; }
        public int WeekNumber { get; set; } // رقم الجولة
        public int TeamId { get; set; }
        public int Played { get; set; }
        public int Won { get; set; }
        public int Drawn { get; set; }
        public int Lost { get; set; }
        public int GoalsFor { get; set; }
        public int GoalsAgainst { get; set; }
        public int Points { get; set; }
       
        public int Position { get; set; } // الترتيب في هذا الأسبوع
    }
}
