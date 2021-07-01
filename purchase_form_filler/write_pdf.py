import fillpdf
from fillpdf import fillpdfs
import pprint as pp


# fields = fillpdfs.get_form_fields('gift_rq.pdf')

fill_dict = {
    'FieldLck2': "Mike Kutzer"
}

fillpdfs.write_fillable_pdf('gift_rq.pdf', 'new_rq.pdf', fill_dict)
