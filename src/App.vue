<script setup lang="ts">
import Home from "./views/Home.vue";
</script>

<template>
  <main class="container">
    <div id="app">
      <nav>
        <router-link to="/">Inicio</router-link> |
        <router-link to="/summaries">Tabla</router-link>
      </nav>
      <router-view />
    </div>
  </main>
</template>
