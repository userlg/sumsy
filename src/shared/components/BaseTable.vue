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

  import { ref, computed, watch } from 'vue';
  import EditModal from './EditModal.vue';
  import ConfirmModal from './ConfirmModal.vue';
  import type { BaseItem } from '@/shared/interfaces/BaseItem';
  import type { useUserStore } from '@/stores/user.store';
  import DeleteSvg from './DeleteSvg.vue';
  import EditSvg from './EditSvg.vue';
  import ViewModal from './ViewModal.vue';
  import ViewSvg from './ViewSvg.vue';
  import SegmentedControl from './SegmentedControl.vue';
  import { isExtraCase } from '@/shared/utils/case.utils';

  const props = defineProps<{
    items: BaseItem[];
    titleModalView: string;
    isReversed: boolean;
    userStore: ReturnType<typeof useUserStore>;
    message: string;
    /** Cases only: shows the "Extra" label, the normal/extra filter and the mark button. */
    extras?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'reverse'): void;
    (e: 'clear'): void;
    (e: 'deleteSummary', id: number): void;
    (e: 'editSummary', id: number, newName: string, newDate?: string): void;
    (e: 'toggleExtra', id: number): void;
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

  type Kind = 'all' | 'normal' | 'extra';
  const kinds: { id: Kind; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'normal', label: 'Normales' },
    { id: 'extra', label: 'Extras' },
  ];
  const kind = ref<Kind>('all');
  watch(kind, () => (currentPage.value = 1));

  const filteredItems = computed(() => {
    const term = search.value.trim().toLowerCase();
    return props.items.filter((item) => {
      if (kind.value !== 'all' && isExtraCase(item) !== (kind.value === 'extra')) return false;
      return !term || item.name.toLowerCase().includes(term);
    });
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

  // Deleting the last row of the last page would leave an empty page: step back instead.
  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
  });

  const tableRef = ref<HTMLElement | null>(null);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      // Bring the start of the table back into view if the user scrolled past it.
      const top = tableRef.value?.getBoundingClientRect().top ?? 0;
      if (top < 0) tableRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      <SegmentedControl
        v-if="extras && items.length > 0"
        v-model="kind"
        :options="kinds"
        label="Tipo de caso"
        class="w-full sm:w-auto"
      />

      <div v-if="filteredItems.length > 0" class="flex gap-2 w-full sm:w-auto">
        <button
          class="sort-button flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-slate-400"
          :aria-label="
            isReversed
              ? 'Orden ascendente; cambiar a descendente'
              : 'Orden descendente; cambiar a ascendente'
          "
          @click="onReverse"
        >
          <svg
            :class="['sort-arrow size-4', { 'is-up': isReversed }]"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75"
            />
          </svg>
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
      v-else-if="filteredItems.length === 0"
      class="text-center text-gray-500 dark:text-gray-400 my-6 font-bold"
    >
      Búsqueda sin resultado
    </div>

    <!-- Table -->
    <div v-else>
      <div
        ref="tableRef"
        class="scroll-mt-24 bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-x-auto"
      >
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead
            class="bg-slate-50/50 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700/80"
          >
            <tr>
              <th class="px-6 py-4 text-center font-medium">#</th>
              <th class="px-6 py-4 text-center font-medium">Nombre</th>
              <th class="px-6 py-4 text-center font-medium hidden sm:table-cell">Fecha</th>
              <th class="px-6 py-4 text-center font-medium">Opciones</th>
            </tr>
          </thead>
          <transition-group tag="tbody" name="row" appear>
            <tr
              v-for="(item, index) in paginatedItems"
              :key="item.id"
              :style="{ '--i': Math.min(index, 5) }"
              class="transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b last:border-none border-slate-100 dark:border-slate-700/50"
            >
              <td class="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                {{ item.element }}
              </td>
              <td
                class="px-6 py-4 text-center text-slate-700 dark:text-slate-200 max-w-[150px] sm:max-w-[200px]"
              >
                <span class="inline-flex max-w-full items-center gap-2">
                  <span class="truncate">{{ item.name }}</span>
                  <span
                    v-if="extras && isExtraCase(item)"
                    class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300"
                  >
                    Extra
                  </span>
                </span>
              </td>
              <td
                class="px-6 py-4 text-center text-slate-500 dark:text-slate-400 hidden sm:table-cell"
              >
                {{ item.date }}
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-center gap-4">
                  <button
                    v-if="extras"
                    :title="isExtraCase(item) ? 'Quitar extra' : 'Marcar como extra'"
                    :aria-pressed="isExtraCase(item)"
                    :class="[
                      'transition-colors',
                      isExtraCase(item)
                        ? 'text-pink-500 hover:text-pink-600'
                        : 'text-slate-400 hover:text-pink-500',
                    ]"
                    @click="emit('toggleExtra', item.id)"
                  >
                    <svg
                      class="size-5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.75"
                      :fill="isExtraCase(item) ? 'currentColor' : 'none'"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                  </button>

                  <button
                    title="Editar"
                    class="text-slate-400 hover:text-blue-500 transition-colors"
                    @click="openEditModal(item.id, item.name, item.date)"
                  >
                    <EditSvg />
                  </button>

                  <button
                    title="Ver"
                    class="text-slate-400 hover:text-emerald-500 transition-colors"
                    @click="openViewModal(item.id, item.name, item.date)"
                  >
                    <ViewSvg />
                  </button>

                  <button
                    title="Borrar"
                    class="text-slate-400 hover:text-red-500 transition-colors"
                    @click="onDelete(item.id)"
                  >
                    <DeleteSvg />
                  </button>
                </div>
              </td>
            </tr>
          </transition-group>
        </table>
      </div>

      <!-- Pagination-->
      <nav
        v-if="totalPages > 1"
        class="flex justify-center items-center gap-3 mt-4 text-sm"
        aria-label="Paginación"
      >
        <button
          :disabled="currentPage === 1"
          class="btn-secondary px-3.5 py-1.5"
          @click="goToPage(currentPage - 1)"
        >
          Anterior
        </button>
        <span class="text-slate-500 dark:text-slate-400 tabular-nums">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          class="btn-secondary px-3.5 py-1.5"
          @click="goToPage(currentPage + 1)"
        >
          Siguiente
        </button>
      </nav>
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

<style scoped>
  .sort-button {
    transition:
      background-color 160ms ease,
      transform 120ms var(--ease-out);
  }

  .sort-button:active {
    transform: scale(0.96);
  }

  .sort-arrow {
    transition: transform 220ms var(--ease-out);
  }

  .sort-arrow.is-up {
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .sort-arrow {
      transition: none;
    }
  }
</style>
