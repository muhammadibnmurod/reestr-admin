<template>
  <div class="min-h-screen w-full flex bg-[#050505] font-sans selection:bg-indigo-500/30">
    <div class="relative flex-1 hidden lg:block overflow-hidden p-10">
      <img :src="bgImage" class="absolute inset-0 w-full h-full object-cover scale-105 animate-subtle-zoom p-10" />
      <div class="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent"></div>

      <div class="relative z-10 h-full flex flex-col justify-between p-20">
        <div class="flex items-center space-x-3">
          <!-- <div
            class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <span class="text-white text-xl font-medium tracking-tight">Smart Site System</span> -->
        </div>

        <div class="max-w-xl">
          <h2 class="text-white text-6xl font-semibold leading-[1.1] mb-6 tracking-tight">
            Xavfsiz tizimga <br />
            <span class="text-indigo-400">xush kelibsiz.</span>
          </h2>
          <p class="text-gray-400 text-lg leading-relaxed font-light">
            Zamonaviy texnologiyalar asosida qurilgan boshqaruv paneli orqali ishingizni osonlashtiring.
          </p>
        </div>
      </div>
    </div>

    <div
      class="w-full lg:w-[600px] flex items-center justify-center px-8 sm:px-16 bg-[#0a0a0a] border-l border-white/5">
      <div class="w-full max-w-[400px]">
        <div class="mb-10 text-center lg:text-left">
          <h1 class="text-white text-4xl font-semibold mb-3 tracking-tight">Kirish</h1>
          <p class="text-gray-500">Davom etish uchun ma'lumotlaringizni kiriting</p>
        </div>

        <el-form ref="formRef" :model="form" label-position="top" size="large" @submit.prevent="onSubmit">
          <div class="space-y-6">
            <el-form-item prop="username" class="custom-form-item" :error="serverErrors.username">
              <template #label>
                <span class="text-gray-400 font-medium ml-1">{{ $t("full_name") }}</span>
              </template>
              <el-input v-model="form.username" :placeholder="$t('enter_your_full_name_here')" class="premium-input" />
            </el-form-item>

            <el-form-item prop="password" class="custom-form-item" :error="serverErrors.password">
              <template #label>
                <div class="flex justify-between items-center w-full">
                  <span class="text-gray-400 font-medium ml-1">{{ $t("password") }}</span>
                  <a href="#" class="text-xs text-indigo-400 hover:text-indigo-300 transition">Parolni unutdingizmi?</a>
                </div>
              </template>
              <el-input v-model="form.password" type="password" show-password
                :placeholder="$t('enter_your_password_here')" class="premium-input" />
            </el-form-item>
          </div>

          <div class="mt-10">
            <el-button type="primary" :loading="loading" @click="onSubmit" class="premium-button w-full h-14">
              {{ $t("login") }}
            </el-button>
          </div>
        </el-form>

        <!-- General error display -->
        <div v-if="serverErrors.general" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">{{ serverErrors.general }}</p>
        </div>

        <!-- <p class="mt-8 text-center text-gray-500 text-sm">
          Hisobingiz yo'qmi?
          <a href="#" class="text-indigo-400 font-medium hover:underline underline-offset-4">Ro'yxatdan o'ting</a>
        </p> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Orqa fon uchun sekin zoom animatsiyasi */
@keyframes subtle-zoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}

.animate-subtle-zoom {
  animation: subtle-zoom 20s infinite alternate ease-in-out;
}

/* Element Plus inputlarini premium ko'rinishga keltirish */
:deep(.premium-input .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.03) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  padding: 8px 16px !important;
  transition: all 0.3s ease;
}

