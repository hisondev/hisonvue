<template>
    <h1>Home Page</h1>
    <HLayout
    class="hison-col-12-mb hison-col-12-tb hison-col-12-pc hison-col-12-wd hison-layout-vertical-align-center-mb hison-layout-vertical-align-top-pc"
    :border="true"
    >
        <HButton
          @click="goToNoteTest"
          :disable="false"
          id="b1"
          :backgroundType="BackgroundType.empty"
          :border="false"
          class="hison-col-2 hison-pos-left hison-size-l-mb hison-size-s-pc hison-color-danger-mb hison-color-warning-pc"
        >
          Go to Note<br>(left-button)
        </HButton>
        <HLayout class="hison-col-5 hison-pos-center hison-pos-vertical-center">
            <HButton
            @click="onClickCenterButton1"
            class="hison-col-5 hison-size-l-mb hison-size-s-pc"
            text="button1"
            :backgroundType="BackgroundType.empty"
            ></HButton>
            <HGap
              class="hison-col-2 hison-size-l-mb hison-color-warning"
              :backgroundType="BackgroundType.empty"
              :line="'vertical'"
            ></HGap>
            <HButton
            @click="onClickCenterButton2"
            id="b4"
            :backgroundType="BackgroundType.transparent"
            class="hison-col-5 hison-size-l-mb hison-size-s-pc"
            text="button2"
            ></HButton>
        </HLayout>
        <HButton @click="goToGridTest" id="b2" class="hison-col-2 hison-pos-right hison-size-l-mb hison-size-s-pc hison-color-info-pc">Go to Grid<br>(right-button)</HButton>
    </HLayout>
    <HGap></HGap>
    <HLayout>
      <HBaggie
        id="bag01"
        class="hison-color-danger"
        position="top-right"
        text="9+"
        shape="circle"
        :buttonEnabled="true"
      >
        <!-- 타겟 -->
        <HButton
          id="b4"
          :backgroundType="BackgroundType.transparent"
          class="hison-col-5 hison-size-l-mb hison-size-s-pc"
          text="button2"
        />
        <!-- 배지 내용 교체하고 싶으면: -->
        <!--
        <template #badge>
          <IconBell />
        </template>
        -->
      </HBaggie>
    </HLayout>
    <HLayout>
      <HModal
        id="mb1"
        class="hison-col-11 hison-color-primary-mb hison-color-danger-pc hison-size-l-mb hison-size-s-pc"
        caption="TESTTESTTESET"
        @open="onOpen"
        @close="onClose"
        @click-close="onClickClose"
        @backdrop-click="onBackdropClick"
      >
        <HButton @click="goAlertTest" id="alertTestBtn" class="hison-col-2 hison-pos-center hison-size-l-mb hison-size-s-pc hison-color-info-pc">Go Test</HButton>
        <HButton @click="goAlertTest2" id="alertTestBtn2" class="hison-col-2 hison-pos-center hison-size-l-mb hison-size-s-pc hison-color-info-pc">Go Test</HButton>
        <HTable
          id="tb1"
          class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-color-primary"
          :border="true"
          :backgroundType="'transparent'"
          :striped="'row'"
          :hoverable="'row'"
          :bodyBorderRight="true"
          :headerBorderBottom="true"
          :footerBorderTop="true"
          caption="Simple Data Table"
        >
  
          <template #colgroup>
            <col style="width: 50px;">
            <col style="width: 200px;">
            <col style="width: auto;">
          </template>
  
          <template #thead>
            <tr>
              <th>이름</th>
              <th class="hison-color-primary-bg-filled-important">직무</th>
              <th>부서</th>
            </tr>
          </template>
  
          <tr>
            <td
            class="hison-color-primary-bg-filled-important"
            style="height: 100px;"
            >홍길동asdfasdfasdfsdf adsfsadfsdfasdf</td>
            <td>개발자asdfasdfasdfsdfa dsfsadfsdfasdf</td>
            <td>ITasdfasdfasd fsdfadsfsadfsdfasdf</td>
          </tr>
          <tr>
            <td>김철수</td>
            <td>디자이너</td>
            <td>Design</td>
          </tr>
          <tr>
            <td>홍길동</td>
            <td>개발자</td>
            <td>IT</td>
          </tr>
          <tr>
            <td>김철수</td>
            <td>디자이너</td>
            <td>Design</td>
          </tr>
          <tr>
            <td>홍길동</td>
            <td>개발자</td>
            <td>IT</td>
          </tr>
          <tr>
            <td>김철수</td>
            <td>디자이너</td>
            <td>Design</td>
          </tr>
          <tr>
            <td>홍길동</td>
            <td>개발자</td>
            <td>IT</td>
          </tr>
          <tr>
            <td>김철수</td>
            <td>디자이너</td>
            <td>Design</td>
          </tr>
  
          <template #tfoot>
            <tr>
              <td colspan="3">총 2명</td>
            </tr>
          </template>
        </HTable>
      </HModal>
      <HModal
        id="mb2"
        class="hison-color-warning-mb hison-color-danger-pc hison-col-12 hison-size-l-mb hison-size-s-pc"
        :headerVisible="false"
        :footerVisible="false"
        :zIndex="1002"
        :modalPosition="ScreenPosition.topCenter"
      >
        <HLabel>This is Alert Message.</HLabel>
      </HModal>
      <HPopup
        id="pop1"
        class="hison-color-primary hison-col-8"
        :height="300"
        :scrollLock="false"
      >
        <p>이것은 기본 팝업입니다.</p>
        <p>body 슬롯에 원하는 내용을 넣을 수 있습니다.</p>
        <p>이것은 기본 팝업입니다.</p>
        <p>body 슬롯에 원하는 내용을 넣을 수 있습니다.</p>
        <p>이것은 기본 팝업입니다.</p>
        <p>body 슬롯에 원하는 내용을 넣을 수 있습니다.</p>
        <p>이것은 기본 팝업입니다.</p>
        <p>body 슬롯에 원하는 내용을 넣을 수 있습니다.</p>
        <p>이것은 기본 팝업입니다.</p>
        <p>body 슬롯에 원하는 내용을 넣을 수 있습니다.</p>
        <p>이것은 기본 팝업입니다.</p>
        <p>body 슬롯에 원하는 내용을 넣을 수 있습니다.</p>
        <p>이것은 기본 팝업입니다.</p>
        <p>body 슬롯에 원하는 내용을 넣을 수 있습니다.</p>
        <p>이것은 기본 팝업입니다.</p>
        <p>body 슬롯에 원하는 내용을 넣을 수 있습니다.</p>
      </HPopup>
      <HPopup
        id="pop2"
        class="hison-color-warning"
        :left="100"
        :top="70"
        :width="500"
        :height="450"
        :draggable="false"
        :border="false"
      >
        <HLayout style="padding: 10px;">
          <h3>Custom 위치 팝업</h3>
          <p>이 팝업은 (100px, 50px)에 표시되고, 크기는 400x250px입니다.</p>
          <p>오버레이는 표시되지 않습니다.</p>
        </HLayout>
      </HPopup>
      <HDrawer
        id="dw1"
        position="left"
        class="hison-size-l hison-color-success"
        :width="300"
        :showOverlay="true"
        :closeClickOverlay="true"
        :border="true"
      >
        <template #default>
          <div style="padding: 1rem">
            <h3>메뉴</h3>
            <ul>
              <li>홈</li>
              <li>설정</li>
              <li>로그아웃</li>
            </ul>
          </div>
        </template>
      </HDrawer>
      <HDrawer
        id="dw2"
        position="bottom"
        :width="500"
        :height="30"
        :visible="true"
        :showHandle="true"
        :showOverlay="false"
        :scrollLock="false"
        backgroundType="empty"
      >
        <template #default>
          <div style="padding: 1rem; text-align: center;">
            <strong>공지사항:</strong> 이번 주 금요일은 서버 점검이 있습니다.
          </div>
        </template>
      </HDrawer>
      <HSpinner
        id="sp1"
        :visible="false"
        spinnerType="ring"
        :position="'middle-center'"
        :timeoutMs="2000"
        class="hison-size-s hison-color-primary"
      />
      <HSpinner
        id="sp2"
        :visible="false"
        spinnerType="dots"
        :position="'middle-right'"
        :timeoutMs="2000"
        class="hison-size-xl hison-color-success"
      />
      <HSpinner
        id="sp3"
        :visible="false"
        spinnerType="bars"
        :position="'top-center'"
        :timeoutMs="2000"
        class="hison-size-xl hison-color-warning"
      />
      <HSpinner
        id="sp4"
        :visible="false"
        spinnerType="pulse"
        :position="'middle-left'"
        :timeoutMs="2000"
        class="hison-size-xl hison-color-danger"
      />
    </HLayout>
    <HLayout class="hison-col-12 hison-size-m hison-color-primary">
      <HButton text="goAlertTest" @click="goAlertTest" />
      <HButton text="goAlertTest2" @click="goAlertTest2" />
      <HButton text="openPopup1" @click="openPopup1" />
      <HButton text="openPopup2" @click="openPopup2" />
      <HButton text="openDrawer1" @click="openDrawer1" />
      <HButton text="openDrawer2" @click="openDrawer2" />
    </HLayout>
    <HGap></HGap>
    <HLayout>
      <HLabel class="hison-col-12 hison-size-l" :href="'https://www.naver.com/'" :border="true">NAVER</HLabel>
      <!-- 단순 텍스트 배열을 리스트로 -->
      <HList
        class="hison-col-12"
        id="list1"
        :textList="['사과', '바나나', '체리']"
        listType="ul"
        :tab-index="18"
        :showMarker="true"
        :listBorder="true"
        :addEvent="false"
        @click="clickTest"
      />
      <HList
        id="list2"
        listType="ol"
        :listBorder="true"
        :showMarker="true"
        class="hison-col-12"
        :addEvent="false"
        @click="clickTest"
      >
        <template v-for="(item, i) in items" :key="i">
          <div>
            <HLabel
            class="hison-col-12 hison-size-l"
            :href="'https://www.naver.com/'"
            :border="true"
            @click="clickTest2"
            >{{ item.title }}</HLabel>
            <p>{{ item.desc }}</p>
          </div>
        </template>
      </HList>
    </HLayout>
    <HGap></HGap>
    <HLayout>
      <HCaption
        :id="'cp1'"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc"
        :font-bold="true"
        :backgroundType="'filled'"
        :border="true"
        :title="'truesdafsdaf'"
        :textAlign="'right'"
        :level="1"
      >test<br>test</HCaption>
      <HCaption
        :id="'cp2'"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-color-muted"
        :level="2"
        :backgroundType="'filled'"
        :textAlign="'center'"
      >
{{ 
`test
    test
test`
 }}
      </HCaption>
      <HGap class="hison-size-l-mb hison-size-s-pc" :line="'horizontal'"/>
      <HCaption
        :id="'cp3'"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-color-info"
        :border="true"
        :level="3"
        :text="'test\n\ttest\ntest'"
      >
      </HCaption>
      <HCaption
        :id="'cp4'"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-color-success"
        :border="true"
        :level="4"
        text="test test test test test test test test test test test test test test test test test test"
      >
      </HCaption>
      <HCaption
        :id="'cp5'"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-color-danger"
        :border="true"
        :level="5"
      >
        test
      </HCaption>
      <HCaption
        :id="'cp6'"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-color-warning"
        :border="true"
        :level="6"
      >
        test
      </HCaption>
    </HLayout>
    <HLayout
      :id="'layoutTest'"
      :border="true"
    >
