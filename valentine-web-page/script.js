document.addEventListener("DOMContentLoaded", function () {
    const noButton = document.getElementById("no");
    const buttonContainer = document.getElementById("button-container");

    noButton.addEventListener("mouseover", function () {
        noButton.style.position = "absolute";

        // Get button container dimensions
        const containerRect = buttonContainer.getBoundingClientRect();
        const buttonWidth = noButton.clientWidth;
        const buttonHeight = noButton.clientHeight;

        // Generate a random position within the button container
        const maxX = containerRect.width - buttonWidth;
        const maxY = containerRect.height - buttonHeight;

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;
    });

    document.getElementById("yes").addEventListener("click", function () {
        window.location.href = "date.html";
    });
});
