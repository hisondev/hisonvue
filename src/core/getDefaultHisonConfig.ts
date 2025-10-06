import type { HisonConfig } from "../types";
import type { InterfaceDataWrapper } from "hisonjs";
import { DateFormat, DateTimeFormat, DayFormat, DayOfWeekFormat, HourFormat, HourMinuteFormat, MinuteFormat, MonthFormat, SecondFormat, Size, TimeFormat, YearFormat, YearMonthFormat } from "../enums";
import { getVanillanoteConfig } from "vanillanote2";
import { CellData, getVanillagridConfig } from "vanillagrid2";
import { hison } from "..";
import { Chart } from "chart.js";
import { getIsColorLight, normalizeToRgba } from "../utils";

export const primaryColorRGBA = 'rgba(19,70,134,1)'
export const mutedColorRGBA = 'rgba(158,158,158,1)'
export const infoColorRGBA = 'rgba(96,150,180,1)'
export const successColorRGBA = 'rgba(95,141,78,1)'
export const dangerColorRGBA = 'rgba(247,113,109,1)'
export const warningColorRGBA = 'rgba(255,193,98,1)'
export const darkTextColorRGBA = 'rgba(48,48,48,1)'
export const lightTextColorRGBA = 'rgba(255,255,255,1)'
export const emptyColorRGBA = 'rgba(255,255,255,1)'

