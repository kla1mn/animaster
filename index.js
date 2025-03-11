const animaster = (function() {
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    return {
        fadeIn(element, duration) {
            fadeIn(element, duration);
            return this;
        },

        fadeOut(element, duration) {
            fadeOut(element, duration);
            return this;
        },

        move(element, duration, translation) {
            move(element, duration, translation);
            return this;
        },

        scale(element, duration, ratio) {
            scale(element, duration, ratio);
            return this;
        },

        moveAndHide(element, duration) {
            const moveDuration = duration * 2/5;
            const fadeDuration = duration * 3/5;

            this.move(element, moveDuration, {x: 100, y: 20});
            setTimeout(() => this.fadeOut(element, fadeDuration), moveDuration);
            return this;
        },

        showAndHide(element, duration) {
            const stepDuration = duration / 3;

            this.fadeIn(element, stepDuration);
            setTimeout(() => this.fadeOut(element, stepDuration), stepDuration * 2);
            return this;
        },

        heartBeating(element) {
            const step = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1);
                    setTimeout(step, 500);
                }, 500);
            };
            step();

            return {
                stop() {
                    clearTimeout();
                }
            };
        }
    };
})();

addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster.scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster.fadeOut(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster.moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster.showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster.heartBeating(block);
        });
}