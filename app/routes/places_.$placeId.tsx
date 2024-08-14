import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import invariant from "tiny-invariant";
import { DestroyItemDialogOrDrawer } from "~/components/DestroyItemDialogOrDrawer";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";

import { getPlaceWithItems } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.placeId, "No place ID found");
  const place = await getPlaceWithItems({ id: params.placeId, userId });
  return json({ place });
};

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return data.place ? (
    <>
      <Header user={user} />
      <div className="m-auto w-2/3 md:w-1/2">
        <div className="flex justify-center my-9 font-bold text-4xl">
          <span className="underline">{data.place?.name}</span>
        </div>
        <div className="mb-10">
          {data.place.items.length === 0 && (
            <div className="w-full text-center">
              Nothing here yet.. let's add some items!
            </div>
          )}
          <ul>
            {data.place.items.map((item) => {
              return (
                <li key={item.id}>
                  <div className="flex justify-between items-center mx-5 my-4">
                    <p>
                      <span className="font-semibold">{item.name}</span>:{" "}
                      {item.note}
                    </p>
                    <div className="flex">
                      <Form
                        method="post"
                        preventScrollReset={true}
                        action={`items/${item.id}/destroy`}
                      >
                        <DestroyItemDialogOrDrawer
                          itemId={item.id}
                          placeId={item.placeId}
                        />
                      </Form>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`items/${item.id}/edit`}>
                          <Pencil size="18" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-row justify-between">
          <Button asChild variant="outline">
            <Link to={"/places"}>Back</Link>
          </Button>
          <div className="flex flex-row gap-4">
            <Button variant="outline" asChild>
              <Link to="new_item">
                <Plus />
                Add Item
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="edit">Edit</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div>didn&apos;t find a place</div>
  );
}
