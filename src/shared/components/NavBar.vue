<script setup lang="ts">
import { ref } from "vue";
import DarkMode from "@/shared/components/ButtonDarkMode.vue";

const isOpen = ref(false);
</script>

<template>
  <header
    class="bg-white dark:bg-gray-800 border-b border-blue-300 dark:border-blue-700 shadow-sm"
  >
    <div class="container mx-auto flex items-center justify-between px-6 py-4">
      <!-- Logo -->
      <router-link
        to="/"
        class="text-2xl font-bold text-blue-700 dark:text-blue-300 select-none hover:opacity-90 transition"
        aria-label="Ir a inicio"
      >
        Sumsy
      </router-link>

      <!-- Navegación -->
      <nav class="hidden md:flex gap-6">
        <router-link to="/" class="nav-link" active-class="nav-active" exact>
          Inicio
        </router-link>
        <router-link to="/summaries" class="nav-link" active-class="nav-active">
          Resumen
        </router-link>
        <router-link to="/cases" class="nav-link" active-class="nav-active">
          Casos
        </router-link>
      </nav>

      <!-- Botón Dark Mode -->
      <div class="flex items-center gap-4">
        <DarkMode />

        <!-- Botón hamburguesa móvil -->
        <button
          class="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          @click="isOpen = !isOpen"
          aria-label="Menú"
        >
          ☰
        </button>
      </div>
    </div>

    <!-- Menú móvil -->
    <transition name="fade">
      <nav
        v-if="isOpen"
        class="md:hidden flex flex-col gap-4 px-6 pb-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <router-link to="/" class="nav-link" active-class="nav-active" exact>
          Inicio
        </router-link>
        <router-link to="/summaries" class="nav-link" active-class="nav-active">
          Resumen
        </router-link>
        <router-link to="/cases" class="nav-link" active-class="nav-active">
          Casos
        </router-link>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
