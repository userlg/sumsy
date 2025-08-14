<script setup lang="ts">
import Logo from "@/shared/icons/favicon.svg";
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center p-4 h-full">
    <div>
      <!-- Icon -->
      <Logo
        id="Logo"
        src="@/shared/icons/favicon.svg"
        alt="Sumsy logo"
        class="w-32 h-32 mb-4 hover:scale-110 duration-200"
      />

      <!-- Title -->
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white">Sumsy</h1>
    </div>
  </div>
</template>

<style scoped>
@keyframes logoFloat {
  0% {
    transform: scale(0.9) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) rotate(3deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

#Logo {
  animation: logoFloat 1.2s ease-out forwards;
}
</style>
