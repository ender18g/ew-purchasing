# Patrick McCorkell
# August 2021
# US Naval Academy
# Robotics and Control TSD
#

import pdfrw
from special import *

target_file = 'test.pdf'
the_pdf = pdfrw.PdfReader(target_file)
new_pdf = 'result.pdf'

def fix_page_3(page_3,properties):
	start_at = 195
	end_at = 316
	page3_cases = {
		46 : 207,
		47 : 208,
		49 : 209,
		52 : 210,
		53 : 211,
		63 : 212,
		68 : 213,
		432 : 315,
		308 : 316
	}

	# This group doesn't require any changes.
	correct_order_group_1 = range(195,206+1)
	group_1_offset = 0

	correct_order_group_2 = range(207,307+1) # This group needs to be shifted by +7
	group_2_offset = 7

	annotation_prefix = '('
	annotation_suffix=')'

	for annotation in page_3['/Annots']:
		if annotation['/Subtype'] == '/Widget':
			if annotation['/T']:
				field_name=annotation['/T'][1:-1]
				# print(field_name)

				# Look for matches. Add 1, because .find method returns -1 if no match.
				find_match = field_name.find(properties['page_pattern_match'])
				if(find_match + 1):
					find_pound_sign = field_name.find('#')
					if (find_pound_sign + 1):
						# print('pound sign on '+field_name)
						text_number=int(field_name[find_match+len(properties['page_pattern_match']):find_pound_sign])
					else:
						# parse out the number
						text_number=int(field_name[find_match+len(properties['page_pattern_match']):])
					# print(text_number)

					# Don't alter fields outside the range for line items.
					if (text_number in correct_order_group_2):
						# print('found: ' + field_name)
						new_field_number = text_number + group_2_offset
						new_field = annotation_prefix + properties['page_pattern_match'] + str(new_field_number) + annotation_suffix
						annotation.T=new_field
						# print('shift translation of ' + str(text_number) + ": " + annotation.T)
					elif page3_cases.get(text_number):
						new_field_number = page3_cases.get(text_number)
						new_field = annotation_prefix + properties['page_pattern_match'] + str(new_field_number) + annotation_suffix
						annotation.T=new_field
						# print('special translation of ' + str(text_number) + ": " + annotation.T)
					else:
						i=1
						# print('no change to ' + str(text_number))
					# print()
	return page_3

def process_annotations():
	page_properties = {
        1: {
			# Dictionary to associate the columns for line items
			'new_field_descriptor_dict' : {
				0 : 'desc',
				1 : 'qty',
				2 : 'unitPrice',
				3 : 'linePrice',
				4 : 'lineDate'
			},
			'page_start' : 1,		 # the first line item on page 1
			'line_item_fields' : 5,	# the number of fields per line item (desc, qty, unit price, qty * unit, date)
            'page_pattern_match' : 'FieldLck', # The text pattern for line item fields on this page.
			'page_first_field_number' : 9,	   # the number of the first field in the first line item from Comptroller's version of the form, ie 'FieldLck9'
			'page_last_field_number' : 33	   # the number of the last field in the last line item from Comptroller's version of the form, ie 'FieldLck33'
        },
		2 : {
			# Dictionary to associate the columns for line items
			'new_field_descriptor_dict' : {
				0 : 'line',
				1 : 'desc',
				2 : 'qty',
				3 : 'unitPrice',
				4 : 'linePrice',
				5 : 'lineDate'
			},
			'page_start' : 6,		 # the first line item on page 2
			'line_item_fields' : 6,	# the number of fields per line item (line #, desc, qty, unit price, qty * unit, date)
            'page_pattern_match' : 'Text',     # The text pattern for line item fields on this page.
			'page_first_field_number' : 74,	   # the number of the first field in the first line item from Comptroller's version of the form, ie 'Text74'
			'page_last_field_number' : 193	   # the number of the last field in the last line item from Comptroller's version of the form, ie 'Text193'
		},
		3 : {
			# Dictionary to associate the columns for line items
			'new_field_descriptor_dict' : {
				0 : 'line',
				1 : 'desc',
				2 : 'qty',
				3 : 'unitPrice',
				4 : 'linePrice',
				5 : 'lineDate'
			},
			'page_start' : 26,		 # the first line item on page 3
			'line_item_fields' : 6,	# the number of fields per line item (#, desc, qty, unit price, qty * unit, date)
            'page_pattern_match' : 'Text',     # The text pattern for line item fields on this page.
			'page_first_field_number' : 195,	   # the number of the first field in the first line item from Comptroller's version of the form
			'page_last_field_number' : 314	   # the number of the last field in the last line item from Comptroller's version of the form
		},
		4 : {
			# Dictionary to associate the columns for line items
			'new_field_descriptor_dict' : {
				0 : 'line',
				1 : 'desc',
				2 : 'qty',
				3 : 'unitPrice',
				4 : 'linePrice',
				5 : 'lineDate'
			},
			'page_start' : 46,		 # the first line item on page 4
			'line_item_fields' : 6,	# the number of fields per line item (#, desc, qty, unit price, qty * unit, date)
            'page_pattern_match' : 'Text',     # The text pattern for line item fields on this page.
			'page_first_field_number' : 309,	   # the number of the first field in the first line item from Comptroller's version of the form
			'page_last_field_number' : 428	   # the number of the last field in the last line item from Comptroller's version of the form
		}
	}


	# For 4 page pdf
	pages = range(1,4+1)

	for page_number in pages:
		page = the_pdf.pages[page_number-1]	# Adobe pages start at 1, programming starts at 0
		page_data = page_properties[page_number]
		new_field_descriptor_dict = page_data['new_field_descriptor_dict']

		# Special case of page 3 being an abomination.
		if page_number == 3:
			page = fix_page_3(page,page_data)

		# print(page_data)

		for annotation in page['/Annots']:
			if annotation['/Subtype'] == '/Widget':
				if annotation['/T']:
					field_name=annotation['/T'][1:-1]
					# print(field_name)

					# if (field_name.find('Signature') + 1):
					# 	print(annotation)
					# 	print()
					# 	print()

					in_lookup_table = lookup_table.get(field_name,False)
					if in_lookup_table:
						# print('found lookup at ' + field_name)
						# print('new val: ' + in_lookup_table)
						# print()
						annotation.T = in_lookup_table

					in_lookup_table_2 = lookup_table_part2.get(field_name,False)
					if in_lookup_table_2:
						# print('found lookup 2 at ' + field_name)
						# print('new val: ' + in_lookup_table_2)
						# print()
						annotation.T = in_lookup_table_2

					# Look for matches.
					# Add 1, because .find method returns -1 if no match.
					if(field_name.find(page_data['page_pattern_match']) + 1):

						# parse out the number
						text_number=int(field_name[len(page_data['page_pattern_match']):]) # - page_data['page_first_field_number']

						# Don't alter fields outside the range for line items.
						if (text_number in range(page_data['page_first_field_number'], page_data['page_last_field_number'] + 1)):
							# print('found: ' + field_name)
							new_field_number = ((text_number - page_data['page_first_field_number'])//page_data['line_item_fields']) + page_data['page_start']
							new_field_descriptor_key = (text_number - page_data['page_first_field_number']) % page_data['line_item_fields']
							new_field = new_field_descriptor_dict[new_field_descriptor_key] + str(new_field_number)
							annotation.T = new_field
							# print('translation: ' + new_field)
							# print()
	pdfrw.PdfWriter().write(new_pdf, the_pdf)

if __name__ == "__main__":
	print("running as main")
	process_annotations()
