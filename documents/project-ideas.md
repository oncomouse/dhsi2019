# Possible Projects to Do

1. [Bekker Number](https://en.wikipedia.org/wiki/Bekker_numbering) translation
	1. Convert a number (of [0-9]+[a-b]) format into a title.
	1. Possibly look up passages
1. Make a reading progress tracker
	1. Users add books via an ISBN
	1. Google Books API for title, author, page count
	1. Readers update progress
	1. Progress update changes display
	1. Three lists:
		* Currently Reading
		* Read This Year
		* Waiting to Read
	1. Data Spec
		* Book info (title, author, page count, ISBN)
		* Pages Read (Int)
		* Last Update (DateTime)
		* Reading? (Boolean)
		* Owner (ID)
	1. Login
		* OAUTH via GitHub
	1. Queries
		* Waiting to Read: Reading? === false && Pages Read === 0
		* Read This Year: Pages Read === Page Count && Last Update <= December 31, THIS YEAR
		* Currently Reading: Reading? === true && Pages Read < Page Count
	1. Backend API
		* /login
		* /books/:owner
			* GET -- All books
			* POST -- Add book (PROTECTED)
		* /books/:owner/:isbn
			* GET -- Get Book
			* PUT -- Update Book (Progress) (PROTECTED)
			* DELETE -- Remove Book (PROTECTED)
		* /books/:owner/reading
			* GET -- Currently Reading
		* /books/:owner/readthisyear
			* GET -- Read This Year
		* /books/:owner/waiting
			* GET -- Waiting to Read
			
