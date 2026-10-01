export type ReturnEligibilityInput = {
  orderType?: string
  customRequestId?: string
  productName?: string
  sku?: string
  items?: { productName?: string; sku?: string }[]
}

const customJewelleryPattern = /custom|customiz|personaliz|engraved|engraving|bespoke|made[ -]to[ -]order/i

export const isCustomJewellery = (input: ReturnEligibilityInput) => {
  if (input.orderType === 'Custom Jewellery' || input.customRequestId) return true

  const itemText = (input.items ?? [])
    .map(item => `${item.productName ?? ''} ${item.sku ?? ''}`)
    .join(' ')
  const searchableText = `${input.productName ?? ''} ${input.sku ?? ''} ${itemText}`

  return customJewelleryPattern.test(searchableText)
}

export const isStandardReturnEligible = (input: ReturnEligibilityInput) => !isCustomJewellery(input)

export const CUSTOM_RETURN_POLICY = 'Custom jewellery is non-returnable and non-refundable.'

export const CUSTOM_ACCOUNT_RETURN_LABEL = 'Custom-made item — Return not available.'

export const CUSTOM_RETURN_ACKNOWLEDGEMENT =
  'I understand that custom-made and personalized jewellery is non-returnable and non-refundable once the quotation is accepted and payment is completed.'
