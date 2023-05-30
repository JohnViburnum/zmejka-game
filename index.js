const main = document.querySelector('main');
const countPara = document.querySelector('#count');
const btnPause = document.querySelector('.pause');
const btnUp = document.querySelector('.up');
const btnLeft = document.querySelector('.left');
const btnDown = document.querySelector('.down');
const btnRight = document.querySelector('.right');
const gameEnd = document.querySelector('.game-end');
const gameReport = document.querySelector('.game-report');
const gameLog = document.querySelector('.game-log');

function random(min, max) { //------------------------------------ функция рандомизации между min и max
  let num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function degToRad(degrees) { //------ функция преобразования градусов в радианы
  return degrees * Math.PI / 180;
}

// Змейка
let snakeExists = true; //------------------------------------------------- Змейка существует
// голова Змейки
let headSnakeSize = 20; //------------------------------------------------- радиус головы Змейки
let headSnakeStepX = headSnakeSize * 2; //--------------------------------- начальный шаг Змейки по X (20*2 = 40)
let headSnakeStepY = 0; //------------------------------------------------- начальный шаг Змейки по Y
let headSnakeStep = headSnakeSize * 2; //---------------------------------- шаг Змейки
let headSnakeX = headSnakeStep * 2; //------------------------------------- начальное положение головы Змейки по X
let headSnakeY = headSnakeStep; //----------------------------------------- начальное положение головы Змейки по Y
// вырез рта Змейки
let headSnakeMouth1 = degToRad(45); //------------------------------------- 45 градусов от крайней правой точки
let headSnakeMouth2 = degToRad(320); //------------------------------------ 320 градусов от крайней правой точки (-45 градусов)
// начальные координаты челюстей Змейки (напротив выреза рта, на спине)
let headSnakeJaw1_1 = degToRad(135); //------------------------------------ начальный градус отрисовки 1й челюсти
let headSnakeJaw1_2 = degToRad(225); //------------------------------------ конечный градус отрисовки 1й челюсти
let headSnakeJaw2_1 = degToRad(135); //------------------------------------ начальный градус отрисовки 2й челюсти
let headSnakeJaw2_2 = degToRad(225); //------------------------------------ конечный градус отрисовки 2й челюсти

function headSnakeDraw() { //----------------------------------------------------------------- функция отрисовки Головы Змейки
  ctx.beginPath(); //------------------------------------------------------------------------- функция начала отрисовки фигуры
  ctx.fillStyle = 'red'; //------------------------------------------------------------------- цвет заливки красный
  ctx.arc(headSnakeX, headSnakeY, headSnakeSize, headSnakeMouth1, headSnakeMouth2, false); //- функция отрисовки формы
  ctx.lineTo(headSnakeX, headSnakeY) //------------------------------------------------------- точка возврата в центр для выреза рта
  ctx.fill(); //------------------------------------------------------------------------------ функция заливки
}

function headSnakeJaw1Draw() { //------------------------------------------------------------- функция отрисовки 1й челюсти Головы Змейки
  ctx.beginPath(); //------------------------------------------------------------------------- функция начала отрисовки фигуры
  ctx.fillStyle = 'red'; //------------------------------------------------------------------- цвет заливки красный
  ctx.arc(headSnakeX, headSnakeY, headSnakeSize, headSnakeJaw1_1, headSnakeJaw1_2, false); //- функция отрисовки формы
  ctx.lineTo(headSnakeX, headSnakeY) //------------------------------------------------------- точка возврата в центр
  ctx.fill(); //------------------------------------------------------------------------------ функция заливки
  // движение по кругу
  headSnakeJaw1_1 += 0.2; //------------------------------------------------------------------ добавление к начальному градусу отрисовки 1й челюсти
  headSnakeJaw1_2 += 0.2; //------------------------------------------------------------------ добавление к конечному градусу отрисовки 1й челюсти
}

function headSnakeJaw2Draw() { //------------------------------------------------------------- функция отрисовки 2й челюсти Головы Змейки
  ctx.beginPath(); //------------------------------------------------------------------------- функция начала отрисовки фигуры
  ctx.fillStyle = 'red'; //------------------------------------------------------------------- цвет заливки красный
  ctx.arc(headSnakeX, headSnakeY, headSnakeSize, headSnakeJaw2_1, headSnakeJaw2_2, false); //- функция отрисовки формы
  ctx.lineTo(headSnakeX, headSnakeY) //------------------------------------------------------- точка возврата в центр
  ctx.fill(); //------------------------------------------------------------------------------ функция заливки
  // движение по кругу в противоположную 1й челюсти сторону
  headSnakeJaw2_1 -= 0.2; //------------------------------------------------------------------ добавление к начальному градусу отрисовки 2й челюсти
  headSnakeJaw2_2 -= 0.2; //------------------------------------------------------------------ добавление к конечному градусу отрисовки 2й челюсти
}

//Канвас
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = Math.floor(main.clientWidth * 0.95 / headSnakeStep) * headSnakeStep;
let height = canvas.height = Math.floor(main.clientHeight * 0.95 / headSnakeStep) * headSnakeStep;

//Координаты для шаров
let xArray = []; //- пустой массив для координат по X
let yArray = []; //- пустой массив для координат по Y
let varX = 0; //---- вспомогательная переменная
let varY = 0; //---- вспомогательная переменная

while (xArray.length < width / headSnakeStep - 1) { //- цикл генерации координат по X (количество данных меньше ширины деленной на количество шагов - 1)
  varX += headSnakeStep; //---------------------------- добавление к переменной значение шага Змейки
  xArray.push(varX); //-------------------------------- внесение данных в массив
}

while (yArray.length < height / headSnakeStep - 1) { //- цикл генерации координат по Y (количество данных меньше высоты деленной на количество шагов - 1)
  varY += headSnakeStep; //----------------------------- добавление к переменной значение шага Змейки
  yArray.push(varY); //--------------------------------- внесение данных в массив
}

//Счет
let allCount = Number(document.querySelector('#allCount').value); //- переменная количества всего счета
let count = 0; //---------------------------------------------------- переменная текущего счета (начальный счет: 0)
countPara.textContent = `Счет: ${count}/${allCount}`; //------------- счет

//Сегменты змейки
class Segment { //----------------------------------------------------- класс Сегмент
  constructor(x, y) { //----------------------------------------------- конструктор
    this.x = x; //----------------------------------------------------- координата X
    this.y = y; //----------------------------------------------------- координата Y
    this.exists = false; //-------------------------------------------- наличие сегмента - ложь
    this.size = headSnakeSize; //-------------------------------------- размер сегмента равен размеру головы Змейки
  }
  draw() { //---------------------------------------------------------- метод отрисовки сегмента
    ctx.beginPath(); //------------------------------------------------ функция начала отрисовки
    ctx.fillStyle = 'yellow'; //--------------------------------------- цвет заливки
    ctx.arc(this.x, this.y, this.size, degToRad(0), degToRad(360)); //- функция отрисовки формы (положение центра X и Y, радиус, градусы начала и конца отрисовки)
    ctx.fill(); //----------------------------------------------------- функция заливки
  }
}

let segments = []; //--------------------- пустой массив сегментов Змейки
while (segments.length < allCount) { //--- цикл генерации сегментов (количество сегментов меньше количества всего счета, по факту равно 50: 0-49)
  let segment = new Segment(-20, -20); //- создание сегмента на основе конструктора Сегмент с отрицательными координатами (за экраном)
  segments.push(segment); //-------------- внесение сегментов в массив
}

segments[0].exists = true; //---------------------- 1й сегмент существует
segments[0].x = headSnakeX - headSnakeSize * 2; //- положение сегмента по X (сразу за головой Змейки)
segments[0].y = headSnakeY; //--------------------- положение сегмента по Y (по горизонтали Змейки)

//Шары
class Ball { //-------------------------------------------------------- класс Шар
  constructor(x, y) { //----------------------------------------------- конструктор
    this.x = x; //----------------------------------------------------- координата X
    this.y = y; //----------------------------------------------------- координата Y
    this.exists = false; //-------------------------------------------- наличие шара - ложь
    this.size = 0.75 * headSnakeSize; //------------------------------- радиус шара
  }
  draw() { //---------------------------------------------------------- метод отрисовки шара
    ctx.beginPath(); //------------------------------------------------ функция начала отрисовки
    ctx.fillStyle = 'green'; //---------------------------------------- цвет заливки
    ctx.arc(this.x, this.y, this.size, degToRad(0), degToRad(360)); //- функция отрисовки формы (положение центра X и Y, радиус, градусы начала и конца отрисовки)
    ctx.fill(); //----------------------------------------------------- функция заливки
  }
}

let balls = []; //--------------------------- пустой массив шаров
while (balls.length < allCount) { //--------- цикл генерации шаров
  let ball = new Ball( //-------------------- создание шара на основе конструктора Шар
    xArray[random(0, xArray.length - 1)], //- положение по оси X (разброс по массиву xArray)
    yArray[random(0, yArray.length - 1)] //-- положение по оси Y (разброс по массиву yArray)
  );
  balls.push(ball); //----------------------- внесение шаров в массив
}

balls[0].exists = true; //- 1й шар существует

//Функции взаимодействия
function headSnakeCollisionDetect() { //------------------------ функция столкновения шара и Головы Змеи
  for (i = 0; i < allCount; i++) { //--------------------------- цикл перебора шаров
    if (balls[i].exists) { //----------------------------------- если шар существует
      // вычисление столкновения Головы Змейки с шаром
      let dx = headSnakeX - balls[i].x;
      let dy = headSnakeY - balls[i].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < headSnakeSize + 15) { //-------------------- если Голова Змейки сталкивается с шаром, то
        balls[i].exists = false; //------------------------------ шара не существует
        if (i < allCount - 1) { //------------------------------- если i меньше на один всего счета, то (для того чтобы последний шар не сломал игру)
          balls[i + 1].exists = true; //------------------------- следующий шар существует
          segments[i + 1].exists = true; //---------------------- следующий сегмент существует
        }
        count++; //---------------------------------------------- к счету добавляется 1
        countPara.textContent = `Счет: ${count}/${allCount}`; //- счет
        if (count === allCount) { //----------------------------- если текущий счет равет всему счету, то
          snakeExists = false; //-------------------------------- Змейки не существует
          canvas.classList.add('hidden');
          gameEnd.classList.remove('hidden');
          gameReport.classList.add('win');
          gameReport.textContent = 'Победа!';
        }
      }
    }
  }
}

