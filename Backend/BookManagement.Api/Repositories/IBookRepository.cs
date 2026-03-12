using BookManagement.Api.Models;

namespace BookManagement.Api.Repositories
{
    public interface IBookRepository
    {
        Task<IEnumerable<Book>> GetAllAsync();
        Task<Book?> GetByIdAsync(Guid id);
        Task AddAsync(Book book);
        Task UpdateAsync(Book book);
        Task DeleteAsync(Guid id);
        Task<bool> ExistsByIsbnAsync(string isbn, Guid? excludeId = null);
    }
}

