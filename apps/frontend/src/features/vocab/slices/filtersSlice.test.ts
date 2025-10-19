import { describe, it, expect } from "vitest";
import filtersReducer, {
  setQ,
  setTags,
  setFrom,
  setTo,
  setPage,
  setLimit,
  resetFilters,
  type FiltersState,
} from "./filtersSlice";

const initialState: FiltersState = {
  q: "",
  tags: [],
  from: null,
  to: null,
  page: 1,
  limit: 20,
  includeSuspended: false,
};

describe("filtersSlice", () => {
  it("should return the initial state", () => {
    expect(filtersReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setQ", () => {
    const actual = filtersReducer(initialState, setQ("test query"));
    expect(actual.q).toEqual("test query");
    expect(actual.page).toEqual(1); // Should reset page
  });

  it("should handle setTags", () => {
    const actual = filtersReducer(initialState, setTags(["Tech", "Business"]));
    expect(actual.tags).toEqual(["Tech", "Business"]);
    expect(actual.page).toEqual(1); // Should reset page
  });

  it("should handle setFrom", () => {
    const actual = filtersReducer(initialState, setFrom("2024-01-01"));
    expect(actual.from).toEqual("2024-01-01");
    expect(actual.page).toEqual(1); // Should reset page
  });

  it("should handle setTo", () => {
    const actual = filtersReducer(initialState, setTo("2024-12-31"));
    expect(actual.to).toEqual("2024-12-31");
    expect(actual.page).toEqual(1); // Should reset page
  });

  it("should handle setPage", () => {
    const actual = filtersReducer(initialState, setPage(3));
    expect(actual.page).toEqual(3);
  });

  it("should handle setLimit", () => {
    const actual = filtersReducer(initialState, setLimit(50));
    expect(actual.limit).toEqual(50);
    expect(actual.page).toEqual(1); // Should reset page
  });

  it("should handle resetFilters", () => {
    const modifiedState: FiltersState = {
      q: "test",
      tags: ["Tech"],
      from: "2024-01-01",
      to: "2024-12-31",
      page: 3,
      limit: 50,
      includeSuspended: false,
    };

    const actual = filtersReducer(modifiedState, resetFilters());
    expect(actual).toEqual(initialState);
  });
});