let worldEnd = false; //- переменная границ игрового поля
let step = 0; //--------- шаг / кадр (для скорости движения Змейки)
let speed = 55; //------- скорость (для количества пропуска кадров, чем меньше данная переменная, тем быстрее Змейка)

function snakeUpdate() { //-------------------------------- функция движения Змейки
  //блок взаимодействия со стеной
  if (worldEnd) { //--------------------------------------- если поле с границами
    if ((headSnakeX + headSnakeSize) >= width || //-------- если положение головы по X плюс радиус головы больше или равен ширине ИЛИ
      (headSnakeX - headSnakeSize) <= 0 || //-------------- положение головы по X минус радиус головы меньше или равно 0 ИЛИ
      (headSnakeY + headSnakeSize) >= height || //--------- положение головы по Y плюс радиус головы больше или равен высоте ИЛИ 
      (headSnakeY - headSnakeSize) <= 0) { //-------------- положение головы по Y минус радиус головы меньше или равно 0, то
      snakeExists = false; //------------------------------ Змейки не существует
      canvas.classList.add('hidden');
      gameEnd.classList.remove('hidden');
      gameReport.textContent = 'Проигрыш!';
      gameLog.textContent = 'Столкнулась со стеной'
    }
  } else if (worldEnd === false) { //---------------------- иначе если поле без границ
    if ((headSnakeX + headSnakeSize) > width) { //--------- если положение головы по X плюс радиус головы больше ширины, то
      headSnakeX = headSnakeSize * 2; //------------------- положение головы по X равно размеру голову * 2 (перескок на левую сторону)
    } else if ((headSnakeX - headSnakeSize) < 0) { //------ иначе если положение головы по X минус радиус головы меньше 0, то
      headSnakeX = width - headSnakeSize * 2; //----------- положение головы по X равно ширине - размер головы * 2 (перескок на правую сторону)
    } else if ((headSnakeY + headSnakeSize) > height) { //- иначе если положение головы по Y плюс радиус головы больше высоты, то
      headSnakeY = headSnakeSize * 2; //------------------- положение головы по Y равно размеру голову * 2 (перескок на верх)
    } else if ((headSnakeY - headSnakeSize) < 0) { //------ иначе если положение головы по Y минус радиус головы меньше 0, то
      headSnakeY = height - headSnakeSize * 2; //---------- положение головы по Y равно высоте - размер головы * 2 (перескок на низ)
    }
  }
  for (i = 0; i < allCount; i++) { //---------------------- цикл перебора сегментов
    //вычисление столкновения Головы Змейки с сегментом
    let dx = headSnakeX - segments[i].x;
    let dy = headSnakeY - segments[i].y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < headSnakeSize + segments[i].size) { //-- если голова Змейки сталкивается с сегментом, то
      snakeExists = false; //------------------------------ Змейки не существует
      canvas.classList.add('hidden');
      gameEnd.classList.remove('hidden');
      gameReport.textContent = 'Проигрыш!';
      gameLog.textContent = 'Съела сама себя'
    }
  }
  //блок скорости и движения Змейки
  step += 1; //-------------------------------------------- шаг добавляется 1
  if (count === allCount * 0.1) { //----------------------- если счет 10% от всего, то
    speed = 50; //----------------------------------------- скорость 50 кадров простоя
  } else if (count === allCount * 0.2) { //---------------- иначе если счет 20% ... и т.д.
    speed = 40;
  } else if (count === allCount * 0.3) {
    speed = 32;
  } else if (count === allCount * 0.4) {
    speed = 26;
  } else if (count === allCount * 0.5) {
    speed = 20;
  } else if (count === allCount * 0.6) {
    speed = 25;
  } else if (count === allCount * 0.7) {
    speed = 16;
  } else if (count === allCount * 0.8) {
    speed = 13;
  } else if (count === allCount * 0.9) {
    speed = 10;
  }
  if (step % speed === 0) { //----------------------------- если остаток деления шага на скорость равно 0, то
    for (i = allCount - 1; i >= 1; i--) { //--------------- цикл добавления сегментов к Змейке
      if (count >= i) { //--------------------------------- если счет больше или равен i, то
        segments[i].x = segments[i - 1].x; //-------------- положение X сегмента i присваивает положение X сегмента i-1 (предыдущего)
        segments[i].y = segments[i - 1].y; //-------------- положение Y сегмента i присваивает положение Y сегмента i-1 (предыдущего)
      }
    }
    segments[0].x = headSnakeX; //------------------------- положение X 0го (1го) сегмента присваивает положение X головы Змейки 
    segments[0].y = headSnakeY; //------------------------- положение Y 0го (1го) сегмента присваивает положение Y головы Змейки 
    headSnakeX += headSnakeStepX; //----------------------- положение X головы Змейки добавляет шаг по X
    headSnakeY += headSnakeStepY; //----------------------- положение Y головы Змейки добавляет шаг по Y
  }
}

