import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { XIcon } from "lucide-react";
import ScheduleReportForm from "./schedule-report-form.jsx";

const ScheduleReportDrawer = ({ open, onOpenChange, trigger }) => {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className="max-w-md overflow-hidden overflow-y-auto">
        <DrawerHeader className="relative">
          <div>
            <DrawerTitle className="text-xl font-semibold">
              Report Settings
            </DrawerTitle>
            <DrawerDescription className="-mt-1">
              Enable or disable monthly financial report emails
            </DrawerDescription>
          </div>
          <DrawerClose className="absolute top-4 right-4">
            <XIcon className="h-5 w-5 !cursor-pointer" />
          </DrawerClose>
        </DrawerHeader>
        <ScheduleReportForm onCloseDrawer={() => onOpenChange(false)} />
      </DrawerContent>
    </Drawer>
  );
};

export default ScheduleReportDrawer;
