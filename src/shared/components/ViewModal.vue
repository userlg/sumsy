<script setup lang="ts">
  const props = defineProps<{
    modelValue: boolean;
    title: string;
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
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-6 relative border border-gray-200 dark:border-gray-700"
      >
        <!-- Header -->
        <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          {{ props.title }}
        </h1>

        <!-- Nombre largo -->
        <div
          class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-5 max-h-36 overflow-y-auto text-gray-800 dark:text-blue-300 text-base leading-relaxed"
        >
          {{ props.name }}
        </div>

        <!-- Content -->
        <div class="border-t border-neutral-400 dark:border-blue-300 my-3" />
        <div class="grid grid-cols-2 gap-y-3 text-sm">
          <div class="text-gray-500 dark:text-gray-400 font-medium">#</div>
          <div class="text-gray-800 dark:text-gray-200 font-semibold">
            {{ props.id }}
          </div>

          <div class="text-gray-500 dark:text-gray-400 font-medium">Fecha</div>
          <div class="text-gray-800 dark:text-gray-200 font-semibold">
            {{ props.date }}
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