:deep(.premium-input .el-input__wrapper.is-focus) {
  border-color: #6366f1 !important;
  background: rgba(99, 102, 241, 0.05) !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

:deep(.premium-input .el-input__inner) {
  color: #fff !important;
  height: 48px !important;
  font-size: 15px !important;
}

/* Tugma dizayni */
.premium-button {
  background: #6366f1 !important;
  border: none !important;
  border-radius: 12px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.premium-button:hover {
  background: #4f46e5 !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.5);
}

.premium-button:active {
  transform: translateY(0);
}

:deep(.el-form-item__label) {
  padding-bottom: 4px !important;
}
</style>


<script setup lang="ts">
import type { FormInstance } from "element-plus";

// Use public directory image path
const bgImage = "/images/auth/image.png";

type LoginForm = { username: string; password: string; remember: boolean };

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive<LoginForm>({
  username: "",
  password: "",
  remember: true,
});

// Server-side validation errors
const serverErrors = reactive<{ [key: string]: string | undefined }>({
  username: undefined,
  password: undefined,
  general: undefined,
});

// Function to handle API validation errors
function handleApiErrors(payload: any) {
  // Clear existing errors
  for (const k in serverErrors) serverErrors[k] = undefined;

  if (!payload || !Array.isArray(payload.error)) {
    if (payload?.message) {
      serverErrors.general = payload.message;
      ElMessage.error(payload.message);
    }
    return;
  }

  payload.error.forEach((msg: string) => {
    const lower = String(msg).toLowerCase();

    if (lower.includes("username") || lower.includes("login")) {
      serverErrors.username = serverErrors.username ? serverErrors.username + " " + msg : msg;
    } else if (lower.includes("password")) {
      serverErrors.password = serverErrors.password ? serverErrors.password + " " + msg : msg;
    } else {
      serverErrors.general = serverErrors.general ? serverErrors.general + " " + msg : msg;
    }
  });

  // Show general error as toast if any
  if (serverErrors.general) {
    ElMessage.error(serverErrors.general);
  }
}

const { setTokens } = useAuth();

const onSubmit = async () => {
  if (!formRef.value) return;

  try {
    // Clear previous server errors
    for (const k in serverErrors) serverErrors[k] = undefined;
    
    loading.value = true;

    // API call ga username va password yuborish
    const { data, error } = await useApiService().Auth.AuthController_login({ 
      username: form.username, 
      password: form.password 
    });

    // Debug: API response ni ko'rish
    console.log("API Response:", { data: data?.value, error: error?.value });


    // Agar server error qaytarsa  
    if (error.value) {
      handleApiErrors(error.value?.data || error.value);
      return;
    }

    // Agar data kelmasa
    if (!data.value) {
      ElMessage.error("Server xatosi: Ma'lumot kelmadi");
      return;
    }

    // Successful login - server dan kelgan tokenlarni saqlash
    const responseData = data.value as { 
      statusCode: number; 
      message: string; 
      data: { 
        accessToken: string; 
        refreshToken?: string;
        role: string;
        image: string;
      } 
    };
    
    // Response structure ni tekshirish va token olish
    const accessToken = responseData.data?.accessToken;
    const refreshToken = responseData.data?.refreshToken;
    
    if (!accessToken) {
      ElMessage.error("Server dan access token kelmadi");
      return;
    }

    // Tokenlarni useAuth orqali saqlash (updated setTokens function)
    setTokens({
      accessToken: accessToken,
      refreshToken: refreshToken // agar mavjud bo'lsa
    }, form.remember);

      if (form.remember) {
        localStorage.setItem("remember_login", form.username);
      } else {
        localStorage.removeItem("remember_login");
      }

      // Success message va redirect
      const successMessage = responseData.message || "Muvaffaqiyatli kirdingiz!";
      ElMessage.success(successMessage);
      await router.push("/example");
      
  } catch (e: any) {
    console.error("Login xatosi:", e);
    // Network yoki boshqa xatolarni handle qilish
    const errorData = e?.response?.data || e?.data || { message: "Tarmoq xatosi yuz berdi" };
    handleApiErrors(errorData);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const saved = localStorage.getItem("remember_login");
  if (saved) form.username = saved;
});
</script>
