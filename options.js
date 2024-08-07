function HandleClick() {
  document.querySelector("#pause").disabled =
    !document.querySelector("#resume").checked;
  if (document.querySelector("#pause").disabled)
    document.querySelector("#pause").checked = false;
}

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    autoResume: document.querySelector("#resume").checked,
    respectPause: document.querySelector("#pause").checked,
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#resume").checked = result.autoResume || true;
    document.querySelector("#pause").checked = result.respectPause || false;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get(["autoResume", "respectPause"]);
  getting.then(setCurrentChoice, onError);
}

document.querySelector("#resume").addEventListener("click", HandleClick);

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
