const searchBoxStyle = `
:host > div .results .hit h2 {
  color: var(--sy-c-heading);
  margin-bottom: 0;
  border-bottom: 0;
  font-weight: 600;
}
:host > div .results .hit .hit-block .content {
  color: var(--sy-c-text);
}
:host > div .results .hit-block a.hit:hover, :host > div .results .hit-block .hit.active {
  background-color: var(--gray-5);
  border-radius: 4px;
}

:host > div div.hit-block a.hit-block-heading:hover {
  text-decoration: underline;
}

:host > div div.hit-block a.hit-block-heading i,
:host > div div.hit-block .hit-block-heading-container .close-icon {
  color: var(--sy-c-light);
  margin-bottom: 0;
  display: flex;
}
`

function renderVersions(config) {
  if (!config.versions || !config.versions.active || !config.versions.active.length) {
    return
  }

  const container = document.querySelector(".nav-versions")
  if (!container) return

  const list = container.querySelector(".nav-versions-choices ul")
  if (!list) return

  let versions = config.versions.active.slice()
  if (
    config.versions.current &&
    !versions.some((version) => version.slug === config.versions.current.slug)
  ) {
    versions = [config.versions.current].concat(versions)
  }

  list.innerHTML = versions
    .map(
      (version) => `
        <li${version.slug === config.versions.current.slug ? ' class="rtd-current-item"' : ""}>
          <a href="${version.urls.documentation}">${version.slug}</a>
        </li>`,
    )
    .join("")
}

function renderLanguages(config) {
  if (
    !config.projects ||
    !config.projects.translations ||
    !config.projects.translations.length
  ) {
    return
  }

  const container = document.querySelector(".nav-languages")
  if (!container) return

  let languages = config.projects.translations.concat(config.projects.current)
  languages = languages.sort((a, b) =>
    a.language.name.localeCompare(b.language.name),
  )

  const list = container.querySelector(".nav-languages-choices ul")
  if (!list) return

  list.innerHTML = languages
    .map(
      (language) => `
        <li${language.slug === config.projects.current.slug ? ' class="rtd-current-item"' : ""}>
          <a href="${language.urls.documentation}">${language.language.name}</a>
        </li>`,
    )
    .join("")
}

document.addEventListener("readthedocs-addons-data-ready", function (event) {
  const config = event.detail && event.detail.data ? event.detail.data() : {}

  const searchInput = document.querySelector(".searchbox input")
  if (searchInput) {
    searchInput.addEventListener("focusin", () => {
      const event = new CustomEvent("readthedocs-search-show")
      document.dispatchEvent(event)
    })
  }
  setTimeout(() => {
    const rtdSearchElement = document.querySelector("readthedocs-search")
    if (rtdSearchElement) {
      const style = document.createElement('style')
      style.textContent = searchBoxStyle
      rtdSearchElement.shadowRoot.appendChild(style)
    }
  }, 1000)

  renderVersions(config)
  renderLanguages(config)
});
