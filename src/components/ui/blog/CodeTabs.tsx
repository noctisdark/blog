import "@styles/codetabs.scss";

// WHEN NOTHING TODO: maybe ditch preact and use web components
// OR GiveUP && use preact OR just don't use this
const CodeTabs = ({ activeTab, children, ...slots }) => {
  const slotEntries = Object.entries(slots);

  return (
    <div class="code-tabs">
      <div class="tabs">
        {slotEntries.map(([name]) => (
          <>
            <span
              class={`tab tab-bordered${
                name === activeTab ? " tab-active" : ""
              }`}
            >
              {name}
            </span>
          </>
        ))}
      </div>

      <div class="tabs-content">
        {slotEntries.map(([name, content]) => (
          <div
            data-tab-name={name}
            data-tab-active={(name === activeTab).toString()}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeTabs;
