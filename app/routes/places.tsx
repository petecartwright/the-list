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
      <h1>PLACES</h1>
      <div>
        <ol>
          {data.placeList.map((place) => {
            return (
              <li key={place.id}>
                <Link to={place.id}>{place.name}</Link>
                {place.note ? <>: {place.note} </> : null} ({place._count.items}{" "}
                items)
              </li>
            );
          })}
        </ol>
      </div>
      <div>
        <Button variant="outline" asChild>
          <Link to="new">
            <Plus /> New Place
          </Link>
        </Button>
      </div>
    </div>
  );
}
