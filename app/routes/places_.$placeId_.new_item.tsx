// import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { createItem } from "~/models/item.server";
import { getPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

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

  const userWantsToCreateAnother = formData.get("submitAndCreateAnother");

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

  const item = await createItem({
    name,
    note,
    userId,
    placeId: params.placeId,
  });

  if (userWantsToCreateAnother) {
    return redirect(`/places/${params.placeId}/new_item?created=${item.id}`);
  }

  return redirect(`/places/${params.placeId}`);
};

export default function NewPlacePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const user = useUser();
  const location = useLocation();

  const nameRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // to support "Submit and Create Another"
    // if we were redirected here by this form, the URL will have a "created" search param
    // if that exists, clear the form, since it won't be on redirect to the same base URL
    if (formRef.current && location.search.includes("created")) {
      formRef.current.reset();
    }
    // TODO: would be nice to pop a "saved!" toast here too
  }, [location.search]);

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
      <div className="m-auto w-2/3 md:w-1/2 mb-5">
        <div className="mt-8 mb-6 text-center w-full font-bold text-4xl">
          <span className="italic">New Item</span> at{" "}
          <span className="underline">
            <Link to={`/places/${data.place?.id}`}>{data.place?.name}</Link>
          </span>
        </div>

        <Form method="post" ref={formRef}>
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

          <div className="w-full flex flex-row justify-between">
            <Button asChild variant="outline">
              <Link to={`/places/${data.place?.id}`}>Back</Link>
            </Button>
            <div className="w-full flex flex-row justify-end gap-4">
              <Button
                name="submitAndCreateAnother"
                type="submit"
                value="yes"
                variant="outline"
              >
                Save and Create Another
              </Button>
              <Button variant="outline" type="submit">
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
