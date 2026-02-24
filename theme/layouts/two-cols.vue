<template>
  <div class="slidev-layout two-cols p-10 h-full grid grid-cols-2 gap-8">
    <div class="col-left">
      <slot name="default" />
    </div>
    <div class="col-right">
      <slot name="right" />
    </div>
  </div>
</template>
