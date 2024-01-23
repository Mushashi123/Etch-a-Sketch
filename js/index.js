const canvas = document.querySelector(".canvas");
const statusCurrent = document.querySelector(".status__current");

function createGrid(size = 16) {
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

createGrid();
