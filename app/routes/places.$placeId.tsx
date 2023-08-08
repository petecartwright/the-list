import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePlace, getPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.placeId, "placeId not found");

  const place = await getPlace({ userId, id: params.placeId });

  if (!place) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ place });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.placeId, "Place id not found");

  await deletePlace({ id: params.placeId, userId });

  return redirect("/places");
};

export default function PlacesDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <hr className="my-4" />
      <h3>{data.place.name}</h3>
      <p>{data.place.notes}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}
