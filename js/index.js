const MIN_GRID_SIZE = 1;
const MAX_GRID_SIZE = 100;
const MODE_PEN = "pen";
const MODE_ERASER = "eraser";
const canvas = document.querySelector(".canvas");
const statusCurrent = document.querySelector(".status__current");
const resizeBtn = document.querySelector("#resize");
const eraserBtn = document.querySelector("#eraser");
const colorPickerBtn = document.querySelector("#color-picker");
const pickedColor = document.querySelector("#picked-color");

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
  }
});

//resize feature
resizeBtn.addEventListener("click", (e) => {
  let size = prompt("Enter new grid size: ");
  // if number is NaN, or nullish dont do anything
  if (isNaN(size) || !size) {
    return;
  }

  // if number is out of range return
  if (size < MIN_GRID_SIZE || size > MAX_GRID_SIZE) {
    alert(`Grid size ${size} out of range`);
    return;
  }

  //create new grid with new size
  createGrid(size);
});

//eraser feature, toogles erasery
eraserBtn.addEventListener("click", (e) => {
  if (penMode === MODE_PEN) {
    eraserBtn.classList.add("btn--active");
    penMode = MODE_ERASER;
  } else if (penMode === MODE_ERASER) {
    eraserBtn.classList.remove("btn--active");
    penMode = MODE_PEN;
  }
});

//change event occours if user changes color  in the color picker and dismisses the color  picker
pickedColor.addEventListener("change", (e) => {
  let pickedColorValue = e.target.value;
  penColor = pickedColorValue;

  //change the current selected color's value
  colorPickerBtn.querySelector("#picked-color__sample").style.backgroundColor =
    pickedColorValue;
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
  statusCurrent.querySelector(
    ".status__value"
  ).innerHTML = `${size} &Cross; ${size}`;
}
