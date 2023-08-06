import type { User, Place } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPlace({
  id,
  userId,
}: Pick<Place, "id"> & {
  userId: User["id"];
}) {
  return prisma.place.findFirst({
    select: { id: true, name: true, notes: true },
    where: { id, userId },
  });
}

export function getPlaceListItems({ userId }: { userId: User["id"] }) {
  return prisma.place.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPlace({
  name,
  notes,
  userId,
}: Pick<Place, "name" | "notes"> & {
  userId: User["id"];
}) {
  return prisma.place.create({
    data: {
      name,
      notes,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deletePlace({
  id,
  userId,
}: Pick<Place, "id"> & { userId: User["id"] }) {
  return prisma.place.deleteMany({
    where: { id, userId },
  });
}