<!--
1.
      <HParagraph>
test1 test2 test3
      </HParagraph>

2. 
      <HParagraph>
test1<br>
&nbsp;&nbsp;&nbsp;&nbsp;test2<br>
test3
      </HParagraph>

3. 
      <HParagraph text="test\n\ttest\ntest"/>

4.
const textValue =
`test
      test
test`
      <HParagraph :text="textValue"/>

5. 
const textValue =
'test\n'
+'\ttest\n'
+'test`
      <HParagraph :text="textValue"/>
-->

      <HParagraph
        id="p0"
        class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-danger-pc"
        :border="true"
        :copyEnabled="true"
        :showCopyButton="true"
      >
test1<br>
&nbsp;&nbsp;&nbsp;&nbsp;test2<br>
test3
        <!-- 아이콘만 교체 -->
        <template #copy-icon>
          <!-- 아무 아이콘 컴포넌트나 SVG 가능 -->
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </template>

        <!-- 라벨만 교체
        <template #copy-label>복사</template> -->
      </HParagraph>
      <HParagraph
        id="p1"
        class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-danger-pc"
        :border="true"
        :copyEnabled="true"
        :showCopyButton="true"
        style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace"
      >
{{`
<template v-else>
    <span class="hison-label-text">internalText</span>
</template>
`}}
      </HParagraph>
      <HParagraph
        id="p2"
        class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-danger-pc"
        :text="'test\ntest\ntest'"
      />
      <HParagraph
        id="p3"
        class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-danger-pc"
        :text="pValue3"
      />
    </HLayout>
    <div style="height: 20px; width: 100%;"></div>
    <HLayout>
      <HLabel
        id="lb1"
        :class="'hison-col-8 hison-size-l-mb hison-size-s-pc hison-color-danger-mb hison-color-warning-pc'"
        :background-type="'empty'"
        :href="'https://naver.com'"
      >
      asdffnlksasdffnlksasdffnlksasdffnlksasdffnlks asdffnlksasdffnlksasdffnlksasdffnlks asdffnlksasdffnlksasdffnlks sasdffnlks asdffnlksasdffnlksasdffnlkssasdffnlks asdffnlksasdffnlksasdffnlkssasdffnlks asdffnlksasdffnlksasdffnlks
      </HLabel>
      <HLabel
        id="lb2"  
        :class="'hison-col-4 hison-size-l-mb hison-size-s-pc hison-color-warning-mb hison-color-danger-pc'"
        :text="'test test'"
        :title="'testaes'"
        :background-type="'filled'"
      />
    </HLayout>
    <div style="height: 20px; width: 100%;"></div>
    <HLayout>
        <HAccordion
          id="acc1"
          class="hison-col-12 hison-size-s-mb hison-size-s-pc hison-color-danger-mb hison-color-primary-pc"
          title="Filtersasdlnflsnadlansdlffnlsdflnsdalf Filtersasdlnflsnadlansdlffnlsdflnsdal sdlffnlsdflnsdalf Filtersasdlnflsnadlansdlffnlsdflnsdalfsdlffnlsdflnsdalf Filtersasdlnflsnadlansdlffnlsdflnsdalff Filtersasdlnflsnadlansdlffnlsdflnsdalf Filtersasdlnflsnadlansdlffnlsdflnsdalf"
          textAlign="center"
          :duration="1000"
          @mounted="acc_mounted"
          @responsiveChange="acc_responsiveChange"
          @open="acc_open"
          @close="acc_close"
          @toggle="acc_toggle"
        >
          <HLayout class="hison-col-12" style="height: 100px; padding-top: 0;">
            <HInput class="hison-col-4" :modelValue="'abc'"/>
            <HButton class="hison-col-4" :text="'asdf'"/>
            <HDropdown
              class="hison-col-4"
              :modelValue="{ value: null, options: [{label:'One', value:1}] }"
            />
          </HLayout>
        </HAccordion>
        <div style="height: 20px; width: 100%;"></div>
        <HAccordion
          id="acc2"
          class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-color-primary-pc hison-color-success-pc"
          title="Advanced"
          :text-align="'center'"
          :defaultOpen="true"
          >
          <template #toggle>
            <span style="display: none;"></span>
          </template>
          <HLayout style="height: 50px;">
            <div>Any content here…</div>
          </HLayout>
        </HAccordion>
        <div style="height: 20px; width: 100%;"></div>
    </HLayout>
    <br/><br/>
    <HLayout style="padding-left: 0; padding-right: 0;">
      <HDropdown
        :id="'dropdown01'"
        v-model="countryModel"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-color-danger-mb hison-color-warning-pc"
        placeholder="Select country"
        @change="dropdown_onChange"
        :textAlign="TextAlign.right"
        :trigger="DropdownTrigger.click"
        :duration="1000"
      />
      <HDropdown
        v-model="countryModel"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-color-success-mb hison-color-muted-pc"
        placeholder="Select country"
        :toggleStyle="'box-shadow: none !important;'"
        :menuStyle="'box-shadow: none !important;'"
        :textAlign="TextAlign.center"
        :trigger="DropdownTrigger.hover"
      >
        <template #caret>
          <span class="hison-dropdown-caret" aria-hidden="true"></span>
        </template>
      </HDropdown>
      <br><br>
      <HImagebox
        id="imagebox"
        class="hison-col-12-pc hison-col-12-mb hison-size-l-mb hison-size-s-pc hison-pos-center hison-color-primary-mb hison-color-success-pc"
        style="height: 250px; box-shadow: none;"
        :border="true"
        @add="onAdd"
        @remove="onRemove"
      >
        <!-- 이미지가 없을 때 나타나는 커스텀 empty slot -->
        <template #empty>
          <div class="custom-empty">
            <span>Drag image here or click the button below</span>
          </div>
        </template>

        <!-- add 버튼 커스텀 (plus 아이콘 + 텍스트 예시) -->
        <template #add-button="{ add }">
          <span><i class="fa fa-plus"></i> Add Image</span>
        </template>

        <!-- remove 버튼 커스텀 (trash 아이콘 예시) -->
        <template #remove-button="{ remove }">
          <span><i class="fa fa-trash"></i> Delete</span>
        </template>
      </HImagebox>
    </HLayout>
    <br/><br/>
    <HLayout>
      <HInputGroup id="inputGroup1" v-model="dataObject">
        <HLayout id="layout1" class="hison-col-12-tb hison-col-6-pc">
          <HFileset
            id="fileset"
            class="hison-size-s-mb hison-size-s-pc hison-pos-right hison-color-primary-mb hison-color-success-pc"
            v-model="files"
            :multiCols="true"
            :placeholder="'저장된 파일이 없습니다.'"
            :addButtonText="'추가'"
            :removeButtonText="'삭제'"
            :enableDrop="true"
            :visible="true"
            :editMode="EditMode.editable"
            :disallowedTypes="[]"
            :multiple="true"
            :maxFileCount="0"
            style="height: 200px; margin-bottom: 5px;"
            >
            <template #file-icon="{ file }">
              <span v-if="file.extension === 'pdf'">📕&nbsp;</span>
              <span v-else-if="file.extension === 'jpg'">🖼️&nbsp;</span>
              <span v-else>📄&nbsp;</span>
            </template>
            <!--
            <template #remove-button="{ file, index, remove, disable }">
              <span
                class="custom-remove-btn"
                :disabled="disable"
                @click="remove"
                :style="'cursor: pointer;'"
              >
                ❌
              </span>
            </template>
            -->
          </HFileset>
          <HInput
          id="range"
          class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-primary-mb hison-color-success-pc"
          style="margin-bottom: 5px;"
          :inputType="InputType.range"
          @mounted="inputMount"
          ></HInput>
          <HInput
          id="color"
          class="hison-col-3 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-primary-mb hison-color-success-pc"
          style="margin-bottom: 5px;"
          :inputType="InputType.color"
          @mounted="inputMount"
          ></HInput>
          <HInput
          id="checkbox"
          class="hison-col-3 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-danger-mb hison-color-warning-pc"
          style="margin-bottom: 5px;"
          :inputType="InputType.checkbox"
          @mounted="inputMount"
          ></HInput>
          <HInput
          id="select"
          class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-danger-mb hison-color-warning-pc"
          style="margin-bottom: 5px;"
          :inputType="InputType.select"
          :editMode="EditMode.editable"
          :options="option1"
          @mounted="inputMount"
          ></HInput>
        </HLayout>
        <HLayout id="layout2" class="hison-col-12-tb hison-col-6-pc">
          <HInput
          id="input1"
          class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-muted-pc"
          style="margin-bottom: 5px;"
          :inputType="InputType.date"
          :format="DateFormat['MMMM dd, yyyy']"
          :required="true"
          :editMode="EditMode.editable"
          ></HInput>
          <HInput
          id="input2"
          class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-info-pc"
          style="margin-bottom: 5px;"
          :inputType="InputType.text"
          placeholder="please insert text here."
          ref="input2Ref"
          :required="true"
          :editMode="EditMode.readonly"
          ></HInput>
          <HInput
          id="input3"
          class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-success-pc"
          style="margin-bottom: 5px;"
          :inputType="InputType.date"
          ></HInput>
          <HInput
          id="input4"
          class="hison-col-3 hison-size-xl-mb hison-size-s-pc hison-pos-left hison-color-danger-pc"
          style="margin-bottom: 5px;"
          v-model="inputValue4"
          :inputType="InputType.number"
          format="$$ #,###.##"
          nullText="$$"
          :maxNumber="10000"
          :editMode="EditMode.disable"
          @input="onInput4"
          ></HInput>
          <HButton
          class="hison-col-3 hison-size-xl-mb hison-size-s-pc hison-pos-left"
          :backgroundType="BackgroundType.empty"
          >
            Korea
          </HButton>
          <HInput
          id="select2"
          class="hison-col-3 hison-size-xl-mb hison-size-s-pc hison-pos-left"
          style="margin-bottom: 5px;"
          :inputType="InputType.select"
          :editMode="EditMode.editable"
          :options="option1"
          @mounted="inputMount"
          ></HInput>
          <HDropdown
            v-model="countryModel"
            class="hison-col-3 hison-size-xl-mb hison-size-s-pc hison-pos-left"
            placeholder="Select country"
            :textAlign="TextAlign.center"
            :trigger="DropdownTrigger.hover"
          >
            <template #caret>
              <span class="hison-dropdown-caret" aria-hidden="true"></span>
            </template>
          </HDropdown>
          <HInput
          id="input5"
          class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-warning-mb"
          style="margin-bottom: 5px;"
          v-model="inputValue5"
          :inputType="InputType.mask"
          format="AA999"
          nullText="-"
          :required="true"
          :maxNumber="15"
          :editMode="'disable'"
          placeholder="testtest"
          ></HInput>
          <HInput
          id="input6"
          class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-warning-pc"
          style="margin-bottom: 5px;"
          v-model="inputValue6"
          :inputType="InputType.password"
          placeholder="testtest"
          :editMode="EditMode.readonly"
          maxLength="10"
          ></HInput>
        </HLayout>
      </HInputGroup>
      <br><br>
      <HChart
        id="chart1"
        type="line"
        class="hison-col-6-pc hison-col-12-mb"
        v-model="chartData1"
        :options="chartOptions1"
        style="height:300px; display: inline-flex; align-items: center; justify-content: center;"
        :loadDelay="10"
        :visible="true"
      />
      <HChart
        id="chart2"
        type="doughnut"
        class="hison-col-6-pc hison-col-12-mb"
        v-model="chartData2"
        :options="chartOptions2"
        style="height:300px; display: inline-flex; align-items: center; justify-content: center;"
        :loadDelay="10"
      />
      <br><br>
      <HCalendar
          id="cal1"
          class="hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-pc"
          :activeView="HCalendarView.month"
          :events-on-month-view="'short'"
          :date-cell-max-height="100"
          :date-cell-min-height="100"
          v-model:selected-date="selectedDate"
          v-model:events="calendarEvents"
          :locale="'en'"
          :time-step="60"
          :time-from="9 * 60"
          :time-to="18 * 60"
          :twelve-hour="true"
          :weekend-color="'#dd5555'"
          :start-week-on-sunday="false"
          :show-today-color="true"
          @cell-click="onCellClick"
          @view-change="onViewChange"
          :special-time="specialTime"
          >
      </HCalendar>
      <br><br>
      <HLayout>
        <HGrid
          id="grid01"
          class="
          hison-col-12-mb hison-col-6-pc
          hison-color-primary-mb hison-color-warning-wd
          hison-size-m-mb hison-size-s-pc
          "
          :columns="testColumns1"
          :height="'400px'"
          :horizenBorderSize="0"
          @mounted="mountGridTest1"
        />
        <HGrid
          id="grid02"
          class="
          hison-col-12-mb hison-col-6-pc
          hison-color-primary-mb hison-color-warning-wd
          hison-size-m-mb hison-size-s-pc
          "
          :columns="testColumns2"
          :height="'400px'"
          @mounted="mountGridTest2"
        />
      </HLayout>
      <br><br>
      <HLayout>
          <HNote v-model="noteData1"
          class="hison-col-12-mb hison-col-6-pc hison-size-m-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-wd"
          id="note1"
          @mounted="mountNote1"
          :boldBeforeClick="onBoldBeforeClick"
          :textareaBeforeFocus="onTextareaBeforeFocus"
          textarea-height="200px"
          ></HNote>
          <HNote v-model="noteData2"
          id="note2"
          class="hison-col-12-mb hison-col-6-pc hison-size-m-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-wd"
          @mounted="mountNote2"
          textarea-height="200px"
          ></HNote>
      </HLayout>
    </HLayout>
