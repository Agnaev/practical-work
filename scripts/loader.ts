import { $ } from './liba'
import type { Liba } from './liba'

const $loader: Liba = $('.loader')
const buttons: Liba[] = [
    '#drawChart',
    '#fillRandom'
].map($)

function show() {
    buttons.map(el => el.attr('disabled', 'disabled'))
    $loader.css({
        display: 'inline'
    })
}

function hide() {
    buttons.map(el => el.rmAttr('disabled'))
    $loader.css({
        display: 'none'
    })
}

export const loader = {
    show,
    hide
}
