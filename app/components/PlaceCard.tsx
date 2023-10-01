import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Link, useFetcher } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/node";
import type { Place } from "@prisma/client";

interface IPlaceCardProps {
  placeItem: SerializeFrom<Place>;
}

export const PlaceCard = ({ placeItem }: IPlaceCardProps) => {
  const fetcher = useFetcher();

  return (
    <Card className="m-1">
      <CardHeader className="p-2 pl-10">
        <CardTitle>
          <Link to={placeItem.id}>{placeItem.name}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent className=" flex flex-col items-center p-2">
        <Textarea
          onBlur={(e) => {
            const newNotes = String(e.target.value).trim();
            // how do we handle this if we want to change it *back* to the `placeItem.notes` on first render?
            // will it rerender??
            if (newNotes !== placeItem.notes.trim()) {
              console.log("newNotes isn't old notes");
              fetcher.submit(
                { notes: newNotes },
                { action: `/places/${placeItem.id}/edit`, method: "post" }
              );
            }
          }}
          defaultValue={placeItem.notes}
        />
      </CardContent>
    </Card>
  );
};