//Управление
let blockPress = 'left'; //- переменная блокировки клавиши (начальное значение 'left', так как начальное движение Змейки - вправо)

function leftFunc() { //---------------- функция движения влево
  if (blockPress !== 'left') { //------- если блокировка клавиши не 'left', то
    blockPress = 'right'; //------------ блокировка клавиши 'right'
    headSnakeStepX = -headSnakeStep; //- движение Змейки по X на шаг влево
    headSnakeStepY = 0; //-------------- движение Змейки по Y нулевое
    //изменение отрисовки рта
    headSnakeMouth1 = degToRad(225);
    headSnakeMouth2 = degToRad(135);
    //изменение отрисовки челюстей
    headSnakeJaw1_1 = degToRad(315);
    headSnakeJaw1_2 = degToRad(45);
    headSnakeJaw2_1 = degToRad(315);
    headSnakeJaw2_2 = degToRad(45);
  }
}

function rightFunc() { //---------------- функция движения вправо
  if (blockPress !== 'right') {
    blockPress = 'left';
    headSnakeStepX = headSnakeStep;
    headSnakeStepY = 0;
    headSnakeMouth1 = degToRad(45);
    headSnakeMouth2 = degToRad(315);
    headSnakeJaw1_1 = degToRad(135);
    headSnakeJaw1_2 = degToRad(225);
    headSnakeJaw2_1 = degToRad(135);
    headSnakeJaw2_2 = degToRad(225);
  }
}

