<template>
  <h1>Test Page with multiple grids</h1>
  <HButton @click="goBack" text-color="#ff0000">Back to Home</HButton> | 
  <HButton @click="test1" text-color="#ff0000">test1</HButton> | 
  <HButton @click="test2" text-color="#ff0000">test2</HButton>
  <br><br>
  <HGrid
    data-id="grid01"
    :columns="columns"
    :height="'200px'"
    :rownumVisible="'false'"
    :statusVisible="'false'"
    :visible="'true'"
    @mounted="mountGrid1"
  />
  <br>
  <HGrid
    data-id="grid02"
    :columns="columns"
    :height="'200px'"
    :rownumVisible="'false'"
    :statusVisible="'false'"
    @mounted="mountGrid2"
  />
  <br>
  <HGrid
    data-id="grid03"
    :columns="columns"
    :height="'200px'"
    :rownumVisible="'false'"
    :statusVisible="'false'"
    @mounted="mountGrid3"
  />
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { hison, type HGridColumn, GridAlign } from 'hisonvue'
  import type { GridMethods } from 'vanillagrid2'

  // 라우터
  const router = useRouter()
  const goBack = () => router.push('/')

  // 컬럼 정의
  const columns: HGridColumn[] = [
    { id: 'col1', header: 'header;1', dataType: 'text', width: '25%' },
    { id: 'col2', header: ';2', dataType: 'text', width: '25%' },
    { id: 'col3', header: ';3', dataType: 'text', width: '25%' },
    { id: 'col4', header: ';4', dataType: 'text', width: '25%', align : GridAlign.right,}
  ]

  const sampleData1 = [
      { col1: 'A', col2: 'B', col3: 'C', col4: 'D' },
      { col1: 'A', col2: 'B', col3: 'C', col4: 'D' },
      { col1: 'A', col2: 'B', col3: 'C', col4: 'D' },
      { col1: 'A', col2: 'B', col3: 'C', col4: 'D' },
      { col1: 'A', col2: 'B', col3: 'C', col4: 'D' }
    ];
  const sampleData2 = [
      { col1: 'Z', col2: 'Y', col3: 'X', col4: 'W' },
      { col1: 'Z', col2: 'Y', col3: 'X', col4: 'W' },
      { col1: 'Z', col2: 'Y', col3: 'X', col4: 'W' },
      { col1: 'Z', col2: 'Y', col3: 'X', col4: 'W' },
      { col1: 'Z', col2: 'Y', col3: 'X', col4: 'W' }
    ];

  // 버튼 테스트용
  const test1 = () => {
    const grid1 = hison.grid.getGrid("grid01")!;
    grid1.load(sampleData1)
  }
  const test2 = () => {
    const grid2 = hison.grid.getGrid("grid02")!;
    grid2.load(sampleData1)
  }

  // 각 grid mount 이벤트
  const mountGrid1 = (grid: GridMethods) => {
    grid.load(sampleData2)
  }
  const mountGrid2 = (grid: GridMethods) => {
    grid.load(sampleData2)
  }
  const mountGrid3 = (grid: GridMethods) => {
    grid.load(sampleData2)
  }
</script>
