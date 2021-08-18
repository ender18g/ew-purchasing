Python script to automatically change fields in RQ pdfs.

Required resources:
- pip3 install pdfrw

To run:

- drop pdf named "test.pdf" in script directory
- From working directory: python3 edit_budget_pdf.py
- outputs "result.pdf" as new file
	- does not directly change "test.pdf"

'ORIGINAL.pdf' is provided in case 'test.pdf' is corrupted for any reason.

TODO:
- field names for 'linked' / duplicated fields 
	- ie FieldLck4 is the RQ number, which is repeated at the top right of each page
- re-establish the sums, products, etc.
	- ie FieldLck43 total purchase price adds the columns above it.

Additional:
- reverse_lookup.py takes the main code's js lookup table and reverses the keys and values for pythonic key lookup.



