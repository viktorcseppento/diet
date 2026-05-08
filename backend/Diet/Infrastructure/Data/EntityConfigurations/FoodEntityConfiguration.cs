using Diet.Infrastructure.Data.Converters;
using Diet.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Diet.Infrastructure.Data.EntityConfigurations;

public class FoodEntityConfiguration : IEntityTypeConfiguration<FoodEntity>
{
    public void Configure(EntityTypeBuilder<FoodEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);
        builder.Property(e => e.Type)
            .IsRequired()
            .HasMaxLength(20);
        builder.Property(e => e.Measure)
            .IsRequired()
            .HasMaxLength(20);
        builder.Property(e => e.Ingredients)
            .HasJsonConversion();
        builder.Property(e => e.Macros)
            .HasJsonConversion();
    }
}