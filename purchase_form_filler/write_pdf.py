import fillpdf
from fillpdf import fillpdfs
import pprint as pp
from field_dict import field_dict


# fields = fillpdfs.get_form_fields('gift_rq.pdf')

fill_dict = {
    'FieldLck2': "Mike Kutzer"
}

pp.pprint(field_dict)

new_dict = {}
for k, v in field_dict.items():
    new_dict.update({v: k})

pp.pprint(new_dict)

fillpdfs.write_fillable_pdf('gift_rq.pdf', 'new_rq.pdf', new_dict)