export const getDefaultHisonConfig = () => {
    const getIcon = (key: string) => {
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('material-symbols-rounded');
        iconSpan.textContent = key;
        return iconSpan
    }

    //set note config
    const vanillanoteConfig = getVanillanoteConfig();

    //set grid config
    const vanillagridConfig = getVanillagridConfig();
    vanillagridConfig.footerFormula = {
        '$$COUNT_CHECK' : function (colValues) {
            let count = 0;
            colValues.forEach((val) => {
                if(val === 'Y') count = count + 1;
            });
            return String(count);
        }
    }
    vanillagridConfig.dataType = {
        img : {
            cellStyle: {
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0',
            },
            onSelected : function (target: any) {
                if(target.firstChild.children[0]) target.firstChild.children[0].style.setProperty('opacity', '0.2');
            },
            onUnselected : function (target: any) {
                if(target.firstChild.children[0]) target.firstChild.children[0].style.removeProperty('opacity');
            },
            getValue: function (gridId, value) {
                if(!value) return null;
                return value;
            },
            getText: function (gridId, value) {
                if(!value) return null;
                return value.alt;
            },
            getChildNode: function (gridId, data) {
                const childNode = document.createElement('span');
                if(!data) return childNode;
                if(!data.value) return childNode;
                childNode.style.display = 'flex';
                childNode.style.alignItems = 'center';
                childNode.style.position = 'relative';
                childNode.style.overflow = 'hidden';
                childNode.style.width = '100%';
                const img = document.createElement('img') as any;
                const alt = document.createElement('span') as any;
                img.style.width = '100%'
                img.style.zIndex = '1';
                img.src = data.value.src;
                img.alt = data.text;
                alt.style.position = 'absolute';
                alt.style.fontSize = '12px';
                if(getIsColorLight(normalizeToRgba(hison.component.getGrid(gridId)!.getGridInfo().cssInfo.selectCellBackColor!))) alt.style.color = 'black';
                else alt.style.color = 'white';
                alt.style.textAlign = 'left';
                alt.style.display = 'inline-block';
                alt.style.width = '100%';
                alt.style.whiteSpace = 'normal';
                alt.style.wordBreak = 'break-all';
                alt.textContent = data.text;
                
                img.gridId = gridId;
                img.cellRow = data.rowIndex;
                img.cellCol = data.colIndex;

                childNode.append(img);
                childNode.append(alt);
                childNode.addEventListener('click', function (e: any) {
                    hison.component.getGrid(gridId)!.setTargetCell(e.target.cellRow, e.target.cellCol);
                })
                childNode.addEventListener('dblclick', function (e: any) {
                    hison.component.getGrid(gridId)!.editCell(e.target.cellRow, e.target.cellCol);
                })
                return childNode;
            },
            getEditor: function (target, gridId, data, call_modify, call_endEdit) {
                if(!data.value) return null;

                const editor = document.createElement('input') as any;
                editor.setAttribute('type','text');
                editor.style.width = target.offsetWidth + 'px';
                editor.style.height = target.scrollHeight + editor.offsetHeight - editor.clientHeight + 'px';
                editor.style.position = 'absolute';
                editor.style.zIndex = '200';
                editor.value = data.text;

                editor.addEventListener('keydown', function (e: any) {
                    switch (e.key) {
                        case 'Enter':
                            call_modify();
                            e.stopPropagation();
                            e.preventDefault();
                            break;
                        case 'Escape':
                            call_endEdit();
                            e.stopPropagation();
                            e.preventDefault();
                            break;
                        case 'Tab':
                            call_modify();
                            e.stopPropagation();
                            e.preventDefault();
                            break;
                        case 'F2':
                            call_modify();
                            e.stopPropagation();
                            e.preventDefault();
                            break;
                        default:
                            break;
                    }
                });
                return editor;
            },
            getEditedValue: function (target: any, gridId, data) {
                if(!data.value) return null;
                const newValue = data.value;
                newValue.alt = target.value;
                return newValue;
            },
            getFilterValue: function (gridId, value) {
                if(!value) return null;
                return 'title : ' + value.alt;
            },
            getSortValue: function (gridId, value) {
                if(!value) return null;
                return value.alt;
            },
            getCopyValue: function (gridId, value) {
                if(!value) return null;
                return value.alt;
            },
            getPasteValue: function (gridId, data, text) {
                if(!data.value) return null;
                const value = data.value;
                value.alt = text;
                return value;
            },
        },
        radio : {
            cellStyle: {
                justifyContent: 'center',
                textAlign: 'center',
            },
            onSelectedAndKeyDown : function (event, gridId, data) {
                if(event.key === 'Enter' || event.key === ' ') {
                    hison.component.getGrid(gridId)!.setColSameValue(data.colIndex, 'N', true);
                    hison.component.getGrid(gridId)!.setCellValue(data.rowIndex, data.colIndex, 'Y', true);
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
                return false;
            },
            onClick : function (event, gridId, data) {
                hison.component.getGrid(gridId)!.setColSameValue(data.colIndex, 'N', true);
                hison.component.getGrid(gridId)!.setCellValue(data.rowIndex, data.colIndex, 'Y', true);
            },
            getValue: function (gridId, value) {
                return value;
            },
            getText: function (gridId, value) {
                const text = value === 'Y' ? 'true' : 'false';
                return text;
            },
            getChildNode: function (gridId, data) {
                const childNode: any = document.createElement('input');
                childNode.setAttribute('type', 'radio');
                childNode.setAttribute('name', data.name? data.name : data.colIndex);
                childNode.setAttribute('value', '' + data.rowIndex);
                childNode._gridId = gridId;
                childNode.rowIndex = data.rowIndex;
                childNode.colIndex = data.colIndex;
                childNode.checked = data.value === 'Y';
                return childNode;
            },
            getFilterValue: function (gridId, value) {
                const filterValue = value === 'Y' ? '●' : '○';
                return filterValue;
            },
        },
        tree : {
            cellStyle: {
                justifyContent: "left",
                textAlign: "left",
            },
            getValue: function (gridId, value) {
                if(value.constructor === Object) {
                    return value;
                } else {
                    return {title: value, toggle: false};
                }
            },
            getText: function (gridId, value) {
                if(!value) return null
                return value.title
            },
            getChildNode: function (gridId, data) {
                if(!data.value) return document.createElement('span');

                const treeSpan = document.createElement('div');
                treeSpan.style.width = '100%'

                const treeText = document.createElement('span') as any;
                treeText.textContent = data.text;
                treeText.style.display = 'inline-block';
                treeText.style.marginLeft = '10px';
                treeText.style.maxWidth = '90%'
                treeText.style.overflow = 'hidden'
                treeText.style.textOverflow = 'ellipsis'
                treeText.addEventListener('click', (e: any) => {
                    onClick(e, gridId, data);
                })

                const treeToggle = document.createElement('span');
                treeToggle.classList.add('far');
                if(data.value.toggle) {
                    treeToggle.textContent = '-'
                }
                else {
                    treeToggle.textContent = '+'
                }
                treeToggle.style.fontSize = '0.85em';
                treeToggle.addEventListener('click', (e) => {
                    onClick(e, gridId, data);
                })

                const grid = hison.component.getGrid(gridId)!;

                if(data.colIndex + 1 <= grid.getColCount() && grid.getCellDataType(data.rowIndex, data.colIndex + 1) !== 'tree') {
                    if(data.value.toggle) {
                        grid.setCellDataType(data.rowIndex, data.colIndex + 1, grid.getColDataType(data.colIndex + 1));
                    }
                    else {
                        grid.setCellDataType(data.rowIndex, data.colIndex + 1, 'none');
                    }
                }

                for(let col = data.colIndex; col > 3; col--) {
                    if(grid.getCellDataType(data.rowIndex, col) === 'tree') {
                        const preCellValue = grid.getCellValue(data.rowIndex, col - 1);
                        if(preCellValue && !preCellValue.toggle) {
                            treeText.textContent = '...';
                        }
                        break;
                    }
                }

                if (data.rowIndex === 1) {
                    treeSpan.append(treeToggle);
                    treeSpan.append(treeText);
                } else if (data.rowIndex > 1 && grid.getCellText(data.rowIndex - 1, data.colIndex) !== data.text) {
                    treeSpan.append(treeToggle);
                    treeSpan.append(treeText);
                }
                
                function onClick(e: any, gridId: string, data: CellData) {
                    const grid = hison.component.getGrid(gridId)!;
                    const toggle = !data.value.toggle;

                    function openTree (nowRow: number, col: number) {
                        let startRow;
                        const title = grid.getCellText(nowRow, col);
                        if(nowRow === 1) {
                            startRow = nowRow;
                        }
                        else {
                            for(let row = nowRow; row > 1; row--) {
                                if(grid.getCellText(row, col) === title) {
                                    startRow = row;
                                    break;
                                }
                            }
                        }
                        const newValue = {title : title, toggle : true};

                        for(let row = startRow!; row <= grid.getRowCount(); row++) {
                            if(title !== grid.getCellText(row, col)) break;
                            grid.setCellValue(row, col, newValue);
                            if(row !== startRow) {
                                if(grid.getCellDataType(row, col + 1) === 'tree') {
                                    if(row === 1 || grid.getCellText(row, col + 1) !== grid.getCellText(row - 1, col + 1)) {
                                        grid.setRowVisible(row, true);
                                    }
                                }
                                else {
                                    grid.setRowVisible(row, true);
                                }
                            }
                            else {
                                for(let c = col + 1; c <= grid.getColCount(); c++) {
                                    if (grid.getCellDataType(row, c) === 'tree') {
                                        grid.setCellValue(row, c, grid.getCellValue(row, c));
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    function closeTree (nowRow: number, col: number) {
                        let startRow = nowRow;
                        const title = grid.getCellText(nowRow, col);
                        if(!title) return;
                        
                        for(let row = startRow; row <= grid.getRowCount(); row++) {
                            if(title !== grid.getCellText(row, col)) break;
                            if(row !== startRow) {
                                grid.setRowVisible(row, false);
                            }
                            for(let c = col; c <= grid.getColCount(); c++) {
                                if(grid.getCellDataType(row, c) === 'tree') {
                                    const newValue = grid.getCellValue(row, c);
                                    if(newValue) {
                                        newValue.toggle = false;
                                        grid.setCellValue(row, c, newValue);
                                    }
                                }
                            }
                        }
                    }

                    if(toggle) {
                        for(let col = data.colIndex; col > 2; col--) {
                            openTree(data.rowIndex, col);
                        }
                    }
                    else {
                        closeTree(data.rowIndex, data.colIndex);
                    }
                }
                return treeSpan;
            },
        },
        none : {
            getChildNode: function (gridId: string, data: CellData) {
                return document.createElement('span')
            }
        }
    }

    //set chart config
    const chartConfig = Chart.defaults

    const hisonConfig: HisonConfig = {
        //utils
        dateFormat : DateFormat['yyyy-MM-dd'],
        timeFormat : TimeFormat['HH:mm:ss'],
        datetimeFormat : DateTimeFormat['yyyy-MM-dd HH:mm:ss'],
        yearFormat : YearFormat.yyyy,
        monthFormat : MonthFormat.M,
        yearMonthFormat : YearMonthFormat['yyyy-MM'],
        dayFormat : DayFormat.d,
        dayOfWeekFormat : DayOfWeekFormat.d,
        hourFormat : HourFormat.h,
        hourMinuteFormat : HourMinuteFormat['hh:mm'],
        minuteFormat : MinuteFormat.m,
        secondFormat : SecondFormat.s,
        numberFormat : '#,##0.##',
        LESSOREQ_0X7FF_BYTE : 2,
        LESSOREQ_0XFFFF_BYTE : 3,
        GREATER_0XFFFF_BYTE : 4,
        //shield
        shieldURL : '',
        exposeIpList : ['0:0:0:0:0:0:0:1'],
        isFreeze : true,
        isPossibleGoBack : false,
        isPossibleOpenDevTool : false,
        doDetectDevTool() {},
        //data
        convertValue(value: any): any {return value;},
        //link
        protocol : 'http://',
        domain : 'localhost:8080',
        controllerPath : '/hison-api-link',
        timeout : 10000,
        webSocketProtocol : 'ws://',
        webSocketEndPoint : '/hison-websocket-endpoint',
        cachingLimit : 10,
        beforeGetRequest(resourcePath: string, options: Record<string, any>): boolean | void { return true; },
        beforePostRequest(requestData: InterfaceDataWrapper, options: Record<string, any>): boolean | void { return true; },
        beforePutRequest(requestData: InterfaceDataWrapper, options: Record<string, any>): boolean | void { return true; },
        beforePatchRequest(requestData: InterfaceDataWrapper, options: Record<string, any>): boolean | void { return true; },
        beforeDeleteRequest(requestData: InterfaceDataWrapper, options: Record<string, any>): boolean | void { return true; },
        afterGetRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
        afterPostRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
        afterPutRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
        afterPatchRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
        afterDeleteRequest<T = InterfaceDataWrapper>(responseData: { data: T; response: Response }): boolean | void { return true; },
        beforeGetUrlRequest(url: string, options: Record<string, any>): boolean | void { return true; },
        beforePostUrlRequest(url: string, requestData: any, options: Record<string, any>): boolean | void { return true; },
        beforePutUrlRequest(url: string, requestData: any, options: Record<string, any>): boolean | void { return true; },
        beforePatchUrlRequest(url: string, requestData: any, options: Record<string, any>): boolean | void { return true; },
        beforeDeleteUrlRequest(url: string, requestData: any, options: Record<string, any>): boolean | void { return true; },
        afterGetUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
        afterPostUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
        afterPutUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
        afterPatchUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
        afterDeleteUrlRequest(responseData: { data: any; response: Response }): boolean | void { return true; },
        interceptApiResult(result: InterfaceDataWrapper | undefined, response: Response): boolean | void { return true; },
        interceptApiError(error: any): boolean | void { return true; },
        component : {
            note : vanillanoteConfig,
            grid : vanillagridConfig,
            chart : chartConfig,
            filesetTotalSize: Infinity,
            filesetSize: Infinity,
        },
        componentStyle : {
            size: Size.m,
            filledColor: primaryColorRGBA,
            emptyColor: emptyColorRGBA,
            filledTextColor: lightTextColorRGBA,
            emptyTextColor: darkTextColorRGBA,
            primaryColor : primaryColorRGBA,
            mutedColor : mutedColorRGBA,
            infoColor : infoColorRGBA,
            successColor : successColorRGBA,
            dangerColor : dangerColorRGBA,
            warningColor : warningColorRGBA,
            invertColor : false,
            minHeightS: 1.7,
            minHeightM: 1.95,
            minHeightL: 2.25,
            minHeightXL: 2.55,
            fontSizeS: 0.7,
            fontSizeM: 0.75,
            fontSizeL: 0.85,
            fontSizeXL: 1,
        },
        event : {
            cssEvent : {
                textbox_onBeforeFocus: (e: FocusEvent) => { return true },
                textbox_onAfterFocus: (e: FocusEvent) => {},
                textbox_onBeforeBlur: (e: FocusEvent) => { return true },
                textbox_onAfterBlur: (e: FocusEvent) => {},
                textbox_onBeforeClick: (e: MouseEvent) => { return true },
                textbox_onAfterClick: (e: MouseEvent) => {},
                textbox_onBeforeMouseover: (e: MouseEvent) => { return true },
                textbox_onAfterMouseover: (e: MouseEvent) => {},
                textbox_onBeforeMouseout: (e: MouseEvent) => { return true },
                textbox_onAfterMouseout: (e: MouseEvent) => {},
                textbox_onBeforeTouchstart: (e: TouchEvent) => { return true },
                textbox_onAfterTouchstart: (e: TouchEvent) => {},
                textbox_onBeforeTouchend: (e: TouchEvent) => { return true },
                textbox_onAfterTouchend: (e: TouchEvent) => {},

                button_onBeforeFocus: (e: FocusEvent) => { return true },
                button_onAfterFocus: (e: FocusEvent) => {},
                button_onBeforeBlur: (e: FocusEvent) => { return true },
                button_onAfterBlur: (e: FocusEvent) => {},
                button_onBeforeClick: (e: MouseEvent) => { return true },
                button_onAfterClick: (e: MouseEvent) => {},
                button_onBeforeMouseover: (e: MouseEvent) => { return true },
                button_onAfterMouseover: (e: MouseEvent) => {},
                button_onBeforeMouseout: (e: MouseEvent) => { return true },
                button_onAfterMouseout: (e: MouseEvent) => {},
                button_onBeforeTouchstart: (e: TouchEvent) => { return true },
                button_onAfterTouchstart: (e: TouchEvent) => {},
                button_onBeforeTouchend: (e: TouchEvent) => { return true },
                button_onAfterTouchend: (e: TouchEvent) => {},
                
                input_onBeforeFocus: (e: FocusEvent) => { return true },
                input_onAfterFocus: (e: FocusEvent) => {},
                input_onBeforeBlur: (e: FocusEvent) => { return true },
                input_onAfterBlur: (e: FocusEvent) => {},
                input_onBeforeMouseover: (e: MouseEvent) => { return true },
                input_onAfterMouseover: (e: MouseEvent) => {},
                input_onBeforeMouseout: (e: MouseEvent) => { return true },
                input_onAfterMouseout: (e: MouseEvent) => {},
                input_onBeforeTouchstart: (e: TouchEvent) => { return true },
                input_onAfterTouchstart: (e: TouchEvent) => {},
                input_onBeforeTouchend: (e: TouchEvent) => { return true },
                input_onAfterTouchend: (e: TouchEvent) => {},
            }
        }
    }

    return hisonConfig;
}
