<template>
    <h1>Home Page</h1>
    <HLayout
    class="hison-col-12-mb hison-col-12-tb hison-col-12-pc hison-col-12-wd hison-layout-vertical-align-center-mb hison-layout-vertical-align-top-pc"
    >
        <HButton
          id="b1"
          class="hison-col-2 hison-pos-left hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-pc"
          :backgroundType="'empty'"
          @click="goToNoteTest"
        >
          Go to Note<br>(left-button)
        </HButton>
        <HLayout class="hison-col-5 hison-pos-center hison-pos-vertical-center">
            <HButton
            id="b2"
            class="hison-col-5 hison-size-l-mb hison-size-s-pc hison-color-muted-mb hison-color-info-pc"
            text="button1"
            @click="onClickCenterButton2"
            ></HButton>
            <HGap
              class="hison-col-2 hison-size-l-mb hison-size-s-pc hison-color-info-mb hison-color-muted-pc"
              :backgroundType="'empty'"
              :line="'vertical'"
            ></HGap>
            <HButton
            id="b3"
            class="hison-col-5 hison-size-l-mb hison-size-s-pc hison-color-warning-mb hison-color-primary-pc"
            text="button2"
            :backgroundType="'filled'"
            @click="onClickCenterButton3"
            ></HButton>
        </HLayout>
        <HButton
          id="b4"
          class="hison-col-2 hison-pos-right hison-size-l-mb hison-size-s-pc hison-color-danger-mb hison-color-success-pc"
          :backgroundType="'empty'"
          @click="goToGridTest"
        >
          Go to Grid<br>(right-button)
        </HButton>
    </HLayout>
</template>

<script setup lang="ts">
import { hison } from 'hisonvue'
import { useRouter } from 'vue-router'
const router = useRouter()

const onClickCenterButton2 = () => {
  const b1 = hison.component.getButton('b1')!
  b1.setBorder(!b1.isBorder())
}
const onClickCenterButton3 = () => {
  const b4 = hison.component.getButton('b4')!
  b4.setBorder(!b4.isBorder())
}
const goToGridTest = () => {
  router.push('/gridTest')
}
const goToNoteTest = () => {
  router.push('/noteTest')
}
</script>

<style scoped>
</style>
