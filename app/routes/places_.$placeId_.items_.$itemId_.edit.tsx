import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";

import { getItem, updateItem } from "~/models/item.server";
import { getPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";

// TODO: the only real diff here is CREATE vs UPDATE - can this be one component?

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.placeId, "no placeId in url");
  invariant(params.itemId, "no itemId in url");
  const item = await getItem({ id: params.itemId, userId });
  const place = await getPlace({ id: item?.placeId || "", userId });
  return json({ item, place });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const note = formData.get("note");

  invariant(params.placeId, "no placeId in url");
  invariant(params.itemId, "no itemId in url");

  // TODO: combine errors
  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "name is required", note: null } },
      { status: 400 },
    );
  }

  if (typeof note !== "string") {
    return json(
      { errors: { name: null, note: "note is required" } },
      { status: 400 },
    );
  }

  await updateItem({
    id: params.itemId,
    name,
    note,
    placeId: params.placeId,
    userId,
  });

  return redirect(`/places/${params.placeId}`);
};

export default function PlaceEditor() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const nameRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div>
        Editing {data.item?.name} at {data.place?.name}{" "}
      </div>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input ref={nameRef} name="name" defaultValue={data.item?.name || ""} />
        {actionData?.errors.name ? actionData?.errors.name : null}
        <label htmlFor="note">Note</label>
        <input ref={noteRef} name="note" defaultValue={data.item?.note || ""} />
        {actionData?.errors.note ? (
          <span>{actionData?.errors.note}</span>
        ) : null}
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
