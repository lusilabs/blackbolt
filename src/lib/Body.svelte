<script lang="ts">
  import {
    debounce,
    includes,
    orderBy,
    pick,
    pickBy,
    sortBy,
    values,
  } from 'lodash'
  import chromeStorageLocalStore from '../stores/localstorage'
  import { get, writable, derived } from 'svelte/store'
  import SvgSpinners270RingWithBg from '~icons/svg-spinners/270-ring-with-bg'
  import type { Trace } from '../types'
  import TraceDiv from './Trace.svelte'
  import MaterialSymbolsDownload from '~icons/material-symbols/download'
  import MaterialSymbolsSortByAlpha from '~icons/material-symbols/sort-by-alpha'
  import MdiSortClockAscending from '~icons/mdi/sort-clock-ascending'
  import { downloadReport, downloadReports } from '../utils'

  let urls = writable([])
  let search = ''
  let sort = true
  let exactMatch = writable(0) // select's have an annoying error on the console where if it's undefined it complains with TypeError
  let traceByUrl: Record<string, Trace[]> = {}

  ;(async () => {
    urls = await chromeStorageLocalStore('urls', [])
    exactMatch = await chromeStorageLocalStore('exactMatch', 0)
  })()

  const URLMatches = [
    { value: 0, text: 'entire domain' },
    { value: 1, text: 'exact match' },
  ]

  const getCurrentURL = async (): Promise<string> => {
    const [tab] = await chrome.tabs.query({
      active: true,
    })
    return tab.url
  }

  setInterval(async () => {
    const { urls: _urls = [] } = await chrome.storage.local.get(['urls'])
    $urls = _urls
  }, 1000) // this keep in sync new urls

  setInterval(async () => {
    traceByUrl = {}
    const all = await chrome.storage.local.get()
    const urlValues = Object.values($urls)
    const traces = Object.keys(all).filter(
      k => k.includes('##URL') && urlValues.some(url => k.includes(url))
    )
    urlValues.forEach((url: string) => {
      const matches = traces.filter(k => k.includes(url))
      const sortedMatches = matches.sort(
        (a, b) => b.split('!')[2] - a.split('!')[2] // reverse chronological ordering
      )
      let data = Object.values(pick(all, sortedMatches))
      data = data.flat()
      traceByUrl[url] = data
    })
  }, 3000)

  let loading = false

  const handleAddURL = async (e: Event) => {
    loading = true
    const currentURL = await getCurrentURL()
    const url = new URL(currentURL)
    const u = $exactMatch ? url.href : url.origin
    $urls = $urls.includes(u) ? $urls : [...$urls, u]
    debounce(() => {
      loading = false
    }, 1000)()
  }
</script>

<main class="flex flex-col space-y-2">
  <section class="flex flex-col mx-4 py-4 space-y-4 border-b-2 border-gray-200">
    <button
      class="text-center text-white align-middle bg-blue-500
        shadow-sm max-w-md h-12 rounded-md
      "
      name="add"
      disabled={loading}
      on:click={handleAddURL}
    >
      {#if loading}
        <div class="flex justify-center space-x-3">
          <SvgSpinners270RingWithBg />
          <p>Adding...</p>
        </div>
      {:else}
        <p class="text-white">Add current page</p>
      {/if}
    </button>

    <div class="flex align-middle text-center space-y-1">
      <select
        class="bg-gray-50 border border-gray-300 shadow-sm p-2 pl-4 rounded-md w-48 focus:ring-blue-500 focus:border-blue-500"
        bind:value={$exactMatch}
      >
        {#each URLMatches as match}
          <option value={match.value}>
            {match.text}
          </option>
        {/each}
      </select>
    </div>
  </section>

  <section class="flex flex-col py-4 space-y-4 mx-4 border-b-2 border-gray-200">
    <div class="flex m-1 space-x-2 align-middle">
      <button
        on:click={() => downloadReports(Object.values($urls), traceByUrl)}
      >
        <MaterialSymbolsDownload font-size={30} />
      </button>
      <MaterialSymbolsSortByAlpha font-size={30} />
      <MdiSortClockAscending font-size={30} />
      <div class="relative mb-4 flex w-full flex-wrap items-stretch ml-2">
        <input
          type="search"
          class="relative m-0 block w-[1px] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
          placeholder="filter by name"
          aria-label="filter by name"
          aria-describedby="button-addon2"
          bind:value={search}
        />

        <span
          class="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700"
          id="basic-addon2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-5 w-5"
          >
            <path
              fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
    <div class="flex flex-col align-middle text-center ml-4 space-y-1">
      {#each Object.values($urls).filter(url => url.includes(search)) as url}
        <TraceDiv {url} trace={traceByUrl[url]} />
      {/each}
    </div>
  </section>
</main>
