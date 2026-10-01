import type { KeyboardEvent, MouseEvent } from 'react'

const interactiveSelector = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[data-row-interactive="true"]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="link"]',
  '[role="menuitem"]'
].join(',')

const isInteractiveDescendant = (target: EventTarget | null, currentTarget: EventTarget & HTMLElement) => {
  if (!(target instanceof Element)) return false

  const interactiveElement = target.closest(interactiveSelector)

  return interactiveElement !== null && interactiveElement !== currentTarget
}

export const handleClickableRow = (event: MouseEvent<HTMLElement>, openDetails: () => void) => {
  if (!isInteractiveDescendant(event.target, event.currentTarget)) openDetails()
}

export const handleClickableRowKeyDown = (event: KeyboardEvent<HTMLElement>, openDetails: () => void) => {
  if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return

  event.preventDefault()
  openDetails()
}
