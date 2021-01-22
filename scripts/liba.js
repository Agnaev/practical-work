class Liba {
	constructor(selector) {
		if (selector instanceof Liba) {
			this.$el = selector.$el
		}
		else if (typeof selector === 'string') {
			this.$el = document.querySelector(selector)
		}
		else throw new TypeError('Could not find element by selector: ' + selector)
	}

	html(html) {
		if (html) {
			this.$el.innerHTML = html
			return this
		}
		return this.$el.innerHTML
	}

	attr(key, val) {
		if (val) {
			this.$el.setAttribute(key, val)
			return this
		}
		return this.$el.getAttribute(key)
	}
}

function $(selector) {
	return new Liba(selector)
}
