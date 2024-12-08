let port;

function getSettings() {
  return {
    group: document.getElementById("group").value,
    artifact: document.getElementById("artifact").value,
    package: document.getElementById("package").value,
    springBootVersion: document.getElementById("springBootVersion").value,
    javaVersion: document.getElementById("javaVersion").value,
    language: document.getElementById("language").value,
    project: document.getElementById("project").value,
    packaging: document.getElementById("packaging").value,
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  // Connect to the background service worker
  port = chrome.runtime.connect({ name: "popup" });

  // Request current settings
  port.postMessage({ type: "GET_SETTINGS" });

  // Listen for messages from the background script
  port.onMessage.addListener((msg) => {
    switch (msg.type) {
      case "SETTINGS_RETRIEVED":
        if (msg.settings) {
          document.getElementById("group").value = msg.settings.group;
          document.getElementById("artifact").value = msg.settings.artifact;
          document.getElementById("package").value = msg.settings.package;

          document.getElementById("springBootVersion").value =
            msg.settings.springBootVersion;
          document.getElementById("javaVersion").value =
            msg.settings.javaVersion;
          document.getElementById("language").value = msg.settings.language;
          document.getElementById("project").value = msg.settings.project;
          document.getElementById("packaging").value = msg.settings.packaging;
        }
        break;

      case "SETTINGS_SAVED":
        showStatus("Settings saved!");
        break;
    }
  });
});

// Save button only saves to storage
document.getElementById("saveButton").addEventListener("click", () => {
  const settings = getSettings();
  port.postMessage({
    type: "SAVE_SETTINGS",
    settings: settings,
  });
});

// Apply button sends settings to content script via background script
document.getElementById("applyButton").addEventListener("click", () => {
  const settings = getSettings();
  port.postMessage({
    type: "APPLY_SETTINGS",
    settings: settings,
  });
  showStatus("Settings applied!");
});

function showStatus(message) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.classList.add("visible");
  setTimeout(() => {
    status.classList.remove("visible");
  }, 2000);
}
