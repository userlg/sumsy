<script setup lang="ts">

import DarkMode from "@/components/ButtonDarkMode.vue";

</script>
<template>

 <div
        class="container mx-auto flex items-center justify-between px-6 py-4"
      >
        <!-- Logo -->
        <h1 class="text-lg font-semibold">Sumsy</h1>

        <!-- Navegación -->
        <nav class="flex gap-4">
          <router-link
            to="/"
            class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Inicio
          </router-link>
          <router-link
            to="/summaries"
            class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Tabla
          </router-link>
        </nav>

        <!-- Botón Dark Mode -->
        <DarkMode />
      </div>

</template>