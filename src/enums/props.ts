export enum BoolString {
    true = 'true',
    false = 'false',
}

export enum InputType {
    text = 'text',
    mask = 'mask',
    number = 'number',
    digit = 'digit',
    date = 'date',
    month = 'month',
    email = 'email',
    password = 'password',

    checkbox = 'checkbox',
    select = 'select',
    textarea = 'textarea',
    range = 'range',
    color = 'color',
}

export enum EditMode {
    editable = 'editable',
    disable = 'disable',
    readonly = 'readonly',
}

export enum DataStatus {
    R = 'R',
    C = 'C',
    U = 'U',
    D = 'D',
}

export enum DayOfWeek {
    sun = 0,
    mon = 1,
    tue = 2,
    wed = 3,
    thu = 4,
    fri = 5,
    sat = 6,
}

export enum HCalenderView {
    day = 'day',
    week = 'week',
    month = 'month',
    year = 'year',
    years = 'years',
}

export enum HCalenderTimeFormat {
    'h24' = 'H',
    'hh24' = 'HH',
    'h' = 'h',
    'hh' = 'hh',
    'm' = 'm',
    'mm' = 'mm',
    'h24:m' = 'H:m',
    'h24:mm' = 'H:mm',
    'hh24:m' = 'HH:m',
    'hh24:mm' = 'HH:mm',
    'h:m' = 'h:m',
    'h:mm' = 'h:mm',
    'hh:m' = 'hh:m',
    'hh:mm' = 'hh:mm',

    'h24{am}' = 'H{am}',
    'hh24{am}' = 'HH{am}',
    'h{am}' = 'h{am}',
    'hh{am}' = 'hh{am}',
    'm{am}' = 'm{am}',
    'mm{am}' = 'mm{am}',
    'h24:m{am}' = 'H:m{am}',
    'h24:mm{am}' = 'H:mm{am}',
    'hh24:m{am}' = 'HH:m{am}',
    'hh24:mm{am}' = 'HH:mm{am}',
    'h:m{am}' = 'h:m{am}',
    'h:mm{am}' = 'h:mm{am}',
    'hh:m{am}' = 'hh:m{am}',
    'hh:mm{am}' = 'hh:mm{am}',
}
