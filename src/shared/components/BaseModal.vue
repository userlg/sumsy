<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const close = () => {
  emit("update:modelValue", false);
};

</script>

<template>
  <transition name="bounce">
    <div
      v-if="props.modelValue"
      class="modal-backdrop fixed inset-0 bg-gray-900/50 dark:bg-gray-800/60 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <!-- Title -->
        <h2
          v-if="props.title"
          class="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200"
        >
          {{ props.title }}
        </h2>

        <!-- Content dynamic -->
        <slot />

        <!-- Footer -->
        <div class="flex justify-end gap-2 mt-4">
          <slot name="footer">
            <button
              @click="close"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cerrar
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>
