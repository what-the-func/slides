<template>
  <div class="slidev-layout section h-full grid place-content-center text-center relative">
    <div class="absolute inset-0 opacity-5">
      <div class="h-full w-full" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,126,219,0.1) 2px, rgba(255,126,219,0.1) 4px);"></div>
    </div>
    <div class="relative">
      <slot />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3.5rem !important;
  text-shadow: 0 0 20px rgba(255, 126, 219, 0.7), 0 0 60px rgba(255, 126, 219, 0.3), 0 0 100px rgba(255, 126, 219, 0.1) !important;
}
</style>
