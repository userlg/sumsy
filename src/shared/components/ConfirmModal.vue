<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

function closeModal() {
  emit("update:modelValue", false);
}

function confirmAction() {
  emit("confirm");
  closeModal();
}
</script>

<template>
  <transition name="bounce">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
    >
      <div
        v-if="modelValue"
        class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg"
      >
        <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          {{ message }}
        </p>

        <div class="flex justify-end gap-2">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            {{ cancelText || "Cancelar" }}
          </button>
          <button
            @click="confirmAction"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition"
          >
            {{ confirmText || "Confirmar" }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
