// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "APPLY_SETTINGS" && message.settings) {
    try {
      setFormValues(message.settings);
      sendResponse({ success: true });
    } catch (error) {
      console.error("Error applying settings:", error);
      sendResponse({ success: false, error: error.message });
    }
  }
  // Must return true if response is sent asynchronously
  return true;
});

function setFormValues(settings) {
  const language = settings.language;
  const project = settings.project;
  const packaging = settings.packaging;
  const javaVersion = settings.javaVersion;
  const springBootVersion = settings.springBootVersion;

  const controlDivs = document.querySelectorAll(".control");
  controlDivs.forEach((div) => {
    let label = div.querySelector("label");

    if (label && label.textContent.trim() === "Language") {
      // Found the correct "Language" label, now find the language anchor
      let languageText;
      if (language === "java") {
        languageText = "Java";
      } else if (language === "kotlin") {
        languageText = "Kotlin";
      } else if (language === "groovy") {
        languageText = "Groovy";
      }

      if (languageText) {
        // Find the anchor tag with the correct language text
        const languageElements = div.querySelectorAll("a.radio .radio-content");
        languageElements.forEach((element) => {
          if (element.textContent.trim() === languageText) {
            element.parentElement.click(); // Click the parent <a> element
          }
        });
      }
    }

    if (label && label.textContent.trim() === "Spring Boot") {
      const springBootVersionElements = div.querySelectorAll(
        "a.radio .radio-content"
      );
      springBootVersionElements.forEach((element) => {
        if (element.textContent.trim() === springBootVersion) {
          element.parentElement.click(); // Click the parent <a> element
        }
      });
    }

    if (label && label.textContent.trim() === "Project") {
      // Found the correct "Project" label, now find the language anchor
      let projectText;

      if (project === "Gradle - Groovy") {
        projectText = "Gradle - Groovy";
      } else if (project === "Gradle - Kotlin") {
        projectText = "Gradle - Kotlin";
      } else if (project === "Maven") {
        projectText = "Maven";
      }

      if (projectText) {
        const languageElements = div.querySelectorAll("a.radio .radio-content");
        languageElements.forEach((element) => {
          if (element.textContent.trim() === projectText) {
            element.parentElement.click(); // Click the parent <a> element
          }
        });
      }
    }
    if (label && label?.textContent.trim() === "Packaging") {
      let packagingText;

      if (packaging === "Jar") {
        packagingText = "Jar";
      } else if (packaging === "War") {
        packagingText = "War";
      }

      if (packagingText) {
        // Find the anchor tag with the correct language text
        const languageElements = div.querySelectorAll("a.radio .radio-content");
        languageElements.forEach((element) => {
          if (element.textContent.trim() === packagingText) {
            element.parentElement.click();
          }
        });
      }
    }

    if (label && label.textContent.trim() === "Java") {
      if (javaVersion) {
        // Find the anchor tag with the correct language text
        const javaVersionElements = div.querySelectorAll(
          "a.radio .radio-content"
        );
        javaVersionElements.forEach((element) => {
          if (element.textContent.trim() === javaVersion) {
            element.parentElement.click(); // Click the parent <a> element
          }
        });
      }
    }
  });

  const groupElement = document.getElementById("input-group");
  if (groupElement && settings.group.trim() !== "") {
    groupElement.value = settings.group;
    groupElement.dispatchEvent(new Event("input", { bubbles: true }));
  }
  // Set the Artifact ID
  const artifactElement = document.getElementById("input-artifact");
  if (artifactElement && settings.artifact.trim() !== "") {
    artifactElement.value = settings.artifact;
    artifactElement.dispatchEvent(new Event("input", { bubbles: true }));
  }

  const nameElement = document.getElementById("input-name");
  if (nameElement && settings.artifact.trim() !== "") {
    nameElement.value = settings.artifact;
    nameElement.dispatchEvent(new Event("input", { bubbles: true }));
  }

  const packageNameElement = document.getElementById("input-packageName");
  if (packageNameElement && settings.package?.trim() !== "") {
    packageNameElement.click();
    packageNameElement.value = settings.package;
  }
}
