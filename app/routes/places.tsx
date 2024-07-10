import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Header } from "~/components/header";
import { getPlaceList } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const placeList = await getPlaceList({ userId });

  return json({ placeList });
};

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div>
      <Header user={user} />
      <h1>PLACES</h1>
      <div>
        <ol>
          {data.placeList.map((place) => {
            return (
              <li key={place.id}>
                <Link to={place.id}>{place.name}</Link>
                {place.note ? <>: {place.note} </> : null}
              </li>
            );
          })}
        </ol>
      </div>
      <div>
        <Link to="new">New Place</Link>
      </div>
    </div>
  );
}
