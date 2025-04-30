import { getVanillanote, getVanillanoteConfig, type VanillanoteConfig } from 'vanillanote2'
import { isValidHexColor, normalizeToHex } from '../utils';
import { hisonCloser } from '../core';

export const getVn = () => {
    const vnConfig = getVanillanoteConfig();
    setVnConfigWithHisonConfig(vnConfig);
    const vn = getVanillanote(vnConfig);

    return vn;
}

const setVnConfigWithHisonConfig = (vnConfig: VanillanoteConfig) => {
    if(hisonCloser.componentStyle.primaryColor) {
        const primaryColor = normalizeToHex(hisonCloser.componentStyle.primaryColor)
        if (!isValidHexColor(primaryColor)) {
          throw new Error(`[Hisonvue] Invalid mainColor: '${hisonCloser.componentStyle.primaryColor}'. Must be a valid hex color (e.g., '#ffffff').`)
        }
        vnConfig.attributes.mainColor = primaryColor;
    }
}
