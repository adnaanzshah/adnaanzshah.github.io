const frameContainer = document.getElementById('frameContainer');
const staticBackup = document.getElementById('static-backup');

let liveIframe = null;

// Active Probe: Periodically ping /api/status with a strict 1.5s timeout
async function probeServer() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
        const res = await fetch(targetBase + '/api/status', {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            if (data.status === 'ONLINE') {
                showLiveState();
                return;
            }
        }
        showBackupState();
    } catch (err) {
        clearTimeout(timeoutId);
        showBackupState();
    }
}

function showLiveState() {
    if (!liveIframe) {
        liveIframe = document.createElement('iframe');
        liveIframe.src = targetBase + window.location.pathname + window.location.search;
        frameContainer.appendChild(liveIframe);
    }
    frameContainer.style.display = 'block';
    staticBackup.style.display = 'none';
}

function showBackupState() {
    frameContainer.style.display = 'none';
    staticBackup.style.display = 'block';
    if (liveIframe) {
        liveIframe.remove();
        liveIframe = null;
    }
}

// Run probe immediately on page load, then repeat every 3 seconds
probeServer();
setInterval(probeServer, 3000);
