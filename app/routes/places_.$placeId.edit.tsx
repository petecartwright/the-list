import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { updatePlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const notes = formData.get("notes")?.toString() || "";

  invariant(params.placeId, "Place id not found");

  await updatePlace({ id: params.placeId, notes: notes, userId });

  return redirect(`/places`);
};
