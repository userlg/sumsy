<script setup lang="ts">
  /**
   * @file NavBar.vue
   * @namespace src.shared.components
   * @description Navigation bar component for the application
   *
   * @component
   * @example
   * <NavBar />
   */

  import { ref } from 'vue';
  import DarkMode from '@/shared/components/ButtonDarkMode.vue';
  import { useUserStore } from '@/stores/user.store';

  const userStore = useUserStore();

  const isOpen = ref(false);
</script>

<template>
  <header class="bg-white dark:bg-gray-800 border-b border-blue-300 dark:border-blue-700 shadow-sm">
    <div class="container mx-auto flex items-center justify-between px-6 py-3">
      <!-- Logo -->
      <router-link
        to="/"
        class="text-2xl font-bold text-blue-700 dark:text-blue-300 select-none hover:opacity-90 transition"
        aria-label="Ir a inicio"
      >
        Sumsy
      </router-link>

      <!-- Navigation -->
      <nav class="hidden md:flex gap-6">
        <router-link to="/" class="nav-link" active-class="nav-active" exact>Inicio</router-link>
        <router-link to="/summaries" class="nav-link" active-class="nav-active">
          Resumen
        </router-link>
        <router-link to="/cases" class="nav-link" active-class="nav-active">Casos</router-link>
        <router-link to="/graphs" class="nav-link" active-class="nav-active">
          Estadísticas
        </router-link>
      </nav>

      <!-- Button Dark Mode -->
      <div class="flex items-center gap-4 cursor-default">
        <div v-if="userStore.getName && userStore.getName.trim() !== ''">
          <span class="text-gray-800 dark:text-white">{{ userStore.getName }}</span>
        </div>

        <DarkMode />

        <!-- Burger icon menu -->
        <button
          class="md:hidden p-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Menú"
          @click="isOpen = !isOpen"
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

    <!-- Mobile menu -->
    <transition name="fade" mode="out-in">
      <nav
        v-if="isOpen"
        class="md:hidden flex flex-col gap-4 px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <router-link to="/" class="nav-link" active-class="nav-active" exact>Inicio</router-link>
        <router-link to="/summaries" class="nav-link" active-class="nav-active">
          Resumen
        </router-link>
        <router-link to="/cases" class="nav-link" active-class="nav-active">Casos</router-link>
      </nav>
    </transition>
  </header>
</template>
