<template>
  <footer
    class="w-full border-t border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-900 cursor-default transition-colors duration-500"
  >
    <div
      class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <!-- Logo / Nombre -->
      <div class="flex items-center gap-3">
        <Logo class="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <span
          class="font-semibold text-blue-700 dark:text-blue-300 text-lg select-none"
        >
          Sumsy
        </span>
      </div>

      <div
        class="border-b border-blue-200 dark:border-blue-700 py-4 text-center text-xs text-blue-600 dark:text-blue-400"
      >
        © {{ new Date().getFullYear() }} Sumsy — Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
import Logo from "@/shared/icons/favicon.svg";
</script>
