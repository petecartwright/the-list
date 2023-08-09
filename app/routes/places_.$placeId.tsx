import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePlace, getPlace, updatePlace } from "~/models/place.server";
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
  const formData = await request.formData();

  invariant(params.placeId, "Place id not found");

  console.log("in action! params is", params);
  console.log("in action! formData.intent is", formData.get("intent"));
  const intent = formData.get("intent");
  if (intent === "delete") {
    await deletePlace({ id: params.placeId, userId });

    return redirect("/places");
  }
  if (intent === "save") {
    const formNotes = formData.get("notes")?.toString() || "";

    await updatePlace({ id: params.placeId, notes: formNotes, userId });

    return redirect(`/places`);
  }
};

export default function PlacesDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <Form method="post">
        <hr className="my-4" />
        <h3>{data.place.name}</h3>
        <textarea
          className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          name="notes"
          defaultValue={data.place.notes}
        />
        <hr className="my-4" />
        <button
          type="submit"
          name="intent"
          value="save"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save Changes
        </button>
        <button
          type="submit"
          name="intent"
          value="delete"
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}
