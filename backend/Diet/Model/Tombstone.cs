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
    public TombstoneDto(TombstoneEntity entity)
    {
        Id = entity.Id;
        Table = entity.Table;
        RecordId = entity.RecordId;
        DeletedAt = entity.DeletedAt;
    }

    public int Id { get; set; }
    public string Table { get; set; } = null!;
    public Guid RecordId { get; set; }
    public long DeletedAt { get; set; }
}