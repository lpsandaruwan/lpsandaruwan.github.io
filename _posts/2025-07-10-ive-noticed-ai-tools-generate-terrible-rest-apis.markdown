---
author: lpsandaruwan
categories: [Posts, REST, API designing, Software Engineering, AI Assisted coding]
date: 2025-07-10
img: /assets/images/content/posts/rest/mrCroca.png
tags: [posts, api, restful, software, ai]
title: "I've Noticed AI Tools Generate Terrible REST APIs - Here's How to Fix It"
---

Here's something that bugs me: AI tools like ChatGPT, Claude, Gemini, or whatever AI you're using are great at cranking out code fast,
but they often generate REST APIs that look like they were designed by someone who never had to maintain them.

Over the past few years working with different teams, I've noticed that about most of AI generated APIs have naming conventions that make me question everything.

<img src="/assets/images/content/posts/rest/mrCroca.png" alt="REST API design illustration" style="max-width: 800px; height: auto; display: block; margin: 20px auto;" />

Why does this happen? AI models learn from existing code on the internet, and unfortunately, there's a lot of bad API design out there. When you ask an AI to "create a book API," it might give you something like this:

`GET https://example.com/api/books/get-one/{book-id}`

`GET https://example.com/api/books/get-all`

`GET https://example.com/api/books/filter-by-author-id/authorId=1&autherId=2&autherId=3...`

`POST https://example.com/api/create-book`

`PUT https://example.com/api/update-book`

If your APIs look like this, don't take it personally. This post isn't meant to shame anyone. The problem is that AI tools often copy patterns from Stack Overflow answers, old tutorials, and legacy codebases where people were just trying to get something working quickly.

But here's the thing: APIs are interfaces that other developers (including future you) will have to work with. A poorly designed API can waste hours of development time, create confusion in documentation, and make your codebase harder to maintain.

Let me show you why these examples are problematic and how to fix them.

## Too Bored to Read? Copy This Prompt

If you're too bored to read this entire post, just copy and paste this comprehensive prompt into your AI coding assistant so it follows these guidelines when generating REST APIs. Instructions for each tool are included below:

<div style="border: 1px solid var(--border-color, #444); border-radius: 5px; margin: 10px 0;">
  <div style="background: var(--code-bg, #2d2d2d); padding: 10px; border-bottom: 1px solid var(--border-color, #444); cursor: pointer; color: var(--text-color, #fff);" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
    📋 Click to expand comprehensive AI prompt for REST API guidelines
  </div>
  <div style="display: none; position: relative;">
    <button onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent)" style="position: absolute; top: 10px; right: 10px; background: var(--accent-color, #007cba); color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">Copy</button>
    <pre style="background: var(--code-bg, #1e1e1e); color: var(--code-color, #fff); padding: 15px; margin: 0; overflow-x: auto; white-space: pre-wrap;"><code>You are a professional AI coding assistant. Follow these REST API design rules religiously when generating any REST API related code, endpoints, or architecture.

## MANDATORY REST API RULES

### URL DESIGN
- Use nouns, NEVER verbs in URLs
- Collections MUST be plural: /api/v1/books not /api/v1/book
- Always version APIs: /api/v1/, /api/v2/
- Structure: {protocol}://{host}/api/{version}/{collection}/{id}?{query_params}

### HTTP METHODS
- GET: Read operations only (safe, idempotent, no side effects)
- POST: Create resources or complex operations
- PUT: Replace entire resource (send all fields)
- PATCH: Update partial resource (send only changed fields)
- DELETE: Remove resource

### RESPONSE STANDARDS
- Always include proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Always include pagination for collections: ?page=1&limit=20
- Use consistent naming convention (pick snake_case OR camelCase, never mix)
- Structure error responses with field-level details

### CORRECT PATTERNS
GET    /api/v1/books                    # List books
GET    /api/v1/books/123               # Get specific book
POST   /api/v1/books                   # Create book
PUT    /api/v1/books/123               # Update entire book
PATCH  /api/v1/books/123               # Update book partially
DELETE /api/v1/books/123               # Delete book

GET    /api/v1/authors/456/books       # Author's books (hierarchical)
POST   /api/v1/authors/456/books       # Create book for author

GET    /api/v1/books?author=tolkien&genre=fantasy    # Simple filtering
POST   /api/v1/books/search            # Complex filtering (use POST)

### FORBIDDEN PATTERNS - NEVER GENERATE THESE
❌ GET /api/books/get-one/123
❌ GET /api/books/get-all
❌ POST /api/create-book
❌ PUT /api/update-book
❌ GET /api/getBookById/123
❌ POST /api/createBook
❌ DELETE /api/removeBook/123

### REQUIRED RESPONSE FORMATS

Success Response:
{
  "data": { "id": 123, "title": "The Hobbit" }
}

Collection with Pagination:
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

Error Response:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "price", "message": "Must be positive number" }
    ]
  }
}

### CHECKLIST - VERIFY BEFORE GENERATING
- [ ] URLs use nouns, not verbs
- [ ] Collections are plural
- [ ] Consistent naming throughout
- [ ] Proper HTTP methods
- [ ] API versioning (/api/v1/)
- [ ] Pagination for collections
- [ ] Meaningful status codes
- [ ] Structured error responses

