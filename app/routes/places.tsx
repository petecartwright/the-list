import type { Place } from "@prisma/client";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Header } from "~/components/header";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getPlaceList } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const placeList = await getPlaceList({ userId });

  return json({ placeList });
};

type PlacesSortMethod =
  | "alphabetical"
  | "alphabetical-reverse"
  | "first-visited"
  | "recently-visited";

const placesSort = ({
  placesList,
  sortMethod,
}: {
  placesList: Place[];
  sortMethod: PlacesSortMethod;
}): Place[] => {
  switch (sortMethod) {
    case "alphabetical":
      return placesList.toSorted((a, b) => {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      });

    case "alphabetical-reverse":
      return placesList.toSorted((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1;
      });
    case "first-visited":
      return placesList.toSorted((a, b) =>
        a.createdAt < b.createdAt ? -1 : 1
      );
    case "recently-visited":
      return placesList.toSorted((a, b) =>
        a.createdAt > b.createdAt ? -1 : 1
      );
  }
};

export default function PlacesPage() {
  const user = useUser();
  const data = useLoaderData<typeof loader>();

  // TODO: put the sort status in the URL?

  const DEFAULT_SORT_METHOD: PlacesSortMethod = "recently-visited";

  const [sortedPlaces, setSortedPlaces] = useState(data.placeList);

  const handleSortChange = (sortMethod: PlacesSortMethod) => {
    const sortedPlaces = placesSort({
      // TODO: I don't like this ignore - i know the types here are fine but the difference is the JsonifyObject that remix generates
      // @ts-ignore
      placesList: data.placeList,
      sortMethod: sortMethod,
    });

    // @ts-ignore
    setSortedPlaces(sortedPlaces);
  };

  return (
    <div>
      <Header user={user} />
      <div className="flex justify-center my-9">
        <p className="text-4xl font-bold">PLACES</p>
      </div>
      <div className="mb-10">
        <div className="m-auto w-2/3 md:w-1/2 mb-5 flex flex-row justify-between">
          <Button variant="outline" asChild>
            <Link to="new">
              <Plus /> New Place
            </Link>
          </Button>

          <Select
            onValueChange={handleSortChange}
            defaultValue={DEFAULT_SORT_METHOD}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="alphabetical">
                  <span className="text-xs">A-Z</span>
                </SelectItem>
                <SelectItem value="alphabetical-reverse">
                  <span className="text-xs">Z-A</span>
                </SelectItem>
                <SelectItem value="first-visited">
                  <span className="text-xs">First Visited</span>
                </SelectItem>
                <SelectItem value="recently-visited">
                  <span className="text-xs">Most Recently Visited</span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ul>
          {sortedPlaces.map((place) => {
            return (
              <li key={place.id}>
                <Link to={place.id}>
                  <Card className="m-auto w-2/3 md:w-1/2 mb-5">
                    <CardHeader className="pb-3">
                      <CardTitle>
                        <Link to={place.id}>{place.name}</Link>
                      </CardTitle>
                      <CardDescription>
                        <span>{place.note ? <> {place.note} </> : null}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-between">
                      <span className="text-xs">
                        Last visited:{" "}
                        {new Date(place.updatedAt).toLocaleDateString()}{" "}
                      </span>
                      <span className="text-xs">
                        {`${place._count.items} item${
                          place._count.items === 1 ? "" : "s"
                        } `}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="h-8" />
    </div>
  );
}
