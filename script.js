'use strict'
//-----бегущая строка-----//
let blocksRuningText = document.querySelectorAll('.running-text');

for (let blockText of blocksRuningText) {
   endlessLine(blockText);
   runText(blockText, timingDelay(blockText));
   setInterval(function () {
      restart(blockText)
      runText(blockText, timingDelay(blockText));
   }, timingDelay(blockText) * 1000)
}

function timingDelay(runBlock) {
   let lineText = runBlock.firstElementChild;
   let widthWindow = document.documentElement.clientWidth;
   let widthLine = lineText.offsetWidth;
   return (widthLine - widthWindow) / 100;
}

function runText(runBlock, time) {
   let lineText = runBlock.firstElementChild;
   let widthWindow = document.documentElement.clientWidth;
   let widthLine = lineText.offsetWidth;
   lineText.style.transition = `all ${time}s linear`;
   lineText.style.transform = `translate3d(${widthWindow - widthLine}px, 0, 0)`;
}

function endlessLine(runBlock) {
   let runningLine = runBlock.firstElementChild;
   let doubleRunningLine = runningLine.cloneNode(true).children;
   runningLine.appendChild(doubleRunningLine[0]);
}

function restart(runBlock) {
   let container = runBlock.firstElementChild;
   container.style.transition = `all 0s linear`;
   container.style.transform = `translate3d(0, 0, 0)`;
}

//------слайдер 1-------//
+function initializationSlider() {
   let wrapperSlider = getSlider('.slider-stages');
   let navigationSlider = getNavigationSlider('.navigation-stages');

   generateBullet(wrapperSlider, navigationSlider);

   navigationSlider.nextButton.addEventListener('click', function () {
      getNextSlide(wrapperSlider);
      getActiveBullet(wrapperSlider, navigationSlider.bullet);
      goSlide(wrapperSlider);
   });
   navigationSlider.prevButton.addEventListener('click', function () {
      getPrevSlide(wrapperSlider);
      getActiveBullet(wrapperSlider, navigationSlider.bullet);
      goSlide(wrapperSlider);
   });
}();



function getSlider(classSlider) {
   let slider = document.querySelector(classSlider);
   let wrapper = slider.firstElementChild;
   [...wrapper.children].map(e => e.dataset.active = "");
   wrapper.firstElementChild.dataset.active = 'active';
   getNavigationSlider('.navigation-stages').prevButton.setAttribute('disabled', 'false');

   return wrapper;
}

function getNavigationSlider(classNavigation) {
   let wrapperNavigation = document.querySelector(classNavigation);
   let wrapperBullet = wrapperNavigation.querySelector('[data-bullet]');
   let prevButton = wrapperNavigation.querySelector('[data-button="left"]');
   let nextButton = wrapperNavigation.querySelector('[data-button="right"]');

   return {
      'wrapper': wrapperNavigation,
      'bullet': wrapperBullet,
      'prevButton': prevButton,
      'nextButton': nextButton
   };
}

function generateBullet(slider, navigation) {
   let numberSlides = slider.children.length;
   for (let i = 0; i < numberSlides; i++) {
      let bullet = document.createElement('span');
      navigation.bullet.appendChild(bullet);
   }
   getActiveBullet(slider, navigation.bullet);
}

function getNextSlide(wrapper) {
   let slides = [...wrapper.children];
   let activeSlide = slides.filter(e => e.dataset.active == 'active')[0];
   let nextSlide = slides[slides.indexOf(activeSlide) + 1];
   if (slides.indexOf(nextSlide) == (slides.length - 1)) {
      getNavigationSlider('.navigation-stages').nextButton.setAttribute('disabled', 'true');
   } else {
      getNavigationSlider('.navigation-stages').nextButton.removeAttribute('disabled');
      getNavigationSlider('.navigation-stages').prevButton.removeAttribute('disabled');
   }
   activeSlide.dataset.active = '';
   nextSlide.dataset.active = 'active';
}

function getPrevSlide(wrapper) {
   let slides = [...wrapper.children];
   let activeSlide = slides.filter(e => e.dataset.active == 'active')[0];
   let prevSlide = slides[slides.indexOf(activeSlide) - 1];
   if (slides.indexOf(prevSlide) == 0) {
      getNavigationSlider('.navigation-stages').prevButton.setAttribute('disabled', 'true');
   } else {
      getNavigationSlider('.navigation-stages').prevButton.removeAttribute('disabled');
      getNavigationSlider('.navigation-stages').nextButton.removeAttribute('disabled');
   }
   activeSlide.dataset.active = '';
   prevSlide.dataset.active = 'active';
}

function getActiveBullet(wrapper, navigationWrapper) {
   let slides = wrapper.children;
   for (let i = 0; i < slides.length; i++) {
      if (slides[i].dataset.active) {
         navigationWrapper.children[i].classList.add('active');
      } else {
         navigationWrapper.children[i].classList.remove('active');
      }
   }
}

function goSlide(wrapper) {
   let widthSlide = wrapper.firstElementChild.clientWidth;
   let activeSlide = [...wrapper.children].filter(e => e.dataset.active == 'active')[0];
   let indexActiveSlide = [...wrapper.children].indexOf(activeSlide);
   wrapper.style.transform = `translate3d(-${widthSlide * indexActiveSlide}px, 0, 0)`;
}

