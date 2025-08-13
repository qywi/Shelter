//------------------------------------------------------------link------------------------------------------------------------------------

//-----------------------------------------------------------link-burger-------------------------------------------------------------------

const burgerIcon = document.querySelector('.burger-menu');
const burgerMenu = document.querySelector('.nav-burger');
const burgerLink = document.querySelectorAll('.header-li-burger');
const headerUlBurger = document.querySelector('.header-ul-burger');
const overlay = document.getElementById('overlay');

//---------------------------------------------------------link-slider------------------------------------------------------------------
async function loadPetsData() {
    try {
        const response = await fetch('pets.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки JSON файла');
        }
        petsData = await response.json();
        shuffleArray(petsData);
        console.log(petsData);
        populateSlides(petsData);
        initializeSlider(); 
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

const sliderPlace = document.querySelector('.slider-line');
const nextSliderButtons = document.querySelectorAll('.next-slide');
const prevSliderButtons = document.querySelectorAll('.prev-slide');
const slideWidth = document.querySelector('.slide').clientWidth;
const imgWidth = document.querySelector('.slide-img').clientWidth;
const initialMargin = document.querySelector('.margin').clientWidth;
const sliderLine = document.querySelector('.slider-line');

//-------------------------------------------------------------link-pop-up----------------------------------------------------------

const modalWindow = document.querySelector('.modal-window');
const buttonPopUp = document.querySelector('.button-pop-up');
const headerPopUp = document.querySelector('.header-pop-up');
const imgPopUp = document.querySelector('.img-pop-up');
const subHeaderPopUp = document.querySelector('.sub-header-pop-up');
const textPopUp = document.querySelector('.text-pop-up');
const span1 = document.querySelector('.span1');
const span2 = document.querySelector('.span2');
const span3 = document.querySelector('.span3');
const span4 = document.querySelector('.span4');
const popUp = document.querySelector('.pop-up');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

//----------------------------------------------------------burger-menu------------------------------------------------------------------
function lockScroll() {
    const scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
}

function unlockScroll() {
    const scrollPosition = Math.abs(parseInt(document.body.style.top, 10));

    document.documentElement.style.scrollBehavior = 'auto';

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    window.scrollTo(0, scrollPosition);

    document.documentElement.style.scrollBehavior = '';
}


burgerIcon.addEventListener("click", function (e) {
    document.body.classList.toggle('lock');
    burgerIcon.classList.toggle('active-icon');

    if (burgerMenu.classList.contains('active-menu')) {
        burgerMenu.classList.remove('active-menu');

        unlockScroll();

        overlay.classList.remove('active-overlay');

        setTimeout(() => {
            burgerMenu.style.display = 'none';
        }, 300);
    } else {
        burgerMenu.style.display = 'block';

        lockScroll();

        overlay.classList.add('active-overlay');

        setTimeout(() => {
            burgerMenu.classList.add('active-menu');
        }, 10);
    }
});

burgerLink.forEach(link => {
    link.addEventListener("click", function () {
        document.body.classList.remove('lock');
        burgerIcon.classList.remove('active-icon');
        burgerMenu.classList.remove('active-menu');

        unlockScroll();

        overlay.classList.remove('active-overlay');

        setTimeout(() => {
            burgerMenu.style.display = 'none';
        }, 300);
    });
});

document.addEventListener("click", function (e) {
    const isClickInsideMenu = headerUlBurger.contains(e.target) || burgerIcon.contains(e.target);

    if (!isClickInsideMenu && burgerMenu.classList.contains('active-menu')) {
        document.body.classList.remove('lock');
        burgerIcon.classList.remove('active-icon');
        burgerMenu.classList.remove('active-menu');

        unlockScroll();

        overlay.classList.remove('active-overlay');

        setTimeout(() => {
            burgerMenu.style.display = 'none';
        }, 300);
    }
});

//-----------------------------------------------------slider-----------------------------------------------------------------------

let activeImg = 0;
let petsData = [];
let flag = true;

let targetSlideCount = 5;

function updateSlides() {
    slides = document.querySelectorAll('.slider-line .slide');
}

function updateVisibleSlides() {
    let slideCount = sliderPlace.childElementCount;  
    const pageWidth = document.documentElement.scrollWidth;  

    if (pageWidth >= 768 && pageWidth < 1280) {
        targetSlideCount = 4;
    } else if (pageWidth >= 320 && pageWidth < 768) {
        targetSlideCount = 3;
    } else if (pageWidth >= 1280) {
        targetSlideCount = 5;
    }

    while (slideCount < targetSlideCount) {
        const newSlide = document.createElement('div');
        newSlide.className = 'slide';
        const petIndex = slideCount % petsData.length; 
        newSlide.innerHTML = `
            <img src="${petsData[petIndex].img}" alt="${petsData[petIndex].name}" class="slide-img">
            <h2 class="header-slider">${petsData[petIndex].name}</h2>
            <a class="lik-slider" href="#no_scroll">Learn more</a>
        `;
        sliderPlace.appendChild(newSlide);
        slideCount++;
    }

    while (slideCount > targetSlideCount) {
        sliderPlace.lastElementChild.remove();
        slideCount--;
    }

}

function initializeSlider() {
    updateVisibleSlides(); 
    window.addEventListener('resize', updateVisibleSlides); 
}


initializeSlider();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function populateSlides(petsData, startIdx = 0) {
    const slides = document.querySelectorAll('.slide');

    slides.forEach((slide, index) => {
        const pet = petsData[(startIdx + index) % petsData.length]; 
        const imgElement = slide.querySelector('.slide-img'); 
        imgElement.src = pet.img; 
        imgElement.alt = pet.name; 

        const headerElement = slide.querySelector('.header-slider');
        headerElement.textContent = pet.name; 
    });
}

function mixerSlideNext() {
    const currentIds = []; 

    var  slides = document.querySelectorAll('.slider-line .slide');

    slides.forEach(slide => {
        const petName = slide.querySelector('.header-slider').textContent;
        const petData = petsData.find(pet => pet.name === petName);
        if (petData) {
            currentIds.push(petData.id); 
        }
    });

    const secondSlide = document.querySelectorAll('.slider-line .slide')[1];
    const imgElement = secondSlide.querySelector('.slide-img'); 
    const headerElement = secondSlide.querySelector('.header-slider');
    setTimeout(() => {
        for (let i = 0; i < petsData.length; i++) {
            const obj = petsData[i];
            if (!currentIds.includes(obj.id)) {
                imgElement.src = obj.img; 
                imgElement.alt = obj.name; 
                headerElement.textContent = obj.name;
                break; 
            }
        }
    },1000);

}

function mixerSlidePrev() {
    const currentIds = []; 

    var slides = document.querySelectorAll('.slider-line .slide');

    slides.forEach(slide => {
        const petName = slide.querySelector('.header-slider').textContent;
        const petData = petsData.find(pet => pet.name === petName);
        if (petData) {
            currentIds.push(petData.id); 
        }
    });

    const secondSlide = document.querySelectorAll('.slider-line .slide')[targetSlideCount - 1];
    const imgElement = secondSlide.querySelector('.slide-img'); 
    const headerElement = secondSlide.querySelector('.header-slider');
    setTimeout(() => {
        for (let i = 0; i < petsData.length; i++) {
            const obj = petsData[i];
            if (!currentIds.includes(obj.id)) {
                imgElement.src = obj.img; 
                imgElement.alt = obj.name; 
                headerElement.textContent = obj.name;
                break; 
            }
        }
    },1000);


}


const nextSlide = () => {
    if (!flag) return;
    flag = !flag
    activeImg++;
    if (activeImg >= petsData.length) {
        activeImg = 0;
    }

    document.querySelector('.slider-line .slide .lik-slider').remove();
    
    const firstSlide = document.querySelector('.slider-line .slide');

    firstSlide.style.marginRight = initialMargin + 'px';
    firstSlide.style.padding = '0px';

    animate({
        duration: 1000,
        draw: function(progres) {
            firstSlide.style.width = (slideWidth * (1 - progres)) + 'px';
            firstSlide.style.marginRight = (initialMargin * (1 - progres)) + 'px';
            firstSlide.style.marginLeft = (initialMargin * (1 - progres)) + 'px';
        },
        removeElement: firstSlide
    });

    const firstImg = document.querySelector('.slider-line .slide .slide-img');

    animate({
        duration: 1000,
        draw: function(progres) {
            firstImg.style.width = (imgWidth * (1 - progres)) + 'px';
        },
        removeElement: firstImg
    });

    populateNewSlide(activeImg);
    mixerSlideNext();
};


const prevSlide = () => {
    if (!flag) return;
    flag = !flag
    activeImg--;
    if (activeImg < 0) {
        activeImg = petsData.length - 1;
    }

    const lastSlide = document.querySelector('.slider-line .slide:last-child');
    document.querySelector('.slider-line .slide:last-child .lik-slider').remove();
    lastSlide.style.padding = '0px';

    animate({
        duration: 1000,
        draw: function(progres) {
            lastSlide.style.width = (slideWidth * (1 - progres)) + 'px';
            lastSlide.style.marginRight = (initialMargin * (1- progres)) + 'px';
            lastSlide.style.marginLeft = (initialMargin * (1 - progres)) + 'px';
        },
            removeElement: lastSlide
        });

        const lastImg = document.querySelector('.slider-line .slide:last-child .slide-img');

        animate({
            duration: 1000,
            draw: function(progres) {
                lastImg.style.width = (imgWidth * (1 - progres)) + 'px';
            },
            removeElement: lastImg
        });

    sliderPlace.style.transition = 'none';
    sliderPlace.style.transform = `translateX(${-(slideWidth)}px)`;

    populateNewSlideStart(activeImg);

    setTimeout(() => {
        sliderPlace.style.transition = 'transform 1s ease-in-out';
        sliderPlace.style.transform = 'translateX(0)';

        setTimeout(() => {
            if (lastSlide) lastSlide.remove();
        }, 1000);
    }, 10);
    mixerSlidePrev();
};

nextSliderButtons.forEach(button => {
    button.addEventListener("click", nextSlide);
})

prevSliderButtons.forEach(button => {
    button.addEventListener("click", prevSlide);
});

function animate({ duration, draw, removeElement }) {
    const start = performance.now();

    requestAnimationFrame(function animate(time) {
        let step = (time - start) / duration;
        if (step > 1) step = 1;
        draw(step);
        if (step < 1) {
            requestAnimationFrame(animate);
        } else {
            removeElement.remove(); 
            flag = true;
        }
    });
}

function populateNewSlide(index) {
    const slide = document.createElement('div');
    slide.className = 'slide';

    const currentIds = Array.from(document.querySelectorAll('.slider-line .slide .header-slider'))
        .map(header => header.textContent);

    for (let i = 0; i < petsData.length; i++) {
        const pet = petsData[(index + i) % petsData.length];
        if (!currentIds.includes(pet.name)) { 
            slide.innerHTML = `
                <img src="${pet.img}" alt="${pet.name}" class="slide-img">
                <h2 class="header-slider">${pet.name}</h2>
                <a class="lik-slider" href="#no_scroll">Learn more</a>
            `;
            sliderPlace.appendChild(slide);
            break; 
        }
    }
}

function populateNewSlideStart(index) {
    const slide = document.createElement('div');
    slide.className = 'slide slide-hidden';  

    const currentIds = Array.from(document.querySelectorAll('.slider-line .slide .header-slider'))
        .map(header => header.textContent);

    for (let i = 0; i < petsData.length; i++) {
        const pet = petsData[(index + i) % petsData.length];
        if (!currentIds.includes(pet.name)) {
            slide.innerHTML = `
                <img src="${pet.img}" alt="${pet.name}" class="slide-img">
                <h2 class="header-slider">${pet.name}</h2>
                <a class="lik-slider" href="#no_scroll">Learn more</a>
            `;


            sliderPlace.insertBefore(slide, sliderPlace.firstChild);

            animate({
                duration: 1000,
                draw: function(progres) {
                    slide.style.marginRight = (initialMargin * progres) + 'px';
                    slide.style.marginLeft = (initialMargin * progres) + 'px';
                }
            });

            requestAnimationFrame(() => {
                slide.classList.remove('slide-hidden');
            });
            break;
        }
    }
}

loadPetsData(); 

//---------------------------------------------------------pop-up--------------------------------------------------------------------
function openPopUp() {
    modalWindow.classList.add('active');
    overlay.classList.add('active-overlay');
    lockScroll();
}

function closePopUp() {
    modalWindow.classList.add('closing');
    overlay.classList.remove('active-overlay');

    modalWindow.addEventListener('transitionend', () => {
        modalWindow.classList.remove('active', 'closing');
        unlockScroll();
    }, { once: true });
}


buttonPopUp.addEventListener("click", closePopUp);

overlay.addEventListener("click", closePopUp);

modalWindow.addEventListener("click", function(event) {
    event.stopPropagation();
});

let clickedSlideData = null; 

sliderPlace.addEventListener("click", function(event) {
    const clickedSlide = event.target.closest('.slide');
    if (clickedSlide) {
        const clickedSlideName = clickedSlide.querySelector('.header-slider').textContent;
        clickedSlideData = petsData.find(pet => pet.name === clickedSlideName);

        if (clickedSlideData) {
            imgPopUp.src = clickedSlideData.img; 
            imgPopUp.alt = clickedSlideData.name;
            headerPopUp.textContent = clickedSlideData.name;
            subHeaderPopUp.textContent = `${clickedSlideData.type} - ${clickedSlideData.breed}`;
            textPopUp.textContent = clickedSlideData.description;
            span1.textContent = clickedSlideData.age;
            span2.textContent = clickedSlideData.inoculations;
            span3.textContent = clickedSlideData.diseases;
            span4.textContent = clickedSlideData.parasites;

            openPopUp();
        }
    }
});
