using System.ComponentModel.DataAnnotations;

namespace BookManagement.Api.DTOs
{
    public class UpdateBookDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 1)]
        public required string Title { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 1)]
        public required string Author { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 10)]
        public required string Isbn { get; set; }

        [Required]
        public DateTime PublicationDate { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }
    }
}
