<template>
  <div class="slidev-layout cover h-full w-full grid place-content-center text-center relative overflow-hidden" style="background: #262335;">
    <!-- Horizon glow line -->
    <div class="absolute left-0 right-0" style="top: 60%; height: 4px; background: linear-gradient(90deg, transparent, #ff7edb, #36f9f6, #ff7edb, transparent); box-shadow: 0 0 30px #ff7edb, 0 0 60px rgba(255,126,219,0.3);"></div>
    <div class="relative z-10 pb-24">
      <slot />
    </div>
  </div>
</template>
