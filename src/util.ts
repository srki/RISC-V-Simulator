export function toggleFullScreen() {
    let documentBody = document.body;

    if (!this.isFullScreen) {
        // @ts-ignoreç
        if (documentBody.requestFullScreen) {
            // @ts-ignoreç
            documentBody.requestFullScreen();
        } else if (documentBody.webkitRequestFullscreen) {
            documentBody.webkitRequestFullscreen();
            // @ts-ignoreç
        } else if (documentBody.mozRequestFullScreen) {
            // @ts-ignoreç
            documentBody.mozRequestFullScreen();
            // @ts-ignoreç
        } else if (documentBody.msRequestFullscreen) {
            // @ts-ignoreç
            documentBody.msRequestFullscreen();
        }
        this.isFullScreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            // @ts-ignoreç
        } else if (document.msExitFullscreen) {
            // @ts-ignoreç
            document.msExitFullscreen();
            // @ts-ignoreç
        } else if (document.mozCancelFullScreen) {
            // @ts-ignorec
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        this.isFullScreen = false;
    }
}