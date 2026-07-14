/**
 * Shared umbrella validation.
 * Requires API_BASE_URL (from config.js) to be loaded first.
 *
 * Conventions:
 *   - Umbrella input:  first element matching [data-umbrella-input], #umbrellaInput, or #umbrella
 *   - Hint span:       #umbrellaHint  (data-hint-class overrides the CSS class prefix, default: 'field-hint')
 *   - Gated buttons:   any element with [data-umbrella-gate] attribute
 *
 * Exposes globals:
 *   umbrellaIsValid  — boolean getter
 *   umbrellaValidate — async function, can be awaited
 */
(function () {
	const input = document.querySelector('[data-umbrella-input]')
	           || document.getElementById('umbrellaInput')
	           || document.getElementById('umbrella');
	const hint  = document.getElementById('umbrellaHint');

	if (!input || !hint) return;

	const hintClass = hint.dataset.hintClass || 'field-hint';
	const gates     = document.querySelectorAll('[data-umbrella-gate]');

	let _valid = false;

	Object.defineProperty(window, 'umbrellaIsValid', { get: function () { return _valid; } });

	function setHint(text, type) {
		hint.textContent = text;
		hint.className   = hintClass + (type ? ' ' + type : '');
		_valid           = (type === 'found');
		gates.forEach(function (el) { el.disabled = !_valid; });
	}

	async function validate() {
		const value = input.value.trim();
		if (!value) { setHint('Please enter an umbrella name.', 'notfound'); return; }
		setHint('Checking\u2026');
		try {
			const res  = await fetch(API_BASE_URL + '/api/PlugEventOrgs?filter=' + encodeURIComponent(value), { cache: 'no-store' });
			if (!res.ok) throw new Error('HTTP ' + res.status);
			const data  = await res.json();
			const found = Array.isArray(data) ? data.length > 0 : !!data;
			setHint(found ? '\u2713 Umbrella found' : 'Umbrella not found. Please check the name.', found ? 'found' : 'notfound');
		} catch (e) {
			setHint('Could not verify umbrella. Please try again.', 'notfound');
		}
	}

	input.addEventListener('blur', validate);
	input.addEventListener('input', function () {
		_valid = false;
		gates.forEach(function (el) { el.disabled = true; });
		setHint('');
	});

	window.umbrellaValidate = validate;
	validate();
})();
