namespace footic.DTOs.squad
{
    public class SubstitutionRequest
    {// لاستقبال بيانات التبديل
        public int MatchId { get; set; }
        public int TeamId { get; set; }
        public int PlayerOutId { get; set; }
        public int PlayerInId { get; set; }
    }
}
