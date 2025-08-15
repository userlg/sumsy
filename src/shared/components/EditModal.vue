<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title: string;
  initialName: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", newName: string): void;
}>();

const name = ref(props.initialName);

watch(
  () => props.initialName,
  (newVal) => {
    name.value = newVal;
  }
);

function closeModal() {
  emit("update:modelValue", false);
}

function saveEdit() {
  if (name.value.trim() !== "") {
    emit("save", name.value.trim());
    closeModal();
  }
}
</script>

<template>
  <transition name="bounce">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg"
      >
        <h2 class="text-xl font-bold mb-4">{{ title }}</h2>

        <input
          type="text"
          v-model="name"
          class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Nuevo nombre"
        />

        <div class="flex justify-end gap-2 mt-4">
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
        </div>
      </div>
    </div>
  </transition>
</template>
