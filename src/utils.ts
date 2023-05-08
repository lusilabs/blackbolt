import { from, timer, merge, first } from 'rxjs'
import type { Trace } from './types'

export function waitForElements(
  selector: string,
  moreThan = 0
): Promise<NodeListOf<HTMLElement>> {
  return new Promise(resolve => {
    let ele = document.querySelectorAll(selector)
    if (ele.length > moreThan) return resolve(ele as NodeListOf<HTMLElement>)
    const observer = new MutationObserver(mutations => {
      ele = document.querySelectorAll(selector)
      if (ele.length > moreThan) {
        resolve(ele as NodeListOf<HTMLElement>)
        observer.disconnect()
      }
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export function waitForElement(selector: string): Promise<HTMLElement> {
  return new Promise(resolve => {
    let ele = document.querySelector(selector)
    if (ele) return resolve(ele as HTMLElement)
    const observer = new MutationObserver(mutations => {
      ele = document.querySelector(selector)
      if (ele) {
        resolve(ele as HTMLElement)
        observer.disconnect()
      }
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export const waitForElementsTimeout$ = (
  query: string,
  seconds = 1,
  moreThan = 0
) =>
  merge(timer(seconds * 1000), from(waitForElements(query, moreThan))).pipe(
    first()
  )

export const waitForElementTimeout$ = (query: string, seconds = 1) =>
  merge(timer(seconds * 1000), from(waitForElement(query))).pipe(first())

export const downloadReport = (url: string, data: Trace[]): void => {
  const content = JSON.stringify({data})
  downloadContent(content, url, 'text/json', '.json')
}

export const downloadReports = (urls: string[], tracesForUrl: Record<string, Trace[]>):void => {
  urls.forEach(url => { downloadReport(url, tracesForUrl[url]) })
}

export const arrayToCsvString = (arr: any[]): string =>
  arr.map(row =>
    row
      .map(String)
      .map((v: string) => v.replaceAll('"', '""'))
      .map((v: string) => `"${v}"`)
      .join(',')
  ).join('\r\n')

export const downloadContent = (content:any, title: string, contentType = 'text/csv;charset=utf-8;', extension='.csv'):void => {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const _a = document.createElement('a')
  _a.href = url
  _a.setAttribute('download', title + extension)
  _a.click()
}
