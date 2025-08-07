<script setup lang="ts">
import DarkMode from "@/components/ButtonDarkMode.vue";
</script>

<template>
  <main class="container dark:bg-gray-500 bg-amber-100">
    <DarkMode />

    <div id="app">
      <nav>
        <router-link to="/">Inicio</router-link> |
        <router-link to="/summaries">Tabla</router-link>
      </nav>
      <router-view />
    </div>
  </main>
</template>
