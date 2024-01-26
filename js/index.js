// || Constants
const MIN_GRID_SIZE = 1;
const MAX_GRID_SIZE = 100;
const MODE_PEN = "pen";
const MODE_ERASER = "eraser";
const MODE_RANDOMIZE = "randomize";
const MODE_DARKEN = "darken";
const COLORED_PIXEL = "colored";

// || DOM element selection for DOM manipulation
const canvas = document.querySelector(".canvas");
const currentStatus = document.querySelector(".status__current");
const resizeBtn = document.querySelector("#resize");
const eraserBtn = document.querySelector("#eraser");
const pickColorBtn = document.querySelector("#pick-color");
const colorPicker = document.querySelector("#color-picker");
const randomizeColorBtn = document.querySelector("#randomize-color");
const resetBtn = document.querySelector("#reset");
const darkenEffectBtn = document.querySelector("#darken-effect");

// || Main logic

// variables that stores states, change in this varibles causes effect in behaviour of the application
let penMode = MODE_PEN;
let mouseDown = false;
let penColor = "#000000";

canvas.addEventListener("mousedown", mouseIsDown);

// if mouse button is released, pen won't work
canvas.addEventListener("mouseup", mouseReleased);

//if the mouse leaves the canvas while mouse button is down, it should be considered mouse releaased, so that when mouse returns to the canvas, user must press mousebutton down again to use pen functionality
// mouseleave doesn't bubble up and descendent element doesn't fire the leave event , hence we can detect if mouse is out of canvas itself or it's descendant
canvas.addEventListener("mouseleave", mouseReleased);

// pen works only if mouse button is down and enters over a pixel's body
canvas.addEventListener("mouseover", pen);

//resize feature
resizeBtn.addEventListener("click", resizeGird);

//eraser feature, toogles erasery
eraserBtn.addEventListener("click", eraser);

//randomize color feature, random pixels
randomizeColorBtn.addEventListener("click", randomizeColor);

darkenEffectBtn.addEventListener("click", (e) => {
  if (penMode === MODE_DARKEN) {
    darkenEffectBtn.classList.remove("btn--active");
    penMode = MODE_PEN;
    return;
  }
  //change the pen mode to darken
  penMode = MODE_DARKEN;

  darkenEffectBtn.classList.add("btn--active");

  //remove other active buttons
  eraserBtn.classList.remove("btn--active");
  randomizeColorBtn.classList.remove("btn--active");
});

//change event occours if user changes color  in the color picker and dismisses the color  picker
colorPicker.addEventListener("change", changePenColor);

resetBtn.addEventListener("click", resetPixels);

// initial grid creation (16 * 16)
createGrid(undefined);

// || function declarations
// no function expressions or arrow functions are used cause they are not hoisted

