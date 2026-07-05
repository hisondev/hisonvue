<!-- login.vue -->
<template>
  <HLayout class="login-page hison-col-12">
    <!-- 중앙 카드 -->
    <HGap></HGap>
    <HGap></HGap>
    <HGap></HGap>
    <HLayout class="card hison-col-12-mb hison-col-8-tb hison-col-5-pc hison-col-4-wd hison-pos-center">
      <!-- 타이틀 -->
      <HLabel
        id="authTitle"
        class="hison-col-12 hison-size-l hison-color-primary"
        :fontBold="true"
        textAlign="center"
        :text="mode === 'login' ? '로그인' : '회원가입'"
      />

      <HGap id="gapTab" class="hison-col-12" :backgroundType="'empty'" :line="'horizontal'" />

      <!-- 로그인 폼 -->
      <HInputGroup v-if="mode === 'login'" id="loginGroup" v-model="loginForm" class="hison-col-12">
        <HLabel
          id="lbLoginId"
          class="hison-col-12 hison-size-s hison-color-muted"
          text="아이디"
          :border="false"
          :backgroundType="'transparent'"
        />
        <HInput
          id="loginId"
          class="hison-col-12"
          inputType="text"
          dataKey="userId"
          placeholder="아이디를 입력하세요"
          :required="true"
        />

        <HGap id="gapLogin1" class="hison-col-12" />

        <HLabel
          id="lbLoginPw"
          class="hison-col-12 hison-size-s hison-color-muted"
          text="비밀번호"
          :border="false"
          :backgroundType="'transparent'"
        />
        <HInput
          id="loginPw"
          class="hison-col-12"
          inputType="password"
          dataKey="password"
          placeholder="비밀번호를 입력하세요"
          :required="true"
        />

        <HGap id="gapLogin2" class="hison-col-12" />

        <HButton
          id="btnLogin"
          class="hison-col-12 hison-color-primary"
          text="로그인"
          :backgroundType="'filled'"
          :border="true"
          @click="onSubmitLogin"
        />
        <HButton
          id="tabSignup"
          class="hison-col-12"
          :text="'회원가입'"
          :backgroundType="'empty'"
          :border="true"
          @click="switchMode('signup')"
        />

        <HGap id="gapLogin3" class="hison-col-12" />

        <HLayout class="hison-col-12 helper-row">
          <HButton
            id="btnFindPw"
            class="hison-col-12"
            text="비밀번호 찾기"
            :backgroundType="'transparent'"
            :border="false"
            @click="openMessage('안내', '비밀번호 찾기 화면/로직을 연결해주세요.')"
          />
        </HLayout>
      </HInputGroup>

      <!-- 회원가입 폼 -->
      <HInputGroup v-else id="signupGroup" v-model="signupForm" class="hison-col-12">
        <HLabel
          id="lbSignId"
          class="hison-col-12 hison-size-s hison-color-muted"
          text="아이디"
          :border="false"
          :backgroundType="'transparent'"
        />
        <HInput
          id="signId"
          class="hison-col-12"
          inputType="text"
          dataKey="userId"
          placeholder="영문/숫자 조합 권장"
          :required="true"
        />

        <HGap id="gapSign1" class="hison-col-12" />

        <HLabel
          id="lbSignEmail"
          class="hison-col-12 hison-size-s hison-color-muted"
          text="이메일"
          :border="false"
          :backgroundType="'transparent'"
        />
        <HInput
          id="signEmail"
          class="hison-col-12"
          inputType="email"
          dataKey="email"
          placeholder="example@domain.com"
          :required="true"
        />

        <HGap id="gapSign2" class="hison-col-12" />

        <HLabel
          id="lbSignPw"
          class="hison-col-12 hison-size-s hison-color-muted"
          text="비밀번호"
          :border="false"
          :backgroundType="'transparent'"
        />
        <HInput
          id="signPw"
          class="hison-col-12"
          inputType="password"
          dataKey="password"
          placeholder="비밀번호"
          :required="true"
        />

        <HGap id="gapSign3" class="hison-col-12" />

        <HLabel
          id="lbSignPw2"
          class="hison-col-12 hison-size-s hison-color-muted"
          text="비밀번호 확인"
          :border="false"
          :backgroundType="'transparent'"
        />
        <HInput
          id="signPw2"
          class="hison-col-12"
          inputType="password"
          dataKey="passwordConfirm"
          placeholder="비밀번호 확인"
          :required="true"
        />

        <HGap id="gapSign4" class="hison-col-12" />

        <HButton
          id="btnSignup"
          class="hison-col-12 hison-color-success"
          text="회원가입"
          :backgroundType="'filled'"
          :border="true"
          @click="onSubmitSignup"
        />

        <HGap id="gapSign5" class="hison-col-12" />

        <HButton
          id="btnBackLogin"
          class="hison-col-12"
          text="로그인으로 돌아가기"
          :backgroundType="'empty'"
          :border="true"
          @click="switchMode('login')"
        />
      </HInputGroup>
    </HLayout>

    <!-- 안내 모달 -->
    <HModal
      id="msgModal"
      :visible="msg.open"
      :caption="msg.title"
      :captionBorder="true"
      :captionBackgroundType="'filled'"
      :closeClickOverlay="true"
      :showOverlay="true"
      :scrollLock="true"
      :position="'middle-center'"
      @close="msg.open = false"
    >
      <div class="modal-body">
        <HLabel
          id="msgText"
          class="hison-col-12 hison-size-s"
          :text="msg.body"
          :border="false"
          :backgroundType="'transparent'"
          textAlign="center"
        />
        <HGap id="gapModal" class="hison-col-12" />
        <HButton
          id="msgOk"
          class="hison-col-12 hison-color-primary"
          text="확인"
          :backgroundType="'filled'"
          :border="true"
          @click="msg.open = false"
        />
      </div>
    </HModal>
  </HLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Mode = 'login' | 'signup'

