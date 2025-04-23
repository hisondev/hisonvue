<template>
    <h1>Test Page with multiple grids</h1>
    <HButton @click="goBack" text-color="#ff0000">Back to Home</HButton>
    <HButton @click="test1" text-color="#ff0000">test1</HButton>
    <HButton @click="test2" text-color="#ff0000">test2</HButton>
  
    <HGrid
      data-id="grid01"
      :columns="columns"
      :height="'200px'"
      :rownumVisible="'false'"
      :statusVisible="'false'"
      :visible="'true'"
      v-model="gridData1"
      @mounted="mountGrid1"
    />
    <br>
    <HGrid
      data-id="grid02"
      :columns="columns"
      :height="'200px'"
      :rownumVisible="'false'"
      :statusVisible="'false'"
      v-model="gridData2"
      @mounted="mountGrid2"
    />
    <br>
    <HGrid
      data-id="grid03"
      :columns="columns"
      :height="'200px'"
      :rownumVisible="'false'"
      :statusVisible="'false'"
      v-model="gridData3"
      @mounted="mountGrid3"
    />
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import { hisonvue } from 'hisonvue'
  import { GridMethods } from 'vanillagrid2'
  
  // 라우터
  const router = useRouter()
  const goBack = () => router.push('/')
  
  // 컬럼 정의
  const columns = [
    { id: 'col1', header: 'header;1', dataType: 'text', width: '25%' },
    { id: 'col2', header: ';2', dataType: 'text', width: '25%' },
    { id: 'col3', header: ';3', dataType: 'text', width: '25%' },
    { id: 'col4', header: ';4', dataType: 'text', width: '25%' }
  ]
  
  // 데이터 및 인스턴스 보관용
  const gridData1 = ref([])
  const gridData2 = ref([])
  const gridData3 = ref([])
  
  // 버튼 테스트용
  const test1 = () => {
    const grid1 = hisonvue.vue.grid.getGrid("grid01");
    grid1?.load([
      { col1: 'A', col2: 'B', col3: 'C', col4: 'D' }
    ])
  }
  const test2 = () => {
    const grid2 = hisonvue.vue.grid.getGrid("grid02");
    grid2?.load([
      { col1: 'A', col2: 'B', col3: 'C', col4: 'D' }
    ])
  }
  
  // 각 grid mount 이벤트
  const mountGrid1 = (grid: GridMethods | null) => {
    console.log(grid?.getGridInfo());
  }
  const mountGrid2 = (grid: GridMethods | null) => {
    console.log(grid?.getGridInfo());
  }
  const mountGrid3 = (grid: GridMethods | null) => {
    console.log(grid?.getGridInfo());
  }
  </script>
  
