import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Link, useFetcher } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/node";
import type { Place } from "@prisma/client";
import { useDebounce } from "~/utils";
import { useEffect, useState } from "react";

interface IPlaceCardProps {
  placeItem: SerializeFrom<Place>;
}

export const PlaceCard = ({ placeItem }: IPlaceCardProps) => {
  const fetcher = useFetcher();

  const [noteText, setNoteText] = useState<string>(placeItem.notes);
  const debouncedNoteText = useDebounce<string>(noteText, 500);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = String(e.target.value).trim();
    setNoteText(newNotes);
  };

  useEffect(() => {
    fetcher.submit(
      { notes: debouncedNoteText },
      { action: `/places/${placeItem.id}/edit`, method: "post" }
    );
  }, [debouncedNoteText, fetcher, placeItem.id]);

  return (
    <Card className="m-1">
      <CardHeader className="p-2 pl-10">
        <CardTitle>
          <Link to={placeItem.id}>{placeItem.name}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent className=" flex flex-col items-center p-2">
        <Textarea onChange={handleChange} defaultValue={noteText} />
      </CardContent>
    </Card>
  );
};
