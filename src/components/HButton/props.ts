import { PropType } from "vue";
import { Color, Size, BoolString } from "../../enums";

export const buttonProps = {
    id: { type: String, required: true },
    addClassList: { type: String, required: false },
    style: { type: Object as PropType<Record<string, string>>, required: false },
    size: { type: String as PropType<Size>, required: false },
    color: { type: String as PropType<Color>, required: false },
    visible: { type: String as PropType<BoolString>, required: false },
}
