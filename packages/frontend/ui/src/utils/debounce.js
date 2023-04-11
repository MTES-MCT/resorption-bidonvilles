export default function debounce(fn, delay = 300) {
    let timer;
    let previousFailure = null;

    return (...args) => {
        if (previousFailure !== null) {
            previousFailure();
            clearTimeout(timer);
        }

        const promise = new Promise((success, failure) => {
            previousFailure = failure;

            timer = setTimeout(() => {
                try {
                    success(fn(...args));
                } catch (e) {
                    failure(e);
                }

                previousFailure = null;
            }, delay);
        });
        promise.abort = function () {
            clearTimeout(timer);
            previousFailure = null;
        };

        return promise;
    };
}