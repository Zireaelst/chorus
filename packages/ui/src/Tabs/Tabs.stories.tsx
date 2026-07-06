import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="p-4 bg-surface rounded-base mt-2 border border-border-hairline">
          <h3 className="text-lg font-medium text-text-primary">Account</h3>
          <p className="text-sm text-text-secondary">Make changes to your account here.</p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="p-4 bg-surface rounded-base mt-2 border border-border-hairline">
          <h3 className="text-lg font-medium text-text-primary">Password</h3>
          <p className="text-sm text-text-secondary">Change your password here.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-4 bg-surface rounded-base mt-2 border border-border-hairline">Overview Content</div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="p-4 bg-surface rounded-base mt-2 border border-border-hairline">Analytics Content</div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="p-4 bg-surface rounded-base mt-2 border border-border-hairline">Reports Content</div>
      </TabsContent>
    </Tabs>
  ),
};
