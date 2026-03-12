using BookManagement.Api.DTOs;
using BookManagement.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BookManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // GET: api/books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> Get()
        {
            var books = await _bookService.GetAllBooksAsync();
            return Ok(books);
        }

        // GET: api/books/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> Get(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        // POST: api/books
        [HttpPost]
        public async Task<ActionResult<BookDto>> Post([FromBody] CreateBookDto createBookDto)
        {
            var createdBook = await _bookService.CreateBookAsync(createBookDto);
            return CreatedAtAction(nameof(Get), new { id = createdBook.Id }, createdBook);
        }

        // PUT: api/books/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] UpdateBookDto updateBookDto)
        {
            if (id != updateBookDto.Id)
            {
                return BadRequest("ID mismatch in URL and body.");
            }

            var updated = await _bookService.UpdateBookAsync(id, updateBookDto);
            if (!updated)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            return NoContent();
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _bookService.DeleteBookAsync(id);
            if (!deleted)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            return NoContent();
        }
    }
}

