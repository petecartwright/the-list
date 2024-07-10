import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deletePlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  invariant(params.placeId, "no placeId in URL somehow");

  await deletePlace({ id: params.placeId, userId });

  return redirect("/places");
};
