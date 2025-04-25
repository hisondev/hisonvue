import { getVanillanote, getVanillanoteConfig, type VanillanoteConfig } from 'vanillanote2'
import type { HisonConfig } from '../types'
import { isValidHexColor } from '../utils';

export const getVn = (hisonConfig: HisonConfig) => {
    const vnConfig = getVanillanoteConfig();
    setVnConfigWithHisonConfig(vnConfig, hisonConfig);
    const vn = getVanillanote(vnConfig);

    return vn;
}

const setVnConfigWithHisonConfig = (vnConfig: VanillanoteConfig, hisonConfig: HisonConfig) => {
    if(hisonConfig.primaryColor) {
        if (!isValidHexColor(hisonConfig.primaryColor)) {
          throw new Error(`[Hisonvue] Invalid mainColor: '${hisonConfig.primaryColor}'. Must be a valid hex color (e.g., '#ffffff').`)
        }
        vnConfig.attributes.mainColor = hisonConfig.primaryColor;
    }
}