const mode = ref<Mode>('login')

/**
 * HInputGroup은 v-model로 폼 객체를 관리하고,
 * 각 HInput은 dataKey(없으면 id)로 값이 매핑됨. 
 */
const loginForm = ref({
  userId: '',
  password: '',
})

const signupForm = ref({
  userId: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const msg = ref({
  open: false,
  title: '안내',
  body: '',
})

const openMessage = (title: string, body: string) => {
  msg.value.title = title
  msg.value.body = body
  msg.value.open = true
}

const switchMode = (m: Mode) => {
  mode.value = m
}

const onSubmitLogin = () => {
  const { userId, password } = loginForm.value
  if (!userId?.trim() || !password?.trim()) {
    openMessage('입력 확인', '아이디/비밀번호를 입력해주세요.')
    return
  }

  // TODO: 여기서 API 호출 연결 (예: hison.link 기반)
  openMessage('로그인', `로그인 시도: ${userId}`)
}

const onSubmitSignup = () => {
  const { userId, email, password, passwordConfirm } = signupForm.value

  if (!userId?.trim() || !email?.trim() || !password?.trim() || !passwordConfirm?.trim()) {
    openMessage('입력 확인', '필수 항목을 모두 입력해주세요.')
    return
  }
  if (password !== passwordConfirm) {
    openMessage('입력 확인', '비밀번호와 비밀번호 확인이 일치하지 않습니다.')
    return
  }

  // TODO: 여기서 회원가입 API 호출 연결
  openMessage('회원가입', `회원가입 시도: ${userId} / ${email}`)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* 카드 느낌 (hisonvue 기본 스타일에 살짝만 추가) */
.card {
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  background: white;
}

.tab-row {
  gap: 8px;
}

.helper-row {
  gap: 8px;
}

.modal-body {
  padding: 12px;
}
</style>
