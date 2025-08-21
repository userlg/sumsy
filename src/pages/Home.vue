<script setup lang="ts">
  /**
   * @file Home.vue
   * @namespace src.pages
   * @description Home page component for the application
   *
   * @component
   * @example
   * <Home />
   */

  import { ref, onMounted } from 'vue';
  import Logo from '@/shared/icons/favicon.svg';
  import { useUserStore } from '@/stores/user.store';
  import EditModal from '@/shared/components/EditModal.vue';
  import { initHome } from '@/logic/home.logic';

  const userStore = useUserStore();
  const showNameModal = ref(false);
  const modalTitle = ref('');
  const modalPlaceholder = ref('');
  const showContent = ref(false);
  const isDev = import.meta.env.DEV;

  function openNameModal(isEditing = false) {
    modalTitle.value = isEditing ? 'Editar nombre' : 'Introduce tu nombre';
    modalPlaceholder.value = isEditing ? 'Cambia tu nombre' : 'Escribe tu nombre';
    showNameModal.value = true;
  }

  function handleSaveName(newName: string): void {
    userStore.setName(newName);
  }

  function clearName(): void {
    userStore.clearName();
    openNameModal(true);
  }

  onMounted(() => {
    initHome(userStore, showContent, openNameModal);
  });
</script>

<template>
  <div class="relative flex flex-col items-center justify-center text-center p-4 h-full">
    <div v-if="showContent">
      <!-- Logo -->
      <Logo
        id="Logo"
        src="@/shared/icons/favicon.svg"
        alt="Sumsy logo"
        class="w-32 h-32 mb-4 hover:scale-110 transition-transform duration-200"
      />

      <!-- Title -->
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white cursor-default">Sumsy</h1>

      <!-- Welcome message -->
      <h2
        v-if="userStore.getName && userStore.getName.trim() !== ''"
        id="welcome-message"
        class="mt-2 text-lg text-gray-600 dark:text-gray-300"
      >
        Bienvenido,
        <span class="font-semibold">{{ userStore.getName }}</span>
        !
      </h2>

      <!-- Botón Borrar Nombre (solo desarrollo) -->
      <button
        v-if="userStore.getName && userStore.getName.trim() !== '' && isDev"
        id="clear-name-button"
        class="absolute bottom-0 left-0 flex items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200"
        @click="clearName"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Borrar Nombre
      </button>

      <!-- Botón cambiar nombre abajo a la derecha -->
      <button
        v-if="userStore.getName && userStore.getName.trim() !== ''"
        id="change-name-button"
        class="absolute bottom-0 right-0 flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200"
        @click="openNameModal(true)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
          />
        </svg>
        Cambiar nombre
      </button>
    </div>

    <!-- Modal -->
    <EditModal
      v-model="showNameModal"
      :title="modalTitle"
      :initial-name="userStore.getName || ''"
      :place-holder="modalPlaceholder"
      :user-store="userStore"
      @save="handleSaveName"
    />
  </div>
</template>
