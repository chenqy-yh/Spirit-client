<!--
 * @Date: 2024-03-24 13:58:45
 * @LastEditors: Chenqy
 * @LastEditTime: 2024-03-24 13:59:14
 * @FilePath: \server-monitor\src\renderer\src\components\loading\loading-1.vue
 * @Description: True or False
-->
<template>
  <div class="loader">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #240229;
}
.loader {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(#14ffe9, #ffeb3b, #ff00e0);
  animation: animate 0.8s linear infinite;
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loader span {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(#14ffe9, #ffeb3b, #ff00e0);
  animation: animate 0.8s linear infinite;
}
.loader span:nth-child(1) {
  filter: blur(5px);
}
.loader span:nth-child(2) {
  filter: blur(10px);
}
.loader span:nth-child(3) {
  filter: blur(25px);
}
.loader span:nth-child(4) {
  filter: blur(50px);
}
.loader:after {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: #240229;
  border-radius: 50%;
}
</style>
