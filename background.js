chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    switch (msg.type) {
      case "APPLY_SETTINGS":
        try {
          const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          const activeTab = tabs[0];

          if (!activeTab) {
            console.error("No active tab found");
            port.postMessage({ type: "ERROR", message: "No active tab found" });
            return;
          }

          chrome.tabs.sendMessage(
            activeTab.id,
            {
              type: "APPLY_SETTINGS",
              settings: msg.settings,
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError);
                port.postMessage({
                  type: "ERROR",
                  message: "Failed to apply settings. Please refresh the page.",
                });
              } else {
                port.postMessage({ type: "SETTINGS_APPLIED" });
              }
            }
          );
        } catch (error) {
          console.error("Error in background script:", error);
          port.postMessage({
            type: "ERROR",
            message: "Error applying settings: " + error.message,
          });
        }
        break;

      case "SAVE_SETTINGS":
        try {
          await chrome.storage.sync.set({ settings: msg.settings });
          port.postMessage({ type: "SETTINGS_SAVED" });
        } catch (error) {
          console.error("Error saving settings:", error);
          port.postMessage({
            type: "ERROR",
            message: "Error saving settings: " + error.message,
          });
        }
        break;

      case "GET_SETTINGS":
        try {
          const data = await chrome.storage.sync.get("settings");
          port.postMessage({
            type: "SETTINGS_RETRIEVED",
            settings: data.settings,
          });
        } catch (error) {
          console.error("Error retrieving settings:", error);
          port.postMessage({
            type: "ERROR",
            message: "Error retrieving settings: " + error.message,
          });
        }
        break;
    }
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "apply-settings") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const data = await chrome.storage.sync.get("settings");
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "APPLY_SETTINGS",
        settings: data.settings,
      });
    });
  }
});
