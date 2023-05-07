/* TODO: SEPERATE RESPONSABILITY */
/* Maybe optimize function signatures */

const getArticle = () => document.querySelector("main > article");

const getArticleHeadings = () =>
  Array.from(
    getArticle().querySelectorAll("h2, h3, h4")
  ) as HTMLHeadingElement[];

const glowTransition = (heading: HTMLHeadingElement) => {
  if (heading.classList.contains("glow-animation")) return;

  const onAnimationEnd = () => {
    heading.classList.remove("glow-animation");
    heading.removeEventListener("animationend", onAnimationEnd);
  };

  heading.addEventListener("animationend", onAnimationEnd);
  heading.classList.add("glow-animation");
};

const scrollToHeading = (heading: HTMLHeadingElement) => {
  window.scrollTo(0, heading.offsetTop);
};

export const createSectionAreas = (
  headings: HTMLHeadingElement[],
  {
    container = null,
  }: {
    container?: HTMLDivElement;
  } = {}
) => {
  const areas = [];

  if (!container) {
    container = document.createElement("div");
    container.classList.add("section-areas", "not-prose");
  }

  for (let i = 0; i < headings.length; i++) {
    const currentHeading = headings[i],
      nextHeading = headings[i + 1];

    const area = document.createElement("div");
    area.classList.add("area");

    area.style.top = currentHeading.offsetTop + "px";
    if (nextHeading)
      area.style.height =
        nextHeading.offsetTop - currentHeading.offsetTop + "px";
    else area.style.bottom = "0";

    area.dataset.heading = currentHeading.id;

    container.appendChild(area);
    areas.push(area);
  }

  return { container, areas };
};

type HeadingEntry = {
  name: string;
  id: string;
  children: HeadingEntry[];
};

const headingIsLower = (
  a: HTMLHeadingElement,
  b: HTMLHeadingElement
): boolean => a.tagName < b.tagName;

export const createHeadingsTree = (headings: HTMLHeadingElement[]) => {
  let index = 0;
  let depthStack = [];
  let result: HeadingEntry[] = [];

  while (index < headings.length) {
    const heading = headings[index];
    const lastLowestEntry = depthStack.at(-1);
    const node = {
      name: heading.textContent,
      id: heading.id,
      children: [],
    };

    if (!lastLowestEntry) {
      depthStack.push({ node, heading });
      result.push(node);
      index += 1;
    } else {
      if (headingIsLower(lastLowestEntry.heading, heading)) {
        depthStack.push({ heading, node });
        lastLowestEntry.node.children.push(node);
        index += 1;
      } else {
        depthStack.pop();
      }
    }
  }

  return result;
};

const buildlistDOM = (
  headingEntries: HeadingEntry[],
  parentEntry: HeadingEntry = null,
  type: "ul" | "ol" = "ul"
) => {
  const listDOM = document.createElement(type);
  const itemsDOM: HTMLLIElement[] = [];

  for (const headingEntry of headingEntries) {
    const itemDOM = document.createElement("li");
    const linkDOM = document.createElement("span");
    linkDOM.innerText = headingEntry.name;
    linkDOM.role = "link";

    linkDOM.addEventListener("click", () => {
      const heading = document.getElementById(
        headingEntry.id
      ) as HTMLHeadingElement;
      scrollToHeading(heading);
      glowTransition(heading);
    });

    itemDOM.appendChild(linkDOM);
    itemDOM.dataset.heading = headingEntry.id;
    if (parentEntry) itemDOM.dataset.parentHeading = parentEntry.id;
    itemsDOM.push(itemDOM);

    if (headingEntry.children.length) {
      const { listDOM: childListDOM, itemsDOM: childItemsDOM } = buildlistDOM(
        headingEntry.children,
        headingEntry
      );

      itemDOM.appendChild(childListDOM);
      itemsDOM.push(...childItemsDOM);
    }

    listDOM.appendChild(itemDOM);
  }

  return { listDOM, itemsDOM };
};

const createVisiblityIndicator = () => {
  const visibilityIndicator = document.createElement("div");
  visibilityIndicator.classList.add("visibility-indicator");

  const setIndicatorRange = (
    indicatorStartItem: HTMLElement,
    indicatorEndItem: HTMLElement
  ) => {
    if (!indicatorStartItem || !indicatorEndItem) {
      visibilityIndicator.style.top = "0.8em";
      visibilityIndicator.style.height = "100%";
    } else {
      visibilityIndicator.style.top = indicatorStartItem.offsetTop + "px";
      visibilityIndicator.style.height =
        indicatorEndItem.offsetTop - indicatorStartItem.offsetTop + 16 + "px";
    }
  };

  return { visibilityIndicator, setIndicatorRange };
};

