import { PropType } from "vue";
import { Color, Size, BoolString } from "../../enums";

export const buttonProps = {
    id: { type: String, required: false },
    class: { type: String, required: false },
    style: {type: String, required: false },
    visible: { type: String as PropType<BoolString>, required: false },
    disable : { type: String as PropType<BoolString>, required: false },
    title : { type: String, required: false },
}
