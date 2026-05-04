namespace footic.DTOs.squad
{
    public class SetLineupRequest
    {// لاستقبال بيانات التشكيلة الأساسية
        public int MatchId { get; set; }
        public int TeamId { get; set; }
        public List<int> SelectedStarterIds { get; set; }
    }
}
