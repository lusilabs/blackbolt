<script lang="ts">
  export let viewInfo: boolean
  import MaterialSymbolsHelp from '~icons/material-symbols/help'
  import MaterialSymbolsSettings from '~icons/material-symbols/settings'
  import RaphaelList from '~icons/raphael/list'
</script>

<nav class="flex p-2 mx-4 justify-end space-x-2 border-b-2 border-gray-200">
  <MaterialSymbolsSettings font-size={20} />
  <button
    on:click={() => {
      viewInfo = !viewInfo
    }}
  >
    <MaterialSymbolsHelp
      class={!viewInfo ? 'text-black' : 'text-blue-600'}
      font-size={20}
    />
  </button>
  <RaphaelList font-size={20} />
</nav>
