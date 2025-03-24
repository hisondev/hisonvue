<template>
    <div>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, onMounted, onBeforeUnmount } from 'vue'
import { getVanillanote, createVanillanote, destroyVanillanote } from 'vanillanote'

const vn = getVanillanote()

// 내부 컴포넌트에 vn 주입
provide('hisonvue-vn', vn)
provide('hprovider', true) // 컴포넌트 내부에서 HProvider 감지용

let observer: MutationObserver | null = null

onMounted(() => {
observer = new MutationObserver((mutations, obs) => {
    const targetEl = document.querySelector('[data-vanillanote]')
    if (targetEl) {
    createVanillanote(vn)
    obs.disconnect() // 감지 후 observer 종료
    }
})

observer.observe(document.body, {
    childList: true,
    subtree: true
})
})

onBeforeUnmount(() => {
destroyVanillanote(vn)
if (observer) {
    observer.disconnect()
    observer = null
}
})
</script>

<style scoped>
</style>
