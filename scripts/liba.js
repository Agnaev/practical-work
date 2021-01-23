class Liba {
	constructor(selector) {
		if (selector instanceof Liba) {
			this.$el = selector.$el
		}
		else if (typeof selector === 'string') {
			this.$el = document.querySelector(selector)
		}
		else if (selector instanceof HTMLElement) {
			this.$el = selector
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

	getClientRect() {
		return this.$el.getBoundingClientRect()
	}

	css(styles) {
		Object.entries(styles)
			.map(([key, value]) => {
				key = key.split(/(?=[A-Z])/).map(x => x.toLowerCase()).join('-')
				this.$el.style[key] = value
			})
	}

	on(event, callback) {
		this.$el.addEventListener(event, callback)
	}

	off(event, callback) {
		this.$el.removeEventListener(event, callback)
	}

	get data() {
		return new Proxy(this.$el, {
			get(target, key) {
				return target.dataset[key]
			},
			set(target, key, value) {
				target.dataset[key] = value
			}
		})
	}

	clear() {
		this.$el.innerHTML = ''
	}
}

export function $(selector) {
	return new Liba(selector)
}

window.$ = $
