import { useState } from "react"
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";


import type { Item, Place, User } from "@prisma/client";

interface DestroyItemDialogOrDrawerProps {
  itemId: Item["id"],
  placeId: Place["id"]
}


export const DestroyItemDialogOrDrawer = ({itemId, placeId}: DestroyItemDialogOrDrawerProps) => {
  // gently borrowed from shadn docs here: https://ui.shadcn.com/docs/components/drawer#responsive-dialog

  const [open, setOpen] = useState(
    false
  )
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleDelete = async () => {
    await fetch(`/places/${placeId}/items/${itemId}/destroy`)
  }


  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"}>Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will delete this item permanently. This is not reversible.
            </DialogDescription>
          </DialogHeader>
          {/* TODO: style */}
          <Button>I'm sure, delete</Button>  
          <Button>Nevermind!!!!!!</Button>
        </DialogContent>
      </Dialog>
    )
  }
     
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={"outline"}>Delete</Button>
      </DrawerTrigger>
      <DrawerContent>
        
        <DrawerHeader className="text-left">
          <DrawerTitle>Are you sure?</DrawerTitle>
          <DrawerDescription>
          This will delete this item permanently. This is not reversible.
          </DrawerDescription>
        </DrawerHeader>
        <Button onClick={handleDelete}>Yes, I'm sure. Delete it.</Button>
        
        <DrawerClose asChild>
          <Button>Cancel</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )

}

