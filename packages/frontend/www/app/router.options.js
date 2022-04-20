export default {
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve)  => {
            setTimeout(() => {
                if (to.hash) {
                    const el = document.querySelector(to.hash);
                    if (el) {
                        if ('scrollBehavior' in document.documentElement.style) {
                            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY- 75, behavior: 'smooth' });
                            // there is an unexplained diff of 75px between scrollTo(options) and scrollTo(x, y
                        } else {
                            window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
                        }

                        resolve();
                        return;
                    }
                }
        
                if (savedPosition) {
                    resolve(savedPosition);
                    return;
                }
        
                resolve({
                    x: 0,
                    y: 0
                });
            }, 200);
        });
    }
};
