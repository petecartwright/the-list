import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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
      { status: 400 },
    );
  }

  // TODO: make note optional
  if (typeof note !== "string") {
    return json(
      { errors: { name: null, note: "note is required" } },
      { status: 400 },
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
      {/* // TODO: move this to a common layout component for new place and new item? */}
      <div className="m-auto w-2/3 md:w-1/2 mb-5">
        <div className="mt-8 mb-6 text-center w-full font-bold text-4xl">
          NEW PLACE
        </div>
        <Form method="post">
          <div className="mb-6">
            <Label htmlFor="name">Name</Label>
            <Input ref={nameRef} name="name" />
            {actionData?.errors.name ? actionData?.errors.name : null}
          </div>
          <div className="mb-8">
            <Label htmlFor="note">Note</Label>
            <Input ref={noteRef} name="note" />
            {actionData?.errors.note ? (
              <span>{actionData?.errors.note}</span>
            ) : null}
          </div>
          <div className="flex flex-row justify-between">
            <Button asChild variant="outline">
              <Link to={"/places"}>Back</Link>
            </Button>
            <Button variant="outline" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
