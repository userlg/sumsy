<script setup lang="ts">
  /**
   * @file ViewModal.vue
   * @namespace src.shared.components
   * @description Main modal component for viewing details
   *
   * @component
   * @example
   * <ViewModal v-model="isOpen" name="Case A" :id="1" date="24-08-25" />
   */
  const props = defineProps<{
    modelValue: boolean;
    name: string;
    id: number;
    date: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();

  function closeModal() {
    emit('update:modelValue', false);
  }
</script>

<template>
  <transition name="bounce">
    <div
      v-if="props.modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
    >
      <!-- Modal Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-gray-200 dark:border-gray-700"
      >
        <!-- Header -->
        <h2
          class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 leading-snug break-words max-h-40 overflow-y-auto pr-2"
        >
          {{ props.name }}
        </h2>

        <!-- Content -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">#</span>
            <span class="text-base font-semibold text-gray-700 dark:text-gray-200">
              {{ props.id }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha</span>
            <span class="text-base font-semibold text-gray-700 dark:text-gray-200">
              {{ props.date }}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 flex justify-end">
          <button
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:opacity-90 transition"
            @click="closeModal"
          >
            <div class="flex flex-row items-center gap-2">
              Volver
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
