import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { createPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const note = formData.get("note");

  // TODO: combine errors
  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "name is required", note: null } },
      { status: 400 }
    );
  }

  // TODO: make note optional
  if (typeof note !== "string") {
    return json(
      { errors: { name: null, note: "note is required" } },
      { status: 400 }
    );
  }

  const place = await createPlace({ name, note, userId });

  return redirect(`/places/${place.id}`);
};

export default function NewPlacePage() {
  const actionData = useActionData<typeof action>();
  const user = useUser();

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
      <Header user={user} />
      <div>NEW PLACE</div>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <Input ref={nameRef} name="name" />
        {actionData?.errors.name ? actionData?.errors.name : null}
        <label htmlFor="note">Note</label>
        <Input ref={noteRef} name="note" />
        {actionData?.errors.note ? (
          <span>{actionData?.errors.note}</span>
        ) : null}
        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
}
