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
  const [noteText, setNoteText] = useState<string>(placeItem.notes);
  const [textAreaTouched, setTextAreaTouched] = useState<boolean>(false);
  const [shouldShowSavingIndicator, setShouldShowSavingIndicator] =
    useState<boolean>(false);
  const debouncedNoteText = useDebounce<string>(noteText, 500);

  const fetcher = useFetcher();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = String(e.target.value).trim();
    setNoteText(newNotes);
    setTextAreaTouched(true);
  };

  useEffect(() => {
    if (textAreaTouched && debouncedNoteText == noteText) {
      fetcher.submit(
        { notes: debouncedNoteText },
        { action: `/places/${placeItem.id}/edit`, method: "post" }
      );
      setShouldShowSavingIndicator(true);

      setTimeout(() => {
        setShouldShowSavingIndicator(false);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNoteText, placeItem.id, textAreaTouched]);

  return (
    <Card className="m-1">
      <CardHeader className="p-2 pl-10">
        <CardTitle>
          <Link to={placeItem.id}>{placeItem.name}</Link>
        </CardTitle>
        <div
          className={`transition-opacity ${
            shouldShowSavingIndicator ? "opacity-100" : "opacity-0"
          }`}
        >
          Saved!
        </div>
      </CardHeader>

      <CardContent className=" flex flex-col items-center p-2">
        <Textarea onChange={handleChange} defaultValue={noteText} />
      </CardContent>
    </Card>
  );
};
