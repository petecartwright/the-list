import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/node";
import type { Place } from "@prisma/client";

interface IPlaceCardProps {
  placeItem: SerializeFrom<Place>;
}

export const PlaceCard = ({ placeItem }: IPlaceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link to={placeItem.id}>{placeItem.name}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Textarea disabled value={placeItem.notes} />
      </CardContent>
    </Card>
  );
};
