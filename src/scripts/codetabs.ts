export const getActiveTab = (tabs: Element) =>
  Array.from(tabs.children).find((child) =>
    child.classList.contains("tab-active")
  );

export const getTabCode = (tab: Element) =>
  Array.from(
    tab.closest(".code-tabs").querySelector(".tabs-content").children
  ).find((child: HTMLElement) => child.dataset.tabName === tab.textContent);

export const setTabActive = (tab: Element, active: boolean) => {
  const targetTabCode = getTabCode(tab) as HTMLElement;

  if (active) {
    tab.classList.add("tab-active");
    targetTabCode.dataset.tabActive = "true";
  } else {
    tab.classList.remove("tab-active");
    targetTabCode.dataset.tabActive = "false";
  }
};

export const handleTabClick = (e: Event) => {
  const targetTab = e.target as HTMLElement;
  const tabs = targetTab.parentElement;
  const activeTab = getActiveTab(tabs);

  if (targetTab === activeTab) return;
  if (activeTab) setTabActive(activeTab, false);
  setTabActive(targetTab, true);
  window.dispatchEvent(new Event("codetab-change"));
};

const setupCodeTabs = () => {
  document
    .querySelectorAll(".code-tabs")
    .forEach((codetabs) =>
      Array.from(codetabs.querySelector(".tabs").children).forEach((tab) =>
        tab.addEventListener("click", handleTabClick)
      )
    );
};

export default setupCodeTabs;
