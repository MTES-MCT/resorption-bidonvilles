import Vue from "vue";

/**
 * Default duration of the notification, in milliseconds
 *
 * @const {Number}
 */
const DEFAULT_DURATION = 6000;

/**
 * Proxy to vue-notification.notify()
 *
 * Its purpose is to set a default duration, if not already defined.
 *
 * @param {Object} options Please see vue-notification official documentation
 */
export function notify(options) {
    return Vue.notify(
        Object.prototype.hasOwnProperty.call(options, "duration")
            ? options
            : { ...options, duration: DEFAULT_DURATION }
    );
}

export default notify;
