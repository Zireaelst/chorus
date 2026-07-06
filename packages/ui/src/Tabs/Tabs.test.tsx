import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, afterEach } from "vitest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

describe("Tabs", () => {
  const renderTabs = () => {
    return render(
      <Tabs defaultValue="tab1">
        <TabsList aria-label="Test Tabs">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );
  };

  afterEach(() => {
    cleanup();
  });

  it("renders correctly with default tab active", () => {
    renderTabs();

    const tabList = screen.getByRole("tablist", { name: "Test Tabs" });
    expect(tabList).toBeInTheDocument();

    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });

    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("aria-selected", "false");

    const panel1 = screen.getByRole("tabpanel", { name: "Tab 1" });
    expect(panel1).toBeVisible();
    expect(panel1).toHaveTextContent("Content 1");
  });

  it("switches tabs on click", async () => {
    const user = userEvent.setup();
    renderTabs();

    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    await user.click(tab2);

    expect(tab2).toHaveAttribute("aria-selected", "true");

    const panel2 = screen.getByRole("tabpanel", { name: "Tab 2" });
    expect(panel2).toBeVisible();
    expect(panel2).toHaveTextContent("Content 2");

    // Tab 1 content should no longer be visible
    expect(screen.queryByRole("tabpanel", { name: "Tab 1" })).not.toBeInTheDocument();
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    renderTabs();

    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();
    expect(tab1).toHaveFocus();

    // Navigate right to Tab 2
    await user.keyboard("{ArrowRight}");
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    expect(tab2).toHaveFocus();
    
    // In Radix, tabs automatically activate on focus by default
    expect(tab2).toHaveAttribute("aria-selected", "true");
    const panel2 = screen.getByRole("tabpanel", { name: "Tab 2" });
    expect(panel2).toBeVisible();

    // Navigate right to Tab 3
    await user.keyboard("{ArrowRight}");
    const tab3 = screen.getByRole("tab", { name: "Tab 3" });
    expect(tab3).toHaveFocus();
    expect(tab3).toHaveAttribute("aria-selected", "true");

    // Navigate left back to Tab 2
    await user.keyboard("{ArrowLeft}");
    expect(tab2).toHaveFocus();
    expect(tab2).toHaveAttribute("aria-selected", "true");
  });
});
