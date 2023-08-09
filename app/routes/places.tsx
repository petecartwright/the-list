import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Outlet, Link } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getPlaceListItems } from "~/models/place.server";

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
                Place: <Link to={placeItem.id}>{placeItem.name}</Link> <br />
                Notes: <textarea disabled value={placeItem.notes} />
              </li>
            );
          })}
        </ul>
      ) : null}

      <Link to="new" className="block p-4 text-xl text-blue-500">
        + New Place
      </Link>
      <Outlet />
    </div>
  );
}
