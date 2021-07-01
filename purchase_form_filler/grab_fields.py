import fillpdf
from fillpdf import fillpdfs
import pprint as pp


fields = fillpdfs.get_form_fields('gift_rq.pdf')

pp.pprint(fields)
