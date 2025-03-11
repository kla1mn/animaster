let animaster = (function() {
    function resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    }
    function resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    }
    function resetMoveAndScale(element) {
        element.style.transform = null;
        element.style.transitionDuration = null;
    }
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
        _steps: [],
        addMove(duration, translation) {
            this._steps.push({
                operation: 'move',
                duration: duration,
                params: translation
            });
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({
                operation: 'scale',
                duration: duration,
                params: ratio
            });
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({
                operation: 'fadeIn',
                duration: duration
            });
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({
                operation: 'fadeOut',
                duration: duration
            });
            return this;
        },
        addDelay(duration) {
            this._steps.push({
                operation: 'delay',
                duration: duration
            });
            return this;
        },
        play(element, cycled) {
            let timeouts = [];
            const initial = {
                className: element.className,
                transform: element.style.transform,
                transitionDuration: element.style.transitionDuration
            };
            const steps = this._steps.slice();
            this._steps = [];
            const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
            const run = () => {
                let delay = 0;
                steps.forEach(step => {
                    let id = setTimeout(() => {
                        if (step.operation !== 'delay') {
                            this[step.operation](element, step.duration, step.params);
                        }
                    }, delay);
                    timeouts.push(id);
                    delay += step.duration;
                });
                if (cycled) {
                    let id = setTimeout(() => {
                        run();
                    }, totalDuration);
                    timeouts.push(id);
                }
            };
            run();
            return {
                stop() {
                    timeouts.forEach(id => clearTimeout(id));
                },
                reset() {
                    timeouts.forEach(id => clearTimeout(id));
                    resetMoveAndScale(element);
                    if (initial.className.indexOf('hide') !== -1) {
                        resetFadeIn(element);
                    } else if (initial.className.indexOf('show') !== -1) {
                        resetFadeOut(element);
                    }
                }
            };
        },
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
            const moveDuration = duration * 2 / 5;
            const fadeDuration = duration * 3 / 5;
            this.addMove(moveDuration, { x: 100, y: 20 })
                .addFadeOut(fadeDuration);
            return this.play(element);
        },
        showAndHide(element, duration) {
            const stepDuration = duration / 3;
            return this.addFadeIn(stepDuration)
                .addDelay(stepDuration)
                .addFadeOut(stepDuration)
                .play(element);
        },
        heartBeating(element) {
            this.addScale(500, 1.4)
                .addScale(500, 1);
            return this.play(element, true);
        },
        buildHandler() {
            const steps = this._steps.slice();
            this._steps = [];
            const instance = this;
            return function() {
                let timeouts = [];
                let delay = 0;
                steps.forEach(step => {
                    let id = setTimeout(() => {
                        if (step.operation !== 'delay') {
                            instance[step.operation](this, step.duration, step.params);
                        }
                    }, delay);
                    timeouts.push(id);
                    delay += step.duration;
                });
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
            animaster.move(block, 1000, { x: 100, y: 10 });
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
            const animation = animaster.moveAndHide(block, 5000);
            document.getElementById('moveAndHideReset')
                .onclick = () => animation.reset();
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            const animation = animaster.showAndHide(block, 3000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const animation = animaster.heartBeating(block);
            document.getElementById('heartBeatingStop')
                .onclick = () => animation.reset();
        });
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            animaster
                .addMove(200, { x: 40, y: 40 })
                .addScale(800, 1.3)
                .addMove(200, { x: 80, y: 0 })
                .addScale(800, 1)
                .addMove(200, { x: 40, y: -40 })
                .addScale(800, 0.7)
                .addMove(200, { x: 0, y: 0 })
                .addScale(800, 1)
                .play(block);
        });
    document.getElementById('worryAnimationPlay')
        .addEventListener('click',
            animaster
                .addMove(200, {x: 80, y: 0})
                .addMove(200, {x: 0, y: 0})
                .addMove(200, {x: 80, y: 0})
                .addMove(200, {x: 0, y: 0})
                .buildHandler());
}