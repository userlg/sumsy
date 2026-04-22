<script setup lang="ts">
  /**
   * @file App.vue
   * @namespace src
   * @description App main component
   *
   * @component
   * @example
   * <App />
   */

  import NavBar from '@/shared/components/NavBar.vue';
  import Footer from '@/shared/components/Footer.vue';
  import { useDarkModeStore } from '@/stores/darkModeStore';

  const darkMode = useDarkModeStore();
  darkMode.initTheme();
</script>

<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-500"
    @contextmenu.prevent
  >
    <!-- HEADER -->
    <NavBar />

    <!-- MAIN -->
    <main class="flex-1 py-8 flex justify-center" aria-live="polite">
      <div class="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>