function mouseIsDown(e) {
  mouseDown = true;

  // if target node it not an element node do nothing
  if (e.target.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  //if mouse down happens in one of the pixel, the pixel must get effected based on pen's mode
  // if pixel is already colored , it wont be colored
  if (e.target.dataset.pixelColored !== COLORED_PIXEL && penMode === MODE_PEN) {
    e.target.style.backgroundColor = penColor;
    e.target.dataset.pixelColored = COLORED_PIXEL;
  } else if (penMode === MODE_ERASER) {
    e.target.style.backgroundColor = "transparent";
    e.target.dataset.pixelColored = null;
  } else if (
    e.target.dataset.pixelColored !== COLORED_PIXEL &&
    penMode === MODE_RANDOMIZE
  ) {
    e.target.style.backgroundColor = randomColor();
    e.target.dataset.pixelColored = COLORED_PIXEL;
  } else if (
    e.target.dataset.pixelColored === COLORED_PIXEL &&
    penMode === MODE_DARKEN
  ) {
    // if first time darken effect, dont reduce it's brighntness
    if (!e.target.style.filter) {
      e.target.style.filter = `brightness(1)`;
      return;
    }

    //after second time
    //extract darknes value
    let currentDarkness = e.target.style.filter.substring(
      e.target.style.filter.indexOf("(") + 1,
      e.target.style.filter.indexOf(")")
    );

    //turn it to number type
    currentDarkness = +currentDarkness;

    // if current darkness is 0 i.e black dont reduce
    if (!currentDarkness) {
      return;
    }

    //from second time start deducingit by 0.1
    currentDarkness -= 0.1;

    e.target.style.filter = `brightness(${currentDarkness})`;
  }
}

function mouseReleased(e) {
  mouseDown = false;
}

function pen(e) {
  // if mouse button is not pressed, pen won't work
  if (!mouseDown) {
    return;
  }

  // if target is not element node return
  if (e.target.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  //based upon pen mode, alter the pixels
  // if pixel is colored it wont be colored
  if (e.target.dataset.pixelColored !== COLORED_PIXEL && penMode === MODE_PEN) {
    e.target.style.backgroundColor = penColor;
    e.target.dataset.pixelColored = COLORED_PIXEL;
  } else if (penMode === MODE_ERASER) {
    e.target.style.backgroundColor = "transparent";
    e.target.dataset.pixelColored = null;
  } else if (
    e.target.dataset.pixelColored !== COLORED_PIXEL &&
    penMode === MODE_RANDOMIZE
  ) {
    e.target.style.backgroundColor = randomColor();
    e.target.dataset.pixelColored = COLORED_PIXEL;
  } else if (
    e.target.dataset.pixelColored === COLORED_PIXEL &&
    penMode === MODE_DARKEN
  ) {
    // if first time darken effect, dont reduce it's brighntness
    if (!e.target.style.filter) {
      e.target.style.filter = `brightness(1)`;
      return;
    }

    //after second time
    //extract darknes value
    let currentDarkness = e.target.style.filter.substring(
      e.target.style.filter.indexOf("(") + 1,
      e.target.style.filter.indexOf(")")
    );

    //turn it to number type
    currentDarkness = +currentDarkness;

    // if current darkness is 0 i.e black dont reduce
    if (!currentDarkness) {
      return;
    }

    //from second time start deducingit by 0.1
    currentDarkness -= 0.1;

    e.target.style.filter = `brightness(${currentDarkness})`;
  }
}

function eraser(e) {
  if (penMode === MODE_ERASER) {
    eraserBtn.classList.remove("btn--active");
    penMode = MODE_PEN;
    return;
  }

  eraserBtn.classList.add("btn--active");
  penMode = MODE_ERASER;

  // remove other active buttons
  randomizeColorBtn.classList.remove("btn--active");
  darkenEffectBtn.classList.remove("btn--active");
}

function randomizeColor(e) {
  if (penMode === MODE_RANDOMIZE) {
    randomizeColorBtn.classList.remove("btn--active");
    penMode = MODE_PEN;
    return;
  }

  randomizeColorBtn.classList.add("btn--active");
  penMode = MODE_RANDOMIZE;

  //remove other active buttons
  eraserBtn.classList.remove("btn--active");
  darkenEffectBtn.classList.remove("btn--active");
}

function changePenColor(e) {
  let colorPicked = e.target.value;
  penColor = colorPicked;

  //change the current selected color's value in UI (#picked-color) element
  pickColorBtn.querySelector("#picked-color").style.backgroundColor =
    colorPicked;

  //when user changes color, it means user wants to use pen , so remove any active modes and change mode to pen
  eraserBtn.classList.remove("btn--active");
  randomizeColorBtn.classList.remove("btn--active");
  darkenEffectBtn.classList.remove("btn--active");
  penMode = MODE_PEN;
}

function resetPixels(e) {
  // get the first child of canvas
  const firstPixel = canvas.firstChild;

  // itterate each pixel and erase color, until next sibbling element is null
  let currentPixel = firstPixel;
  while (currentPixel) {
    currentPixel.style.backgroundColor = "transparent";
    currentPixel = currentPixel.nextElementSibling;
  }
}

function resizeGird(e) {
  let newGridSize = prompt("Enter new grid size: ");

  // if newGridSize is NaN, or nullish value don't do anything
  if (isNaN(newGridSize) || !newGridSize) {
    return;
  }

  // if number is out of range return error and don't do anything
  if (newGridSize < MIN_GRID_SIZE || newGridSize > MAX_GRID_SIZE) {
    alert(`Grid size ${newGridSize} out of range`);
    return;
  }

  //create new grid with new size, if everything fine
  createGrid(newGridSize);
}

function createGrid(size = 16) {
  //before creating grid make sure canvas is empty
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }

  //create size  * size number of square pixels
  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    // the width and height of pixel is calculated by dividing the total size of it's parent to each number of pixel eqally, which creates perfect sized pixel without overflowing container
    pixel.style.height = pixel.style.width = `calc(100% / ${size})`;
    canvas.appendChild(pixel);
  }

  //once grid is created , update the UI with the current size of the grid
  //innerHTML is used instead of textContent cause, we want entity code to be parsed as HTML
  currentStatus.querySelector(
    ".status__value"
  ).innerHTML = `${size} &Cross; ${size}`;
}

function randomColor() {
  let red = Math.trunc(Math.random() * 256);
  let green = Math.trunc(Math.random() * 256);
  let blue = Math.trunc(Math.random() * 256);

  return `rgb(${red},${green},${blue})`;
}
