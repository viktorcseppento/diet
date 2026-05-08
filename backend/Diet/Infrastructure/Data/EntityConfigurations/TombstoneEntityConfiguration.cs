using Diet.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Diet.Infrastructure.Data.EntityConfigurations;

public class TombstoneEntityConfiguration : IEntityTypeConfiguration<TombstoneEntity>
{
    public void Configure(EntityTypeBuilder<TombstoneEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Table)
            .IsRequired()
            .HasMaxLength(100);
    }
}