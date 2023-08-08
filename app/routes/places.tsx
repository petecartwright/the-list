import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Outlet, Link } from "@remix-run/react";
import { useUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { getPlaceListItems } from "~/models/place.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const placesListItems = await getPlaceListItems({ userId });

  return json({ placesListItems });
};

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  console.log("Data", data.placesListItems);
  console.log("user", user);

  return (
    <div>
      {data.placesListItems ? (
        <ul>
          {data.placesListItems.map((placeItem) => {
            return (
              <li key={placeItem.id}>
                Place: <Link to={placeItem.id}>{placeItem.name}</Link> <br />
                Notes: <textarea disabled>{placeItem.notes}</textarea>
              </li>
            );
          })}
        </ul>
      ) : (
        <div>
          {" "}
          Didn't find any places - click <Link to="/places/new">here</Link> to
          create{" "}
        </div>
      )}

      <Outlet />
    </div>
  );
}
