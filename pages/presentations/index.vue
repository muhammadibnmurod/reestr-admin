<template>
  <div class="flex flex-col gap-6 h-full p-6 bg-gray-50 dark:bg-gray-900">
    <div class="flex justify-between items-center pb-4">
      <div>
        <h1 class="text-black dark:text-white text-3xl font-inter font-bold">
          Taqdimotlar
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Mahsulot taqdimotlarini boshqarish tizimi
        </p>
      </div>
      <el-button
        :icon="ElIconPlus"
        type="primary"
        @click="goToCreate"
        class="!px-5 !py-3 !rounded-xl"
      >
        Taqdimot qo'shish
      </el-button>
    </div>

    <PresentationsFilter
      v-model:search="filterParams.search"
      :total-count="presentations.length"
      @search="handleSearch"
    />

    <PresentationsList
      :presentations="filteredPresentations"
      :loading="loading"
      @edit="goToEdit"
      @view="goToView"
      @delete="confirmDelete"
      @order-change="handleOrderChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElNotification, ElLoading } from 'element-plus';
import { Plus as ElIconPlus } from '@element-plus/icons-vue';
import api from '@/utils/axios';
import type { Presentation } from '@/types';

const router = useRouter();
const presentations = ref<Presentation[]>([]);
const loading = ref(false);

const filterParams = ref({
  currentPage: 1,
  pageSize: 10,
  search: '',
});

const filteredPresentations = computed(() => {
  if (!filterParams.value.search) {
    return presentations.value;
  }
  
  const search = filterParams.value.search.toLowerCase();
  return presentations.value.filter(p => 
    p.titleUz?.toLowerCase().includes(search) ||
    p.titleEn?.toLowerCase().includes(search) ||
    p.titleRu?.toLowerCase().includes(search) ||
    p.subtitleUz?.toLowerCase().includes(search) ||
    p.descriptionUz?.toLowerCase().includes(search)
  );
});

const fetchPresentations = async () => {
  loading.value = true;
  try {
    const response = await api.get('/presentation');
    presentations.value = response.data.data || [];
    presentations.value.sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error('Error fetching presentations:', error);
    ElNotification({
      title: 'Xatolik',
      message: error.response?.data?.message || 'Taqdimotlarni yuklashda xatolik yuz berdi',
      type: 'error',
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPresentations();
});

const goToCreate = () => {
  router.push({ name: 'presentations-create' });
};

const goToEdit = (presentation: Presentation) => {
  router.push({ 
    name: 'presentations-edit-id', 
    params: { id: presentation.id } 
  });
};

const goToView = (presentation: Presentation) => {
  router.push({ 
    name: 'presentations-view-id', 
    params: { id: presentation.id } 
  });
};

const confirmDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      'Ushbu taqdimotni o\'chirmoqchimisiz? Bu amalni bekor qilib bo\'lmaydi.',
      'Ogohlantirish',
      {
        confirmButtonText: 'Ha, o\'chirish',
        cancelButtonText: 'Bekor qilish',
        type: 'warning',
        distinguishCancelAndClose: true,
      }
    );
    await onDelete(id);
  } catch (error) {
    // Bekor qilindi
  }
};

const onDelete = async (id: number) => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: 'O\'chirilmoqda...'
  });
  
  try {
    await api.delete(`/presentation/${id}`);
    ElNotification({
      title: 'Muvaffaqiyatli',
      message: 'Taqdimot muvaffaqiyatli o\'chirildi',
      type: 'success',
      position: 'top-right'
    });
    
    await fetchPresentations();
  } catch (error: any) {
    console.error('Error deleting presentation:', error);
    ElNotification({
      title: 'Xatolik',
      message: error.response?.data?.message || 'Taqdimotni o\'chirishda xatolik yuz berdi',
      type: 'error',
      position: 'top-right'
    });
  } finally {
    loadingInstance.close();
  }
};

const handleOrderChange = async (newOrder: Array<{ id: number; order: number }>) => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: 'Tartib o\'zgartirilmoqda...'
  });
  
  try {
    await api.put('/presentation/change-order', newOrder);
    ElNotification({
      title: 'Muvaffaqiyatli',
      message: 'Tartib muvaffaqiyatli o\'zgartirildi',
      type: 'success',
      position: 'top-right'
    });
    
    await fetchPresentations();
  } catch (error: any) {
    console.error('Error changing order:', error);
    ElNotification({
      title: 'Xatolik',
      message: error.response?.data?.message || 'Tartibni o\'zgartirishda xatolik yuz berdi',
      type: 'error',
      position: 'top-right'
    });
  } finally {
    loadingInstance.close();
  }
};

const handleSearch = () => {
  // Search qilinadi computed property orqali
};
</script>