export const createNavigationSection = (headings: HTMLHeadingElement[]) => {
  const navigationSection = document.getElementById("floatingnav-root");
  const nav = navigationSection.querySelector("nav");
  const button = navigationSection.querySelector("button");
  const headingsTree = createHeadingsTree(headings);
  const { listDOM, itemsDOM } = buildlistDOM(headingsTree);
  nav.appendChild(listDOM);
  navigationSection.appendChild(nav);

  const { visibilityIndicator, setIndicatorRange } = createVisiblityIndicator();
  nav.appendChild(visibilityIndicator);

  const itemsHash: {
    [key: string]: { item: HTMLLIElement; index: number };
  } = {};

  for (let i = 0; i < itemsDOM.length; i++) {
    const item = itemsDOM[i];

    itemsHash[item.dataset.heading] = {
      item,
      index: i,
    };
  }

  const collapseAllTrees = () => {
    for (const itemDOM of itemsDOM) itemDOM.classList.remove("item-visible");
  };

  const setTreeVisible = (heading: string) => {
    const { item } = itemsHash[heading];
    item.classList.add("item-visible");
    if (item.dataset.parentHeading) setTreeVisible(item.dataset.parentHeading);
  };

  return {
    navigationSection,
    nav,
    button,
    itemsDOM,
    itemsHash,
    collapseAllTrees,
    setTreeVisible,
    visibilityIndicator,
    setIndicatorRange,
  };
};

let headingsIntersectionObserver;

const observeSections = (
  areas: HTMLDivElement[],
  onVisibilityChange: (visibleAreas: Set<string>) => void
) => {
  const options = {
    rootMargin: "-50px",
    threshold: 0,
  };

  const visibleAreas = new Set<string>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target as HTMLElement,
        headingId = target.dataset.heading;

      if (entry.isIntersecting) visibleAreas.add(headingId);
      else visibleAreas.delete(headingId);
    }

    onVisibilityChange(visibleAreas);
  }, options);

  for (const area of areas) observer.observe(area);
  return observer;
};

const computeNavigation = (
  article = getArticle(),
  headings: HTMLHeadingElement[],
  headingItemsHash: { [key: string]: { item: HTMLLIElement; index: number } },
  { collapseAllTrees, setTreeVisible, setIndicatorRange }
) => {
  let oldAreasSection = article.querySelector("article > .section-areas");
  if (headingsIntersectionObserver) headingsIntersectionObserver.disconnect();

  const { container: areasSection, areas } = createSectionAreas(headings);
  let indicatorStartIndex: number, indicatorEndIndex: number;
  let indicatorStartItem: HTMLElement, indicatorEndItem: HTMLElement;

  headingsIntersectionObserver = observeSections(areas, (visibleHeadings) => {
    collapseAllTrees();

    indicatorStartIndex = Infinity;
    indicatorEndIndex = -Infinity;

    for (const visibleHeading of visibleHeadings) {
      setTreeVisible(visibleHeading);
      const { item, index } = headingItemsHash[visibleHeading];

      if (index < indicatorStartIndex) {
        indicatorStartIndex = index;
        indicatorStartItem = item;
      }

      if (index > indicatorEndIndex) {
        indicatorEndIndex = index;
        indicatorEndItem = item;
      }
    }

    setIndicatorRange(indicatorStartItem, indicatorEndItem);
  });

  if (oldAreasSection) oldAreasSection.remove();
  article.appendChild(areasSection);
};

export const createFloatingNavigation = () => {
  const article = getArticle();
  if (!article) return;

  const headings = getArticleHeadings();
  const {
    button,
    nav,
    navigationSection,
    itemsHash,
    collapseAllTrees,
    setTreeVisible,
    setIndicatorRange,
  } = createNavigationSection(headings);

  const resizeObserver = new ResizeObserver(() => {
    computeNavigation(article, headings, itemsHash, {
      collapseAllTrees,
      setTreeVisible,
      setIndicatorRange,
    });
  });

  button.addEventListener("click", () => {
    const currentDisplay = nav.style.getPropertyValue("display"),
      nextDisplay = currentDisplay === "block" ? "none" : "block";

    nav.style.display = nextDisplay;
    if (nextDisplay === "block") {
      computeNavigation(article, headings, itemsHash, {
        collapseAllTrees,
        setTreeVisible,
        setIndicatorRange,
      });
    }
  });

  resizeObserver.observe(article);
  article.appendChild(navigationSection);
};
