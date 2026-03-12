namespace BookManagement.Api.Models
{
    public class Book
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Author { get; set; }
        public required string Isbn { get; set; }
        public DateTime PublicationDate { get; set; }
        public string? Category { get; set; }
    }
}
