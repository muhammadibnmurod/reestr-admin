<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <!-- F.I.O O'zbekcha -->
    <el-form-item
      label="F.I.O (O'zbekcha)"
      prop="fullNameUz"
      class="col-span-2"
    >
      <el-input
        v-model="modelValue.fullNameUz"
        placeholder="Familiya Ism Sharif"
        :prefix-icon="User"
        clearable
      />
    </el-form-item>

    <!-- F.I.O Inglizcha -->
    <el-form-item label="F.I.O (Inglizcha)" prop="fullNameEn">
      <el-input
        v-model="modelValue.fullNameEn"
        placeholder="Lastname Firstname"
        clearable
      />
    </el-form-item>

    <!-- F.I.O Ruscha -->
    <el-form-item label="F.I.O (Ruscha)" prop="fullNameRu">
      <el-input
        v-model="modelValue.fullNameRu"
        placeholder="Фамилия Имя Отчество"
        clearable
      />
    </el-form-item>

    <!-- Lavozim O'zbekcha -->
    <el-form-item
      label="Lavozim (O'zbekcha)"
      prop="positionUz"
      class="col-span-2"
    >
      <el-input
        v-model="modelValue.positionUz"
        placeholder="Dasturchi"
        :prefix-icon="Briefcase"
        clearable
      />
    </el-form-item>

    <!-- Lavozim Inglizcha -->
    <el-form-item label="Lavozim (Inglizcha)" prop="positionEn">
      <el-input
        v-model="modelValue.positionEn"
        placeholder="Programmer"
        clearable
      />
    </el-form-item>

    <!-- Lavozim Ruscha -->
    <el-form-item label="Lavozim (Ruscha)" prop="positionRu">
      <el-input
        v-model="modelValue.positionRu"
        placeholder="Программист"
        clearable
      />
    </el-form-item>

    <!-- Manager ID -->
    <!-- <el-form-item label="Manager ID" prop="managerId" class="col-span-2">
      <el-input-number
        v-model="modelValue.managerId"
        :min="1"
        placeholder="Manager ID"
        class="w-full"
      />
    </el-form-item> -->
  </div>
</template>

<script setup lang="ts">
import { User, Briefcase } from "@element-plus/icons-vue";

defineProps<{
  modelValue: {
    fullNameUz: string;
    fullNameEn: string;
    fullNameRu: string;
    positionUz: string;
    positionEn: string;
    positionRu: string;
    managerId: number | null;
  };
}>();
</script>
