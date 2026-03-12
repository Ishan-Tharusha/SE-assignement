using BookManagement.Api.DTOs;
using BookManagement.Api.Interfaces;
using BookManagement.Api.Models;
using BookManagement.Api.Repositories;

namespace BookManagement.Api.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _repository;

        public BookService(IBookRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            var books = await _repository.GetAllAsync();
            return books.Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                Isbn = b.Isbn,
                PublicationDate = b.PublicationDate,
                Category = b.Category
            });
        }

        public async Task<BookDto?> GetBookByIdAsync(Guid id)
        {
            var book = await _repository.GetByIdAsync(id);
            if (book == null) return null;

            return new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Isbn = book.Isbn,
                PublicationDate = book.PublicationDate,
                Category = book.Category
            };
        }

        public async Task<BookDto> CreateBookAsync(CreateBookDto createBookDto)
        {
            if (await _repository.ExistsByIsbnAsync(createBookDto.Isbn))
            {
                throw new InvalidOperationException($"A book with ISBN {createBookDto.Isbn} already exists.");
            }

            var newBook = new Book
            {
                Title = createBookDto.Title,
                Author = createBookDto.Author,
                Isbn = createBookDto.Isbn,
                PublicationDate = createBookDto.PublicationDate,
                Category = createBookDto.Category
            };

            await _repository.AddAsync(newBook);

            return new BookDto
            {
                Id = newBook.Id,
                Title = newBook.Title,
                Author = newBook.Author,
                Isbn = newBook.Isbn,
                PublicationDate = newBook.PublicationDate,
                Category = newBook.Category
            };
        }

        public async Task<bool> UpdateBookAsync(Guid id, UpdateBookDto updateBookDto)
        {
            var existingBook = await _repository.GetByIdAsync(id);
            if (existingBook == null)
            {
                return false;
            }

            if (await _repository.ExistsByIsbnAsync(updateBookDto.Isbn, id))
            {
                throw new InvalidOperationException($"A book with ISBN {updateBookDto.Isbn} already exists.");
            }

            existingBook.Title = updateBookDto.Title;
            existingBook.Author = updateBookDto.Author;
            existingBook.Isbn = updateBookDto.Isbn;
            existingBook.PublicationDate = updateBookDto.PublicationDate;
            existingBook.Category = updateBookDto.Category;

            await _repository.UpdateAsync(existingBook);
            return true;
        }

        public async Task<bool> DeleteBookAsync(Guid id)
        {
            var existingBook = await _repository.GetByIdAsync(id);
            if (existingBook == null)
            {
                return false;
            }

            await _repository.DeleteAsync(id);
            return true;
        }
    }
}
