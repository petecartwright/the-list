import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPlaceListItems } from "~/models/place.server";
import { requireUserId } from "~/session.server";
// import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.llg;

  const userId = await requireUserId(request);
  const placeListItems = await getPlaceListItems({ userId });

  return json({ placeListItems });
};

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();
  // const user = useUser();

  return (
    <div>
      <h1>PLACES</h1>
      <div>
        <ol>
          {data.placeListItems.map((place) => {
            return (
              <li key={place.id}>
                <Link to={place.id}>{place.name}</Link>
                {place.note ? <>: {place.note} </> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
