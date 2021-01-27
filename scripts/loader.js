import {$} from './liba'

const $loader = $('.loader')
const buttons = ['#drawChart', '#fillRandom'].map(selector => $(selector))

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
