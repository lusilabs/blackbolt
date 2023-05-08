import { writable } from 'svelte/store'

const chromeStorageLocalStore = async (
  key: string,
  defaultValue: any = ''
) => {
  const stored = (await chrome.storage.local.get(key))[key] ?? defaultValue
  const interval = writable(stored)
  interval.subscribe(async v => await chrome.storage.local.set({ [key]: v }))
  return interval
}

export default chromeStorageLocalStore
