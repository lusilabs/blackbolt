import {
  interval,
  mergeMap,
  tap,
} from 'rxjs'
import { debounce } from 'lodash';
import type { Trace } from './types';

// console.log(
//   'env variables from content script',
//   import.meta.env,
//   'document cookies from content script',
//   document.cookie
// )

const BUFFER_TTL = 500
let URLs = []
let personId: string;

console.log('latest May 1')

const shouldStart = () => interval(1000)
.pipe(
  mergeMap(_ => chrome.storage.local.get(['urls', 'identity'])),
  tap(({urls = [], identity = ''}) => {
    URLs = urls
    personId = identity
  })
)

shouldStart().subscribe({
  next: n => console.info('tick'),
  error: console.error,
  complete: () => console.info('##COMPLETE')
})

const saveTracesToUrls = (buffer: Trace[]) => {
  const shouldSave = URLs.some(url => window.location.href.includes(url))
  const ts = Date.now()
  const key = `##URL!${window.location.href}!${ts}` // '!' is encoded in URLs so safe to split by it
  const _ = shouldSave && chrome.storage.local.set({[key]: buffer})
}

let buffer: Trace[] = []

const debouncedCaptureKeylogBuffer = debounce(async () => {
  if (buffer.length > 0) {
    saveTracesToUrls(buffer)
    buffer = []
  }
}, BUFFER_TTL);

const captureKeyboardEvent = (e: KeyboardEvent) => {
  let trace = {
    event: e.type, 
    key: e.key,
    code: e.code,
    keyCode: e.keyCode,
    unixTimestamp: Date.now(),
    clientId: window.location.href,
    personId,
    resourceId: window.location.pathname,
    courseId: '##placeholder',
    eventId: '##placeholder',
  };
  buffer.push(trace)
  debouncedCaptureKeylogBuffer();
}

document.addEventListener("keyup", captureKeyboardEvent)
document.addEventListener('keydown', captureKeyboardEvent)
