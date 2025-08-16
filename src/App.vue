<script setup lang="ts">
import NavBar from "@/shared/components/NavBar.vue";
import Footer from "@/shared/components/Footer.vue";
import { useDarkModeStore } from "@/stores/darkModeStore";

const darkMode = useDarkModeStore();
darkMode.initTheme();
</script>

<template>
  <div
    class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500"
    @contextmenu.prevent
  >
    <!-- HEADER -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <NavBar />
    </header>

    <!-- MAIN -->
    <main class="flex-1 py-8 flex justify-center" aria-live="polite">
      <div class="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <transition name="bounce" mode="in-out">
          <router-view />
        </transition>
      </div>
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>
