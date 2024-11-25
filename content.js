// Select all relevant text elements
document.querySelectorAll('.token_unit').forEach((el) => {
  // Example hardcoded translation (replace with dynamic input later)
  const translations = { "Sam": "Sam", "closed": "zamknął", "his": "swoje", "eyes": "oczy" };
  if (translations[el.textContent.trim()]) {
      el.textContent = translations[el.textContent.trim()];
  }
});
