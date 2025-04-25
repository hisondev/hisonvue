<template>
    <div>
      <h2>{{ title }} - {{ propsCount }}</h2>
      <p>Count: {{ count }}</p>
      <p>Double Count (computed): {{ doubleCount }}</p>
      <button @click="increment">Increment</button>
      <button @click="emitCustomEvent">Custom Event Emit</button>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref, // 반응형 변수 const count = ref(0)
    reactive, // 반응형 객체 const state = reactive({ ... })
    computed, // 계산된 속성 (computed) const doubleCount = computed(() => count.value * 2)
    watch, // 값 변화 감시 watch(count, (newVal, oldVal) => { ... })
    onBeforeMount, // DOM 마운트 직전
    onMounted, // DOM 마운트 후 실행
    onBeforeUpdate, // DOM 업데이트 직전
    onUpdated, //  DOM 업데이트 완료 후
    onBeforeUnmount, // DOM 제거 직전
    onUnmounted, // DOM 제거 완료 후
    onErrorCaptured // 자식 컴포넌트 오류 (false를 반환하면 에러를 상위로 전파하지 않음)
} from 'vue'

export default defineComponent({
    name: 'ReferenceComponent',
    // props 타입 정의
    props: {
        title: {
        type: String,
        required: true
        },
        count: {
        type: Number,
        required: true
        }
    },
    // emits 타입 정의
    emits: {
        customEvent: (payload: string) => {
        return typeof payload === 'string'
        }
    },
    setup(props, { emit }) {
        // 반응형 변수 (primitive 타입)
        const count = ref(0)

        // 반응형 객체 (여러 속성을 가진 상태 관리)
        const state = reactive({
        message: 'Hello, Vue 3!'
        })

        // 계산된 속성 (computed)
        const doubleCount = computed(() => count.value * 2)

        // 메서드 함수 정의
        const increment = () => {
        count.value++
        }

        const emitCustomEvent = () => {
        emit('customEvent', 'Hello!')
        }

        // 값 변화 감시 (watch)
        watch(count, (newVal, oldVal) => {
        console.log(`count changed from ${oldVal} to ${newVal}`)
        })

        // 생명주기 훅들
        onBeforeMount(() => {
        console.log('onBeforeMount: DOM 마운트 직전')
        })

        onMounted(() => {
        console.log('onMounted: DOM 마운트 후 실행')
        })

        onBeforeUpdate(() => {
        console.log('onBeforeUpdate: DOM 업데이트 직전')
        })

        onUpdated(() => {
        console.log('onUpdated: DOM 업데이트 완료 후')
        })

        onBeforeUnmount(() => {
        console.log('onBeforeUnmount: DOM 제거 직전')
        })

        onUnmounted(() => {
        console.log('onUnmounted: DOM 제거 완료 후')
        })

        onErrorCaptured((err, instance, info) => {
        console.error('onErrorCaptured: 자식 컴포넌트 오류', err, info)
        return false // false를 반환하면 에러를 상위로 전파하지 않음
        })

        return {
        // 템플릿에서 사용할 변수들
        title: props.title,
        propsCount: props.count,
        count,
        doubleCount,
        increment,
        emitCustomEvent
        }
    }
})
</script>

<style scoped>
div {
    padding: 1rem;
}
button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
}
</style>
  
