<script setup>
defineProps({
  color: { type: String, default: 'pink' }
})

const glows = {
  pink: '#ff7edb',
  cyan: '#36f9f6',
  yellow: '#fede5d',
}
</script>

<template>
  <span
    :style="{
      color: glows[color],
      textShadow: `0 0 10px ${glows[color]}80, 0 0 40px ${glows[color]}40`
    }"
  ><slot /></span>
</template>