function upFunc() { //---------------- функция движения вверх
  if (blockPress !== 'up') {
    blockPress = 'down';
    headSnakeStepY = -headSnakeStep;
    headSnakeStepX = 0;
    headSnakeMouth1 = degToRad(315);
    headSnakeMouth2 = degToRad(225);
    headSnakeJaw1_1 = degToRad(45);
    headSnakeJaw1_2 = degToRad(135);
    headSnakeJaw2_1 = degToRad(45);
    headSnakeJaw2_2 = degToRad(135);
  }
}

function downFunc() { //---------------- функция движения вниз
  if (blockPress !== 'down') {
    blockPress = 'up';
    headSnakeStepY = headSnakeStep;
    headSnakeStepX = 0;
    headSnakeMouth1 = degToRad(135);
    headSnakeMouth2 = degToRad(45);
    headSnakeJaw1_1 = degToRad(225);
    headSnakeJaw1_2 = degToRad(315);
    headSnakeJaw2_1 = degToRad(225);
    headSnakeJaw2_2 = degToRad(315);
  }
}

let pause = false; //- переменная паузы

function pauseFunc() { //------------------------- функция паузы
  if (pause) { //--------------------------------- если пауза, то
    pause = false; //----------------------------- пауза ложь
    snakeExists = true; //------------------------ змейка существует
    //кнопки для сенсорных экранов работают
    btnUp.removeAttribute('disabled');
    btnLeft.removeAttribute('disabled');
    btnDown.removeAttribute('disabled');
    btnRight.removeAttribute('disabled');
  } else { //------------------------------------- иначе
    pause = true; //------------------------------ пауза
    snakeExists = false; //----------------------- змейка не существует
    //кнопки для сенсорных экранов выключаются
    btnUp.setAttribute('disabled', 'true');
    btnLeft.setAttribute('disabled', 'true');
    btnDown.setAttribute('disabled', 'true');
    btnRight.setAttribute('disabled', 'true');
  }
}

