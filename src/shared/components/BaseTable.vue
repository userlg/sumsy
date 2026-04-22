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
    titleModalView: string;
    isReversed: boolean;
    userStore: ReturnType<typeof useUserStore>;
    message: string;
  }>();

  const emit = defineEmits<{
    (e: 'reverse'): void;
    (e: 'clear'): void;
    (e: 'deleteSummary', id: number): void;
    (e: 'editSummary', id: number, newName: string, newDate?: string): void;
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



  function openEditModal(id: number, name: string, date: string) {
    tempId.value = id;
    tempName.value = name;
    tempDate.value = date;
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

  function saveEdit(newName: string, newDate?: string) {
    if (tempId.value !== null) {
      emit('editSummary', tempId.value, newName, newDate);
      closeModal();
    }
  }
</script>

<template>
  <div>
    <!-- Filters and actions -->
    <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por nombre..."
        class="w-full sm:flex-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100"
        @input="currentPage = 1"
      />

      <div v-if="filteredItems.length > 0" class="flex gap-2 w-full sm:w-auto">
        <button
          class="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 rounded-xl transition-all border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-slate-400"
          @click="onReverse"
        >
          {{ isReversed ? 'ASC' : 'DESC' }}
        </button>

        <button
          class="flex-1 sm:flex-none bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white font-medium px-4 py-2.5 rounded-xl transition-all border border-red-200 dark:border-red-900/50 hover:border-red-500 focus:ring-2 focus:ring-red-400"
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
      <div class="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-slate-50/50 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700/80">
            <tr>
              <th class="px-6 py-4 text-center font-medium">#</th>
              <th class="px-6 py-4 text-center font-medium">Nombre</th>
              <th class="px-6 py-4 text-center font-medium hidden sm:table-cell">Fecha</th>
              <th class="px-6 py-4 text-center font-medium">Opciones</th>
            </tr>
          </thead>
          <transition-group tag="tbody" name="bounce" appear>
            <tr
              v-for="item in paginatedItems"
              :key="item.id"
              class="transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b last:border-none border-slate-100 dark:border-slate-700/50"
            >
              <td class="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                {{ item.element }}
              </td>
              <td class="px-6 py-4 text-center text-slate-700 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[200px]">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 text-center text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                {{ item.date }}
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-center gap-4">
                  <button title="Editar" class="text-slate-400 hover:text-blue-500 transition-colors" @click="openEditModal(item.id, item.name, item.date)">
                    <EditSvg />
                  </button>

                  <button title="Ver" class="text-slate-400 hover:text-emerald-500 transition-colors" @click="openViewModal(item.id, item.name, item.date)">
                    <ViewSvg />
                  </button>

                  <button title="Borrar" class="text-slate-400 hover:text-red-500 transition-colors" @click="onDelete(item.id)">
                    <DeleteSvg />
                  </button>
                </div>
              </td>
            </tr>
          </transition-group>
        </table>
      </div>

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
      :initial-date="tempDate"
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
    <ViewModal
      :id="tempId"
      v-model="showViewModal"
      :title="props.titleModalView"
      :name="tempName"
      :date="tempDate"
    />
  </div>
</template>
