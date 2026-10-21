/**
 * @param {HTMLButtonElement} button
 */
function bindButtonEvent(button) {
  const id = button.getAttribute('aria-controls')
  const content = document.getElementById(id)
  if (!content) return

  content.addEventListener('click', (e) => {
    e.stopPropagation()
  })

  button.addEventListener('click', (e) => {
    e.stopPropagation()

    const components = getExpandedComponents()
    if (content.getAttribute('aria-hidden') === 'false') {
      collapse(id)
    } else {
      components.push(id)
      document.body.setAttribute('data-expanded', components.join(' '))
      content.setAttribute('aria-hidden', 'false')
      setButtonExpanded(id, 'true')
    }
    syncHeadDropdownHeight(content)
  })
}

/**
 * @param {string} id
 * @param {string} value
 */
function setButtonExpanded(id, value) {
  const els = document.querySelectorAll('[aria-controls="' + id + '"]')
  for (let i = 0; i < els.length; i++) {
    els[i].setAttribute('aria-expanded', value)
  }
}

function getExpandedComponents() {
  const expanded = document.body.getAttribute('data-expanded') || ''
  if (!expanded.trim()) {
    return []
  }
  return expanded.split(/\s+/)
}

function collapse(id) {
  const components = getExpandedComponents()
  const index = components.indexOf(id)
  if (index === -1) {
    return
  }
  components.splice(index, 1)
  document.body.setAttribute('data-expanded', components.join(' '))
  const content = document.getElementById(id)
  if (content) {
    content.setAttribute('aria-hidden', 'true')
  }
  setButtonExpanded(id, 'false')
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches
}

/**
 * Keep nav-links dropdowns in sync with their content height so the
 * expand/collapse transition animates precisely, like the globaltoc.
 * @param {HTMLElement} [target]
 */
function syncHeadDropdownHeight(target) {
  const dropdowns = target
    ? [target]
    : document.querySelectorAll('.head-nav-children')
  dropdowns.forEach((el) => {
    if (!el.classList.contains('head-nav-children')) {
      return
    }
    if (!isMobileViewport()) {
      el.style.maxHeight = ''
      return
    }
    if (el.getAttribute('aria-hidden') === 'false') {
      el.style.maxHeight = el.scrollHeight + 'px'
    } else {
      el.style.maxHeight = '0px'
    }
  })
}

/** @type {NodeListOf<HTMLButtonElement>} */
const menuButtons = document.querySelectorAll('.js-menu')
for (let i = 0; i < menuButtons.length; i++) {
  bindButtonEvent(menuButtons[i])
}

// On desktop, nav-links dropdowns are hover-driven: close them when the
// pointer leaves the item so a single click does not keep them pinned open.
document.querySelectorAll('.sy-head-links .link').forEach((link) => {
  link.addEventListener('mouseleave', () => {
    if (isMobileViewport()) {
      return
    }
    const button = link.querySelector('.js-menu')
    if (!button) {
      return
    }
    collapse(button.getAttribute('aria-controls'))
  })
})

document.body.addEventListener('click', () => {
  const components = getExpandedComponents()
  document.body.setAttribute('data-expanded', '')
  components.forEach((id) => {
    const content = document.getElementById(id)
    content.setAttribute('aria-hidden', 'true')
    setButtonExpanded(id, 'false')
  })
  syncHeadDropdownHeight()
})

window.addEventListener('resize', () => {
  syncHeadDropdownHeight()
})
