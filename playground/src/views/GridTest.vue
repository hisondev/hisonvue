<template>
  <h1>Test Page with multiple grids</h1>
  <HButton @click="goBack" id="b1">Back to Home</HButton> | 
  <HButton @click="test1" id="b2">test1</HButton> | 
  <HButton @click="test2" id="b3">test2</HButton>
  <br><br>
  <HGrid
    id="grid01"
    :columns="columns"
    class="hison-col-4"
    :height="'200px'"
    :rownumVisible="false"
    :statusVisible="false"
    :visible="true"
    :activeRow="onActiveRow"
    :activeCol="onActiveCol"
    @mounted="mountGrid1"
  />
  <HGrid
    id="grid02"
    class="hison-col-4"
    :columns="columns"
    :height="'200px'"
    :rownumVisible="false"
    :statusVisible="false"
    :color="'danger'"
    @mounted="mountGrid2"
  />
  <HGrid
    id="grid03"
    class="hison-col-4"
    :columns="columns"
    :height="'200px'"
    :rownumVisible="false"
    :statusVisible="false"
    :color="'warning'"
    :activeCell="onActiveCell"
    :activeCells="onActiveCells"
    @mounted="mountGrid3"
  />
  <HGrid
    id="grid04"
    class="
    hison-col-12-mb hison-col-9-tb hison-col-6-pc hison-col-3-wd
    hison-color-muted-mb hison-color-info-tb hison-color-success-pc hison-color-warning-wd
    hison-size-xl-mb hison-size-l-tb hison-size-m-pc hison-size-s-wd
    "
    :columns="testColumns"
    :height="'400px'"
    @mounted="mountGridTest"
  />
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { hison, type HGridColumn, GridAlign } from 'hisonvue'
  import { Align, type GridMethods } from 'vanillagrid2'

  const onActiveRow = (row: number) => {console.log('onActiveRow',row); return true;}
  const onActiveCol = (colId: string) => {console.log('onActiveCol',colId); return true;}
  const onActiveCell = (row: number, colId: string) => {console.log('onActiveCell',row, colId); return true;}
  const onActiveCells = (startRow: number, startColId: string, endRow: number, endColId: string) => {console.log('onActiveCells',startRow,startColId,endRow,endColId); return true;}

  // 라우터
  const router = useRouter()
  const goBack = () => router.push('/')

  // 컬럼 정의
  const columns: HGridColumn[] = [
    { id: 'col1', header: 'header;1', dataType: 'text', width: '25%' },
    { id: 'col2', header: ';2', dataType: 'number', width: '25%' },
    { id: 'col3', header: ';3', dataType: 'button', width: '25%' },
    { id: 'col4', header: ';4', dataType: 'text', width: '25%', align : GridAlign.right,}
  ]

  const testColumns: HGridColumn[] = [
    { id : "dept", header : "Click the Sigma button to the left of the header;filter1(mask);dept ", dataType : "mask", format : "AAA99", width : "100", rowMerge : true },
    { id : "f_nm", header : ";filter2(text);first name", dataType : "text", width : "120", align : Align.center, locked : true },
    { id : "l_nm", header : ";filter3(text);last name", dataType : "text", width : "120", align : Align.center, locked : true, colMerge : true },
    { id : "d_o_j", header : ";filter4(month);DOJ", dataType : "month", format : "yyyy/mm", width : "120", align : Align.center, locked : true },
    { id : "e_id", header : "sort1(text);;", dataType : "number", width : "120", align : Align.center, locked : true, footer : "MAX;MIN;AVG;SUM", roundNumber : -1 },
    { id : "salary", header : "sort2(number);;salary", dataType : "number", format : "$ #,###.#####", width : "150", footer : "$$MAX;$$MIN;$$AVG;$$SUM" },
    { id : "status", header : "Please double click;checkbox;status", dataType : "checkbox", width : "80", align : Align.center, footer : "$$COUNT_CHECK" },
    { id : "radio", header : "radio", dataType : "radio", width : "80", align : Align.center, footer : "$$COUNT_CHECK" }
  ]

  let sampleData = [
      { col1: 'A', col2: '2', col3: 'C', col4: 'D' },
      { col1: 'A', col2: '3', col3: 'C', col4: 'D' },
      { col1: 'A', col2: '4', col3: 'C', col4: 'D' },
      { col1: 'A', col2: '5', col3: 'C', col4: 'D' },
      { col1: 'A', col2: '6', col3: 'C', col4: 'D' }
    ];


  let invertColorToggle = true
  // 버튼 테스트용
  const test1 = () => {
    const grid4 = hison.component.getGrid("grid04")!;
    grid4.load(testData)
  }
  const test2 = () => {
    hison.style.setInvertColor(invertColorToggle)
    invertColorToggle = !invertColorToggle
  }

  const testData = [
    {
        dept : "AAA01",
        f_nm : "James",
        l_nm : "Smith",
        d_o_j : "201603",
        e_id : "7",
        salary : 100000,
        status : "Y",
    },
    {
        dept : "AAA01",
        f_nm : "Johnson",
        l_nm : "Johnson",
        d_o_j : "200103",
        e_id : "2",
        salary : 200000,
        status : "Y",
    },
    {
        dept : "AAA01",
        f_nm : "Michael",
        l_nm : "Williams",
        d_o_j : "200803",
        e_id : "4",
        salary : 150000,
        status : "N",
    },
    {
        dept : "AAA01",
        f_nm : "Smith",
        l_nm : "Smith",
        d_o_j : "202403",
        e_id : "46",
        salary : 50000,
        status : "Y",
    },
    {
        dept : "AAA01",
        f_nm : "William",
        l_nm : "Brown",
        d_o_j : "202203",
        e_id : "25",
        salary : 70000,
        status : "N",
    },
    {
        dept : "AAA01",
        f_nm : "Charles",
        l_nm : "Jones",
        d_o_j : "202103",
        e_id : "27",
        salary : 30000,
        status : "N",
    },
    {
        dept : "AAA02",
        f_nm : "David",
        l_nm : "Smith",
        d_o_j : "201403",
        e_id : "12",
        salary : 180000,
        status : "N",
    },
    {
        dept : "AAA02",
        f_nm : "James",
        l_nm : "Jones",
        d_o_j : "202303",
        e_id : "26",
        salary : 80000,
        status : "N",
    },
    {
        dept : "AAA02",
        f_nm : "Richard",
        l_nm : "Garcia",
        d_o_j : "202203",
        e_id : "24",
        salary : 60000,
        status : "Y",
    },
    {
        dept : "AAA02",
        f_nm : "David",
        l_nm : "Miller",
        d_o_j : "202403",
        e_id : "48",
        salary : 90000,
        status : "Y",
    },
    {
        dept : "AAA02",
        f_nm : "Joseph",
        l_nm : "Davis",
        d_o_j : "202403",
        e_id : "34",
        salary : 40000,
        status : "Y",
    },
    {
        dept : "AAA02",
        f_nm : "Richard",
        l_nm : "Miller",
        d_o_j : "202303",
        e_id : "35",
        salary : 50000,
        status : "Y",
    },
    {
        dept : "BBB01",
        f_nm : "Joseph",
        l_nm : "Davis",
        d_o_j : "200403",
        e_id : "3",
        salary : 140000,
        status : "Y",
    },
    {
        dept : "BBB01",
        f_nm : "Thomas",
        l_nm : "Johnson",
        d_o_j : "200903",
        e_id : "9",
        salary : 110000,
        status : "N",
    },
    {
        dept : "BBB01",
        f_nm : "Charles",
        l_nm : "Brown",
        d_o_j : "200703",
        e_id : "11",
        salary : 130000,
        status : "Y",
    },
    {
        dept : "BBB01",
        f_nm : "James",
        l_nm : "Rodriguez",
        d_o_j : "201303",
        e_id : "14",
        salary : 120000,
        status : "N",
    },
    {
        dept : "BBB02",
        f_nm : "Richard",
        l_nm : "Garcia",
        d_o_j : "200803",
        e_id : "10",
        salary : 190000,
        status : "Y",
    },
    {
        dept : "BBB02",
        f_nm : "David",
        l_nm : "Martinez",
        d_o_j : "202403",
        e_id : "37",
        salary : 60000,
        status : "Y",
    },
    {
        dept : "BBB02",
        f_nm : "Robert",
        l_nm : "Rodriguez",
        d_o_j : "202303",
        e_id : "31",
        salary : 90000,
        status : "N",
    },
    {
        dept : "BBB02",
        f_nm : "James",
        l_nm : "Williams",
        d_o_j : "202403",
        e_id : "40",
        salary : 60000,
        status : "Y",
    },
  ];

  // 각 grid mount 이벤트
  const mountGrid1 = (grid: GridMethods) => {
    grid.load(sampleData)
  }
  const mountGrid2 = (grid: GridMethods) => {
    grid.load(sampleData)
  }
  const mountGrid3 = (grid: GridMethods) => {
    grid.load(sampleData)
  }
  const mountGridTest = (grid: GridMethods) => {
  }
</script>
