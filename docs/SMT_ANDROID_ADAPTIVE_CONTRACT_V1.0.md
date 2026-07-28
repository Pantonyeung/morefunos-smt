# SMT Android Adaptive Contract V1.0

Status: LOCK CANDIDATE
Scope: SMT Web Runtime inside Android POS host
Baseline: Sunmi T2S 1280×800 landscape

## 1. Source authority

This contract adapts the following Android official guidance for the SMT Web Runtime:

- Android Adaptive Apps: https://developer.android.com/develop/adaptive-apps
- Window size classes: https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes
- Adaptive do's and don'ts: https://developer.android.com/develop/adaptive-apps/guides/adaptive-dos-and-donts
- Support different display sizes: https://developer.android.com/develop/adaptive-apps/guides/support-different-display-sizes
- Canonical layouts: https://developer.android.com/develop/adaptive-apps/guides/canonical-layouts

Android guidance is the external design authority. MoreFun business rules, locked POS workflows, and the 1920 visual master remain internal product authority.

## 2. Core rule

SMT adapts to the current application window, not to a device model, tablet flag, physical screen name, or hardcoded POS brand.

The runtime must keep three decisions separate:

1. Window size class: high-level pane and navigation decisions.
2. SMT responsive profile: locked visual density for the five accepted POS viewports.
3. Component geometry: calculated from the component's actual available area.

No layer may replace the other two.

## 3. Window size classes

### Width

| Class | Available width |
|---|---:|
| compact | < 600 |
| medium | 600–839 |
| expanded | 840–1199 |
| large | 1200–1599 |
| extra-large | ≥ 1600 |

### Height

| Class | Available height |
|---|---:|
| compact | < 480 |
| medium | 480–899 |
| expanded | ≥ 900 |

The Web Runtime uses layout viewport CSS pixels as its window units. The Android host must expose the real usable app window and must not fake a fixed device resolution when multi-window or system insets reduce the viewport.

## 4. Accepted SMT viewport mapping

| Viewport | SMT density profile | Width class | Height class |
|---|---|---|---|
| 1920×1080 | large | extra-large | expanded |
| 1600×900 | standard | extra-large | expanded |
| 1440×900 | standard | large | expanded |
| 1366×768 | standard | large | medium |
| 1280×800 | compact | large | medium |

All five accepted POS viewports are eligible for the SMT two-pane order layout because width is at least expanded and height is not compact.

## 5. Layout decisions

- Order products + cart use a supporting-pane pattern.
- Product area is the primary pane.
- Cart, pending actions, and contextual controls are the supporting pane.
- Pane proportion is decided by SMT business and ergonomic rules, not by stretching both panes equally.
- 1280×800 remains a first-class target, not a scaled-down 1920 canvas.
- 1920×1080 remains the visual master and must not be visually changed by adaptive compatibility work.
- Dialogs and overlays must remain reachable inside the current app window.
- Component row height, card height, and visible density are derived from actual available component area.

## 6. Prohibited patterns

- Device-name or isTablet branching.
- Reading physical display size instead of the current app window.
- One global scale transform as the primary layout system.
- Fixed canvas assumptions that create clipped or unreachable controls.
- Independent breakpoint logic scattered across pages.
- Per-resolution CSS patches that bypass the shared adaptive contract.
- Stretching buttons, cards, or text lines merely to fill wider windows.

## 7. Runtime contract

`shared/responsive.js` is the single authority for:

- `getWindowSizeClass(width, height)`
- `getResponsiveProfile(width, height)`
- width and height class constants
- root/body adaptive data attributes

Required document attributes:

- `data-responsive-profile`
- `data-viewport-width`
- `data-viewport-height`
- `data-window-width-class`
- `data-window-height-class`
- `data-two-pane-eligible`

Parent shell and active child page must expose the same window class state.

## 8. QA gate

Minimum acceptance evidence:

1. All five accepted viewports return the locked profile and correct window classes.
2. Parent shell and order iframe expose identical adaptive attributes.
3. 1920 baseline boots without runtime errors.
4. Responsive visual contract passes all five viewports.
5. Proportional layout contract passes all five viewports.
6. Full Playwright matrix passes on the PR head SHA.

A targeted PASS does not equal final integration PASS.

## 9. Android host follow-up

The APK host should use current Android window metrics and system inset information when native controls or kiosk chrome affect the WebView area. Business UI layout remains owned by the shared Web Runtime contract; the native host must not create a second set of SMT breakpoint rules.
