import { useState } from "react";
import { Pill, PillsInput } from "@mantine/core";
import { ZodError } from "zod";

export const TagsInput = ({
  label,
  error: propsError,
  defaultValue,
  value: tags = defaultValue,
  lockedTags = [],
  removeTag,
  addTag,
  onKeyDown: propsOnKeyDown,
  ...restProps
}) => {
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");
  const allTags = [...lockedTags, ...tags];
  const tagPills = allTags.map((tag, i) => {
    const locked = i < lockedTags.length;
    return (
      <Pill
        key={tag}
        withRemoveButton={!locked}
        disabled={locked}
        bg={
          locked
            ? "light-dark(var(--mantine-color-primary-2), var(--mantine-color-primary-6))"
            : undefined
        }
        onRemove={locked ? undefined : () => removeTag(tag)}
      >
        {tag}
      </Pill>
    );
  });

  // NOTE this catch is here as a bit of a safety net, if there's no
  // validation upstream before hitting the store directly. In typical
  // forms it's still going to be better to handle validation in the
  // form state.
  const addTagWithCatch = (tag) => {
    try {
      addTag(tag);
    } catch (e) {
      if (e instanceof ZodError) {
        setError(e.issues?.[0]?.message || "The entered tag is invalid");
      } else {
        console.error(e);
        setError("An unknown error has occurred");
      }
    }
  };

  return (
    <PillsInput label={label} error={error || propsError} {...restProps}>
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
            propsOnKeyDown?.(e);
            setError(null);

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
                addTagWithCatch(value.toLowerCase(), e);
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