### PROCESS
1. Ask about entities and relationships first
2. Design around resources, not actions
3. Use proper HTTP methods and status codes
4. Include pagination for collection endpoints
5. Provide structured error handling
6. Follow consistent naming conventions
7. Include API versioning

Apply these rules to ALL REST API code generation. These rules are non-negotiable.</code></pre>
  </div>
</div>

#### How to Add These Rules to Your AI Tools

**For Claude Code (.claude.md):**
Create a `.claude.md` file in your project root and paste the rules above.

**For Cline (.cline/rules.md):**
Create `.cline/rules.md` in your project and paste the rules.

**For Cursor (.cursorrules):**
Create a `.cursorrules` file in your project root and paste the rules.

**For GitHub Copilot:**
Add the rules to your project's README or create a `copilot-instructions.md` file.

**For ChatGPT:**
Go to Settings → Personalization → Custom Instructions and paste the rules.

## Intro

I am not going to explain what a REST API is. That you can search in the web, or ask your AI assistant; "Hey ChatGPT. I a noob to REST API. Explain REST API to me like I'm a five year old."
Main purpose of the REST API is to build a standard or a blueprint where your client and server comes to an agreement to manipulate your resources of business needs.
To make is easier it comes with below options,

### URI
Where is the resource? Ideally it goes like,

`{Protocol}://{Host address}/{path and path variables mix}?{query parameter key}={query parameter value}`

example: `https://example.com/api/v1/vendors/{vendorId}/books?publishedDate=2021-10-10&page=1&limit=100`

### Method

Which type of resource action it is.
There is plenty of methods to use. GET, POST, PUT, ...

### Protocol and Host address

The server's address or mapped domain including the protocol(http or https)

### Path variables

Variables which are included in the URI path. Mainly path variables are for representing a main entity or a hierarchical resources.
i.e. Vendors have books <-> Books are owned by vendors
`https://example.com/api/v1/vendors/{veendorId}/books/{bookId}`

### Query parameters

Mostly using for extra options and filtering resources.
i.e. filter books by published date
`https://example.com/api/v1/books/publishedDate=2021-05-12`


## Designing

Designing is the crucial part of every system. At least you need to have a virtual or a mind map. So let's talk about it.
Now we have the idea about the parts of a RESTful API. If you get a problem to solve or to design a system with REST APIs,
let's see how we can put good conventions and good practices into the design.

It is best to always design rest apis around entities and their relationships. It doesn't need to have a visible model or a database,
the entities can be virtual too.

Let's take a look at examples.

### Example 1: Book Store System

Consider a simple book store with these entities:
- **Authors** (id, name, email)
- **Books** (id, title, isbn, price, author_id)
- **Customers** (id, name, email)
- **Orders** (id, customer_id, order_date, total)
- **Order Items** (order_id, book_id, quantity, price)

Here's how you'd design clean REST APIs for this system:

**Books Management:**
```
GET    /api/v1/books                    # List all books
GET    /api/v1/books/{bookId}           # Get specific book
POST   /api/v1/books                    # Create new book
PUT    /api/v1/books/{bookId}           # Update entire book
PATCH  /api/v1/books/{bookId}           # Update book partially
DELETE /api/v1/books/{bookId}           # Delete book

GET    /api/v1/books?author={authorId}  # Filter books by author
GET    /api/v1/books?priceMin=10&priceMax=50  # Price range filter
```

**Author's Books (Hierarchical relationship):**
```
GET    /api/v1/authors/{authorId}/books # Get all books by author
POST   /api/v1/authors/{authorId}/books # Create book for author
```

**Customer Orders:**
```
GET    /api/v1/customers/{customerId}/orders     # Customer's orders
POST   /api/v1/customers/{customerId}/orders     # Place new order
GET    /api/v1/orders/{orderId}/items            # Order items
```

### Example 2: Virtual Models - Book Recommendation Engine

Sometimes you need APIs for actions that don't directly map to database tables. Here's a third party integration example where your book store needs to integrate with an external recommendation service.

**Virtual entities we're working with:**
- **Recommendations** (not stored, generated on demand)
- **User Preferences** (aggregated data)
- **Search Results** (temporary, filtered data)

```
GET    /api/v1/users/{userId}/recommendations           # Get recommendations for user
GET    /api/v1/recommendations?type=trending            # Get trending recommendations
POST   /api/v1/recommendations                          # Send user interaction feedback

POST   /api/v1/books                                    # Advanced book search with complex filters
GET    /api/v1/suggestions?q={query}                    # Search suggestions

POST   /api/v1/events                                   # Track user events
GET    /api/v1/users/{userId}/preferences               # Get user preference summary
```

Notice how these endpoints focus on **actions and aggregated data** rather than simple CRUD operations. The recommendation engine doesn't "store" recommendations - it generates them. But we still follow REST principles by treating them as resources.

## Conventions That Actually Matter

