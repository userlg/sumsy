<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";

import Footer from "./components/Footer.vue";

import { useDarkModeStore } from "@/stores/darkMode";

const darkMode = useDarkModeStore();

darkMode.initTheme();
</script>
<template>
  <div
    class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300"
  >
    <!-- HEADER -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <NavBar />
    </header>

    <!-- MAIN -->
    <main
      class="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-6 flex justify-center"
    >
      <div class="w-full max-w-5xl px-4">
        <router-view />
      </div>
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>
