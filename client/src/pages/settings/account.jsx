import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./_components/account-form.jsx";
const Account = () => {
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        children: [
          _jsx("h3", { className: "text-lg font-medium", children: "Account" }),
          _jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Update your account settings.",
          }),
        ],
      }),
      _jsx(Separator, {}),
      _jsx(AccountForm, {}),
    ],
  });
};
export default Account;