Now here's the real stuff that separates good APIs from the garbage ones floating around. I've been debugging APIs for years, and trust me, following these conventions will save you from a lot of headaches.

### 1. Use Nouns, Not Verbs

Your URL should describe **what** you're working with, not **what** you're doing to it. The HTTP method already tells us the action.

**Wrong:**
```
POST /api/v1/createBook
GET  /api/v1/getBookById/123
DELETE /api/v1/removeBook/123
```

**Right:**
```
POST   /api/v1/books
GET    /api/v1/books/123
DELETE /api/v1/books/123
```

### 2. Plural Nouns for Collections

Collections should always be plural. This keeps your API consistent whether you're dealing with one item or many.

**Wrong:**
```
GET /api/v1/book        # Are we getting one book or all books?
GET /api/v1/book/123    # Confusing structure
```

**Right:**
```
GET /api/v1/books       # Obviously a collection
GET /api/v1/books/123   # Obviously one item from the collection
```

### 3. HTTP Methods Have Meaning - Use Them

Each HTTP method has a specific purpose. Don't just use GET and POST for everything.

- **GET**: Read data, should be safe and idempotent (no side effects)
- **POST**: Create new resources or complex operations
- **PUT**: Replace entire resource (send all fields)
- **PATCH**: Update partial resource (send only changed fields)
- **DELETE**: Remove resource

### 4. When Query Parameters Get Messy, Use POST

Sometimes your filters become so complex that query parameters look like a mess. That's when you switch to POST with a request body.

**Query parameter nightmare:**
```
GET /api/v1/books?author=1&author=2&author=3&genre=fiction&genre=mystery&price_min=10&price_max=50&published_after=2020-01-01&in_stock=true&format=paperback&format=ebook
```

**Clean POST approach:**
```
POST /api/v1/books/search
{
  "authors": [1, 2, 3],
  "genres": ["fiction", "mystery"],
  "priceRange": {"min": 10, "max": 50},
  "publishedAfter": "2020-01-01",
  "inStock": true,
  "formats": ["paperback", "ebook"]
}
```

### 5. Version Your APIs

Always version your APIs from day one. You'll thank yourself later.

```
/api/v1/books    # Good
/api/v2/books    # When you need breaking changes
```

### 6. Naming Conventions Matter

Pick a naming style and stick with it throughout your entire API. Here are real scenarios where this becomes important:

**Scenario 1: E-commerce API with snake_case**
```
GET /api/v1/products?created_at=2024-01-01&price_min=50&is_available=true
POST /api/v1/users/123/shipping_addresses
{
  "street_address": "123 Main St",
  "postal_code": "12345",
  "is_default": true
}
```

**Scenario 2: Same API with camelCase**
```
GET /api/v1/products?createdAt=2024-01-01&priceMin=50&isAvailable=true
POST /api/v1/users/123/shippingAddresses
{
  "streetAddress": "123 Main St",
  "postalCode": "12345",
  "isDefault": true
}
```

Both work fine, but mixing them creates confusion:
```
GET /api/v1/books?created_at=2024-01-01&publishedDate=2024-01-01   # Don't do this!
```

### 7. Return Meaningful HTTP Status Codes

Your status codes should tell the story of what happened:

- **200 OK**: Everything worked
- **201 Created**: New resource created successfully
- **400 Bad Request**: Client sent invalid data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not allowed
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server screwed up

Don't just return 200 for everything and put the real status in the response body. That's lazy.

## Real World Lessons I've Learned

After working with APIs in production for years, here are some things that books won't tell you:

### Pagination is Not Optional

If your API returns lists, it needs pagination. I don't care if you think your table will only have 50 records forever. Trust me, it won't.

```
GET /api/v1/books?page=1&limit=20
GET /api/v1/books?offset=0&limit=20     # Alternative approach
```

Return metadata about the pagination:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Filter Parameters Should Be Intuitive

Don't make people guess how to filter your data. Make it obvious:

```
GET /api/v1/books?author=tolkien&genre=fantasy&available=true
GET /api/v1/books?priceMin=10&priceMax=50
GET /api/v1/books?publishedAfter=2020-01-01
```

### Error Responses Need Structure

When things go wrong (and they will), return helpful error messages:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "price",
        "message": "Price must be a positive number"
      },
      {
        "field": "isbn",
        "message": "ISBN format is invalid"
      }
    ]
  }
}
```

### Nested Resources Can Get Messy

Be careful with deep nesting. This starts to look ridiculous:
```
GET /api/v1/publishers/123/authors/456/books/789/reviews/101/comments/202
```

Instead, consider flattening:
```
GET /api/v1/reviews/101/comments
GET /api/v1/comments?reviewId=101
```

## Keep in mind...

Look, AI tools are great for generating code quickly, but they often miss these important facts. They'll happily generate endpoints like `/api/getBookById` because they're trained on examples that include bad APIs too.

Next time you're working with an AI assistant, give it these guidelines upfront. Tell it to use proper REST conventions, meaningful HTTP methods, and consistent naming. Your future self (and your teammates) will thank you.

And remember, a well designed API is like a good conversation. It should be predictable, clear, and not leave people guessing what you meant.
