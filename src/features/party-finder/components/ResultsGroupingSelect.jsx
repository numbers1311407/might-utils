import { useMemo, useRef } from "react";
import { Select } from "@mantine/core";
import { useDraftState } from "@/core/hooks";
import { useTagGroupsStore } from "@/model/store";
import { usePartyFinderStore } from "../store";

export const ResultsGroupingSelect = () => {
  const value = usePartyFinderStore((store) => store.options?.groupBy || "");
  const setOption = usePartyFinderStore((store) => store.setOption);
  const groups = useTagGroupsStore((store) => store.registry);
  const ref = useRef();

  const { data, searchValue } = useMemo(() => {
    const data = [
      { label: "None", value: "" },
      ...Object.values(groups)
        .filter((group) => group.active)
        .map((group) => ({
          label: group.name,
          value: `tag:${group.id}`,
        })),
    ];
    const searchValue = data.find((o) => o.value === value)?.label || "";
    return { data, searchValue };
  }, [groups, value]);

  // NOTE the search value predefinition here is a little strange since in
  // other select this hasn't been necessary, but without it, the component
  // will re-render with a flash of showing the placeholder before showing
  // the "None" option text. It makes sense that it would happen but I haven't
  // troubleshot  why other selects don't require this. Perhaps because the
  // options are defined in this function isntead of a separate hook.
  const [search, setSearch] = useDraftState(searchValue);

  return (
    <Select
      allowDeselect={false}
      clearable
      data={data}
      label="Grouping Tags"
      onSearchChange={setSearch}
      placeholder="Select grouping..."
      ref={ref}
      searchValue={search}
      searchable
      value={value}
      onFocus={() => {
        setSearch("");
      }}
      onChange={(value) => {
        (setOption("groupBy", value || undefined), setSearch(""));
      }}
      onDropdownClose={() => {
        ref.current?.blur();
      }}
    />
  );
};
