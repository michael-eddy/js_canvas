$.fn.extend({
  zoomMe: function () {
    if (this && this.length > 0) {
      $(this).on('mouseenter', function (e) {
        enterHandler(e);
      });
      $(this).on('mousemove', function (e) {
        moveHandler(e);
      });
      $(this).on('mouseleave', function (e) {
        leaveHandler(e);
      });
      $(this).on('touchstart', function (e) {
        enterHandler(e);
      });
      $(this).on('touchmove', function (e) {
        moveHandler(e);
      });
      $(this).on('touchend', function (e) {
        leaveHandler(e);
      });
      function enterHandler(e) {
        e.target.setAttribute("zoomed", 1);
        moveHandler(e);
      }
      function moveHandler(e) {
        const rect = e.target.getBoundingClientRect();
        let offsetX = 0;
        let offsetY = 0;
        if (["touchstart", "touchmove", "touchend"].includes(e.type)) {
          e.preventDefault();
          offsetX = e.touches[0].clientX - rect.left;
          offsetY = e.touches[0].clientY - rect.top;
        }
        else {
          offsetX = e.offsetX;
          offsetY = e.offsetY;
        }
        offsetX = Math.min(Math.max(0, offsetX), rect.width);
        offsetY = Math.min(Math.max(0, offsetY), rect.height);
        e.target.style.setProperty("--x", offsetX / rect.width);
        e.target.style.setProperty("--y", offsetY / rect.height);
      }
      function leaveHandler(e) {
        e.target.removeAttribute("zoomed");
      }
    }
  }
});