//для сенсорных экранов
btnRight.ontouchstart = () => { rightFunc(); }
btnDown.ontouchstart = () => { downFunc(); }
btnLeft.ontouchstart = () => { leftFunc(); }
btnUp.ontouchstart = () => { upFunc(); }

btnPause.onclick = () => { //-------------- прослушиватель события нажатие кнопки
  pauseFunc(); //-------------------------- запуск функции паузы
  if (pause) { //-------------------------- если пауза
    btnPause.textContent = 'Продолжить' //- текст кнопки
  } else { //------------------------------ иначе
    btnPause.textContent = 'Пауза' //------ текст кнопки
  }
}

//для клавиатуры
window.onkeydown = (e) => { //--------- прослушиватель события нажатие клавиши
  switch (e.code) { //----------------- переключатель (код)
    case 'ArrowLeft': leftFunc(); //--- случай 'Стрелка Влево': запуск функции движения влево
      break; //------------------------ окончание случая; и т.д. ниже
    case 'ArrowRight': rightFunc();
      break;
    case 'ArrowUp': upFunc();
      break;
    case 'ArrowDown': downFunc();
      break;
    case 'Space': pauseFunc(); //------ случай 'Пробел': запуск функции паузы
      break;
  }
}

function pauseDraw() { //------------------------------ функция отрисовки слова 'пауза'
  ctx.fillStyle = 'red';
  ctx.font = '100px arial';
  ctx.fillText('Пауза', width / 2 - 140, height / 2 + 20);
}

