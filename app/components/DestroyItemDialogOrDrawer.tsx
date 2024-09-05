import { useEffect, useState } from "react";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

import type { Item, Place, User } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { Trash2 } from "lucide-react";

interface DestroyItemDialogOrDrawerProps {
  itemId: Item["id"];
  placeId: Place["id"];
}

export const DestroyItemDialogOrDrawer = ({
  itemId,
  placeId,
}: DestroyItemDialogOrDrawerProps) => {
  // gently borrowed from shadn docs here: https://ui.shadcn.com/docs/components/drawer#responsive-dialog

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();

  // make sure the dialog only gets rendered on the client side
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const handleDelete = async () => {
    // TODO: error handling?
    await fetch(`/places/${placeId}/items/${itemId}/destroy`, {
      method: "post",
    });
    navigate(`/places/${placeId}`);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <Trash2 size="18" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will delete this item permanently. This is not reversible.
            </DialogDescription>
          </DialogHeader>
          <Button variant="destructive" onClick={handleDelete}>
            I'm sure, delete
          </Button>
          <DrawerClose asChild>
            <Button>Cancel. Don't delete anything.</Button>
          </DrawerClose>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <Trash2 size="18" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure?</DrawerTitle>
          <DrawerDescription>
            This will delete this item permanently. <br />
            This is not reversible.
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto w-2/3 flex flex-col">
          <Button variant="destructive" className="mb-5" onClick={handleDelete}>
            Yes, I'm sure. Delete it.
          </Button>

          <DrawerClose asChild className="mb-10">
            <Button>Cancel. Don't delete anything.</Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
