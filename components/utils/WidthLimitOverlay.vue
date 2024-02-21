<template>
  <div class="overlay no-select">
    <div>
      <div class="d-flex justify-center">
        <v-icon icon="mdi-arrow-expand" size="200" />
      </div>
      <div class="mt-5 d-flex justify-center text-h4">页面宽度不足</div>
      <div class="d-flex justify-center text-caption font-weight-bold">
        请使用更宽的屏幕浏览本页面
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 24px;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