</template>

<script setup lang="ts">
const openDrawer1 = () => {
  const dw1 = hison.component.getDrawer('dw1')!
  dw1.open()
}
const openDrawer2 = () => {
  const dw2 = hison.component.getDrawer('dw2')!
  dw2.setVisible(true)
  dw2.setHeight(120, true)
}
const goAlertTest = () => {
  const mb1 = hison.component.getModal('mb1')!
  mb1.open()
}
const goAlertTest2 = () => {
  const mb2 = hison.component.getModal('mb2')!
  mb2.open()
}
const openPopup1 = () => {
  const pop1 = hison.component.getPopup('pop1')!
  pop1.open()
}
const openPopup2 = () => {
  const pop2 = hison.component.getPopup('pop2')!
  pop2.open()
}
const onOpen = () => console.log('opened')
const onClose = () => console.log('closed')
const onClickClose = () => console.log('close button clicked')
const onBackdropClick = () => console.log('backdrop clicked')

const onClickCenterButton1 = () => {
  const sp1 = hison.component.getSpinner('sp1')!
  sp1.setVisible(true)
}
const onClickCenterButton2 = () => {
  const sp1 = hison.component.getSpinner('sp1')!
  sp1.setSpinnerType('bars')
  sp1.setPosition('bottom-center')
}

