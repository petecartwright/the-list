export const MatchedItemsAtPlace = ({
  places,
}: { places: string[] }): JSX.Element => {
  return <span className="text-xs ml-auto">{places.join(", ")}</span>;
};
