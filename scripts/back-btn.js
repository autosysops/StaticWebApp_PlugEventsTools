// Resolves the optional `returnTo` query parameter and updates the #backBtn href.
// Only same-origin http(s) URLs are accepted; invalid or cross-origin values are
// silently ignored and the default href set in HTML is kept.
(function () {
	const params = new URLSearchParams(location.search);
	const raw = params.get('returnTo');
	if (!raw) return;
	try {
		const decoded = decodeURIComponent(raw);
		const resolved = new URL(decoded);
		if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
			const safePath = resolved.origin + resolved.pathname;
			const btn = document.getElementById('backBtn');
			if (btn) btn.setAttribute('href', safePath);
		}
	} catch (e) {
		// ignore invalid values and keep default
	}
})();
