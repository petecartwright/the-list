import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, Link, Outlet } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getPlaceListItems } from "~/models/place.server";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceCard } from "~/components/PlaceCard";
import { useState } from "react";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const placesListItems = await getPlaceListItems({ userId });
  placesListItems.sort((a, b) => {
    return a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1;
  });
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
      <Input
        className="w-1/4"
        name="search"
        placeholder="search"
        onChange={handleSearchChange}
      ></Input>
      {placesToDisplay ? (
        <ul className="flex flex-col items-center">
          {placesToDisplay.map((placeItem) => {
            return (
              <li className="w-4/5" key={placeItem.id}>
                <PlaceCard placeItem={placeItem} />
              </li>
            );
          })}
        </ul>
      ) : null}
      <Link to="new" className={buttonVariants({ variant: "outline" })}>
        + New Place
      </Link>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
      <Outlet />
    </div>
  );
}
