import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Outlet, Link } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getPlaceListItems } from "~/models/place.server";
import { buttonVariants } from "@/components/ui/button";
import { PlaceCard } from "~/components/PlaceCard";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const placesListItems = await getPlaceListItems({ userId });

  return json({ placesListItems });
};

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {data.placesListItems ? (
        <ul>
          {data.placesListItems.map((placeItem) => {
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
