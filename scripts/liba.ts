class Liba {
	private $el: HTMLElement|null 
	constructor(selector: string|Liba|HTMLElement) {
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

	html(html: string) {
		if (html) {
			this.clear()
			if (this.$el) {
				this.$el.innerHTML = html
			}
			return this
		}
		return this.$el?.innerHTML
	}

	text(text: string) {
		if (text) {
			if (this.$el) {
				this.$el.innerHTML = text
			}
			return this
		}
		return this.$el?.innerText
	}

	attr(key: string, val: string) {
		if (val) {
			if (this.$el) {
				this.$el.setAttribute(key, val)
			}
			return this
		}
		return this.$el?.getAttribute(key)
	}

	rmAttr(key: string) {
		this.$el?.removeAttribute(key)
	}

	getClientRect() {
		return this.$el?.getBoundingClientRect()
	}

	css(styles: { [prop: string]: string }) {
		if (!this.$el?.style) {
			return
		}
		Object.entries(styles)
			.map(
				([key, value]: [string, string]) => {
					key = key
						.split(/(?=[A-Z])/).map(
							x => x.toLowerCase()
						)
						.join('-')
					// @ts-ignore
					this.$el.style[<any>key] = value
				}
		)
	}

	on(event: string, callback: (evt: Event) => boolean|undefined) {
		this.$el?.addEventListener(event, callback)
	}

	off(event: string, callback: (evt: Event) => boolean|undefined) {
		this.$el?.removeEventListener(event, callback)
	}

	get data() {
		return new Proxy(this.$el as HTMLElement, {
			get(target: HTMLElement, key: string): string {
				return target.dataset[key] as string
			},
			set(target: HTMLElement, key: string, value: any): boolean {
				target.dataset[key] = value
				return true
			}
		})
	}

	clear() {
		if (this.$el) {
			this.$el.innerHTML = ''
		}
	}
}

export function $(selector: string|Liba|HTMLElement) {
	return new Liba(selector)
}

export type { Liba }