const items = [
  { title: '첫번째 카드', desc: '설명 A' },
  { title: '두번째 카드', desc: '설명 B' },
  { title: '세번째 카드', desc: '설명 C' }
]
const clickTest = (...param: any[]) => {
  console.log('clickTest !!!')
}
const clickTest2 = (e: any) => {
  const list1 = hison.component.getList('list1')!
  list1.setAddEvent(!list1.isAddEvent())
  e.stopPropagation()
  e.preventDefault()
}

//'mounted', 'responsive-change', 'open', 'close', 'toggle', 'change'
const acc_mounted = (...param: any) => { console.log('acc mounted', param) }
const acc_responsiveChange = (...param: any) => { console.log('acc responsiveChange', param) }
const acc_open = (...param: any) => { console.log('acc open', param) }
const acc_close = (...param: any) => { console.log('acc close', param) }
const acc_toggle = (...param: any) => { console.log('acc toggle', param) }
const acc_change = (...param: any) => { console.log('acc change', param) }

const pValue2 =
`test1
\ttest2
test3`

const pValue3 = 'test\n'
                + '\ttest\n'
                + 'test'

let toggle = false
const countryModel = ref<HDropdownModel>({
    value: 't',
    options: [
        { label: 'kdnvbnsdkfnlknzxlkcvlkzxc ckzxcovi sodinlkzxncv lzxcoivjoisdo', value: 't' },
        { label: 'Korea', value: 'KR' },
        { label: 'Japan', value: 'JP' },
        { label: 'USA', value: 'US', disabled: true },
    ],
})
const dropdown_onChange = (oldValue: string, newValue: string, dropdown: HDropdownMethods) => {
  console.log(oldValue, newValue, dropdown)
}

