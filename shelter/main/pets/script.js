//------------------------------------------------------------link------------------------------------------------------------------------

//-----------------------------------------------------------link-burger-------------------------------------------------------------------

const burgerIcon = document.querySelector('.burger-menu');
const burgerMenu = document.querySelector('.nav-burger');
const burgerLink = document.querySelectorAll('.header-li-burger');
const headerUlBurger = document.querySelector('.header-ul-burger');
const overlay = document.getElementById('overlay');

//----------------------------------------------------------link-slider------------------------------------------------------------------

const sliderPlace = document.querySelector('.slider-line');
const nextSliderButtons = document.querySelector('.next-slide');
const allNextSliderButtons = document.querySelector('.all-next-slide');
const prevSliderButtons = document.querySelector('.prev-slide');
const allPrevSliderButtons = document.querySelector('.all-prev-slide');
const activeNumber = document.querySelector('.active-number');

let petsData = []; 

async function loadPetsData() {
    try {
        const response = await fetch('pets.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки JSON файла');
        }
        petsData = await response.json();

        const petsArray = [];
        for (let i = 0; i < 6; i++) {
            petsArray.push(...petsData);
        }

        const shuffledPets = shuffleArray(petsArray);

        populateSlides(shuffledPets);
        initializeSlider();
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//-------------------------------------------------------------link-pop-up----------------------------------------------------------

const modalWindow = document.querySelector('.modal-window');
const buttonPopUp = document.querySelector('.button-pop-up');
const imgPopUp = document.querySelector('.img-pop-up');
const headerPopUp = document.querySelector('.header-pop-up');
const subHeaderPopUp = document.querySelector('.sub-header-pop-up');
const textPopUp = document.querySelector('.text-pop-up');
const span1 = document.querySelector('.span1');
const span2 = document.querySelector('.span2');
const span3 = document.querySelector('.span3');
const span4 = document.querySelector('.span4');
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

//---------------------------------------------------------------slider------------------------------------------------------------------

let position = 0;
let slideIndex = 1;
let maxSlideIndex = 6;
let maxPosition;
let minPosotion = 0;
let positionValye;

function updateVisibleSlides() {
    const pageWidth = document.documentElement.scrollWidth;  

    if (pageWidth >= 768 && pageWidth < 1280) {
        maxSlideIndex = 8;
        maxPosition = 4340;
        positionValye = 620;
    } else if (pageWidth >= 320 && pageWidth < 768) {
        maxSlideIndex = 16;
        maxPosition = 4340;
        positionValye = 310;
    } else if (pageWidth >= 1280) {
        maxSlideIndex = 6;
        maxPosition = 6200;
        positionValye = 1240;
    }
}

function initializeSlider() {
    updateVisibleSlides(); 
    window.addEventListener('resize', updateVisibleSlides); 
}

function populateSlides(petsData, attempt = 0, maxAttempts = 10) {
    const slides = document.querySelectorAll('.slide');

    // Сначала разбиваем все слайды на группы по 4
    const groups = [];
    for (let i = 0; i < slides.length; i += 4) {
        groups.push(Array.from(slides).slice(i, i + 4));
    }

    // Теперь, используя каждую пару групп (по 8 слайдов), размещаем уникальных питомцев
    for (let i = 0; i < groups.length / 2; i++) {
        const firstGroup = groups[i];
        const secondGroup = groups[i + (groups.length / 2)];

        const combinedGroup = [...firstGroup, ...secondGroup];
        const uniquePets = selectUniquePets(petsData, 8);

        combinedGroup.forEach((slide, index) => {
            const pet = uniquePets[index];
            if (pet) {
                const imgElement = slide.querySelector('.slide-img');
                imgElement.src = pet.img;
                imgElement.alt = pet.name;

                const headerElement = slide.querySelector('.header-slider');
                headerElement.textContent = pet.name;
            }
        });
    }

    // Проверяем каждую тройку пар на уникальность ID, и при необходимости перезаполняем слайды
    if (!validateSlides(groups, petsData)) {
        if (attempt < maxAttempts) {
            console.warn(`Попытка ${attempt + 1} из ${maxAttempts}...`);
            populateSlides(petsData, attempt + 1, maxAttempts);
        } else {
            console.error('Не удалось сгенерировать уникальные слайды после нескольких попыток.');
        }
    }
}

// Вспомогательная функция для выбора уникальных питомцев
function selectUniquePets(petsData, count) {
    const uniquePets = [];
    const usedIds = new Set();

    while (uniquePets.length < count) {
        const randomIndex = Math.floor(Math.random() * petsData.length);
        const pet = petsData[randomIndex];

        if (!usedIds.has(pet.id)) {
            uniquePets.push(pet);
            usedIds.add(pet.id);
        }
    }

    return uniquePets;
}

// Вспомогательная функция для проверки уникальности ID в тройках пар слайдов
function validateSlides(groups, petsData) {
    for (let i = 0; i < groups.length / 2; i++) {
        const firstPair = groups.slice(i * 2, i * 2 + 2).flat();
        const secondPair = groups.slice((i + 4) * 2, (i + 4) * 2 + 2).flat();
        const thirdPair = groups.slice((i + 8) * 2, (i + 8) * 2 + 2).flat();

        const combinedPair = [...firstPair, ...secondPair, ...thirdPair];
        const ids = combinedPair.map(slide => slide.querySelector('.slide-img').alt);

        if (new Set(ids).size !== ids.length) {
            return false;
        }
    }
    return true;
}

function nextSlide() {
    if (slideIndex > maxSlideIndex-1) {
        return;
    }
    if (slideIndex === maxSlideIndex-1) {
        allNextSliderButtons.classList.add('inactive');
        nextSliderButtons.classList.add('inactive');
        allNextSliderButtons.classList.remove('active');
        nextSliderButtons.classList.remove('active');
    }
    position += positionValye;
    sliderPlace.style.left = -position + 'px';
    slideIndex++;
    activeNumber.textContent = slideIndex;
    allPrevSliderButtons.classList.add('active');
    prevSliderButtons.classList.add('active');
    allPrevSliderButtons.classList.remove('inactive');
    prevSliderButtons.classList.remove('inactive');
}

function maxNextSlide() {
    position = maxPosition; 
    sliderPlace.style.left = -position + 'px';
    slideIndex = maxSlideIndex;
    activeNumber.textContent = slideIndex;
    allNextSliderButtons.classList.add('inactive');
    nextSliderButtons.classList.add('inactive');
    allNextSliderButtons.classList.remove('active');
    nextSliderButtons.classList.remove('active');
    allPrevSliderButtons.classList.add('active');
    prevSliderButtons.classList.add('active');
    allPrevSliderButtons.classList.remove('inactive');
    prevSliderButtons.classList.remove('inactive');
}

function maxPrevSlide() {
    position = minPosotion; 
    sliderPlace.style.left = -position + 'px';
    slideIndex = 1;
    activeNumber.textContent = slideIndex;
    activeNumber.textContent = slideIndex;
    allNextSliderButtons.classList.add('active');
    nextSliderButtons.classList.add('active');
    allNextSliderButtons.classList.remove('inactive');
    nextSliderButtons.classList.remove('inactive');
    allPrevSliderButtons.classList.add('inactive');
    prevSliderButtons.classList.add('inactive');
    allPrevSliderButtons.classList.remove('active');
    prevSliderButtons.classList.remove('active');
}

function prevSlide() {
    
    if (slideIndex === 1) {
        return;
    }
    if (slideIndex === 2) {
        allPrevSliderButtons.classList.add('inactive');
        prevSliderButtons.classList.add('inactive');
        allPrevSliderButtons.classList.remove('active');
        prevSliderButtons.classList.remove('active');
    }
    position -= positionValye;
    sliderPlace.style.left = -position + 'px';
    slideIndex--;
    activeNumber.textContent = slideIndex;
    allNextSliderButtons.classList.add('active');
    nextSliderButtons.classList.add('active');
    allNextSliderButtons.classList.remove('inactive');
    nextSliderButtons.classList.remove('inactive');
}

loadPetsData()


nextSliderButtons.addEventListener("click", nextSlide);
prevSliderButtons.addEventListener("click", prevSlide);
allNextSliderButtons.addEventListener("click", maxNextSlide);
allPrevSliderButtons.addEventListener("click", maxPrevSlide);

initializeSlider()

//---------------------------------------------------------pop-up--------------------------------------------------------------------
function openPopUp() {
    modalWindow.classList.add('active-window');
    overlay.classList.add('active-overlay');
    lockScroll();
}

function closePopUp() {
    modalWindow.classList.add('closing');
    overlay.classList.remove('active-overlay');

    modalWindow.addEventListener('transitionend', () => {
        modalWindow.classList.remove('active-window', 'closing');
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
            span2.textContent = clickedSlideData.inoculations.join(', ');
            span3.textContent = clickedSlideData.diseases.join(', ');
            span4.textContent = clickedSlideData.parasites.join(', ');

            openPopUp();
        }
    }
});