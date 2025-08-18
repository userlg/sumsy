<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Logo from '@/shared/icons/favicon.svg';
  import { useUserStore } from '@/stores/user.store';
  import EditModal from '@/shared/components/EditModal.vue';

  const userStore = useUserStore();
  const showNameModal = ref(false);
  const modalTitle = ref('');
  const modalPlaceholder = ref('');
  const showContent = ref(false);

  function openNameModal(isEditing = false) {
    modalTitle.value = isEditing ? 'Editar nombre' : 'Introduce tu nombre';
    modalPlaceholder.value = isEditing ? 'Cambia tu nombre' : 'Escribe tu nombre';
    showNameModal.value = true;
  }

  function handleSaveName(newName: string) {
    userStore.setName(newName);
  }

  onMounted(() => {
    if (!userStore.getName || userStore.getName.trim() === '') {
      openNameModal(false);
    }
    setTimeout(() => {
      showContent.value = true;
    }, 100);
  });
</script>

<template>
  <div class="relative flex flex-col items-center justify-center text-center p-4 h-full">
    <transition name="bounce">
      <div v-if="showContent">
        <!-- Logo -->
        <Logo
          id="Logo"
          src="@/shared/icons/favicon.svg"
          alt="Sumsy logo"
          class="w-32 h-32 mb-4 hover:scale-110 transition-transform duration-200"
        />

        <!-- Título -->
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white cursor-default">Sumsy</h1>

        <!-- Mensaje de bienvenida -->
        <h2
          v-if="userStore.getName && userStore.getName.trim() !== ''"
          class="mt-2 text-lg text-gray-600 dark:text-gray-300"
        >
          Bienvenido,
          <span class="font-semibold">{{ userStore.getName }}</span>
          !
        </h2>

        <!-- Botón cambiar nombre abajo a la derecha -->
        <button
          v-if="userStore.getName && userStore.getName.trim() !== ''"
          class="absolute bottom-0 right-0 flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200"
          @click="openNameModal(true)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.232 5.232l3.536 3.536M4 13v7h7l9.536-9.536a1.5 1.5 0 00-2.122-2.122L9 17H4v-4z"
            />
          </svg>
          Cambiar nombre
        </button>
      </div>
    </transition>

    <!-- Modal -->
    <EditModal
      v-model="showNameModal"
      :title="modalTitle"
      :initial-name="userStore.getName || ''"
      :place-holder="modalPlaceholder"
      @save="handleSaveName"
    />
  </div>
</template>
