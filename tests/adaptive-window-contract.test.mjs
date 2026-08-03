import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ADAPTIVE_LAYOUT_MODES,
  getAdaptiveLayoutMode,
  getResponsiveProfile
} from '../shared/responsive.js';

const matrix = [
  { width: 1920, height: 1080, expected: ADAPTIVE_LAYOUT_MODES.EXPANDED },
  { width: 1366, height: 768, expected: ADAPTIVE_LAYOUT_MODES.WIDE },
  { width: 1280, height: 800, expected: ADAPTIVE_LAYOUT_MODES.WIDE },
  { width: 1024, height: 768, expected: ADAPTIVE_LAYOUT_MODES.MEDIUM },
  { width: 768, height: 1024, expected: ADAPTIVE_LAYOUT_MODES.MEDIUM },
  { width: 430, height: 932, expected: ADAPTIVE_LAYOUT_MODES.COMPACT },
  { width: 390, height: 844, expected: ADAPTIVE_LAYOUT_MODES.COMPACT }
];

test('adaptive layout mode is derived from usable viewport, not named devices', () => {
  for (const item of matrix) {
    assert.equal(
      getAdaptiveLayoutMode(item.width, item.height),
      item.expected,
      `${item.width}x${item.height}`
    );
  }
});

test('responsive profile exposes one canonical layoutMode contract', () => {
  for (const item of matrix) {
    const profile = getResponsiveProfile(item.width, item.height);
    assert.equal(profile.layoutMode, item.expected);
    assert.equal(profile.width, item.width);
    assert.equal(profile.height, item.height);
    assert.equal(profile.orientation, item.width >= item.height ? 'landscape' : 'portrait');
  }
});

test('same viewport width keeps the same layout mode across orientation changes', () => {
  assert.equal(getAdaptiveLayoutMode(768, 1024), ADAPTIVE_LAYOUT_MODES.MEDIUM);
  assert.equal(getAdaptiveLayoutMode(1024, 768), ADAPTIVE_LAYOUT_MODES.MEDIUM);
});
