<template>
  <div class="slidev-layout image-right h-full grid grid-cols-2">
    <div class="p-10 flex flex-col justify-center">
      <slot name="default" />
    </div>
    <div class="h-full w-full" :style="{ backgroundImage: `url(${$attrs.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
      <slot name="right" />
    </div>
  </div>
</template>
