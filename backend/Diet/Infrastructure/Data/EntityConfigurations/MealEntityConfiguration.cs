using Diet.Infrastructure.Data.Converters;
using Diet.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Diet.Infrastructure.Data.EntityConfigurations;

public class MealEntityConfiguration : IEntityTypeConfiguration<MealEntity>
{
    public void Configure(EntityTypeBuilder<MealEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasOne(e => e.Person)
            .WithMany(p => p.Meals)
            .HasForeignKey(e => e.PersonId);
        builder.Property(e => e.Comment)
            .HasMaxLength(2000);
        builder.Property(e => e.Foods)
            .HasJsonConversion();
    }
}