function onAdd(file: AttachedFileItem, imageboxMethods: HImageboxMethods) {
  console.log("Image added:", file)
}
function onRemove(prevFile: AttachedFileItem, imageboxMethods: HImageboxMethods) {
  console.log("Image removed:", prevFile)
}
const allowedTypes = [
  'image/png',
  'image/jpeg',
  '.pdf',
  '.docx'
]
const disallowedTypes = [
  '.exe',
  'application/x-msdownload',
  '.bat',
  '.java'
]
const onMaxFileCountExceeded = () => { window.alert("TEst!!!!!!") }
const files = ref<AttachedFileItem[]>([])
const inputMount = (input: HInputMethods) => {
  
}


let data, dataModel, dataWrapper
let invertColorToggle = true
let tempFiles: any = null
let fileDm: InterfaceDataModel<AttachedFileItem> | null = null
let imageFile: AttachedFileItem | null = null
let imageDm: InterfaceDataModel<AttachedFileItem> | null = null
const noteData1 = ref<NoteData>()
const noteData2 = ref<NoteData>()

const colorValue = ref('#f4ed25')
const rangeValue = ref(100)
const checkboxValue = ref(true)
const selectValue = ref('value2')
const option1 = [
  { text: '가나다1', value: 'value1' },
  { text: '가나다2', value: 'value2' },
  { text: 'text3', value: 'value3' },
  { text: 'text4', value: 'value4' },
  { text: 'text5', value: 'value5' },
]
let dataObject = ref({
  checkbox : true,
  color : "#128483",
  input1 : "2025-11-28",
  input2 : '',
  input3 : "2025-11-19",
  input4 : 4321.4231,
  input5 : "FA123",
  input6 : "15sdfxzcv1",
  range : 70,
  select : "value4",
})

