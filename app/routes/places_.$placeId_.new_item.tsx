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
  console.log("params :", params);
  console.log("request :", request);
  console.log("...formData.entries() :", ...formData.entries());

  invariant(params.placeId, "no placeId in url");

  // TODO: combine errors
  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "name is required", note: null } },
      { status: 400 }
    );
  }

  if (typeof note !== "string") {
    return json(
      { errors: { name: null, note: "note is required" } },
      { status: 400 }
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
      console.log("resetting form");
      formRef.current.reset();
    }
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
      <h1>
        <Link to={`/places/${data.place?.id}`}>{data.place?.name}</Link>
      </h1>
      <div>NEW ITEM</div>
      <Form method="post" ref={formRef}>
        <Label htmlFor="name">Name</Label>
        <Input ref={nameRef} name="name" />
        {actionData?.errors.name ? actionData?.errors.name : null}
        <Label htmlFor="note">Note</Label>
        <Input ref={noteRef} name="note" />
        {actionData?.errors.note ? (
          <span>{actionData?.errors.note}</span>
        ) : null}
        <Button
          variant="outline"
          name="submitAndCreateAnother"
          value="yes"
          type="submit"
        >
          Submit and Create Another
        </Button>
        <Button variant="outline" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}
