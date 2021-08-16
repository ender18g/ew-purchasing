from ew_purchasing_lookup_json import *

new_dict = {}
def translate():
	for k in lookup:
		new_dict[lookup[k]]=k
	return new_dict

translate()