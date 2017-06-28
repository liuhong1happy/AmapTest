export default {
    ONLY_ONE: 0, // 仅仅提醒一次
    EVERY_DAY: 1, // 每天
    ONLY_WORK: 2, // 工作日
    ONLY_DAYOFF: 3, // 休息日
};

export const TimeTypesArray = [
    { value: 0, name: "ONLY_ONE", title: '仅仅提醒一次' },
    { value: 1, name: "EVERY_DAY", title: '每天' },
    { value: 2, name: "ONLY_WORK", title: '工作日' },
    { value: 3, name: "ONLY_DAYOFF", title: '休息日' },
];