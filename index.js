let canvas = document.querySelector('canvas');
let span = document.querySelector('#span');
let ost = document.querySelector('#ost');
let ctx = canvas.getContext('2d'); //------------------------------ контекст рисования фигур
let worldEnd = false; //------------------------------------------- переменная границ поля

function random(min, max) { //------------------------------------- функция рандомизации между min и max
   let num = Math.floor(Math.random() * (max - min + 1)) + min;
   return num;
}
function degToRad(degrees) { //------------------------------------ функция преобразования градусов в радианы
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

//Ширина и высота канвас
let width = canvas.width = Math.floor(window.innerWidth * 0.99 / headSnakeStep) * headSnakeStep; //-------------------------------- ширина
let height = canvas.height = Math.floor(window.innerHeight * 0.85 / headSnakeStep) * headSnakeStep; //------------------------------- высота

function headSnakeDraw() { //------------------------------------------------------------------ функция отрисовки Головы Змейки
   ctx.beginPath(); //------------------------------------------------------------------------- функция начала отрисовки фигуры
   ctx.fillStyle = 'red'; //------------------------------------------------------------------- цвет заливки красный
   ctx.arc(headSnakeX, headSnakeY, headSnakeSize, headSnakeMouth1, headSnakeMouth2, false); //- функция отрисовки формы
   ctx.lineTo(headSnakeX, headSnakeY) //------------------------------------------------------- точка возврата в центр для выреза рта
   ctx.fill(); //------------------------------------------------------------------------------ функция заливки
}

function headSnakeJaw1Draw() { //-------------------------------------------------------------- функция отрисовки 1й челюсти Головы Змейки
   ctx.beginPath(); //------------------------------------------------------------------------- функция начала отрисовки фигуры
   ctx.fillStyle = 'red'; //------------------------------------------------------------------- цвет заливки красный
   ctx.arc(headSnakeX, headSnakeY, headSnakeSize, headSnakeJaw1_1, headSnakeJaw1_2, false); //- функция отрисовки формы
   ctx.lineTo(headSnakeX, headSnakeY) //------------------------------------------------------- точка возврата в центр
   ctx.fill(); //------------------------------------------------------------------------------ функция заливки
   // движение по кругу
   headSnakeJaw1_1 += 0.2; //------------------------------------------------------------------ добавление к начальному градусу отрисовки 1й челюсти
   headSnakeJaw1_2 += 0.2; //------------------------------------------------------------------ добавление к конечному градусу отрисовки 1й челюсти
}

function headSnakeJaw2Draw() { //-------------------------------------------------------------- функция отрисовки 2й челюсти Головы Змейки
   ctx.beginPath(); //------------------------------------------------------------------------- функция начала отрисовки фигуры
   ctx.fillStyle = 'red'; //------------------------------------------------------------------- цвет заливки красный
   ctx.arc(headSnakeX, headSnakeY, headSnakeSize, headSnakeJaw2_1, headSnakeJaw2_2, false); //- функция отрисовки формы
   ctx.lineTo(headSnakeX, headSnakeY) //------------------------------------------------------- точка возврата в центр
   ctx.fill(); //------------------------------------------------------------------------------ функция заливки
   // движение по кругу в противоположную 1й челюсти сторону
   headSnakeJaw2_1 -= 0.2; //------------------------------------------------------------------ добавление к начальному градусу отрисовки 2й челюсти
   headSnakeJaw2_2 -= 0.2; //------------------------------------------------------------------ добавление к конечному градусу отрисовки 2й челюсти
}

let xArray = []; //------------------------------------- пустой массив для координат по X
let yArray = []; //------------------------------------- пустой массив для координат по Y
let varX = 0; //---------------------------------------- вспомогательная переменная
let varY = 0; //---------------------------------------- вспомогательная переменная
while (xArray.length < width / headSnakeStep - 1) { //-- цикл генерации координат по X (количество данных меньше ширины деленной на количество шагов - 1)
   varX += headSnakeStep; //---------------------------- добавление к переменной значение шага Змейки
   xArray.push(varX); //-------------------------------- внесение данных в массив
}
while (yArray.length < height / headSnakeStep - 1) { //- цикл генерации координат по Y (количество данных меньше высоты деленной на количество шагов - 1)
   varY += headSnakeStep; //---------------------------- добавление к переменной значение шага Змейки
   yArray.push(varY); //-------------------------------- внесение данных в массив
}

class Segment { //------------------------------------------------------- класс Сегмент
   constructor(x, y) { //------------------------------------------------ конструктор
      this.x = x; //----------------------------------------------------- координата X
      this.y = y; //----------------------------------------------------- координата Y
      this.exists = false; //-------------------------------------------- наличие сегмента - ложь
      this.size = headSnakeSize; //-------------------------------------- размер сегмента равен размеру головы Змейки
   }
   draw() { //----------------------------------------------------------- метод отрисовки сегмента
      ctx.beginPath(); //------------------------------------------------ функция начала отрисовки
      ctx.fillStyle = 'yellow'; //--------------------------------------- цвет заливки
      ctx.arc(this.x, this.y, this.size, degToRad(0), degToRad(360)); //- функция отрисовки формы (положение центра X и Y, радиус, градусы начала и конца отрисовки)
      ctx.fill(); //----------------------------------------------------- функция заливки
   }
}

class Ball { //---------------------------------------------------------- класс Шар
   constructor(x, y) { //------------------------------------------------ конструктор
      this.x = x; //----------------------------------------------------- координата X
      this.y = y; //----------------------------------------------------- координата Y
      this.exists = false; //-------------------------------------------- наличие шара - ложь
      this.size = 0.75 * headSnakeSize; //------------------------------------------------- радиус шара
   }
   draw() { //----------------------------------------------------------- метод отрисовки шара
      ctx.beginPath(); //------------------------------------------------ функция начала отрисовки
      ctx.fillStyle = 'green'; //---------------------------------------- цвет заливки
      ctx.arc(this.x, this.y, this.size, degToRad(0), degToRad(360)); //- функция отрисовки формы (положение центра X и Y, радиус, градусы начала и конца отрисовки)
      ctx.fill(); //----------------------------------------------------- функция заливки
   }
}


let allCount = Number(document.querySelector('#allCount').value); //- переменная количества всего счета
let count = 0; //---------------------------------------------------- текущий счет (начальный счет: 0)
span.textContent = 'Счет: ' + count; //------------------------------ текст подписи
ost.textContent = 'Осталось шаров: ' + allCount; //------------------ осталось шаров

let segments = []; //---------------------- пустой массив сегментов Змейки
while (segments.length < allCount) { //---- цикл генерации сегментов (количество сегментов меньше количества всего счета, по факту равно 50: 0-49)
   let segment = new Segment(-20, -20); //- создание сегмента на основе конструктора Сегмент с отрицательными координатами (за экраном)
   segments.push(segment); //-------------- внесение сегментов в массив
}

segments[0].exists = true; //---------------------- 1й сегмент существует
segments[0].x = headSnakeX - headSnakeSize * 2; //- положение сегмента по X (сразу за головой Змейки)
segments[0].y = headSnakeY; //--------------------- положение сегмента по Y (по горизонтали Змейки)

let balls = []; //----------------------------- пустой массив шаров
while (balls.length < allCount) { //----------- цикл генерации шаров (количество шаров меньше количества всего счета, по факту равно 50: 0-49)
   let ball = new Ball( //--------------------- создание шара на основе конструктора Шар
      xArray[random(0, xArray.length - 1)], //- положение по оси X (разброс по массиву xArray 0-22)
      yArray[random(0, yArray.length - 1)] //-- положение по оси Y (разброс по массиву yArray 0-10)
   );
   balls.push(ball); //------------------------ внесение шаров в массив
}

balls[0].exists = true; //- 1й шар существует

function headSnakeCollisionDetect() { //----------------------- функция столкновения шара и Головы Змеи
   for (i = 0; i < allCount; i++) { //------------------------- цикл перебора шаров
      if (balls[i].exists === true) { //----------------------- если шар существует
         // вычисление столкновения с Головы Змейки с шаром
         let dx = headSnakeX - balls[i].x;
         let dy = headSnakeY - balls[i].y;
         let distance = Math.sqrt(dx * dx + dy * dy);
         if (distance < headSnakeSize + 15) { //--------------- если Голова Змейки сталкивается с шаром, то
            balls[i].exists = false; //------------------------ шара не существует
            if (i < allCount - 1) { //------------------------- если i меньше на один всего счета, то (для того чтобы последний шар не сломал игру)
               balls[i + 1].exists = true; //------------------ следующий шар существует
               segments[i + 1].exists = true; //--------------- следующий сегмент существует
            }
            count++; //---------------------------------------- к счету добавляется 1
            span.textContent = 'Счет: ' + count; //------------ текст подписи
            ost.textContent = 'Осталось шаров: ' + (allCount - count);
            if (count === allCount) { //--------------------------------- если текущий счет равет всему счету, то
               snakeExists = false; //----------------------------------- Змейки не существует
               span.textContent = 'Счет: ' + count + '! Победа!!!'; //--- текст подписи
               ost.textContent = 'Осталось шаров: ' + (allCount - count);
               document.querySelector('#reload').setAttribute('class', 'visible'); //---- включение кнопки перезагрузки
               canvas.style.display = 'none';
            }
         }
      }
   }
}

let step = 0; //--- шаг / кадр (вспомогательная переменная для скорости движения Змейки)
let speed = 55; //- скорость (вспомогательная переменная для количества пропуска кадров, чем меньше данная переменная, тем быстрее Змейка)

function snakeUpdate() { //----------------------------------------------------- функция отрисовки движения Змейки
   if (worldEnd === true) { //-------------------------------------------------- если поле с границами
      if ((headSnakeX + headSnakeSize) >= width || //--------------------------- если положение головы по X плюс радиус головы больше или равен ширине ИЛИ
         (headSnakeX - headSnakeSize) <= 0 || //-------------------------------- положение головы по X минус радиус головы меньше или равно 0 ИЛИ
         (headSnakeY + headSnakeSize) >= height || //--------------------------- положение головы по Y плюс радиус головы больше или равен высоте ИЛИ 
         (headSnakeY - headSnakeSize) <= 0) { //-------------------------------- положение головы по Y минус радиус головы меньше или равно 0, то
         snakeExists = false; //------------------------------------------------ Змейки не существует
         span.textContent = 'Врубился в стенку! ПРОИГРЫШ!!!'; //---------------- текст подписи
         ost.textContent = 'Осталось шаров: ' + (allCount - count);
         document.querySelector('#reload').setAttribute('class', 'visible'); //- включение кнопки перезагрузки
         canvas.style.display = 'none';
      }
   } else if (worldEnd === false) { //------------------------------------------ если поле без границ
      if ((headSnakeX + headSnakeSize) > width) {
         headSnakeX = headSnakeSize * 2;
      } else if ((headSnakeX - headSnakeSize) < 0) {
         headSnakeX = width - headSnakeSize * 2;
      } else if ((headSnakeY + headSnakeSize) > height) {
         headSnakeY = headSnakeSize * 2;
      } else if ((headSnakeY + headSnakeSize) < headSnakeSize * 2) {
         headSnakeY = height - headSnakeSize * 2;
      }
   }

   for (i = 0; i < allCount; i++) { //-------------------------- цикл перебора сегментов
      // вычисление столкновения с Головы Змейки с сегментом
      let dx = headSnakeX - segments[i].x;
      let dy = headSnakeY - segments[i].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < headSnakeSize + segments[i].size) { //----- если голова Змейки сталкивается с сегментом, то
         snakeExists = false; //-------------------------------- Змейки не существует
         span.textContent = 'Съел сам себя! ПРОИГРЫШ!!!'; //---- текст подписи
         ost.textContent = 'Осталось шаров: ' + (allCount - count);
         document.querySelector('#reload').setAttribute('class', 'visible'); //- включение кнопки перезагрузки
         canvas.style.display = 'none';
      }
   }
   // блок скорости Змейки
   step += 1; //------------------------------------------------- шаг добавляется 1
   if (count === allCount * 0.1) { //---------------------------- если счет 10% от всего, то
      speed = 50; //--------------------------------------------- скорость 50 кадров простоя
   } else if (count === allCount * 0.2) { //--------------------- иначе если счет 20% ... и т.д.
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
   if (step % speed === 0) { //---------------------------------- если остаток деления шага на скорость равно 0, то
      for (i = allCount - 1; i >= 1; i--) { //------------------- цикл добавления сегментов к Змейке (от 49го до 1го)
         if (count >= i) { //------------------------------------ если счет больше или равен i, то
            segments[i].x = segments[i - 1].x; //---------------- положение X сегмента i присваивает положение X сегмента i-1 (предыдущего)
            segments[i].y = segments[i - 1].y; //---------------- положение Y сегмента i присваивает положение Y сегмента i-1 (предыдущего)
         }
      }
      segments[0].x = headSnakeX; //----------------------------- положение X 0го (1го) сегмента присваивает положение X головы Змейки 
      segments[0].y = headSnakeY; //----------------------------- положение Y 0го (1го) сегмента присваивает положение Y головы Змейки 
      headSnakeX += headSnakeStepX; //--------------------------- положение X головы Змейки добавляет шаг по X
      headSnakeY += headSnakeStepY; //--------------------------- положение Y головы Змейки добавляет шаг по Y
   }

}

let blockPress = 'left'; //--------------------- переменная блокировки клавиши (начальная позиция 'a', так как начальное движение Змейки - вправо)
window.addEventListener('keydown', (e) => { //-- прослушиватель события нажатие клавиши
   switch (e.which) { //------------------------ переключатель клавиша
      case 37: //------------------------------- случай: нажата данная клавиша (a)
         if (blockPress !== 'left') { //-------- если блокировка клавиши не 'a', то
            blockPress = 'right'; //------------ блокировка клавиши 'd'
            headSnakeStepX = -headSnakeStep; //- движение Змейки по X на шаг влево
            headSnakeStepY = 0; //-------------- движение Змейки по Y нулевое
            headSnakeMouth1 = degToRad(225); //- изменение начала отрисовки головы
            headSnakeMouth2 = degToRad(135); //- изменение конца отрисовки головы
            // отрисовка челюстей на спине
            headSnakeJaw1_1 = degToRad(315);
            headSnakeJaw1_2 = degToRad(45);
            headSnakeJaw2_1 = degToRad(315);
            headSnakeJaw2_2 = degToRad(45);
         }
         break; //------------------------------ окончание случая; и т.д. ниже
      case 39:
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
         break;
      case 38:
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
         break;
      case 40:
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
         break;
   }
});

let pause = false;

window.addEventListener('keydown', (e) => { //- функция паузы
   if (e.which === 32) {
      if (pause === false) {
         pause = true;
         snakeExists = false;
      } else if (pause === true) {
         pause = false;
         span.textContent = 'Счет: ' + count;
         snakeExists = true;
      }
   }
});

function pauseDraw() { //------------------------------ функция отрисовки слова 'пауза'
   ctx.fillStyle = 'red';
   ctx.font = '100px arial';
   ctx.fillText('Пауза', width / 2 - 140, height / 2 + 20);
}

function loop() { //----------------------- функция запуска
   ctx.fillStyle = 'white'; //------------- цвет заливки полотна белый
   ctx.fillRect(0, 0, width, height); //--- функция ширины заливки
   if (snakeExists === true) { //---------- если Змейка существует, то
      headSnakeDraw(); //------------------ запуск функции отрисовки головы Змейки
      headSnakeJaw1Draw(); //-------------- запуск функции отрисовки 1й челюсти
      headSnakeJaw2Draw(); //-------------- запуск функции отрисовки 2й челюсти
      snakeUpdate(); //-------------------- запуск функции движения Змейки
      for (let segment of segments) { //--- цикл сегментов
         if (segment.exists === true) { //- если сегмент существует, то
            segment.draw(); //------------- запуск функции отрисовки сегментов
         }
      }
   }
   for (i = 0; i < allCount; i++) { //----- цикл шаров
      if (balls[i].exists === true) { //--- если шар i существует, то
         balls[i].draw(); //--------------- запуск функции отрисовки шара
         headSnakeCollisionDetect(); //---- запуск функции столкновения головы Змейки с шаром
      }
   }
   if (pause) {
      pauseDraw();
   }
   requestAnimationFrame(loop); //--------- функция запуска анимации (60 циклов / кадров в секунду)
}

document.querySelector('#border').onclick = function () {
   if (worldEnd) {
      worldEnd = false;
      document.querySelector('#border').textContent = 'Без границ';
      canvas.removeAttribute('class');
   } else {
      worldEnd = true;
      document.querySelector('#border').textContent = 'С границами';
      canvas.setAttribute('class', 'border');
   }

}

canvas.style.display = 'none';
document.querySelector('#start').onclick = function () { //-- кнопка запуска
   loop();
   allCount = Number(document.querySelector('#allCount').value);
   ost.textContent = 'Осталось шаров: ' + allCount;
   document.querySelector('#reload').setAttribute('class', 'visible');
   document.querySelector('#start').setAttribute('class', 'hidden');
   document.querySelector('#allCount').setAttribute('class', 'hidden');
   document.querySelector('#labelAllCount').setAttribute('class', 'hidden');
   document.querySelector('#border').setAttribute('class', 'hidden');
   document.querySelector('#gamebox').setAttribute('class', 'hidden');
   canvas.style.display = '';
}
document.querySelector('#reload').onclick = function () { //- кнопка перезагрузки
   document.location.reload();
};