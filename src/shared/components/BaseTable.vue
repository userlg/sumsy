<script setup lang="ts">
import { ref, computed } from "vue";
import BaseModal from "./BaseModal.vue";
import type { BaseItem } from "@/shared/interfaces/BaseItem";
import DeleteSvg from "./DeleteSvg.vue";
import EditSvg from "./EditSvg.vue";

const props = defineProps<{
  summaries: BaseItem[];
  isReversed: boolean;
}>();

const emit = defineEmits<{
  (e: "reverse"): void;
  (e: "clear"): void;
  (e: "deleteSummary", id: number): void;
  (e: "editSummary", id: number, newName: string): void;
}>();

const search = ref("");
const currentPage = ref(1);
const itemsPerPage = 20;

// Modal
const showEditModal = ref(false);
const editId = ref<number | null>(null);
const editName = ref("");

const filteredSummaries = computed(() => {
  const term = search.value.trim().toLowerCase();
  return term
    ? props.summaries.filter((s) => s.name.toLowerCase().includes(term))
    : props.summaries;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredSummaries.value.length / itemsPerPage))
);

const paginatedSummaries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredSummaries.value.slice(start, start + itemsPerPage);
});

function onDelete(id: number) {
  emit("deleteSummary", id);
}

function openEditModal(id: number, name: string) {
  editId.value = id;
  editName.value = name;
  showEditModal.value = true;
}

function saveEdit() {
  if (editId.value !== null && editName.value.trim() !== "") {
    emit("editSummary", editId.value, editName.value.trim());
    closeModal();
  }
}

function closeModal() {
  showEditModal.value = false;
  editId.value = null;
  editName.value = "";
}

function onReverse() {
  emit("reverse");
}

function onClear() {
  emit("clear");
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}
</script>

<template>
  <div>
    <!-- Filtros y acciones -->
    <div class="flex flex-wrap gap-2 items-center justify-between mb-2">
      <input
        type="text"
        v-model="search"
        placeholder="Buscar por nombre..."
        class="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        @input="currentPage = 1"
      />

      <div v-if="filteredSummaries.length > 0" class="flex gap-2">
        <button
          @click="onReverse"
          class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition"
        >
          {{ isReversed ? "ASC" : "DESC" }}
        </button>

        <button
          @click="onClear"
          class="bg-pink-500 text-white px-3 py-2 rounded hover:bg-pink-600 focus:ring-2 focus:ring-pink-400 transition"
        >
          Borrar todo
        </button>
      </div>
    </div>

    <!-- Mensajes -->
    <div
      v-if="summaries.length === 0"
      class="text-center text-gray-500 dark:text-gray-400 my-6 font-bold"
    >
      No hay resúmenes disponibles.
    </div>
    <div
      v-else-if="filteredSummaries.length === 0 && search.length > 0"
      class="text-center text-gray-500 dark:text-gray-400 my-6 font-bold"
    >
      Búsqueda sin resultado
    </div>

    <!-- Tabla -->
    <div v-else>
      <table
        class="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600"
      >
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-700">
            <th class="border px-4 py-2 text-center">#</th>
            <th class="border px-4 py-2 text-center">Nombre</th>
            <th class="border px-4 py-2 text-center">Fecha</th>
            <th class="border px-4 py-2 text-center">Opciones</th>
          </tr>
        </thead>
        <transition-group tag="tbody" name="fade-slide" appear>
          <tr
            v-for="summary in paginatedSummaries"
            :key="summary.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
          >
            <td class="border px-4 py-2 text-center">{{ summary.element }}</td>
            <td class="border px-4 py-2 text-center truncate max-w-[150px]">{{ summary.name }}</td>
            <td class="border px-4 py-2 text-center">{{ summary.date }}</td>
            <td class="border px-4 py-2 text-center flex justify-center gap-3">
              <button
                @click="openEditModal(summary.id, summary.name)"
                title="Editar"
              >
                <EditSvg />
              </button>
              <button @click="onDelete(summary.id)" title="Borrar">
                <DeleteSvg />
              </button>
            </td>
          </tr>
        </transition-group>
      </table>

      <!-- Paginación -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center gap-2 mt-4"
      >
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <BaseModal v-model="showEditModal" title="Editar resumen">
      <input
        type="text"
        v-model="editName"
        class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder="Nuevo nombre"
      />

      <template #footer>
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
        >
          Cancelar
        </button>
        <button
          @click="saveEdit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition"
        >
          Guardar
        </button>
      </template>
    </BaseModal>
  </div>
</template>
