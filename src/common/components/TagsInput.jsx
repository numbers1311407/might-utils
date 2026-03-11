import { useState } from "react";
import { Pill, PillsInput } from "@mantine/core";

export const TagsInput = ({
  label,
  defaultValue,
  value: tags = defaultValue,
  lockedTags = [],
  removeTag,
  addTag,
  ...restProps
}) => {
  const [value, setValue] = useState("");
  const allTags = [...lockedTags, ...tags];
  const tagPills = allTags.map((tag, i) => {
    const locked = i < lockedTags.length;
    return (
      <Pill
        key={tag}
        withRemoveButton={!locked}
        disabled={locked}
        onRemove={locked ? undefined : () => removeTag(tag)}
      >
        {tag}
      </Pill>
    );
  });

  return (
    <PillsInput label={label} {...restProps}>
      <Pill.Group>
        {tagPills}
        <PillsInput.Field
          value={value}
          placeholder="Add tag"
          onChange={(e) => {
            setValue(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();

            if (
              e.key === "Backspace" &&
              value.length === 0 &&
              tagPills.length > lockedTags.length
            ) {
              e.preventDefault();
              removeTag(tags[tags.length - 1], e);
            } else if (
              (e.key === "Enter" || e.key === " " || e.key === ",") &&
              value.length > 0
            ) {
              e.preventDefault();
              if (!allTags.includes(value.toLowerCase())) {
                addTag(value.toLowerCase(), e);
              }
              setValue("");
            } else if (e.code === "Space") {
              e.preventDefault();
            }
          }}
        />
      </Pill.Group>
    </PillsInput>
  );
};
