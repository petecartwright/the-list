import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPlaceWithItems } from "~/models/place.server";
import { requireUserId } from "~/session.server";

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
                <Form method="post" action={`items/${item.id}/destroy`}>
                  <button>DELETE</button>
                </Form>
                <Link to={`items/${item.id}/edit`}>Edit</Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <Link to="new_item">Add Item</Link>
      </div>
      <div>
        <Link to="edit">Edit</Link>
      </div>
      <div>
        <Form action="destroy" method="post">
          <button type="submit">DELETE</button>
        </Form>
      </div>
    </div>
  ) : (
    <div>didn&apos;t find a place</div>
  );
}
