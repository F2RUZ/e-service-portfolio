// Language Switcher - i18n.js
// Multi-language support for Euphoria Service Website

(function () {
  "use strict";

  let translations = {};
  let currentLang = "uz"; // Default language

  /**
   * Load translations from JSON file
   */
  async function loadTranslations() {
    try {
      // Try loading from root (for pro-tech folder structure)
      const response = await fetch("translations.json");
      translations = await response.json();

      // Get saved language from localStorage or use default
      const savedLang = localStorage.getItem("selectedLanguage") || "uz";
      setLanguage(savedLang);
    } catch (error) {
      console.error("Error loading translations:", error);
      console.log("Trying alternative paths...");

      // Try alternative paths
      const paths = [
        "../translations.json",
        "../../translations.json",
        "/translations.json",
        "/pro-tech/translations.json",
      ];

      for (const path of paths) {
        try {
          const response = await fetch(path);
          translations = await response.json();

          const savedLang = localStorage.getItem("selectedLanguage") || "uz";
          setLanguage(savedLang);
          console.log(`✅ Translations loaded from: ${path}`);
          return;
        } catch (err) {
          console.log(`❌ Failed to load from: ${path}`);
        }
      }

      console.error("❌ Failed to load translations from all paths!");
    }
  }

  /**
   * Set active language
   * @param {string} lang - Language code (uz/ru)
   */
  function setLanguage(lang) {
    if (!translations[lang]) {
      console.error("Language not found:", lang);
      return;
    }

    currentLang = lang;
    localStorage.setItem("selectedLanguage", lang);

    // Update HTML lang attribute
    document.documentElement.setAttribute("lang", lang);

    // Update all elements with data-i18n attribute
    updatePageTranslations();

    // Update language switcher button (show opposite language)
    updateLanguageSwitcher();
  }

  /**
   * Update all translations on the page
   */
  function updatePageTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = getNestedTranslation(key);

      if (translation) {
        // Add fade effect
        element.style.opacity = "0";

        setTimeout(() => {
          element.textContent = translation;
          element.style.opacity = "1";
        }, 100);
      }
    });
  }

  /**
   * Get nested translation value (e.g., "nav.home")
   * @param {string} key - Translation key
   * @returns {string} Translated text
   */
  function getNestedTranslation(key) {
    return key
      .split(".")
      .reduce((obj, k) => obj?.[k], translations[currentLang]);
  }

  /**
   * Update language switcher button - shows OPPOSITE language (what it will switch to)
   */
  function updateLanguageSwitcher() {
    const langBtns = document.querySelectorAll(".current-lang");
    const nextLang = currentLang === "uz" ? "RU" : "UZ";

    langBtns.forEach((btn) => {
      if (btn) {
        btn.textContent = nextLang;
      }
    });
  }

  /**
   * Toggle between languages
   */
  function toggleLanguage() {
    const newLang = currentLang === "uz" ? "ru" : "uz";
    setLanguage(newLang);
  }

  /**
   * Initialize language switcher buttons
   */
  function initLanguageSwitcher() {
    const langSwitcherBtns = document.querySelectorAll(".lang-switcher-btn");

    langSwitcherBtns.forEach((btn) => {
      if (btn) {
        // Remove existing listeners to prevent duplicates
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleLanguage();
        });
      }
    });
  }

  /**
   * Initialize on DOM ready
   */
  function init() {
    loadTranslations();
    initLanguageSwitcher();
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // For Barba.js page transitions (if using)
  if (window.barba) {
    window.barba.hooks.after(() => {
      updatePageTranslations();
      initLanguageSwitcher();
    });
  }

  // Expose functions globally for debugging (optional)
  window.i18n = {
    setLanguage,
    getCurrentLanguage: () => currentLang,
    getTranslations: () => translations,
  };
})();
