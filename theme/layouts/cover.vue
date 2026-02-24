<template>
  <div class="slidev-layout cover h-full grid place-content-center text-center relative overflow-hidden">
    <!-- Retro grid floor -->
    <div class="absolute inset-0" style="background: linear-gradient(180deg, #262335 0%, #262335 50%, #1a1a2e 100%);">
      <div class="absolute bottom-0 left-0 right-0 h-1/2" style="
        background-image: linear-gradient(rgba(255, 126, 219, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 126, 219, 0.15) 1px, transparent 1px);
        background-size: 60px 60px;
        transform: perspective(300px) rotateX(60deg);
        transform-origin: bottom;
      "></div>
      <!-- Horizon glow -->
      <div class="absolute left-0 right-0" style="top: 48%; height: 4px; background: linear-gradient(90deg, transparent, #ff7edb, #36f9f6, #ff7edb, transparent); box-shadow: 0 0 30px #ff7edb, 0 0 60px rgba(255,126,219,0.3);"></div>
    </div>
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
