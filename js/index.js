const canvas = document.querySelector(".canvas");
const statusCurrent = document.querySelector(".status__current");

function createGrid(size = 16, pen) {
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

  //and initialize pen
  pen();
}

function pen() {
  //pen works only if mouse is down
  let mouseDown = false;
  canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    //if mouse down happens in one of the pixel, the pixel must change color too
    if (e.target.nodeType === Node.ELEMENT_NODE)
      e.target.style.backgroundColor = "#000";
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
    if (mouseDown && e.target.nodeType === Node.ELEMENT_NODE) {
      e.target.style.backgroundColor = "#000";
    }
  });
}

createGrid(undefined, pen);
