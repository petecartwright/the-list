import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useEffect, useRef } from "react";

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const name = formData.get("name");
  const notes = formData.get("notes");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "Name is required", notes: null } },
      { status: 400 }
    );
  }

  if (typeof notes !== "string" || notes.length === 0) {
    return json(
      { errors: { name: null, notes: "Notes are required" } },
      { status: 400 }
    );
  }

  const place = await createPlace({ name, notes, userId });
  return redirect(`places/${place.id}`);
};

export default function NewPlacePage() {
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors.notes) {
      notesRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name:</span>
          <input
            ref={nameRef}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            name="name"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.name ? (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData.errors.name}
          </div>
        ) : null}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Notes:</span>
          <textarea
            ref={notesRef}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            name="notes"
            aria-invalid={actionData?.errors?.notes ? true : undefined}
            aria-errormessage={
              actionData?.errors?.notes ? "notes-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.notes ? (
          <div className="pt-1 text-red-700" id="notes-error">
            {actionData.errors.notes}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
