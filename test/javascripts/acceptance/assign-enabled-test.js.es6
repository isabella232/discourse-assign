import selectKit from "helpers/select-kit-helper";
import { acceptance, updateCurrentUser } from "helpers/qunit-helpers";
import { clearCallbacks } from "select-kit/mixins/plugin-api";

acceptance("Assign mobile", {
  loggedIn: true,
  mobileView: true,
  settings: { assign_enabled: true },
  beforeEach() {
    clearCallbacks();
  }
});

QUnit.test("Footer dropdown contains button", async assert => {
  updateCurrentUser({ can_assign: true });
  const menu = selectKit(".topic-footer-mobile-dropdown");

  await visit("/t/internationalization-localization/280");
  await menu.expand();

  assert.ok(menu.rowByValue("assign").exists());
});
