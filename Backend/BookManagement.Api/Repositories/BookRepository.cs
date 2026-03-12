using BookManagement.Api.Models;

namespace BookManagement.Api.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly List<Book> _books = new();

        public BookRepository()
        {
            // Seed some data
            _books.Add(new Book
            {
                Id = Guid.NewGuid(),
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                Isbn = "978-0743273565",
                PublicationDate = new DateTime(1925, 4, 10)
            });
            _books.Add(new Book
            {
                Id = Guid.NewGuid(),
                Title = "1984",
                Author = "George Orwell",
                Isbn = "978-0451524935",
                PublicationDate = new DateTime(1949, 6, 8)
            });
        }

        public Task<IEnumerable<Book>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Book>>(_books);
        }

        public Task<Book?> GetByIdAsync(Guid id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            return Task.FromResult(book);
        }

        public Task AddAsync(Book book)
        {
            book.Id = Guid.NewGuid();
            _books.Add(book);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Book book)
        {
            var index = _books.FindIndex(b => b.Id == book.Id);
            if (index != -1)
            {
                _books[index] = book;
            }
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Guid id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            if (book != null)
            {
                _books.Remove(book);
            }
            return Task.CompletedTask;
        }
    }
}