import type { ChartData, ChartOptions } from 'chart.js'

const chartData1 = ref<ChartData>({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [100, 150, 80, 120, 90],
      borderColor: 'primary',
      borderWidth: 1,
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      fill: true,
      tension: 0.4
    }
  ]
})
const chartData2 = ref<ChartData>({
  labels: [
    'A level',
    'B level',
    'C level'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'primary',
      'warning',
      'danger'
    ],
    hoverOffset: 4
  }]
})
const chartOptions2 = ref<ChartOptions>({
  responsive: true,
  layout: {
    padding: 0  // 또는 { left: 0, right: 0, top: 0, bottom: 0 }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  }
})

const chartOptions1 = ref<ChartOptions>({
  responsive: true,
  plugins: {
    title: {
        display: false,
        text: '',
        font: {
            size: 50,
            style: 'normal',
            weight: 'bold',
            lineHeight: 1.2,
        },
    },
    legend: {
      position: 'top',
      labels: {
        font: {
          size: 12,
        }
      }
    },
    tooltip: {
      enabled: true,
      titleFont: {
        size: 12
      },
      bodyFont: {
        size: 10
      }
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 10
        }
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 10
        }
      }
    }
  }
})

const mountNote1 = (note: VanillanoteElement) => {
}
const mountNote2 = () => {
}
const onBoldBeforeClick = (e: Event) => { console.log('onBoldBeforeClick'); return false }
const onTextareaBeforeFocus = (e: Event) => { console.log('onTextareaBeforeFocus'); return false}

