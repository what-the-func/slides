<script setup>
defineProps({
  color: { type: String, default: 'pink' }
})

const colors = {
  pink: { border: '#ff7edb', glow: 'rgba(255,126,219,0.3)' },
  cyan: { border: '#36f9f6', glow: 'rgba(54,249,246,0.3)' },
  yellow: { border: '#fede5d', glow: 'rgba(254,222,93,0.3)' },
}
</script>

<template>
  <div
    class="p-6 rounded-lg"
    :style="{
      border: `1px solid ${colors[color].border}`,
      boxShadow: `0 0 15px ${colors[color].glow}, inset 0 0 15px ${colors[color].glow}`,
      background: 'rgba(30, 26, 46, 0.8)'
    }"
  >
    <slot />
  </div>
</template>
