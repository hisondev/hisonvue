import { getVanillagrid } from 'vanillagrid2'
import { isValidHexColor, normalizeToHex } from '../utils';
import { Size } from '../enums';
import { HisonConfig } from '..';
import { hisonCloser } from '../hisonCloser';

export const getVg = (hisonConfig: HisonConfig) => {
    setVgConfigWithHisonConfig(hisonConfig);
    const vg = getVanillagrid(hisonConfig.component.grid);

    return vg;
}

const setVgConfigWithHisonConfig = (hisonConfig: HisonConfig) => {
    if(hisonCloser.componentStyle.primaryColor) {
        const primaryColor = normalizeToHex(hisonCloser.componentStyle.primaryColor)
        if (!isValidHexColor(primaryColor)) {
          console.warn(`[Hisonvue] Invalid mainColor: '${hisonCloser.componentStyle.primaryColor}'. Must be a valid hex color (e.g., '#ffffff').`)
        }
        hisonConfig.component.grid.attributes.defaultGridCssInfo.color = primaryColor;
    }
    if(hisonCloser.componentStyle.size) {
        switch (hisonCloser.componentStyle.size) {
            case Size.xs :
                hisonConfig.component.grid.attributes.defaultGridCssInfo.sizeLevel = 1;
                break;
            case Size.s :
                hisonConfig.component.grid.attributes.defaultGridCssInfo.sizeLevel = 3;
                break;
            case Size.m :
                hisonConfig.component.grid.attributes.defaultGridCssInfo.sizeLevel = 5;
                break;
            case Size.l :
                hisonConfig.component.grid.attributes.defaultGridCssInfo.sizeLevel = 7;
                break;
            case Size.xl :
                hisonConfig.component.grid.attributes.defaultGridCssInfo.sizeLevel = 9;
                break;
        }
    }
}
