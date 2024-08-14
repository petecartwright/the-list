import type { Item, Place, User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getItem({
  id,
  userId,
}: Pick<Item, "id"> & { userId: User["id"] }) {
  return prisma.item.findFirst({
    where: { id, userId },
  });
}

export function createItem({
  name,
  note,
  userId,
  placeId,
}: Pick<Item, "name" | "note"> & { userId: User["id"] } & {
  placeId: Place["id"];
}) {
  return prisma.item.create({
    data: {
      name,
      note,
      place: {
        connect: {
          id: placeId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteItem({
  id,
  placeId,
  userId,
}: Pick<Item, "id" | "placeId"> & { userId: User["id"] }) {
  return prisma.item.deleteMany({
    where: { id, placeId, userId },
  });
}

export function updateItem({
  id,
  name,
  note,
  placeId, // overkill? idk
  userId,
}: Pick<Item, "id" | "name" | "note"> & {
  userId: User["id"];
} & {
  placeId: Place["id"];
}) {
  return prisma.item.update({
    where: { id, userId, placeId },
    data: {
      name,
      note,
    },
  });
}
