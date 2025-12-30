const video = document.querySelector('video');

if (video) {
  video.addEventListener('ended', () => {
    video.pause();
  });
}