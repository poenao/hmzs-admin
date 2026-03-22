<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { loginAi } from "@/apis/user";
import { useUserStore } from "@/stores/user";
import router from "@/router";

// 表单 ref
const formRef = ref<FormInstance>();

// 组件挂载时，检查是否有记住的登录信息
onMounted(() => {
  const rememberData = localStorage.getItem("REMEMBER_KEY");
  if (rememberData) {
    const { username, password } = JSON.parse(rememberData);
    loginForm.value.username = username;
    loginForm.value.password = password;
    loginForm.value.remember = true;
  }
});

// 表单数据
const loginForm = ref({
  username: "",
  password: "",
  remember: false,
});

// 校验规则
const rules: FormRules = {
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 20, message: "账号长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
};

// 登录提交
const store = useUserStore();
const handleLogin = () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      const { username, password } = loginForm.value;
      const res = await loginAi({ username, password });
      store.setToken(res.data.token);

      if (loginForm.value?.remember) {
        const loginData = JSON.stringify({ username, password });
        localStorage.setItem("REMEMBER_KEY", loginData);
      } else {
        localStorage.removeItem("REMEMBER_KEY");
      }

      ElMessage.success("登录成功 ✧(≖ ◡ ≖✿)");
      // 获取之前的重定向路径
      const redirectPath = localStorage.getItem("redirectPath");
      // 登录成功后清除重定向路径，避免下次登录时误用
      localStorage.removeItem("redirectPath");
      // 登录后重定向到之前页面或首页
      router.push(redirectPath || "/");
    }
  });
};
</script>

<template>
  <div class="login_body">
    <div class="bg" />

    <div class="box">
      <!-- 新增一层卡片容器，用来做玻璃态和卡片阴影 -->
      <div class="kawaii-card">
        <div class="title-wrapper">
          <div class="title">Agent 智能体</div>
          <div class="subtitle">Welcome Back ~ ☆</div>
        </div>

        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          class="custom-form"
        >
          <el-form-item label="✦ 账号" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="输入你的专属 ID 吧 (•ω•)"
              size="large"
            />
          </el-form-item>

          <el-form-item label="✦ 密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="嘘，这是秘密 (×ω×)"
              show-password
              size="large"
            />
          </el-form-item>

          <el-form-item prop="remember" class="remember-item">
            <el-checkbox v-model="loginForm.remember"
              >记住我，下次直接进！</el-checkbox
            >
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="login_btn kawaii-btn"
              @click="handleLogin"
            >
              登 录 出 发 🚀
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 整体背景加了一点点梦幻的微蓝紫底色，衬托白卡片 */
.login_body {
  display: flex;
  background-color: #f6f8fd;
  min-height: 100vh;
}

.bg {
  width: 60vw;
  height: 100vh;
  /* 👇 把这里的路径改成刚才建好的 svg 文件！ */
  background: url("@/assets/kawaii-bg.svg") center center no-repeat;

  /* 添加缓慢漂浮的呼吸动画 */
  background-size: 120% 120%;
  animation: dream-float 20s ease-in-out infinite alternate;
  border-radius: 0 40px 40px 0;
  box-shadow: 10px 0 30px rgba(177, 156, 253, 0.1);
}

/* 背景呼吸动画关键帧 */
@keyframes dream-float {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 100%;
  }
}

.box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* =======================================
   1. 糖果玻璃卡片 (包裹整个表单的白底框)
   ======================================= */
.kawaii-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  border-radius: 36px; /* 超大圆角 */
  padding: 50px 40px;
  /* 柔和的粉紫渐变大阴影 + 内圈白色高光边缘 */
  box-shadow:
    0 20px 60px rgba(161, 196, 253, 0.25),
    0 10px 20px rgba(255, 193, 204, 0.15),
    inset 0 0 0 2px rgba(255, 255, 255, 1);
  margin-right: 10%; /* 适配你原先的布局偏向 */
}

/* 标题区域 */
.title-wrapper {
  text-align: center;
  margin-bottom: 40px;

  .title {
    font-size: 30px;
    font-weight: 900;
    /* 渐变色文字 */
    background: linear-gradient(135deg, #7f7fd5, #86a8e7, #91eae4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
  }

  .subtitle {
    margin-top: 8px;
    font-size: 14px;
    color: #a3aab8;
    font-weight: bold;
  }
}

/* 深度穿透 Element Plus 样式 */
:deep(.custom-form) {
  .el-form-item {
    margin-bottom: 28px;
  }

  /* Label 标签：加粗，换成温柔的紫灰色 */
  .el-form-item__label {
    font-size: 14px;
    color: #8c98a4;
    font-weight: 700;
    padding-bottom: 6px;
  }

  /* =======================================
     2. Q弹泡芙输入框
     ======================================= */
  .el-input__wrapper {
    background-color: #f7f9fa; /* 淡淡的奶油灰底 */
    border-radius: 99px; /* 完全胶囊形 */
    padding: 8px 20px;
    box-shadow: none !important; /* 去掉自带的边框 */
    /* cubic-bezier 提供类似果冻的 Q弹回弹动画 */
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

    .el-input__inner {
      font-weight: 500;
      color: #555;
    }

    &:hover {
      background-color: #f1f4f9;
    }

    /* 聚焦点（Focus）：核心发光 & Q弹放大效果 */
    &.is-focus {
      background-color: #ffffff;
      /* 放大 2% 并且向上稍微浮起 */
      transform: scale(1.02) translateY(-2px);
      /* 内边框变成梦幻的粉蓝色，下面打出对应的彩虹泡芙阴影 */
      box-shadow:
        inset 0 0 0 2px #a1c4fd,
        0 12px 24px -6px rgba(161, 196, 253, 0.5) !important;
    }
  }

  /* =======================================
     3. 猛男粉定制复选框
     ======================================= */
  .remember-item {
    margin-bottom: 35px;

    .el-checkbox {
      /* 修改 Element 默认主题色为梦幻紫粉 */
      --el-checkbox-checked-bg-color: #b19cfd;
      --el-checkbox-checked-input-border-color: #b19cfd;
      --el-checkbox-checked-text-color: #b19cfd;

      .el-checkbox__label {
        font-size: 13px;
        font-weight: bold;
        color: #9ba4b4;
        transition: color 0.3s;
      }

      /* 勾选后的文字颜色 */
      &.is-checked .el-checkbox__label {
        color: #b19cfd;
      }
    }
  }
}

/* =======================================
   4. 二次元果冻按钮
   ======================================= */
.kawaii-btn {
  width: 100%;
  height: 54px;
  border-radius: 99px;
  border: none;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #fff;

  /* 梦幻果冻渐变：粉桃色过渡到浅蓝紫色 */
  background: linear-gradient(135deg, #ffc3a0 0%, #ffafbd 50%, #b19cfd 100%);
  background-size: 200% auto; /* 背景拉伸，为后面的 hover 动画做准备 */

  /* 彩色果冻阴影 */
  box-shadow: 0 10px 25px -5px rgba(255, 175, 189, 0.6);
  /* 同样使用 Q弹动画曲线 */
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    /* 鼠标悬浮：渐变色流动，整体向上弹起，阴影扩大 */
    background-position: right center;
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 16px 30px -5px rgba(177, 156, 253, 0.7);
  }

  &:active {
    /* 鼠标点击：向下压扁（吧唧） */
    transform: translateY(2px) scale(0.96);
    box-shadow: 0 5px 10px -3px rgba(177, 156, 253, 0.5);
  }
}
</style>