const testColumns1: HGridColumn[] = [
  { id : "dept", header : "Click the Sigma button to the left of the header;filter1(mask);dept ", dataType : "mask", format : "AAA99", width : "100", rowMerge : true },
  { id : "f_nm", header : ";filter2(text);first name", dataType : "text", width : "120", align : Align.center, locked : true },
  { id : "l_nm", header : ";filter3(text);last name", dataType : "text", width : "120", align : Align.center, locked : true, colMerge : true },
  { id : "d_o_j", header : ";filter4(month);DOJ", dataType : "month", format : "yyyy/mm", width : "120", align : Align.center, locked : true },
  { id : "e_id", header : "sort1(text);;", dataType : "number", width : "120", align : Align.center, locked : true, footer : "MAX;MIN;AVG;SUM", roundNumber : -1 },
  { id : "salary", header : "sort2(number);;salary", dataType : "number", format : "$ #,###.#####", width : "150", footer : "$$MAX;$$MIN;$$AVG;$$SUM" },
  { id : "status", header : "Please double click;checkbox;status", dataType : "checkbox", width : "80", align : Align.center, footer : "$$COUNT_CHECK" },
  { id : "radio", header : "radio", dataType : "radio", width : "80", align : Align.center, footer : "$$COUNT_CHECK" }
]
const mountGridTest1 = (grid: GridMethods) => {
  grid.load(testData)
}
const testColumns2: HGridColumn[] = [
  { id : "dept", header : "Click the Sigma button to the left of the header;filter1(mask);dept ", dataType : "mask", format : "AAA99", width : "100", rowMerge : true },
  { id : "f_nm", header : ";filter2(text);first name", dataType : "text", width : "120", align : Align.center, locked : true },
  { id : "l_nm", header : ";filter3(text);last name", dataType : "text", width : "120", align : Align.center, locked : true, colMerge : true },
  { id : "d_o_j", header : ";filter4(month);DOJ", dataType : "month", format : "yyyy/mm", width : "120", align : Align.center, locked : true },
  { id : "e_id", header : "sort1(text);;", dataType : "number", width : "120", align : Align.center, locked : true, footer : "MAX;MIN;AVG;SUM", roundNumber : -1 },
  { id : "salary", header : "sort2(number);;salary", dataType : "number", format : "$ #,###.#####", width : "150", footer : "$$MAX;$$MIN;$$AVG;$$SUM" },
  { id : "status", header : "Please double click;checkbox;status", dataType : "checkbox", width : "80", align : Align.center, footer : "$$COUNT_CHECK" },
  { id : "radio", header : "radio", dataType : "radio", width : "80", align : Align.center, footer : "$$COUNT_CHECK" }
]
const mountGridTest2 = (grid: GridMethods) => {
  grid.load(testData)
}


