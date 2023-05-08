<script lang="ts">
  import type { Trace } from '../types'
  export let url: string = ''
  export let trace: Trace[]
  import MaterialSymbolsDeleteOutlineSharp from '~icons/material-symbols/delete-outline-sharp'
  import MaterialSymbolsDownload from '~icons/material-symbols/download'
  import { downloadReport } from '../utils'
  const handleRemove = async () => {
    const { urls: allUrls } = await chrome.storage.local.get('urls')
    const ix = allUrls.indexOf(url)
    allUrls.splice(ix, 1)
    const urls = allUrls as string[]
    const _ = await chrome.storage.local.set({ urls })
  }
</script>

<div
  class="flex text-align align-middle border border-gray-100 space-y-2 space-x-3"
>
  <button on:click={() => downloadReport(url, trace)}>
    <MaterialSymbolsDownload class="mt-2" />
  </button>
  <div class="truncate max-w-sm">
    {url}
  </div>
  <button on:click={handleRemove} class="absolute right-5">
    <MaterialSymbolsDeleteOutlineSharp />
  </button>
</div>
