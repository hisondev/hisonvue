import { getVanillagrid, getVanillagridConfig, type VanillagridConfig } from 'vanillagrid2'
import type { HisonConfig } from '../types'
import { isValidHexColor } from '../utils';
import { Size } from '../enums';

export const getVg = (hisonConfig: HisonConfig) => {
    const vgConfig = getVanillagridConfig();
    setVnConfigWithHisonConfig(vgConfig, hisonConfig);
    const vg = getVanillagrid(vgConfig);

    return vg;
}

const setVnConfigWithHisonConfig = (vgConfig: VanillagridConfig, hisonConfig: HisonConfig) => {
    if(hisonConfig.componentStyle.primaryColor) {
        if (!isValidHexColor(hisonConfig.componentStyle.primaryColor)) {
          throw new Error(`[Hisonvue] Invalid mainColor: '${hisonConfig.componentStyle.primaryColor}'. Must be a valid hex color (e.g., '#ffffff').`)
        }
        vgConfig.attributes.defaultGridCssInfo.color = hisonConfig.componentStyle.primaryColor;
    }
    if(hisonConfig.componentStyle.size) {
        switch (hisonConfig.componentStyle.size) {
            case Size.s :
                vgConfig.attributes.defaultGridCssInfo.sizeLevel = 3;
                break;
            case Size.m :
                vgConfig.attributes.defaultGridCssInfo.sizeLevel = 5;
                break;
            case Size.l :
                vgConfig.attributes.defaultGridCssInfo.sizeLevel = 7;
                break;
            case Size.xl :
                vgConfig.attributes.defaultGridCssInfo.sizeLevel = 9;
                break;
        }
    }
}
