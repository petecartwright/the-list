import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Outlet, Link } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getPlaceListItems } from "~/models/place.server";
import { buttonVariants } from "@/components/ui/button";
import { PlaceCard } from "~/components/PlaceCard";
import { useState } from "react";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const placesListItems = await getPlaceListItems({ userId });

  return json({ placesListItems });
};

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();

  const [placesToDisplay, setPlacesToDisplay] = useState(data.placesListItems);

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    const searchText = e.currentTarget.value.toLowerCase();

    const filteredPlaces = data.placesListItems.filter((item) => {
      // return the item if the name or description matches
      return (
        item.name.toLowerCase().includes(searchText) ||
        item.notes.toLowerCase().includes(searchText)
      );
    });
    setPlacesToDisplay(filteredPlaces);
  };

  return (
    <div>
      <input
        name="search"
        placeholder="search"
        onChange={handleSearchChange}
      ></input>
      {placesToDisplay ? (
        <ul>
          {placesToDisplay.map((placeItem) => {
            return (
              <li key={placeItem.id}>
                <PlaceCard placeItem={placeItem} />
              </li>
            );
          })}
        </ul>
      ) : null}

      <Link to="new" className={buttonVariants({ variant: "outline" })}>
        + New Place
      </Link>
      <Outlet />
    </div>
  );
}
