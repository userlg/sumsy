<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";

import Footer from "./components/Footer.vue";

import { useDarkModeStore } from "@/stores/darkModeStore";

const darkMode = useDarkModeStore();

darkMode.initTheme();
</script>
<template>
  <div
    class="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500"
  >
    <!-- HEADER -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <NavBar />
    </header>

    <!-- MAIN -->
    <main
      class="flex-1 py-8 flex justify-center bg-white dark:bg-gray-900 transition-colors duration-500"
    >
      <div class="w-full max-w-5xl px-6">
        <router-view />
      </div>
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>
