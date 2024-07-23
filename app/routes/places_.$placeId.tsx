import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import invariant from "tiny-invariant";
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
    <div>
      <Header user={user} />
      <div className="flex justify-center my-9">
        <p className="text-3xl">{data.place?.name}</p>
      </div>
      <div className="mb-10">
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
                    <Form method="post" action={`items/${item.id}/destroy`}>
                      <Button variant="ghost" type="submit" size="sm">
                        <Trash2 size="10" />
                      </Button>
                    </Form>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`items/${item.id}/edit`}>
                        <Pencil size="10" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-end mx-5">
        <Button variant="outline" className="flex mx-5" asChild>
          <Link to="new_item">
            <Plus />
            Add Item
          </Link>
        </Button>
        <Button variant="outline" className="flex" asChild>
          <Link to="edit">Edit</Link>
        </Button>
      </div>
    </div>
  ) : (
    <div>didn&apos;t find a place</div>
  );
}
