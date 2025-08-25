<script setup lang="ts">
  /**
   * @file BaseTable.vue
   * @namespace src.shared.components
   * @description Main base table component
   *
   * @component
   * @example
   * <BaseTable />
   */

  import { ref, computed } from 'vue';
  import EditModal from './EditModal.vue';
  import ConfirmModal from './ConfirmModal.vue';
  import type { BaseItem } from '@/shared/interfaces/BaseItem';
  import type { useUserStore } from '@/stores/user.store';
  import DeleteSvg from './DeleteSvg.vue';
  import EditSvg from './EditSvg.vue';
  import ViewModal from './ViewModal.vue';
  import ViewSvg from './ViewSvg.vue';

  const props = defineProps<{
    items: BaseItem[];
    isReversed: boolean;
    userStore: ReturnType<typeof useUserStore>;
    message: string;
  }>();

  const emit = defineEmits<{
    (e: 'reverse'): void;
    (e: 'clear'): void;
    (e: 'deleteSummary', id: number): void;
    (e: 'editSummary', id: number, newName: string): void;
  }>();

  const search = ref('');
  const currentPage = ref(1);
  const itemsPerPage = 20;

  const showViewModal = ref(false);

  const showEditModal = ref(false);
  const tempId = ref<number>(0);
  const tempName = ref('');
  const tempDate = ref('');

  const showConfirmModal = ref(false);

  const filteredItems = computed(() => {
    const term = search.value.trim().toLowerCase();
    return term ? props.items.filter((s) => s.name.toLowerCase().includes(term)) : props.items;
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredItems.value.length / itemsPerPage))
  );

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredItems.value.slice(start, start + itemsPerPage);
  });

  function onDelete(id: number) {
    emit('deleteSummary', id);
  }

  function openEditModal(id: number, name: string) {
    tempId.value = id;
    tempName.value = name;
    showEditModal.value = true;
  }

  function openViewModal(id: number, name: string, date: string) {
    tempId.value = id;
    tempName.value = name;
    tempDate.value = date;
    showViewModal.value = true;
  }

  function closeModal() {
    showEditModal.value = false;
    tempId.value = 0;
    tempName.value = '';
    tempDate.value = '';
  }

  function onReverse() {
    emit('reverse');
  }

  function confirmClear() {
    showConfirmModal.value = true;
  }

  function clearAll() {
    emit('clear');
    showConfirmModal.value = false;
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function saveEdit(newName: string) {
    if (tempId.value !== null) {
      emit('editSummary', tempId.value, newName);
      closeModal();
    }
  }
</script>

<template>
  <div>
    <!-- Filters and actions -->
    <div class="flex flex-wrap gap-2 items-center justify-between mb-2">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por nombre..."
        class="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        @input="currentPage = 1"
      />

      <div v-if="filteredItems.length > 0" class="flex gap-2">
        <button
          class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition shadow-md hover:shadow-gray-400 dark:hover:shadow-gray-900"
          @click="onReverse"
        >
          {{ isReversed ? 'ASC' : 'DESC' }}
        </button>

        <button
          class="bg-pink-500 text-white px-3 py-2 rounded hover:bg-pink-600 focus:ring-2 focus:ring-pink-400 transition shadow-md hover:shadow-gray-400 dark:hover:shadow-gray-900"
          @click="confirmClear"
        >
          Borrar todo
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div
      v-if="items.length === 0"
      class="text-center text-gray-500 dark:text-gray-400 my-6 font-bold"
    >
      {{ props.message }}
    </div>
    <div
      v-else-if="filteredItems.length === 0 && search.length > 0"
      class="text-center text-gray-500 dark:text-gray-400 my-6 font-bold"
    >
      Búsqueda sin resultado
    </div>

    <!-- Table -->
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
        <transition-group tag="tbody" name="bounce" appear>
          <tr
            v-for="item in paginatedItems"
            :key="item.id"
            class="transition-all duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-800"
          >
            <td class="border px-4 py-2 text-center">
              {{ item.element }}
            </td>
            <td class="border px-4 py-2 text-center truncate max-w-[150px]">
              {{ item.name }}
            </td>
            <td class="border px-4 py-2 text-center">
              {{ item.date }}
            </td>
            <td class="border px-4 py-2 text-center">
              <div class="flex justify-center gap-4">
                <button title="Editar" @click="openEditModal(item.id, item.name)">
                  <EditSvg />
                </button>

                <button title="Editar" @click="openViewModal(item.id, item.name, item.date)">
                  <ViewSvg />
                </button>

                <button title="Borrar" @click="onDelete(item.id)">
                  <DeleteSvg />
                </button>
              </div>
            </td>
          </tr>
        </transition-group>
      </table>

      <!-- Pagination-->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-4">
        <button
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
          @click="goToPage(currentPage - 1)"
        >
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
          @click="goToPage(currentPage + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditModal
      v-model="showEditModal"
      title="Editar resumen"
      :user-store="props.userStore"
      :initial-name="tempName"
      place-holder="editar"
      @save="saveEdit"
    />

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="showConfirmModal"
      title="Confirmar acción"
      message="¿Seguro que quieres borrar todos los resúmenes?"
      confirm-text="Sí, borrar todo"
      cancel-text="Cancelar"
      @confirm="clearAll"
    />

    <!-- View Modal -->
    <ViewModal :id="tempId" v-model="showViewModal" :name="tempName" :date="tempDate" />
  </div>
</template>
