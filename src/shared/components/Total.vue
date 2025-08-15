<template>
  <div
    class="flex flex-col items-center justify-center space-y-2 cursor-default"
  >
    <!-- Círculo -->
    <div
      ref="circleEl"
      class="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-sky-500 dark:border-blue-300 bg-white dark:bg-gray-800 shadow-md transition-all duration-500 hover:scale-105 hover:shadow-lg"
    >
      <span class="text-3xl font-bold text-gray-700 dark:text-gray-100">
        {{ tweened.number.toFixed(0) }}
        <!-- Corregido: acceder a .number -->
      </span>
    </div>

    <!-- Título -->
    <h2
      class="text-sm font-medium text-gray-600 dark:text-gray-300 text-center"
    >
      {{ title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, toRef, onMounted } from "vue";
import gsap from "gsap";

const props = defineProps<{
  title: string;
  refreshTrigger: number;
}>();

const number = toRef(props, "refreshTrigger");
const tweened = reactive({
  number: props.refreshTrigger,
});

// Animación inicial al montar
onMounted(() => {
  gsap.to(tweened, { duration: 0.5, number: number.value });
});

// Watcher para cambios en la prop
watch(number, (n) => {
  console.log("Working");
  gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 });
});
</script>
