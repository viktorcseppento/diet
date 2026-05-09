namespace Diet.Model;

public class TombstoneEntity
{
    public int Id { get; set; }
    public string Table { get; set; } = null!;
    public Guid RecordId { get; set; }
    public long DeletedAt { get; set; }
}

public class TombstoneDto
{
    public required int Id { get; set; }
    public required string Table { get; set; }
    public required Guid RecordId { get; set; }
    public required long DeletedAt { get; set; }
}