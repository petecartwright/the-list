// import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, redirect, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

import { createItem } from "~/models/item.server";
import { getPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";

// TODO: loader to show place name
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.placeId, "No place ID found");
  const place = await getPlace({ id: params.placeId, userId });
  return json({ place });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const note = formData.get("note");

  invariant(params.placeId, "no placeId in url");

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

  await createItem({
    name,
    note,
    userId,
    placeId: params.placeId,
  });

  return redirect(`/places/${params.placeId}`);
};

export default function NewPlacePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors.note) {
      noteRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <h1>{data.place?.name}</h1>
      <div>NEW ITEM</div>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input ref={nameRef} name="name" />
        {actionData?.errors.name ? actionData?.errors.name : null}
        <label htmlFor="note">Note</label>
        <input ref={noteRef} name="note" />
        {actionData?.errors.note ? (
          <span>{actionData?.errors.note}</span>
        ) : null}
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
