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
  import ViewModal from './ViewModal.vue';
  import SegmentedControl from './SegmentedControl.vue';
  import Tooltip from './Tooltip.vue';
  import { isExtraCase } from '@/shared/utils/case.utils';
  import ArrowDownIcon from '@/shared/icons/arrow-down.svg?component';
  import EyeIcon from '@/shared/icons/eye.svg?component';
  import PencilSquareIcon from '@/shared/icons/pencil-square.svg?component';
  import StarIcon from '@/shared/icons/star.svg?component';
  import TrashIcon from '@/shared/icons/trash.svg?component';

  const props = defineProps<{
    items: BaseItem[];
    titleModalView: string;
    isReversed: boolean;
    /** What one row is called, for the modals: "resumen", "caso". */
    itemName: string;
    itemNamePlural: string;
    message: string;
    /** Cases only: shows the "Extra" label, the normal/extra filter and the mark button. */
    extras?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'reverse'): void;
    (e: 'clear'): void;
    (e: 'deleteItem', id: number): void;
    (e: 'editItem', id: number, newName: string, newDate?: string): void;
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
    emit('deleteItem', id);
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

  /** Read once by screen readers after the user flips the order (not on every moved row). */
  const sortStatus = ref('');

  function onReverse() {
    const newestFirst = !props.isReversed;
    emit('reverse');
    const order = newestFirst ? 'Más recientes primero' : 'Más antiguos primero';
    sortStatus.value = `${order}, ${filteredItems.value.length} ${props.itemNamePlural}`;
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
      emit('editItem', tempId.value, newName, newDate);
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
        <Tooltip
          class="flex-1 sm:flex-none"
          :text="isReversed ? 'Más recientes primero' : 'Más antiguos primero'"
        >
          <button
            class="sort-button w-full inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-slate-400"
            :aria-label="
              isReversed
                ? 'Orden descendente; cambiar a ascendente'
                : 'Orden ascendente; cambiar a descendente'
            "
            @click="onReverse"
          >
            <ArrowDownIcon
              :class="['sort-arrow size-4', { 'is-up': !isReversed }]"
              aria-hidden="true"
            />
            <!-- The current order: oldest first is ascending, newest first descending. -->
            {{ isReversed ? 'DESC' : 'ASC' }}
          </button>
        </Tooltip>
        <p role="status" class="sr-only" data-test="sort-status">{{ sortStatus }}</p>

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
                  <Tooltip
                    v-if="extras"
                    :text="isExtraCase(item) ? 'Quitar extra' : 'Marcar como extra'"
                  >
                    <button
                      :aria-label="`${isExtraCase(item) ? 'Quitar extra' : 'Marcar como extra'}: ${item.name}`"
                      :aria-pressed="isExtraCase(item)"
                      :class="[
                        'transition-colors',
                        isExtraCase(item)
                          ? 'text-pink-500 hover:text-pink-600'
                          : 'text-slate-400 hover:text-pink-500',
                      ]"
                      @click="emit('toggleExtra', item.id)"
                    >
                      <StarIcon
                        class="size-5"
                        :fill="isExtraCase(item) ? 'currentColor' : 'none'"
                        aria-hidden="true"
                      />
                    </button>
                  </Tooltip>

                  <Tooltip text="Editar">
                    <button
                      :aria-label="`Editar: ${item.name}`"
                      class="text-slate-400 hover:text-blue-500 transition-colors"
                      @click="openEditModal(item.id, item.name, item.date)"
                    >
                      <PencilSquareIcon
                        class="size-6 stroke-2 stroke-gray-400 dark:stroke-pink-400 hover:stroke-gray-500 dark:hover:stroke-pink-500 transition duration-500 ease-in-out"
                        aria-hidden="true"
                      />
                    </button>
                  </Tooltip>

                  <Tooltip text="Ver">
                    <button
                      :aria-label="`Ver: ${item.name}`"
                      class="text-slate-400 hover:text-emerald-500 transition-colors"
                      @click="openViewModal(item.id, item.name, item.date)"
                    >
                      <EyeIcon
                        class="size-6 stroke-2 stroke-green-600 dark:stroke-green-200 hover:stroke-green-700 dark:hover:stroke-hover-300 transition duration-500 ease-in-out"
                        aria-hidden="true"
                      />
                    </button>
                  </Tooltip>

                  <Tooltip text="Borrar">
                    <button
                      :aria-label="`Borrar: ${item.name}`"
                      class="text-slate-400 hover:text-red-500 transition-colors"
                      @click="onDelete(item.id)"
                    >
                      <TrashIcon
                        class="size-5 stroke-2 stroke-pink-500 dark:stroke-blue-300 dark:hover:stroke-blue-400 hover:stroke-pink-600 transition duration-500 ease-in-out"
                        aria-hidden="true"
                      />
                    </button>
                  </Tooltip>
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
      :title="`Editar ${itemName}`"
      :initial-name="tempName"
      :initial-date="tempDate"
      place-holder="editar"
      @save="saveEdit"
    />

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="showConfirmModal"
      title="Confirmar acción"
      :message="`¿Seguro que quieres borrar todos los ${itemNamePlural}?`"
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
