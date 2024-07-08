import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPlaceWithItems } from "~/models/place.server";
import { requireUserId } from "~/session.server";

// import { useUser } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.placeId, "No place ID found");
  const place = await getPlaceWithItems({ id: params.placeId, userId });
  return json({ place });
};

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();

  return data.place ? (
    <div>
      <h1>{data.place?.name}</h1>
      <div>
        <ul>
          {data.place.items.map((item) => {
            return (
              <li key={item.id}>
                {item.name} - {item.note}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : (
    <div>didn&apost find a place</div>
  );
}
