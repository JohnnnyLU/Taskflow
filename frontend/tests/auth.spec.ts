import { expect, test } from "@playwright/test";

test("redirects anonymous user from dashboard to login", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem("taskflow-auth");
  });

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
});
