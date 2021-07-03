// Example of constructing pdfform
// If you don't care about which PDF library to use, just call without arguments, as in
// pdfform().transform(..) / pdfform().list_fields(...)
function make_pdfform() {
	var lib_name = document.querySelector('input[name="pdflib"]:checked').value;
	return pdfform(lib_name === 'minipdf' ? minipdf : minipdf_js);
}

// Example of listing all fields

// Example of filling out fields
async function fill(buf) {
	var filled_pdf; // Uint8Array
	const order_url = 'https://ew-purchasing-default-rtdb.firebaseio.com/orders/-Md_13JNqSee61aKq-h0.json';
	const fields = {};
	const lookup = await axios.get('lookup.json');
	const fireUrl = await axios.get(order_url);
	const fireData = fireUrl.data;
	const lookupData = lookup.data;
	console.log(fireData);
	console.log(lookupData);
	for (const [ key, value ] of Object.entries(fireUrl.data)) {
		//look at the key of the firebase object
		fields[lookupData[key]] = [ value ];
	}
	console.log(fields);
	filled_pdf = make_pdfform().transform(buf, fields);
	var blob = new Blob([ filled_pdf ], { type: 'application/pdf' });
	saveAs(blob, 'pdfform.js_generated.pdf');
}

// From here on just code for this demo.
// This will not feature in your website
function on_error(e) {
	console.error(e, e.stack); // eslint-disable-line no-console
	var div = document.createElement('div');
	div.appendChild(document.createTextNode(e.message));
	document.querySelector('.error').appendChild(div);
}

function empty(node) {
	var last;
	while ((last = node.lastChild)) {
		node.removeChild(last);
	}
}

var current_buffer;

function on_file(filename, buf) {
	current_buffer = buf;
	document.querySelector('.url_form').setAttribute('style', 'display: none');
	var cur_file = document.querySelector('.cur_file');
	empty(cur_file);
	cur_file.setAttribute('style', 'display: block');
	cur_file.appendChild(document.createTextNode('loaded file ' + filename + ' (' + buf.byteLength + ' Bytes)'));
	var reload_btn = document.createElement('button');
	reload_btn.appendChild(document.createTextNode('use another file'));
	cur_file.appendChild(reload_btn);
	document.querySelector('.fill').removeAttribute('disabled');
}

document.addEventListener('DOMContentLoaded', function() {
	// Download by URL
	// Note that this just works for URLs in the same origin, see Same-Origin Policy
	var url_form = document.querySelector('.url_form');
	url_form.addEventListener('submit', function(e) {
		e.preventDefault();
		var url = document.querySelector('input[name="url"]').value;

		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = function() {
			if (this.status == 200) {
				on_file(url.split(/\//).pop(), this.response);
			} else {
				on_error('failed to load URL (code: ' + this.status + ')');
			}
		};

		xhr.send();
	});

	document.querySelector('.url_form input[name="file"]').addEventListener('change', function(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(ev) {
			on_file(file.name, ev.target.result);
		};
		reader.readAsArrayBuffer(file);
	});

	var fill_form = document.querySelector('.fill_form');
	fill_form.addEventListener('submit', function(e) {
		e.preventDefault();
		fill(current_buffer);
	});

	var cur_file = document.querySelector('.cur_file');
	cur_file.addEventListener('submit', function(e) {
		e.preventDefault();
		empty(document.querySelector('.error'));
		cur_file.setAttribute('style', 'display: none');
		url_form.setAttribute('style', 'display: block');
	});

	var pdflib_radios = document.querySelectorAll('input[name="pdflib"]');
	for (var i = 0; i < pdflib_radios.length; i++) {
		var r = pdflib_radios[i];
		r.addEventListener('change', function() {
			if (current_buffer) {
				list(current_buffer);
			}
		});
	}

	document.querySelector('.loading').setAttribute('style', 'display: none');
});