import 'vue-cal/dist/vuecal.css'

const specialTime = {
  [DayOfWeek.sun] : [
    { from: 10 * 60, to: 12 * 60 + 30, className: 'open' },
    { from: 13 * 60, to: 15 * 60 + 30 }
  ]
}

const disableDays = ['2025-06-16','2025-06-17','2025-06-21','2025-06-22']

const onCellClick = (date: Date) => {
    console.log('### onCellClick selectedDate.value', selectedDate.value)
    console.log('### onCellClick typeof selectedDate.value', typeof selectedDate.value)
    console.log('### onCellClick instanceof selectedDate.value', (selectedDate.value as any) instanceof Date)
}
const onViewChange = (e: any) => {
}
const selectedDate = ref('20250618')

const calendarEvents = ref([
  {
    title: 'Project Kickoff',
    start: new Date(2025, 5, 16, 10, 0),
    end: new Date(2025, 5, 16, 14, 0),
    content: 'Initial project meeting with the team',
    class: 'event-blue',
  },
  {
    title: 'Design Review',
    start: new Date(2025, 5, 16, 15, 0),
    end: new Date(2025, 5, 16, 18, 30),
    content: 'UI/UX final design review',
    class: 'event-green',
  },
  {
    title: 'Client Call',
    start: new Date(2025, 5, 16, 11, 0),
    end: new Date(2025, 5, 16, 17, 30),
    content: 'Call with overseas client (Zoom)',
    class: 'event-red',
  },
  {
    title: 'Dev Sprint Planning',
    start: new Date(2025, 5, 20, 6, 0),
    end: new Date(2025, 5, 20, 11, 30),
    content: 'Weekly planning session for developers',
    class: 'event-purple',
  },
  {
    title: 'Team Lunch',
    start: new Date(2025, 5, 21, 12, 0),
    end: new Date(2025, 5, 21, 20, 0),
    content: 'Casual team lunch at the cafeteria',
    class: 'event-orange',
  },
])

const calendarEvents2 = ref([
  {
    title: 'Dev Sprint Planning 222',
    start: new Date(2025, 5, 20, 6, 0),
    end: new Date(2025, 5, 20, 11, 30),
    content: 'Weekly planning session for developers',
    class: 'event-purple',
  },
  {
    title: 'Team Lunch 222',
    start: new Date(2025, 5, 21, 12, 0),
    end: new Date(2025, 5, 21, 20, 0),
    content: 'Casual team lunch at the cafeteria',
    class: 'event-orange',
  },
])


const events = ref([
  { start: '2025-06-12 09:00', end: '2025-06-12 11:00', title: 'My Event' }
]);
const isWeekend = (heading: any) => {
    return heading.label === 'Saturday' || heading.label === 'Sunday'
}

import { AttachedFileItem, DateFormat, DayOfWeek, EditMode, BackgroundType, HCalendarView, HGridColumn, HImageboxMethods, HInputMethods, hison, InputType, HDropdownModel, TextAlign, HDropdownMethods, DropdownTrigger, ScreenPosition } from 'hisonvue'
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { Align, GridMethods } from 'vanillagrid2'
import { NoteData, NoteModeByDevice, ToolPosition, VanillanoteElement } from 'vanillanote2'
import { InterfaceDataModel } from 'hisonjs'

const inputValue1 = ref<any>('20240228');
const inputValue2 = ref<any>('2025-03')
const inputValue3 = ref<any>('2025-03-19');
const inputValue4 = ref<any>('1234.1234');
const inputValue5 = 'hr123';
const inputValue6 = '15sdfxzcv1515asd'
const input2Ref = ref<HTMLInputElement | null>(null)

const router = useRouter()
const onChange1 = (oldValue: any, newValue: any, inputMethods: HInputMethods) => {
}
const onInputMounted1 = (inputMethods: HInputMethods) => {
}
const onInput4 = (value: any, ...param: any) => {
}
const goToGridTest = () => {
    router.push('/gridTest')
}
const goToNoteTest = () => {
    router.push('/noteTest')
}
const dw = new hison.data.DataWrapper({
    input1: '20250319',
    input2: '19100301',
    input3: '19100301',
    input4: '123.132',
    input5: 'asdfs!!',
})
const dm = new hison.data.DataModel({
    input1: '20221202',
    input2: '12100301',
    input3: '29100301',
    input4: '321.132',
    input5: 'bbbs!!',
})
const obj = {
    input1: '20220806',
    input2: '20000101',
    input3: '21000228',
    input4: '458.132',
    input5: 'dsgb!!',
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
</script>

<style scoped>
::v-deep(.vuecal__time-column .open) {
    color: blue;
}
.sch1 {
    color: blue;
}
.vuecal__cell.sch1 {
    color: blue;
}
.sch2 {
    color: green;
}
.vuecal__cell.sch2 {
    color: green;
}
</style>