<script setup lang="ts">
import { ref, computed } from "vue";
import type { Summary } from "@/interfaces/Summary";
import DeleteSvg from "./DeleteSvg.vue";

const props = defineProps<{
  summaries: Summary[];
  isReversed: boolean;
}>();

const emit = defineEmits<{
  (e: "reverse"): void;
  (e: "clear"): void;
  (e: "deleteSummary", id: number): void;
}>();

const search = ref("");

const filteredSummaries = computed(() => {
  if (!search.value.trim()) return props.summaries;
  return props.summaries.filter((s) =>
    s.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

function onDelete(id: number) {
  if (confirm("¿Seguro que quieres eliminar este resumen?")) {
    emit("deleteSummary", id);
  }
}

function onReverse() {
  emit("reverse");
}

function onClear() {
  if (confirm("Esto borrará todos los resúmenes. ¿Continuar?")) {
    emit("clear");
  }
}
</script>

<template>
  <div>
    <div class="flex flex-row-reverse">
      <input
        type="text"
        v-model="search"
        placeholder="Buscar por nombre..."
        class="mb-2 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
        aria-label="Buscar resumen por nombre"
      />

      <div
        v-if="filteredSummaries.length > 0"
        class="my-2 flex gap-2 justify-start"
      >
        <button
          @click="onReverse"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          {{ isReversed ? "ASC" : "DESC" }}
        </button>
        <button
          @click="onClear"
          class="bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition cursor-pointer"
        >
          Borrar todo
        </button>
      </div>
    </div>

    <table
      class="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600"
    >
      <thead>
        <tr class="bg-gray-100 dark:bg-gray-700">
          <th
            class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left"
          >
            #
          </th>
          <th
            class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left"
          >
            Nombre
          </th>
          <th
            class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center"
          >
            Opciones
          </th>
        </tr>
      </thead>
      <transition-group
        tag="tbody"
        name="fade-slide"
        appear
        class="bg-white dark:bg-gray-800"
      >
        <tr
          v-for="summary in filteredSummaries"
          :key="summary.id"
          class="hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-shadow duration-300"
        >
          <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
            {{ summary.element }}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
            {{ summary.name }}
          </td>
          <td
            class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center"
          >
            <button
              @click="onDelete(summary.id)"
              class="text-red-500 hover:text-red-700 transition cursor-pointer"
              aria-label="Eliminar resumen"
              title="Eliminar resumen"
            >
              <DeleteSvg />
            </button>
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>
