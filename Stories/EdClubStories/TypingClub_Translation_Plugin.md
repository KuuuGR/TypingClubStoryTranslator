# TypingClub Plugin Documentation and Issues

### Plugin Overview

The plugin for Firefox and Chrome is designed to enable users to extract, translate, and upload lesson text from stories on [TypingClub](https://www.edclub.com/sportal/). It simplifies the process of interacting with lesson text by fetching content dynamically and allowing users to input their translations.

---

### Current Status

- The plugin **successfully extracts the story text** from TypingClub lesson pages.
- **However, uploading translations** currently encounters problems:
    - The website’s scripts overwrite the uploaded text after each word, reverting it back to the original text.
    - As a result, the translated text disappears once you begin typing, causing improper interaction with the original language content.

---
### Temporary Solution

- **Workaround**:
    - Start the lesson.
    - Type a single letter in the TypingClub interface.
    - Copy and paste the text into a platform like [Monkeytype](https://monkeytype.com/).
    - Use the **Custom → Change** feature in Monkeytype to manage the text.

---

### Instructions for Installation and Use

#### Firefox

1. Open `about:debugging` in Firefox.
2. Select **This Firefox** or **Load Temporary Add-ons**.
3. Click **Load Temporary Add-on** and select the `manifest.json` file from the plugin directory.
4. Navigate to the TypingClub lesson page.
5. Click the plugin icon in the toolbar to open the interface.
6. Use the plugin buttons to fetch or upload translations.

#### Chrome

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer Mode** (top-right corner).
3. Click **Load Unpacked** and select the folder containing the plugin's `manifest.json`.
4. Navigate to the TypingClub lesson page.
5. Open the plugin from the toolbar and use the provided options.

---

### Note on Translations

- Translations were generated using **ChatGPT** and **Bielik.ai**, with review and validation by a native Polish teacher.
- Users are encouraged to compare translations and suggest improvements by opening an issue or contributing directly.

---

### Known Issues

1. **Text Overwriting**:
    - TypingClub’s internal script actively reverts any uploaded text after spaces.
2. **Dynamic Content Handling**:
    - Text extraction depends on dynamically loaded elements, which may occasionally fail if the page structure changes.

---

### Next Steps

1. **Debugging Uploads**:
    - Investigate DOM mutations or JavaScript listeners causing the original text overwrite.
    - Use `MutationObserver` or hook into TypingClub’s script to suppress overwriting behaviors.
2. **Improve Content Script**:
    - Enhance resilience of the `content.js` script to accommodate future website changes.
3. **User Feedback**:
    - Gather insights from users about other potential issues with translations or plugin behavior.

---
