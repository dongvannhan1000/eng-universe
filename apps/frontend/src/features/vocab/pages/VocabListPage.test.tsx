// import type React from "react";
// import { describe, it, expect } from "vitest";
// import { render, screen } from "@testing-library/react";
// import { Provider } from "react-redux";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { MemoryRouter } from "react-router-dom";
// import { configureStore } from "@reduxjs/toolkit";
// import { QueryClient } from "@tanstack/react-query";
// import { VocabListPage } from "./VocabListPage";
// import filtersReducer from "../slices/filtersSlice";

// const createTestStore = () => {
//   return configureStore({
//     reducer: {
//       filters: filtersReducer,
//     },
//   });
// };

// const createTestQueryClient = () => {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         retry: false,
//       },
//     },
//   });
// };

// const renderWithProviders = (component: React.ReactElement) => {
//   const store = createTestStore();
//   const queryClient = createTestQueryClient();

//   return render(
//     <Provider store={store}>
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>{component}</MemoryRouter>
//       </QueryClientProvider>
//     </Provider>,
//   );
// };

// describe("VocabListPage", () => {
//   it("renders the page title and description", () => {
//     renderWithProviders(<VocabListPage />);

//     expect(screen.getByText("Vocabulary Learning")).toBeInTheDocument();
//     expect(screen.getByText(/Discover and learn new English words/)).toBeInTheDocument();
//   });

//   it("renders the search toolbar", () => {
//     renderWithProviders(<VocabListPage />);

//     expect(screen.getByPlaceholderText(/Search by word or explanation/)).toBeInTheDocument();
//     expect(screen.getByText("Select tags...")).toBeInTheDocument();
//   });

//   it("shows loading state initially", () => {
//     renderWithProviders(<VocabListPage />);

//     // Should show skeleton cards while loading
//     expect(document.querySelectorAll(".animate-pulse")).toHaveLength(6);
//   });
// });
