<template>
  <div class="w-full h-screen p-10 font-sans">
    <div
      class="bg-gray-100 h-full w-full rounded-2xl relative overflow-hidden flex justify-center items-center"
    >
      <img :src="ImgaeBottomLeftAuth" class="absolute bottom-0 left-0" />
      <img :src="ImageTopRightAuth" class="absolute top-0 right-0" />

      <div
        class="z-10 w-full max-w-[450px] px-12 py-14 rounded-2xl bg-white shadow-sm flex flex-col items-center"
      >
        <div class="flex justify-between w-full">
          <h2 class="text-2xl font-bold mb-10 text-black">
            {{ $t("login") }}
          </h2>
          <div class="">
            <el-dropdown trigger="click">
              <div
                class="el-dropdown-link flex items-center gap-1 border border-[#605BFF] p-2 rounded-full"
              >
                <img
                  :src="flags[activeLang].flag"
                  :alt="flags[activeLang].flag"
                  class="w-5 h-5"
                />
              </div>
              <template #dropdown>
                <el-dropdown-menu class="flex flex-col gap-1 !px-1">
                  <el-dropdown-item
                    v-for="(item, index) in flags"
                    :key="index"
                    @click="setLocale(item.code)"
                  >
                    <div class="flex items-center gap-1">
                      <img :src="item.flag" :alt="item.flag" class="w-5 h-5" />
                      <span>{{ item.name }}</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          label-position="top"
          size="large"
          class="w-full custom-form"
        >
          <div class="mb-5">
            <label class="block text-[#7A7A7A] text-sm font-semibold mb-2">{{
              $t("full_name")
            }}</label>
            <el-form-item prop="login" class="!mb-0">
              <el-input
                v-model="form.login"
                :placeholder="$t('enter_your_full_name_here')"
                class="rounded-input"
              />
            </el-form-item>
          </div>

          <!-- <div class="mb-5">
            <label class="block text-[#7A7A7A] text-sm font-semibold mb-2"
              >Email</label
            >
            <el-form-item prop="email" class="!mb-0">
              <el-input
                v-model="form.email"
                placeholder="Enter your Email here"
                class="rounded-input"
              />
            </el-form-item>
          </div> -->

          <div class="mb-10">
            <label class="block text-[#7A7A7A] text-sm font-semibold mb-2">{{
              $t("password")
            }}</label>
            <el-form-item prop="password" class="!mb-0">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                :placeholder="$t('enter_your_password_here')"
                class="rounded-input"
              />
            </el-form-item>
          </div>

          <el-form-item class="!mb-0">
            <el-button
              type="primary"
              :loading="loading"
              @click="onSubmit"
              class="w-full h-14 !text-lg !font-bold !rounded-xl !bg-[#4A3AFF] !border-none hover:!bg-[#392edb] transition-all"
            >
              {{ $t("login") }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Rasmga mos input dizayni */
:deep(.rounded-input .el-input__wrapper) {
  background-color: #e6e8ec !important; /* Rasmga mos kulrang fon */
  box-shadow: none !important;
  border-radius: 16px !important; /* Juda yumaloq burchaklar */
  padding: 10px 20px !important;
  border: none !important;
}

:deep(.rounded-input .el-input__inner) {
  height: 40px;
  color: #1a1d1f;
}

:deep(.rounded-input .el-input__inner::placeholder) {
  color: #9a9fa5;
  font-size: 14px;
}

/* Label uchun stil */
.custom-form label {
  font-family: inherit;
}

/* Input ichidagi ko'zcha (password icon) rangi */
:deep(.el-input__suffix) {
  color: #6f767e;
}
</style>

<script setup lang="ts">
import { Lock, User } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { ImageLogo, ImageTopRightAuth, ImgaeBottomLeftAuth } from "~/assets";
import { ImageFlagEn, ImageFlagRu, ImageFlagUz } from "~/assets";
import AuthIMage from "../../../assets/images/auth/auth.png";

const flags: {
  [key: string]: {
    code: "en" | "ru" | "uz" | "kril";
    name: string;
    flag: string;
  };
} = {
  uz: { code: "uz", name: "O'zbek", flag: ImageFlagUz },
  kril: { code: "kril", name: "Ўзбек", flag: ImageFlagUz },
  ru: { code: "ru", name: "Русский", flag: ImageFlagRu },
  en: { code: "en", name: "English", flag: ImageFlagEn },
};

const activeLang = ref<"uz" | "ru" | "en" | "kril">("uz");

type LoginForm = { login: string; password: string; remember: boolean };

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive<LoginForm>({
  login: "",
  password: "",
  remember: true,
});

// const rules = reactive<FormRules<LoginForm>>({
//   login: [
//     { required: true, message: "Введите логин", trigger: "blur" },
//     { min: 3, message: "Минимум 3 символа", trigger: "blur" },
//   ],
//   password: [
//     { required: true, message: "Введите пароль", trigger: "blur" },
//     { min: 6, message: "Минимум 6 символов", trigger: "blur" },
//   ],
// });

const { setTokens } = useAuth();
const { locale, setLocale } = useI18n();

const onSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    // Immiatatsiya: Backend so'rovini kutish (masalan, 1 soniya)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Login va parolni tekshirish
    if (form.login === "admin" && form.password === "admin123") {
      // Muvaffaqiyatli login: Tokenlarni o'rnatish (shunchaki test uchun)
      const fakeToken = { access_token: "fake-jwt-token" };
      setTokens(fakeToken, form.remember);

      if (form.remember) {
        localStorage.setItem("remember_login", form.login);
      } else {
        localStorage.removeItem("remember_login");
      }

      await router.push("/example");
    } else {
      // Xato bo'lsa
      ElMessage.error("Login yoki parol noto‘g‘ri!");
      throw new Error("Auth failed");
    }
  } catch (e) {
    console.error("Xatolik:", e);
  } finally {
    loading.value = false;
  }
};

const goHome = () => router.push("/");

onMounted(() => {
  const saved = localStorage.getItem("remember_login");
  if (saved) form.login = saved;
});
</script>
