<script setup lang="ts">
  /**
   * @file NotifyModal.vue
   * @namespace src.shared.components
   * @description Notification modal for success/error feedback messages.
   * Matches the visual style and animations of EditModal.
   *
   * @component
   * @example
   * <NotifyModal v-model="show" title="Éxito" message="Operación completada." type="success" />
   */

  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();

  function close() {
    emit('update:modelValue', false);
  }
</script>

<template>
  <div>
    <transition name="bounce">
      <div
        v-show="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
        data-test="notify-modal"
        @click.self="close"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-lg">
          <!-- Icon + Title -->
          <div class="flex items-center gap-3 mb-3">
            <!-- Success icon -->
            <div
              v-if="type === 'success'"
              class="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <!-- Error icon -->
            <div
              v-else-if="type === 'error'"
              class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <!-- Info icon -->
            <div
              v-else
              class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 class="text-xl font-bold text-slate-800 dark:text-white">
              {{ title }}
            </h2>
          </div>

          <!-- Message -->
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 ml-[52px]">
            {{ message }}
          </p>

          <!-- Button -->
          <div class="flex justify-end">
            <button
              id="notify-accept-button"
              class="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus-visible:outline-none transition-all duration-200"
              @click="close"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
