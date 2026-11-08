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

  import { computed, ref } from 'vue';
  import { useScrollY } from '@/shared/composables/useScrollY';
  import DarkMode from '@/shared/components/ButtonDarkMode.vue';
  import { useUserStore } from '@/stores/user.store';

  const userStore = useUserStore();

  const isOpen = ref(false);

  // The bar lifts off the page (stronger blur + shadow) once content scrolls under it.
  const scrollY = useScrollY();
  const isScrolled = computed(() => scrollY.value > 4);
</script>

<template>
  <header
    :class="[
      'navbar sticky top-0 z-50 backdrop-blur-lg border-b',
      isScrolled
        ? 'bg-white/85 dark:bg-slate-900/85 border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/5 dark:shadow-black/20'
        : 'bg-white/60 dark:bg-slate-900/60 border-transparent shadow-none',
    ]"
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

      <!-- User name-->
      <div class="flex items-center gap-4 cursor-default">
        <div v-if="userStore.getName && userStore.getName.trim() !== ''">
          <span
            :class="[
              userStore.getName.toLowerCase() === 'orlando'
                ? 'neon-name'
                : 'text-slate-800 dark:text-white',
            ]"
          >
            {{ userStore.getName }}
          </span>
        </div>

        <!-- Button Dark Mode -->
        <DarkMode />

        <!-- Burger icon menu -->
        <button
          class="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Menú"
          :aria-expanded="isOpen"
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
    <transition name="fade-slide">
      <nav
        v-if="isOpen"
        class="md:hidden flex flex-col gap-4 px-6 py-4 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800"
      >
        <router-link
          to="/"
          class="nav-link"
          active-class="nav-active"
          exact
          @click="isOpen = false"
        >
          Inicio
        </router-link>
        <router-link
          to="/summaries"
          class="nav-link"
          active-class="nav-active"
          @click="isOpen = false"
        >
          Resumen
        </router-link>
        <router-link to="/cases" class="nav-link" active-class="nav-active" @click="isOpen = false">
          Casos
        </router-link>
        <router-link
          to="/graphs"
          class="nav-link"
          active-class="nav-active"
          @click="isOpen = false"
        >
          Estadísticas
        </router-link>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
  .navbar {
    transition:
      background-color 240ms ease,
      border-color 240ms ease,
      box-shadow 240ms ease;
  }
</style>
