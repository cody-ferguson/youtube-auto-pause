browser.runtime.onStartup.addListener(() => {
  browser.storage.local.clear();
});

browser.tabs.onActivated.addListener(async (activeInfo) => {
  await browser.scripting.executeScript({
    target: {
      tabId: activeInfo.tabId,
    },
    files: ["browser-polyfill.js"],
  });

  await browser.scripting.executeScript({
    target: {
      tabId: activeInfo.tabId,
    },

    args: [activeInfo.tabId],

    func: (tabId) => {
      let video = document.querySelector("video");
      browser.storage.sync
        .get(["autoResume", "respectPause"])
        .then(({ autoResume, respectPause }) => {
          if (!respectPause && autoResume) {
            video.play();
            return;
          }
          browser.storage.local.get(`tab${tabId}`).then(
            (items) => {
              console.log(items);

              if (!items[`tab${tabId}`]) {
                video.play();
              }
            },
            (err) => {
              console.error(err);
            }
          );
        });
    },
  });

  let tabs = await browser.tabs.query({ active: false });

  for (let tab of tabs) {
    await browser.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      files: ["browser-polyfill.js"],
    });

    await browser.scripting.executeScript({
      target: {
        tabId: tab.id,
      },

      args: [tab.id],

      func: (tabId) => {
        let video = document.querySelector("video");
        browser.storage.sync.get(["respectPause"]).then(({ respectPause }) => {
          if (respectPause) {
            if (video.paused) {
              browser.storage.local
                .set({ [`tab${tabId}`]: true })
                .then(() => {})
                .catch((err) => {
                  console.error(err);
                });
            } else {
              browser.storage.local
                .set({ [`tab${tabId}`]: false })
                .then(() => {})
                .catch((err) => {
                  console.error(err);
                });
            }
          }
        });
        video.pause();
      },
    });
  }
});
