import React from "react";
import { cn } from "@/lib/utils";
import PageHeader from "./page-header.jsx";

const PageLayout = ({
  children,
  className,
  title,
  subtitle,
  rightAction,
  showHeader = true,
  addMarginTop = false,
  renderPageHeader,
}) => {
  return (
    <div>
      {showHeader && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          rightAction={rightAction}
          renderPageHeader={renderPageHeader}
        />
      )}
      <div
        className={cn(
          "w-full max-w-[var(--max-width)] mx-auto pt-8",
          addMarginTop && "-mt-20",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
