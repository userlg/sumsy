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

  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import NavBar from '@/shared/components/NavBar.vue';
  import Footer from '@/shared/components/Footer.vue';
  import BackToTop from '@/shared/components/BackToTop.vue';
  import { useDarkModeStore } from '@/stores/darkModeStore';

  const darkMode = useDarkModeStore();
  darkMode.initTheme();

  // Views slide in the direction of the nav: going right in the menu slides left, and back.
  const route = useRoute();
  const transitionName = ref('view-forward');
  watch(
    () => route.meta.order,
    (to, from) => {
      transitionName.value = (to ?? 0) >= (from ?? 0) ? 'view-forward' : 'view-back';
    }
  );
</script>

<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-500"
    @contextmenu.prevent
  >
    <!-- HEADER -->
    <NavBar />

    <!-- MAIN -->
    <main class="flex-1 py-8 flex justify-center overflow-x-clip" aria-live="polite">
      <div class="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <router-view v-slot="{ Component }">
          <transition :name="transitionName" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- FOOTER -->
    <Footer />

    <BackToTop />
  </div>
</template>
