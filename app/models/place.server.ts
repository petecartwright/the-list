import type { Place, User } from "@prisma/client";

import { prisma } from "../db.server";

export function getPlace({
  id,
  userId,
}: Pick<Place, "id"> & {
  userId: User["id"];
}) {
  return prisma.place.findFirst({
    select: { id: true, name: true, note: true },
    where: { id, userId },
  });
}

export function getPlaceWithItems({
  id,
  userId,
}: Pick<Place, "id"> & {
  userId: User["id"];
}) {
  return prisma.place.findFirst({
    where: { id, userId },
    include: { items: true },
  });
}

export function getPlaceList({ userId }: { userId: User["id"] }) {
  return prisma.place.findMany({
    select: { id: true, name: true, note: true },
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPlace({
  name,
  note,
  userId,
}: Pick<Place, "name" | "note"> & {
  userId: User["id"];
}) {
  return prisma.place.create({
    data: {
      name,
      note,
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

export function updatePlace({
  id,
  name,
  note,
  userId,
}: Pick<Place, "id" | "name" | "note"> & {
  userId: User["id"];
}) {
  return prisma.place.update({
    where: { id, userId },
    data: {
      name,
      note,
    },
  });
}