//Настройки
document.querySelector('#border-on').onchange = () => {
  worldEnd = true;
  canvas.classList.add('border');
}

document.querySelector('#border-off').onchange = () => {
  worldEnd = false;
  canvas.classList.remove('border');
}

//Запуск
function loop() { //-------------------- функция запуска
  ctx.fillStyle = 'white'; //----------- цвет заливки полотна белый
  ctx.fillRect(0, 0, width, height); //- функция ширины заливки
  if (snakeExists) { //----------------- если Змейка существует, то
    headSnakeDraw(); //----------------- запуск функции отрисовки головы Змейки
    headSnakeJaw1Draw(); //------------- запуск функции отрисовки 1й челюсти
    headSnakeJaw2Draw(); //------------- запуск функции отрисовки 2й челюсти
    snakeUpdate(); //------------------- запуск функции движения Змейки
    for (let segment of segments) { //-- цикл сегментов
      if (segment.exists) { //---------- если сегмент существует, то
        segment.draw(); //-------------- запуск функции отрисовки сегментов
      }
    }
  }
  for (i = 0; i < allCount; i++) { //--- цикл шаров
    if (balls[i].exists) { //----------- если шар i существует, то
      balls[i].draw(); //--------------- запуск функции отрисовки шара
      headSnakeCollisionDetect(); //---- запуск функции столкновения головы Змейки с шаром
    }
  }
  if (pause) { //----------------------- если пауза
    pauseDraw(); //--------------------- запуск функции отрисовки паузы
  }
  requestAnimationFrame(loop); //------- функция запуска анимации (60 циклов / кадров в секунду)
}


//кнопки для сенсорных экранов отключены
btnUp.setAttribute('disabled', 'true');
btnLeft.setAttribute('disabled', 'true');
btnDown.setAttribute('disabled', 'true');
btnRight.setAttribute('disabled', 'true');
btnPause.setAttribute('disabled', 'true');

document.querySelector('#start').onclick = () => { //--------------------- прослушиватель события нажатие кнопки
  loop(); //-------------------------------------------------------------- запуск функции запуска
  allCount = Number(document.querySelector('#allCount').value); //-------- весь счет равен значению селектора
  countPara.textContent = `Счет: ${count}/${allCount}`; //---------------- счет
  document.querySelector('.settings').setAttribute('class', 'hidden'); //- настройки скрыты
  canvas.classList.remove('hidden'); //----------------------------------- канвас открыт
  //кнопки для сенсорных экранов включены
  btnPause.removeAttribute('disabled');
  btnUp.removeAttribute('disabled');
  btnLeft.removeAttribute('disabled');
  btnDown.removeAttribute('disabled');
  btnRight.removeAttribute('disabled');
}

document.querySelector('#reload').onclick = () => { //- прослушиватель события нажатие кнопки
  document.location.reload(); //----------------------- перезагрузка страницы
};