//------слайдер 2-------//
class Slider {
   constructor(optionSlider) {
      this.prevButton = document.querySelector(optionSlider.selectorPrevButton);
      this.nextButton = document.querySelector(optionSlider.selectorNextButton);
      this.slider = document.querySelector(optionSlider.selectorSlider);
      this.bullet = document.querySelector(optionSlider.selectorBullet);

      this.intervalSlides = optionSlider.columnGap;
      this.numberSlides = optionSlider.numberSlides;
      this.wrapperSlider = this.slider.firstElementChild;
      this.timeAnimation = optionSlider.time;
      this.activeSlide = optionSlider.numberSlides;
      this.mediaQueries = optionSlider.media;
   }

   trak = 0;
   endSlide;

   initializationSlider() {
      this.getActiveSlide();
      this.getEndSlide();
      this.instalingStyles();
      this.showBullet();
      this.showNextSlide();
      this.showPrevSlide();
      if (this.timeAnimation > 0) {
         this.autoplay();
      }
   }

   instalingStyles() {
      this.wrapperSlider.style.gap = `${this.getGap()}px`;

      let slides = this.wrapperSlider.children;
      for (let slide of slides) {
         slide.style.flex = `0 0 calc(${this.getWidthSlide()}% - 
         ${this.getGap() / this.getNumberSlides() * (this.getNumberSlides() - 1)}px)`
      }
   }

   getWidthSlide() {
      return 100 / this.getNumberSlides();
   }

   nextSlide() {
      this.trak -= this.getWidthSlide();
      this.activeSlide++;
      this.showBullet();
      if (this.trak < -(this.getWidthSlide() * this.endSlide)) {
         this.trak = 0;
         this.activeSlide = this.getNumberSlides();
         this.showBullet();
      }
      this.wrapperSlider.style.transform = `translateX(${this.trak}%)`;
   }

   showNextSlide() {
      this.nextButton.addEventListener('click', () => {
         this.nextSlide();
      })
   }

   showPrevSlide() {
      this.prevButton.addEventListener('click', () => {
         this.trak += this.getWidthSlide();
         this.activeSlide--;
         this.showBullet();
         if (this.trak > 0.1) {
            this.trak = -(this.getWidthSlide() * this.endSlide);
            this.activeSlide = this.wrapperSlider.children.length;
            this.showBullet();
         }
         this.wrapperSlider.style.transform = `translateX(${this.trak}%)`;
      })
   }

   autoplay() {
      setInterval(() => {
         this.nextSlide();
      }, this.timeAnimation * 1000)
   }

   showBullet() {
      this.bullet.lastElementChild.textContent = this.wrapperSlider.children.length;
      this.bullet.firstElementChild.textContent = this.activeSlide;
   }

   getWidthWindow() {
      return document.documentElement.clientWidth;
   }

   getMediaQueries() {
      let arrMediaQueries = Object.keys(this.mediaQueries);
      arrMediaQueries.push(this.getWidthWindow());
      arrMediaQueries.sort((a, b) => a - b);
      return arrMediaQueries[arrMediaQueries.indexOf(this.getWidthWindow()) - 1];
   }

   getGap() {
      let options = this.mediaQueries[this.getMediaQueries()];
      if (options.columnGap !== undefined) {
         return options.columnGap;
      } else {
         return this.intervalSlides;
      }
   }

   getNumberSlides() {
      let options = this.mediaQueries[this.getMediaQueries()];
      if (options.numberSlides !== undefined) {
         return options.numberSlides;
      } else {
         return 1;
      }
   }

   getActiveSlide() {
      let options = this.mediaQueries[this.getMediaQueries()];
      if (options.numberSlides) {
         this.activeSlide = options.numberSlides;
      }
   }

   getEndSlide() {
      this.endSlide = this.wrapperSlider.children.length - this.getNumberSlides();
   }
}

let slider = new Slider({
   selectorSlider: '.participants__body',
   selectorPrevButton: '.navigation__button_left',
   selectorNextButton: '.navigation__button_right',
   selectorBullet: '.navigation__bullet',
   columnGap: 20,
   numberSlides: 3,
   media: {
      '0': {
         columnGap: 0,
         numberSlides: 1
      },
      '500': {
         columnGap: 10,
         numberSlides: 2
      },

      '767': {
         columnGap: 20,
         numberSlides: 3
      }
   },
   time: 4,
});


slider.initializationSlider();


//------перемещение блока-------//
let runningBlocks = document.querySelectorAll('[data-goto]');
for (let movableBlock of runningBlocks) {
   moveNewLocation(movableBlock);
}

function moveNewLocation(block) {
   let options = block.dataset.goto.split(', ');
   let location = document.querySelector(options[0]);
   let maxmin = options[1];
   let mediaWidth = options[2];
   let position = options[3] || '0';
   if (maxmin == 'max') {
      if (document.documentElement.clientWidth <= mediaWidth) {
         if (position != '0') {
            location.children[position - 1].insertAdjacentElement('afterEnd', block)
         } else {
            location.prepend(block);
         }
      }
   }
   if (maxmin == 'min') {
      if (document.documentElement.clientWidth >= mediaWidth) {
         if (position != '0') {
            location.children[position - 1].insertAdjacentElement('afterEnd', block);
         } else {
            location.prepend(block);
         }
      }
   }
}