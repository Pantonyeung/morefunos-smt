export const ORDER_PAGE_CONFIG = Object.freeze({
  schemaVersion: 4,
  workspaceRatio: '25/75',
  workspaceRatios: Object.freeze(['25/75','30/70','35/65']),
  categoryColumns: 7,
  categoryRows: 2,
  searchAlwaysVisible: true,
  productCardMode: 'large',
  productCardModes: Object.freeze(['large','compact','text']),
  mergeMode: 'same-config',
  mergeModes: Object.freeze(['never','same-product','same-config']),
  quickDrinkLimit: 12,
  showQuickDrinks: true,
  clearConfirmation: true
});

export const ratioToCartPercent = ratio => ({'25/75':25,'30/70':30,'35/65':35}[ratio] || 25);
