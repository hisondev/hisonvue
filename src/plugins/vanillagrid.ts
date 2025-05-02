import { getVanillagrid, getVanillagridConfig, type VanillagridConfig } from 'vanillagrid2'
import { isValidHexColor, normalizeToHex } from '../utils';
import { Size } from '../enums';
import { hisonCloser } from '..';

export const getVg = () => {
    const vgConfig = getVanillagridConfig();
    setVnConfigWithHisonConfig(vgConfig);
    const vg = getVanillagrid(vgConfig);

    return vg;
}

const setVnConfigWithHisonConfig = (vgConfig: VanillagridConfig) => {
    if(hisonCloser.componentStyle.primaryColor) {
        const primaryColor = normalizeToHex(hisonCloser.componentStyle.primaryColor)
        if (!isValidHexColor(primaryColor)) {
          throw new Error(`[Hisonvue] Invalid mainColor: '${hisonCloser.componentStyle.primaryColor}'. Must be a valid hex color (e.g., '#ffffff').`)
        }
        vgConfig.attributes.defaultGridCssInfo.color = primaryColor;
    }
    if(hisonCloser.componentStyle.size) {
        switch (hisonCloser.componentStyle.size) {
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
