<script setup lang="ts">
import { ref } from "vue";
import DarkMode from "@/shared/components/ButtonDarkMode.vue";

const isOpen = ref(false);
</script>

<template>
  <header
    class="bg-white dark:bg-gray-800 border-b border-blue-300 dark:border-blue-700 shadow-sm"
  >
    <div class="container mx-auto flex items-center justify-between px-6 py-3">
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
          class="md:hidden p-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          @click="isOpen = !isOpen"
          aria-label="Menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menú móvil -->
    <transition name="fade" mode="out-in">
      <nav
        v-if="isOpen"
        class="md:hidden flex flex-col gap-4 px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
