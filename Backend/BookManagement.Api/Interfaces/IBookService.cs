using BookManagement.Api.DTOs;

namespace BookManagement.Api.Interfaces
{
    public interface IBookService
    {
        // Abstracts away the Data layer explicitly handling Domain <-> DTO mapping
        Task<IEnumerable<BookDto>> GetAllBooksAsync();
        Task<BookDto?> GetBookByIdAsync(Guid id);
        Task<BookDto> CreateBookAsync(CreateBookDto createBookDto);
        Task<bool> UpdateBookAsync(Guid id, UpdateBookDto updateBookDto);
        Task<bool> DeleteBookAsync(Guid id);
    }
}
