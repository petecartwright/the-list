import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";

import { Header } from "~/components/header";
import { Button, buttonVariants } from "~/components/ui/button";
import { getPlaceList } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const placeList = await getPlaceList({ userId });

  return json({ placeList });
};

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div>
      <Header user={user} />
      <div className="flex justify-center my-9">
        <p className="text-3xl">PLACES</p>
      </div>
      <div className="mb-10">
        <ul>
          {data.placeList.map((place) => {
            return (
              <li key={place.id}>
                {/* TODO: mx56 is not what i actually want her*/}
                <span className="flex justify-between items-center mx-56 my-4">
                  <Link to={place.id}>{place.name}</Link>
                  {place.note ? <>: {place.note} </> : null} (
                  {place._count.items} items)
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      {/* TODO: mx56 is not what i actually want her*/}
      <div className="flex justify-end mx-56">
        <Button variant="outline" asChild>
          <Link to="new">
            <Plus /> New Place
          </Link>
        </Button>
      </div>
    </div>
  );
}
