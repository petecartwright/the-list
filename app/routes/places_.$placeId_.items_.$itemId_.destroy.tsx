import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteItem } from "~/models/item.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  invariant(params.placeId, "no placeId in URL somehow");
  invariant(params.itemId, "no itemId in URL somehow");

  await deleteItem({ id: params.itemId, placeId: params.placeId, userId });

  return redirect(`/places/${params.placeId}`);
};
