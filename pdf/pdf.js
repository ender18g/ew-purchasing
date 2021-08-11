// Example of constructing pdfform
// If you don't care about which PDF library to use, just call without arguments, as in
// pdfform().transform(..) / pdfform().list_fields(...)
function make_pdfform() {
	var lib_name = document.querySelector('input[name="pdflib"]:checked').value;
	return pdfform(lib_name === 'minipdf' ? minipdf : minipdf_js);
}

function get_params() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const fireKey = urlParams.get('fireKey');
	return { fireKey: fireKey };
}

// Example of listing all fields

// Example of filling out fields
async function fill(buf) {
	var filled_pdf; // Uint8Array
	const params = get_params();
	const { fireKey } = params;
	const order_url = `https://ew-purchasing-default-rtdb.firebaseio.com/orders/${fireKey}.json`;
	const fields = {};
	const [ lookup, fireUrl ] = await Promise.all([ axios.get('lookup.json'), axios.get(order_url) ]);
	const fireData = fireUrl.data;
	const lookupData = lookup.data;
	console.log(fireData);
	console.log(lookupData);
	for (const [ key, value ] of Object.entries(fireUrl.data)) {
		//look at the key of the firebase object
		fields[lookupData[key]] = [ value ];
		if (key === 'date') {
			const dateArray = value.split('-');
			const dateString = [ dateArray[1], dateArray[2], dateArray[0] ].join('/');
			fields[lookupData[key]] = [ dateString ];
		}
	}
	console.log(fields);
	filled_pdf = make_pdfform().transform(buf, fields);
	var blob = new Blob([ filled_pdf ], { type: 'application/pdf' });
	saveAs(blob, `RQ_VolgenauFY21_${fireData.merchant}_${fireData.date}.pdf`);
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
	//cur_file.appendChild(document.createTextNode('loaded file ' + filename + ' (' + buf.byteLength + ' Bytes)'));
	var reload_btn = document.createElement('button');
	reload_btn.appendChild(document.createTextNode('use another file'));
	//cur_file.appendChild(reload_btn);
	document.querySelector('.fill').removeAttribute('disabled');
}

var url_form = document.querySelector('.url_form');

document.addEventListener('DOMContentLoaded', function() {
	console.log('domcontentloaded');
	// Download by URL
	// Note that this just works for URLs in the same origin, see Same-Origin Policy

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

	var fill_btn = document.querySelector('.fill');
	fill_btn.addEventListener('click', function(e) {
		e.preventDefault();
		console.log('Filling!');
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

setTimeout(() => {
	document.querySelector('.url_form button').click();
}, 500);

setTimeout(() => {
	document.querySelector('.generatingText').classList.toggle('hide');
	document.querySelector('.spinnerDiv').classList.toggle('visually-hidden');
	document.querySelector('.fill_form').classList.toggle('hide');
}, 3000);
