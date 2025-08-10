<template>
  <footer
    class="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-default"
  >
    <div
      class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <!-- Logo / Nombre -->
      <div class="flex items-center gap-2">
        <span class="text-2xl">🚀</span>
        <span class="font-semibold text-gray-800 dark:text-gray-100 text-lg">
          Sumsy
        </span>
      </div>

      <div
        class="border-b border-gray-200 dark:border-gray-700 py-4 text-center text-xs text-gray-500 dark:text-gray-400"
      >
        © {{ new Date().getFullYear() }} Sumsy — Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>
