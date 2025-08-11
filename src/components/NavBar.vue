<script setup lang="ts">
import DarkMode from "@/components/ButtonDarkMode.vue";
</script>

<template>
  <div
    class="container mx-auto flex items-center justify-between px-6 py-5
           bg-white dark:bg-gray-800
           border-b border-blue-300 dark:border-blue-700"
  >
    <!-- Logo -->
    <h1
      class="text-xl font-semibold text-blue-700 dark:text-blue-300 select-none"
    >
      Sumsy
    </h1>

    <!-- Navegación -->
    <nav class="flex gap-6">
      <router-link
        to="/"
        class="text-blue-700 dark:text-blue-300
               hover:text-blue-500 dark:hover:text-blue-400
               transition-colors font-medium"
      >
        Inicio
      </router-link>
      <router-link
        to="/summaries"
        class="text-blue-700 dark:text-blue-300
               hover:text-blue-500 dark:hover:text-blue-400
               transition-colors font-medium"
      >
        Tabla
      </router-link>
    </nav>

    <!-- Botón Dark Mode -->
    <DarkMode />
  </div>
</template>
