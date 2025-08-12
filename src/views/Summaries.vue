<script setup lang="ts">
import { ref, computed } from "vue";
import { useResumenStore } from "@/stores/summaryStore";
import Total from "@/components/Total.vue";

const store = useResumenStore();
const name = ref("");
const error = ref("");

const total = computed(() => store.list.length);

function addSummary(): void {
  if (!name.value.trim()) {
    error.value = "El nombre no puede estar vacío.";
    return;
  }
  error.value = "";
  store.create(name.value.trim());
  name.value = "";
}

function deleteSummary(id: number): void {
  if (confirm("¿Seguro que quieres eliminar este resumen?")) {
    store.delete(id);
  }
}

function clearAll(): void {
  if (confirm("Esto borrará todos los resúmenes. ¿Continuar?")) {
    store.clearAll();
  }
}
</script>

<template>
  <div>
    <Total :total="total" title="Resúmenes" />

    <!-- Campo de entrada -->
    <div class="flex items-center gap-2 mt-4">
      <input
        v-model="name"
        placeholder="Nombre"
        autocomplete="off"
        aria-label="Nombre del resumen"
        class="border rounded px-3 py-2 flex-1 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
        @keyup.enter="addSummary"
      />
      <button
        @click="addSummary"
        :disabled="!name.trim()"
        class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 disabled:bg-gray-400 transition cursor-pointer"
      >
        Agregar
      </button>
    </div>

    <!-- Mensaje de error -->
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>

    <!-- Lista de resúmenes -->
    <transition-group name="fade" tag="ul" class="mt-4 space-y-2">
      <li
        v-for="summary in store.list"
        :key="summary.id"
        class="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-2 rounded shadow-sm hover:shadow-md transition"
      >
        <span
          >{{ summary.element }} — {{ summary.name }} — {{ summary.date }}</span
        >
        <button
          @click="deleteSummary(summary.id)"
          class="text-red-500 hover:text-red-700 transition cursor-pointer"
          aria-label="Eliminar resumen"
        >
          🗑️
        </button>
      </li>
    </transition-group>

    <!-- Botón limpiar todo -->
    <div v-if="total > 0" class="mt-6">
      <button
        @click="clearAll"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
      >
        Borrar todo
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
