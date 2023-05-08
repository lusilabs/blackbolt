import { writable } from 'svelte/store'

const stored = localStorage.getItem('interval') || 'default interval '

export const interval = writable(stored)

interval.subscribe(v => localStorage.setItem('interval', v))
