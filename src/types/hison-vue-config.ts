/**
 * Configuration interface for global HisonVue settings.
 *
 * @property primaryColor - The main color applied to all components (hex color string).
 * @property size - Default size used across all components (s, m, l, xl).
 * @property editorConfig - Default config for HEditor (based on Vanillanote).
 */
export interface HisonVueConfig {
  primaryColor?: string;
  size?: 's' | 'm' | 'l' | 'xl';
}
