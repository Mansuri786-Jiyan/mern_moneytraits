import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import TransactionForm from "./transaction-form.jsx";
const AddTransactionDrawer = () => {
  const [open, setOpen] = useState(false);
  const onCloseDrawer = () => {
    setOpen(false);
  };
  return _jsxs(Drawer, {
    direction: "right",
    open: open,
    onOpenChange: setOpen,
    children: [
      _jsx(DrawerTrigger, {
        asChild: true,
        children: _jsxs(Button, {
          className: "!cursor-pointer !text-white",
          children: [
            _jsx(PlusIcon, { className: "h-4 w-4" }),
            "Add Transaction",
          ],
        }),
      }),
      _jsxs(DrawerContent, {
        className: "max-w-md overflow-hidden overflow-y-auto",
        children: [
          _jsxs(DrawerHeader, {
            className: "relative",
            children: [
              _jsxs("div", {
                children: [
                  _jsx(DrawerTitle, {
                    className: "text-xl font-semibold",
                    children: "Add Transaction",
                  }),
                  _jsx(DrawerDescription, {
                    children: "Add a new transaction to track your finances",
                  }),
                ],
              }),
              _jsx(DrawerClose, {
                className: "absolute top-4 right-4",
                children: _jsx(XIcon, { className: "h-5 w-5 !cursor-pointer" }),
              }),
            ],
          }),
          _jsx(TransactionForm, { onCloseDrawer: onCloseDrawer }),
        ],
      }),
    ],
  });
};
export default AddTransactionDrawer;
