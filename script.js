const ticketsCount = document.querySelector('#num');
const button = document.querySelector('.button');
const route = document.querySelector('#route');
const timeAB = document.querySelector('.timeAB');
const timeBA = document.querySelector('.timeBA');
const returnTime = document.querySelector('.return-time');
let result = document.querySelector('.result');
let departureHours;
let arrivedHours;
let currentPrice;
let currentTime;

const priceOneWay = 700;
const priceReturn = 1200;
const timeOneWay = 50; //minute
const timeReturn = timeOneWay * 2; //minute
const usersTimeZone = (new Date().getTimezoneOffset() / 60) * -1;

const currentTimeFromAtoB = [
  new Date(2022, 10, 01, 18, 00),
  new Date(2022, 10, 01, 18, 30),
  new Date(2022, 10, 01, 18, 45),
  new Date(2022, 10, 01, 19, 00),
  new Date(2022, 10, 01, 19, 15),
  new Date(2022, 10, 01, 21, 00),
];

const currentTimeFromBtoA = [
  new Date(2022, 10, 01, 18, 30),
  new Date(2022, 10, 01, 18, 45),
  new Date(2022, 10, 01, 19, 00),
  new Date(2022, 10, 01, 19, 15),
  new Date(2022, 10, 01, 19, 35),
  new Date(2022, 10, 01, 21, 50),
  new Date(2022, 10, 01, 21, 55),
];

function setActualTime(array, direction) {
  let options = array;
  for (let i = 0; i < options.length; i++) {
    let sceduleTime = direction[i].toLocaleTimeString().slice(0, 5);
    let arrayFromTime = splitTime(sceduleTime, ':');
    let usersHours;
    if (arrayFromTime[0] - 2 + usersTimeZone >= 24) {
      let usersHoursWIP = arrayFromTime[0] - 2 + usersTimeZone - 24;
      usersHours = usersHoursWIP.toString().padStart(2, '0');
    } else {
      usersHours = arrayFromTime[0] - 2 + usersTimeZone;
    }

    let usersTime = usersHours + ':' + arrayFromTime[1];

    options[i].textContent = usersTime;
  }
}

setActualTime(timeAB.querySelectorAll('option'), currentTimeFromAtoB);
setActualTime(timeBA.querySelectorAll('option'), currentTimeFromBtoA);

route.addEventListener('change', () => {
  route.options[route.selectedIndex].value !== 'из A в B и обратно в А'
    ? (currentTime = timeOneWay)
    : (currentTime = timeOneWay * 2);

  if (route.options[route.selectedIndex].value === 'из A в B и обратно в А') {
    returnTime.classList.remove('non-diplayed');
    blockNotavailableSlots();
  } else {
    returnTime.classList.add('non-diplayed');
  }
});

timeAB.addEventListener('change', () => {
  blockNotavailableSlots();
});

function splitTime(time, separator) {
  const arrayFromTime = time.split(separator);
  return arrayFromTime;
}

function getDepartureTime(startTime) {
  let arrayFromTime = splitTime(startTime, ':');
  departureHours = Number(arrayFromTime[0]);
  let departureMinutes = Number(arrayFromTime[1]);
  let departure = departureHours * 60 + departureMinutes;

  return departure;
}

function getArriveTime(departureSlot) {
  let departureTime = getDepartureTime(departureSlot);
  let arriveTime = departureTime + timeOneWay;

  return arriveTime;
}

function getArriveHomeTime() {
  let departure;
  let arriveTime;
  if (route.options[route.selectedIndex].value !== 'из A в B и обратно в А') {
    departure = getDepartureTime(timeAB.options[timeAB.selectedIndex].text);
  } else {
    departure = getDepartureTime(timeBA.options[timeBA.selectedIndex].text);
  }
  arriveTime = departure + timeOneWay;
  return arriveTime;
}

function humanizeArriveTime() {
  let arriveTime = getArriveHomeTime();
  let arriveHours = Math.floor(arriveTime / 60);
  let arriveinMutes = arriveTime - arriveHours * 60;

  return arriveHours + ':' + arriveinMutes.toString().padStart(2, '0');
}

function blockNotavailableSlots() {
  let arriveTime = getArriveTime(timeAB.options[timeAB.selectedIndex].text);
  let options = timeBA.querySelectorAll('option');

  for (let option of options) {
    let departureToA = getDepartureTime(option.text);

    if (arriveTime > departureToA) {
      option.setAttribute('disabled', true);
    } else {
      option.removeAttribute('disabled');
    }
  }
}

const humanizeTimeDuration = (duration) => {
  const hours =
    Math.trunc(duration / 60) > 0 ? Math.trunc(duration / 60) + 'ч' : '';
  const minutes = duration % 60;

  return `${hours} ${minutes}`;
};

button.onclick = function () {
  const tiketsAmount = document.querySelector('#num').value;
  if (route.options[route.selectedIndex].classList.contains('return')) {
    currentPrice = tiketsAmount * priceReturn;
  } else {
    currentPrice = tiketsAmount * priceOneWay;
  }

  if (
    tiketsAmount < 1 ||
    route.options[route.selectedIndex].text == '' ||
    timeAB.options[timeAB.selectedIndex].text == ''
  ) {
    result.textContent = 'Пожалуйста, заполните все поля';
  } else if (
    route.options[route.selectedIndex].value == 'из A в B и обратно в А' &&
    timeBA.options[timeBA.selectedIndex].text == ''
  ) {
    result.textContent = 'Пожалуйста, заполните все поля';
  } else {
    result.textContent =
      'Вы выбрали ' +
      tiketsAmount +
      ' билета по маршруту ' +
      route.options[route.selectedIndex].value +
      ' стоимостью ' +
      currentPrice +
      'р. Время в пути составит ' +
      humanizeTimeDuration(currentTime) +
      ' минут. Теплоход в пункт В отправляется в ' +
      timeAB.options[timeAB.selectedIndex].text +
      ', а закончится ваше путешествие в ' +
      humanizeArriveTime() +
      '.';
  }
};
