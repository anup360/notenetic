
import moment from 'moment';

export function displayFormattedDueDate(taskObj /* 2022-07-28T06:31:51.95 */) {
    let newDate
    if (taskObj.dueDate !== null) { newDate = taskObj.dueDate }
    const dueDate = moment(newDate).format("M/D/YYYY")
    const currentDate = moment(new Date()).format("M/D/YYYY")
    if (currentDate > dueDate && taskObj.isCompleted == false) {
        return 'text-danger px-2 f-12';
    } else { return 'text px-2 f-12'; }
}

export function displayUIForTasks(taskObj /* 2022-07-28T06:31:51.95 */) {
    let newDate
    if (taskObj.dueDate !== null) { newDate = taskObj.dueDate }
    const dueDate = moment(newDate).format("M/D/YYYY")
    const currentDate = moment(new Date()).format("M/D/YYYY")
    let style = "top-column-first "
    if (taskObj.isCompleted == true) { style = 'top-column-first completed-column' }
    if (taskObj.isCompleted == false && currentDate > dueDate) { style = 'top-column-first not-completed-column'; }
    if (taskObj.isHighPriorityTask == true) { style = style + ' important-column'; }
    return style;
}
