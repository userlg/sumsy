<script setup lang="ts">
import { ref } from "vue";
import { useResumenStore } from "@/stores/summaryStore";

const store = useResumenStore();
const nombre = ref("");

const total = ref(store.getAllSummaries().length);

function addSummary() {
  if (!nombre.value.trim()) return;
  store.create(nombre.value.trim());
  nombre.value = "";
  total.value = store.getAllSummaries().length;
}
</script>

<template>
  <div>
    <h2
      class="text-3xl font-bold transition-colors duration-500 text-gray-800 dark:text-gray-200 animate-pulse"
    >
      Total: {{ total }}
    </h2>

    <input v-model="nombre" placeholder="Nombre" />
    <button @click="addSummary">Agregar</button>

    <ul>
      <li v-for="r in store.getAllSummaries()" :key="r.id">
        {{ r.element }} — {{ r.name }} — {{ r.date }}
        <button @click="store.delete(r.id)">🗑️</button>
      </li>
    </ul>
  </div>
</template>
