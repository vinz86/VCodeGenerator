<script setup lang="ts">
</script>
<template>
  <div>
    <Toolbar>
      <template #start>
        <div class="logo">VCodeGenerator <i class="text-sm">0.0.1-rc</i></div>
      </template>

      <template #center>
      </template>

      <template #end>
      </template>
    </Toolbar>

    <slot />
    <div class="text-sm text-center font-light pt-1 pb-1">Copyright &copy; {{new Date().getFullYear()}} vcodegenerator.com. All right reserved</div>
  </div>
</template>