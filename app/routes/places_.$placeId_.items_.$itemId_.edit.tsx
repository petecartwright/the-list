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
} from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { DestroyItemDialogOrDrawer } from "~/components/DestroyItemDialogOrDrawer";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { getItem, updateItem } from "~/models/item.server";
import { getPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

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
  const user = useUser();

  const nameRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  return data.place?.id && data.item?.id ? (
    <>
      <Header user={user} />
      <div className="m-auto w-2/3 md:w-1/2 mb-5">
        <div className="mt-8 mb-6 text-center w-full font-bold text-4xl">
          Editing <span className="italic">{data.item?.name}</span> at{" "}
          <span className="underline">
            <Link to={`/places/${data.place?.id}`}>{data.place?.name}</Link>
          </span>
        </div>
        <Form method="post">
          <div className="mb-6">
            <Label htmlFor="name">Name</Label>
            <Input
              ref={nameRef}
              name="name"
              defaultValue={data.item?.name || ""}
            />
            {actionData?.errors.name ? actionData?.errors.name : null}
          </div>
          <div className="mb-8">
            <Label htmlFor="note">Note</Label>
            <Input
              ref={noteRef}
              name="note"
              defaultValue={data.item?.note || ""}
            />
            {actionData?.errors.note ? (
              <span>{actionData?.errors.note}</span>
            ) : null}
          </div>
          <div className="w-full flex flex-row justify-between">
            <Button asChild variant="outline">
              <Link to={`/places/${data.place?.id}`}>Back</Link>
            </Button>
            <div className="flex flex-row justify-end gap-5">
              <Button type="submit" variant="outline">
                Save
              </Button>
              <DestroyItemDialogOrDrawer
                itemId={data.item.id}
                placeId={data.place.id}
              />
            </div>
          </div>
        </Form>
      </div>
    </>
  ) : // TODO: show error here?
  null;
}
