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
  SelectLabel,
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
        console.log("in regular:");
        console.log("\t a.name", a.name);
        console.log("\t b.name", b.name);
        console.log(
          "\t a.name.toLowerCase() < b.name.toLowerCase()",
          a.name.toLowerCase() < b.name.toLowerCase()
        );
        console.log(
          "\t a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;",
          a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
        );
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      });

    case "alphabetical-reverse":
      return placesList.toSorted((a, b) => {
        console.log("in reverse:");
        console.log("\t a.name", a.name);
        console.log("\t b.name", b.name);
        console.log(
          "\t a.name.toLowerCase() > b.name.toLowerCase()",
          a.name.toLowerCase() > b.name.toLowerCase()
        );
        console.log(
          "\t a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1;",
          a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1
        );
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

  // const [sortMethod, setSortMethod] =
  //   useState<PlacesSortMethod>(DEFAULT_SORT_METHOD);
  const [sortedPlaces, setSortedPlaces] = useState(data.placeList);

  const handleSortChange = (sortMethod: PlacesSortMethod) => {
    const sortedPlaces = placesSort({
      // TODO: I don't like this ignore - i know the types here are fine but the difference is the JsonifyObject that remix generates
      // @ts-ignore
      placesList: data.placeList,
      sortMethod: sortMethod,
    });

    console.log("about to set sortedPlaces to ", sortedPlaces);
    // @ts-ignore
    setSortedPlaces(sortedPlaces);
  };

  return (
    <div>
      <Header user={user} />
      <div className="flex justify-center my-9">
        <p className="text-3xl">PLACES</p>
      </div>
      <div className="mb-10">
        <div className="m-auto w-2/3 md:w-1/2 mb-5 flex flex-row items-baseline gap-5 justify-end">
          <Label htmlFor="sort-select">Sort by...</Label>
          {/* // TODO: why is this so slow to populate?? */}

          <Select
            // TODO: I don't like this ignore - how do i tell TS that the select item value will be a PlacesSortMethod?*/}
            name="sort-select"
            // @ts-ignore
            onValueChange={handleSortChange}
            defaultValue={DEFAULT_SORT_METHOD}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by...</SelectLabel>
                <SelectItem value="alphabetical">A-Z</SelectItem>
                <SelectItem value="alphabetical-reverse">Z-A</SelectItem>
                <SelectItem value="first-visited">First Visited</SelectItem>
                <SelectItem value="recently-visited">
                  Most Recently Visited
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ul>
          {sortedPlaces.map((place) => {
            console.log("rendering, place is ", place);
            return (
              <li key={place.id}>
                <Link to={place.id}>
                  <Card className="m-auto w-2/3 md:w-1/2 mb-5">
                    <CardHeader className="pb-3">
                      <CardTitle>
                        <Link to={place.id}>{place.name}</Link>
                      </CardTitle>
                      <CardDescription>
                        <span>{place.note ? <>: {place.note} </> : null}</span>
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
