<script lang="ts">
  import Header from './lib/Header.svelte'
  import Body from './lib/Body.svelte'
  let viewInfo = false
</script>

<main class="main flex flex-col divide-solid">
  <Header bind:viewInfo />
  {#if !viewInfo}
    <Body />
  {:else}
    <div class="flex flex-col text-center m-4">
      <!-- <img src="/branding.png" alt="branding" />
      <a
        href="https://webpage"
        target="_blank"
        class="mt-4 text-blue-600 underline">webpage</a
      > -->
    </div>
  {/if}
</main>
