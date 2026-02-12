document.addEventListener('DOMContentLoaded', () => {

  const shape = document.querySelector('.abstract-shape');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    const x = (currentX / window.innerWidth - 0.5) * 10;
    const y = (currentY / window.innerHeight - 0.5) * 10;

    shape.style.transform =
      `translate(-50%, -50%) rotateX(${-y}deg) rotateY(${x}deg)`;

    requestAnimationFrame(animate);
  }

  animate();

});
