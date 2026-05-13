namespace Diet.Model;

public class TombstoneEntity
{
    public int Id { get; set; }
    public required string Table { get; set; }
    public Guid RecordId { get; set; }
    public long DeletedAt { get; set; }
}

public class TombstoneDto
{
    public int Id { get; set; }
    public required string Table { get; set; }
    public Guid RecordId { get; set; }
    public long DeletedAt { get; set; }
}