// JavaScript for animations and interactivity

// Example: Fade in effect on page load
window.onload = function() {
    document.body.style.opacity = 0;
    let fadeEffect = setInterval(function () {
        if (!document.body.style.opacity) {
            document.body.style.opacity = 0;
        }
        if (document.body.style.opacity < 1) {
            document.body.style.opacity += 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 100);
};

// Example: Click event for a button
document.getElementById('myButton').addEventListener('click', function() {
    alert('Button Clicked!');
});
