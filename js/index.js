const MIN_GRID_SIZE = 1;
const MAX_GRID_SIZE = 100;
const MODE_PEN = "pen";
const MODE_ERASER = "eraser";
const MODE_RANDOMIZE = "randomize";
const canvas = document.querySelector(".canvas");
const currentStatus = document.querySelector(".status__current");
const resizeBtn = document.querySelector("#resize");
const eraserBtn = document.querySelector("#eraser");
const pickColorBtn = document.querySelector("#pick-color");
const colorPicker = document.querySelector("#color-picker");
const randomizeColorBtn = document.querySelector("#randomize-color");
const resetBtn = document.querySelector("#reset");
//pen works only if mouse is down
let penMode = MODE_PEN;
let mouseDown = false;
let penColor = "#000000";

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  // if target node it not an element node do nothing
  if (!(e.target.nodeType === Node.ELEMENT_NODE)) {
    return;
  }
  //if mouse down happens in one of the pixel, the pixel must change color too
  if (penMode === MODE_PEN) e.target.style.backgroundColor = penColor;
  // if pen mode is eraser, it erases the color
  else if (penMode === MODE_ERASER) {
    e.target.style.backgroundColor = "transparent";
  } else if (penMode === MODE_RANDOMIZE) {
    e.target.style.backgroundColor = randomColor();
  }
});

// if mouse if up it wont work
canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;
});

//if the mouse leaves the canvas while mouse down, it should be considered mouse out, so that when mouse returns to the canvas, user must press mouse down again to use pen
// mouseleave doesn't bubble and descendent element doesnt fire the event , hence we can detect if mouse is out of canvas itself or it's descendant
canvas.addEventListener("mouseleave", (e) => {
  mouseDown = false;
});

// pen works only if mouse is down and is over a pixel
canvas.addEventListener("mouseover", (e) => {
  // is mouse is not down return
  if (!mouseDown) {
    return;
  }

  // if target is not element node return
  if (!(e.target.nodeType === Node.ELEMENT_NODE)) {
    return;
  }

  if (penMode === MODE_PEN) {
    e.target.style.backgroundColor = penColor;
  } else if (penMode === MODE_ERASER) {
    e.target.style.backgroundColor = "transparent";
  } else if (penMode === MODE_RANDOMIZE) {
    e.target.style.backgroundColor = randomColor();
  }
});

//resize feature
resizeBtn.addEventListener("click", (e) => {
  let newGridSize = prompt("Enter new grid size: ");
  // if number is NaN, or nullish dont do anything
  if (isNaN(newGridSize) || !newGridSize) {
    return;
  }

  // if number is out of range return
  if (newGridSize < MIN_GRID_SIZE || newGridSize > MAX_GRID_SIZE) {
    alert(`Grid size ${newGridSize} out of range`);
    return;
  }

  //create new grid with new size
  createGrid(newGridSize);
});

//eraser feature, toogles erasery
eraserBtn.addEventListener("click", (e) => {
  if (penMode === MODE_ERASER) {
    eraserBtn.classList.remove("btn--active");
    penMode = MODE_PEN;
    return;
  }

  eraserBtn.classList.add("btn--active");
  penMode = MODE_ERASER;

  // remove other modes
  randomizeColorBtn.classList.remove("btn--active");
});

//randomize color feature, random pixels
randomizeColorBtn.addEventListener("click", (e) => {
  if (penMode === MODE_RANDOMIZE) {
    randomizeColorBtn.classList.remove("btn--active");
    penMode = MODE_PEN;
    return;
  }

  randomizeColorBtn.classList.add("btn--active");
  penMode = MODE_RANDOMIZE;

  //remove other mode
  eraserBtn.classList.remove("btn--active");
});

//change event occours if user changes color  in the color picker and dismisses the color  picker
colorPicker.addEventListener("change", (e) => {
  let colorPicked = e.target.value;
  penColor = colorPicked;

  //change the current selected color's value in UI (#picked-color) element
  pickColorBtn.querySelector("#picked-color").style.backgroundColor =
    colorPicked;
});

resetBtn.addEventListener("click", (e) => {
  // get the first child of canvas
  const firstPixel = canvas.firstChild;

  // itterate the until the next sibbling elementh is null and erase color
  let currentPixel = firstPixel;
  while (currentPixel) {
    currentPixel.style.backgroundColor = "transparent";
    currentPixel = currentPixel.nextElementSibling;
  }
});

// initial grid default 16 * 16
createGrid(undefined);

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
  let randomColor = Math.trunc(Math.random() * 1234567890);
  return `#${randomColor.toString(16).substring(0, 6)}`;
}
